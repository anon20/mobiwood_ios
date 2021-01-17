import React, { useState, createContext, useContext, useEffect } from "react";
import {AuthContext} from "./AuthContext";
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Share from 'react-native-share';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { firestore } from "../firebase.config";
import firestore from '@react-native-firebase/firestore';

import { VideosContext } from "./VideosContext";
import { completeHandlerIOS } from "react-native-fs";

export const UserContext = createContext({});

async function buildLink(id, vidTitle) {
  const link = await dynamicLinks().buildShortLink({
      link: `https://mobiwood.page.link/${id}`,
      domainUriPrefix: `https://mobiwood.page.link`,
      navigation: {
          forcedRedirectEnabled: true,
      },
      android: {
          packageName: 'net.mobiwood',
          fallbackUrl: 'https://mobiwood.page.link',

        },
      social: {
          title: vidTitle,
      }
  });

  return link;
}

const UserContextProvider = ({ children }) => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [myVideos, setMyVideos] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [vidShared, setVidShared] = useState('');
  const [likedVideosMap, setLikedVideosMap] = useState(new Map());
  const { userDetails, uid } = useContext(AuthContext);
  const [fllwingMap, setFllwingMap] = useState(new Map());
  // const { videos } = useContext(VideosContext);
  const handleShare = (id, vidTitle) => {
    buildLink(id, vidTitle).then(link => {
        // console.log(`${link}`);
        const title = `${vidTitle}`;
        // const message = 'Please check this out on the uDanta App "Your Home for News"\n';
        const message = `${vidTitle} \n \n${`Checkout This Video`}"\n\n`;


        const options = {
            title,
            subject: title,
            message: `${message} ${link}`,
        }

        Share.open(options)
          .then(res => { console.log(res); analytics().logEvent('Normal_Share',{name:'normal_share_button'})})
          .catch(err => { err && console.log(err); });
    })
  };
  useEffect(() => {
    // alert(`a : ${JSON.stringify(userDetails)}`)
    if (userDetails) {
      if(userDetails.likedVideos)
      setLikedVideos(userDetails.likedVideos || []);
      setFollowers(userDetails.followers || []);
      setFollowing(userDetails.following || []);
    }
  }, [userDetails]);

  useEffect(() => {
    // const videosFromSession = JSON.parse(sessionStorage.getItem("videos"));
    // AsyncStorage.getItem("videos").then(resp => {
      // alert(`${uid}`)
      const getUserDetails = async () => {
        await firestore().collection("user").doc(uid).get().then(async resp=>{
          let userData = resp.data();
          let likedVidMap = new Map();
          let tmpFllwingMp = new Map();
          setLikedVideos(userData.likedVideos);
          setProfilePhoto(userData.profile);
          // console.log(`resp :${JSON.stringify(resp.data())}`);
          // console.log(`likedVideos : ${userData["likedVideos"]}`)
          // if(resp)
          if(userData&&userData.following&&userData.following.length)
          {
            userData.following.forEach(data => {
              tmpFllwingMp.set(data, true);
            });
          }
          if(userData&&userData.likedVideos&&userData.likedVideos.length)
          {
            userData.likedVideos.forEach(data => {
              likedVidMap.set(data, true);
            })
          }

          setFollowing(userData&&userData.following&&userData.following.length?userData.following:[]);
          setFollowers(userData&&userData.followers&&userData.followers.length?userData.followers:[]);
          setLikedVideosMap(likedVidMap);
          setFllwingMap(tmpFllwingMp);
          console.log(`following : ${JSON.stringify(userData.following)}`)
          // console.log(`Following data is set too`)
        })
      }
      const fetchMyVideos = async () => {
        //   const db = firestore();
          const collectionRef = firestore().collection("user").doc(uid).collection("videos");
          const vids = await collectionRef.get();
          let vidArray = [];
          vids.forEach((vid) => {
            if (vid.data().videoUrl) {
              vidArray.push(vid.data());
            }
          });
          setMyVideos(vidArray);
          // getLikedVideos();
        };
        
        // if (uid && videosFromSession) {
          // checkDynamicLink();
          if(uid)
          {
            fetchMyVideos();
            getUserDetails();
          }
        // }
    // });
    // (sessionStorage.getItem("videos"));

    
  }, [uid]);
  
  const updateLikes = (videoId, noOfLikes) => {

    let newLikes=[];
    // console.log(`videoId :${videoId}`)
    noOfLikes= noOfLikes?noOfLikes:0;
    if (!likedVideosMap.get(videoId)) {
      // console.log(`likedVideos : ${JSON.stringify(likedVideos)}`)
      if(likedVideos)
      newLikes = [...likedVideos];
      newLikes.push(videoId);
      noOfLikes++;
    } else {
      newLikes = likedVideos.filter((vid) => vid !== videoId);
      if(noOfLikes>0)
        noOfLikes--;
    }
    // console.log(`LIKED VIDEOS ARRAY : ${JSON.stringify(newLikes)}`)
    setLikedVideos(newLikes);
    let tempLikedMap = new Map(likedVideosMap);
    tempLikedMap.set(videoId, !tempLikedMap.get(videoId));
    return firestore().collection("user").doc(uid).update({
      likedVideos: newLikes,
    }).then(resp => {
      return firestore().collection("contest").doc(videoId).update({
        likes: noOfLikes,
      })
      .then(()=>{
        // console.log(`NEW NO OF LIKES : ${noOfLikes}`);
        setLikedVideosMap(tempLikedMap);
        return noOfLikes;
      })
    });
  };
  const updateFollowers = async (action, userId) => {
    let newFollowers = followers;
    if (action === "follow") {
      setFollowers([...followers, userId]);
      newFollowers = [...newFollowers, userId];
    } else {
      if (followers && followers.length) {
        newFollowers = followers.filter((follower) => follower !== userId);
        setFollowers(newFollowers);
      } else {
        setFollowers([]);
        newFollowers = [];
      }
    }
    await firestore().collection("user").doc(userId).update({
      followers: newFollowers,
    });
  };

  const updateFollowing = async (action, userId) => {
    // console.log(`userId : ${userId}`)
    console.log(`other person from UserContext.js : ${userId}`)

    let allFollowers = []; 
    //retreiving all the followers of the video uploader
    await firestore().collection("user").doc(uid).get().then(resp => {
      // console.log(`resp.data : ${JSON.stringify(resp.data())}`);
      if(resp.data().followers)
        allFollowers = [...resp.data().followers];
    })
    // console.log(`${action} ${userId}`);
    let returnMesg="followed"
    let newFollowing = following;
    // console.log(`before adding  following : ${newFollowing}`);
    if (action === "follow") {
      setFollowing([...following, userId]);
      newFollowing = [...newFollowing, userId];
      allFollowers.push(uid);
      // console.log(`after adding userid : ${userId}, following : ${newFollowing}`);
    } 
    else 
    {
      returnMesg = "unfollowed"
      allFollowers = allFollowers.filter(id => id != uid);
      if (following && following.length) {
        newFollowing = following.filter((follower) => follower !== userId);
        setFollowing(newFollowing);
      } 
      else {
        setFollowing([]);
        newFollowing = [];
      }
    }
    // console.log(`allFolowers : ${JSON.stringify(allFollowers)}`)
    //updating user's following list
    await firestore().collection("user").doc(uid).update({
      following: newFollowing,
    });
    // console.log(`following data updated`)
    //updating video uploader's followers list
    console.log(`allFollowers before : ${JSON.stringify(allFollowers)}, myuid : ${uid}`)
    return firestore().collection("user").doc(userId).update({
      followers:[...allFollowers]
    })
    .then(resp => {
      // console.log(`YO`)
      let tmpFollowingMap = new Map(fllwingMap); 
      tmpFollowingMap.set(userId, !fllwingMap.get(userId));
      setFllwingMap(tmpFollowingMap);
      return returnMesg;
    })
    .catch(err => {
      throw new Error(err);
    })
  };

  return (
    <UserContext.Provider
      value={{
        likedVideos:likedVideos,
        vidShared:vidShared,
        likedVideosMap:likedVideosMap,
        fllwingMap:fllwingMap,
        myVideos:myVideos,
        following:following,
        followers:followers,
        profilePhoto:profilePhoto,
        setProfilePhoto:setProfilePhoto,
        updateFollowers:updateFollowers,
        handleShare:handleShare,
        setVidShared:setVidShared,
        updateLikes:updateLikes,
        updateFollowing:updateFollowing,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
