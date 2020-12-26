import React, { useState, createContext } from "react";
// import { firestore } from "../firebase.config.js";
import {View, Text, ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from './UserContext';
import SharedVideo from '../screens/SharedVid/SharedVideo.js';
import dynamicLinks from '@react-native-firebase/dynamic-links'
export const VideosContext = React.createContext({});

const VideosContextProvider = ({ children }) => {
  const usrCntxt = React.useContext(UserContext);
  const [videosLimited, setVideosLimited] = useState([]);
  const [videos, setVideos] = useState([]);
  const [id, setId] = useState([]);
  const [vidLikesMap, setVidLikesMap] = useState(new Map());
  const [noOfViewsMap, setNoOfViewsMap] = useState(new Map());
  const [noOfFollowersMap, setNoOfFollowersMap] = useState(new Map());
  React.useEffect(() => {
    
    const fetchLimitedVideos = async () => {
    const initialCount = await AsyncStorage.getItem("count");
    const timestamp = await AsyncStorage.getItem("lastLoad");
    if (!initialCount) await AsyncStorage.setItem("count", '0');
    if (!timestamp) AsyncStorage.setItem("lastLoad", JSON.stringify(new Date().getDate()));
    const difference = Math.floor(new Date() - new Date(timestamp)) / (1000 * 60 * 60 * 24);
    console.log(Math.floor(difference / (1000 * 60 * 60 * 24)));
      const getCount = await AsyncStorage.getItem("count");
      const count = parseInt(getCount);
      let vids = [];
      let tmp = [];
      let ids = [];
      let tempVidMap = new Map();
      let tempNoOfFollowers = new Map();
      let tempNoOfViewsMap = new Map();
      firestore().collection("contest").orderBy("uploadTime", "desc").get().then(async resp => {
        if (1==1 || count >= 3 || !initialCount || !timestamp || difference > 0) {
            resp.docs.forEach( (collection, i) => { 
            vids.push(collection.data());
            vids[vids.length-1].id = collection.id;
            ids.push(collection.id);
            tempVidMap.set(collection.id, collection.data().likes?collection.data().likes:0);
            tempNoOfFollowers.set(collection.data().userid, collection.data().followerCount?collection.data().followerCount:0);
            // console.log(`VIEWS : ${collection.data().views}`)
            tempNoOfViewsMap.set(collection.data().id, collection.data().views?collection.data().views:0);
            if (i < 16) {
              tmp.push(collection.data());
            }
            });
            setId(ids);
            setNoOfFollowersMap(tempNoOfFollowers);
            setVidLikesMap(tempVidMap);
            setNoOfViewsMap(tempNoOfViewsMap);
            const checkDynamicLink = async () => {
              const link = await dynamicLinks().getInitialLink();
              // usrCntxt.setVidShared(link);
              console.log(`checking dynamic link`)
              usrCntxt.setVidShared(link);
            }
            checkDynamicLink();
            setVideos(vids);
            setVideosLimited(tmp);
            AsyncStorage.setItem("count", "0");
            AsyncStorage.setItem("videosLimited", JSON.stringify(tmp));
            AsyncStorage.setItem("videos", JSON.stringify(vids));
            AsyncStorage.setItem("id", JSON.stringify(ids));
            AsyncStorage.setItem("lastLoad", JSON.stringify(new Date()));
          } else {
            AsyncStorage.setItem("count", parseInt(count) + 1+'');
            const tempVids = await AsyncStorage.getItem("videosLimited");
            const totalVids = await AsyncStorage.getItem("videos");
            const vidIds = await AsyncStorage.getItem("id");
            setVideosLimited(JSON.parse(tempVids));
            setVideos(JSON.parse(totalVids));
            setId(JSON.parse(vidIds));
          }
        })
    };
    fetchLimitedVideos();
  }, []);
  
  return (
    <VideosContext.Provider value={{ 
      videosLimited:videosLimited, 
      videos:videos, 
      id:id, 
      vidLikesMap:vidLikesMap, 
      noOfFollowersMap:noOfFollowersMap, 
      noOfViewsMap:noOfViewsMap,
      setNoOfFollowersMap:setNoOfViewsMap,
      setNoOfFollowersMap:setNoOfFollowersMap, 
      setVidLikesMap:setVidLikesMap 
    }}>
      {usrCntxt.vidShared?<SharedVideo />
        :
        !usrCntxt.vidShared&&videos.length?children:
        <View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
            <ActivityIndicator size="large" color="black" />
            <Text style={{alignContent:'center', justifyContent:'center'}}>Loading...</Text>
        </View>
      }
    </VideosContext.Provider>
  );
};

export default VideosContextProvider;