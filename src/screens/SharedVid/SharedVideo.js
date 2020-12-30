import React,{useState} from 'react';
import {View,
  StyleSheet,
  Text,
  TouchableOpacity, 
  ToastAndroid,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import {VideosContext} from '../../contexts/VideosContext.js';
const windowWidth = Dimensions.get('window').width;

import FeatherIcon from 'react-native-vector-icons/Feather';
const windowHeight = Dimensions.get('window').height;
import {UserContext} from '../../contexts/UserContext.js';

import firestore from '@react-native-firebase/firestore';

export default props => {
    const usrCntxt = React.useContext(UserContext);
    const [vidObj, setVidObj] = useState({});
    const vidCntxt = React.useContext(VideosContext);
    React.useEffect(()=>{
        const link = usrCntxt.vidShared.substr(27);
        firestore().collection("contest").doc(link).get().then(resp => {
            setVidObj(resp.data());
        })
        .catch(err => {
            if(Platform.OS==="android")
                ToastAndroid.show(`Something Went Wrong!`, ToastAndroid.LONG);
            else
                Alert.alert(`Something Went Wrong`);
        })
    },[])
    return (
        <SafeAreaView style={{flex:1}}>
            {vidObj?
                <View style={{justifyContent:'center',flex:1}}>
                <View style={styles.centeredView}>
                  <TouchableOpacity onPress={()=>{usrCntxt.setVidShared('')}} style={{backgroundColor:'white', borderRadius:1000, borderWidth:2, borderColor:'black', position:'absolute', zIndex:10, top:-10, right:-10, alignSelf:'flex-end'}}>
                  
                    <FeatherIcon  name='x' size={30} color='grey' />
                </TouchableOpacity>
                <VideoPlayer
                    video={{uri:vidObj.videoUrl}}
                    style={{height:windowHeight-150, width:windowWidth-15}}
                    thumbnail={{uri: vidObj.thumbnail}}
                    onPlayPress={()=>{
                      firestore().collection("contest").doc(vidObj.id).update({
                        views: vidCntxt.noOfViewsMap.get(vidObj.id)+1,
                      })
                      .then(resp => {
                        let tmpViewsMap = new Map(vidCntxt.noOfViewsMap);
                        tmpViewsMap.set(vidObj.id, tmpViewsMap.get(vidObj.id)+1);
                        vidCntxt.setNoOfViewsMap(tmpViewsMap);
                        console.log(`view updated!`)
                      })
                      .catch(err => {
                        console.log(`error occured!`)
                      })
                    }}
                  />
                <View style={{flexDirection:'row', paddingTop:10, paddingLeft:10}}>
                  <View style={{alignSelf:'flex-start', flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>{
                      usrCntxt.updateLikes(vidObj.id, vidCntxt.vidLikesMap.get(vidObj.id)).then(reslt => {
                        // console.log(`vidLiked : ${reslt}`)
                        if(Platform.OS === "android")
                          if(reslt>vidCntxt.vidLikesMap.get(vidObj.id))
                            ToastAndroid.show(`You Liked This Video`, ToastAndroid.LONG)
                          // else
                          //   ToastAndroid.show(`Like Cleared!`, ToastAndroid.LONG);
                        let tmp = new Map(vidCntxt.vidLikesMap);
                        tmp.set(vidObj.id, reslt);
                        vidCntxt.setVidLikesMap(tmp);
                      })
                      
                    }}>
                      <Text style={{color:'black', fontSize:20}}> <FeatherIcon name='thumbs-up' size={25} color={!usrCntxt.likedVideosMap.get(vidObj.id)?'black':'red'} />  {vidCntxt.vidLikesMap.get(vidObj.id)}  </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{usrCntxt.handleShare(vidObj.id, vidObj.description)}}>
                      <Text style={{color:'black',fontSize:20}}> <FeatherIcon  name='share-2' size={25} color='black' />  {vidObj.shares?vidObj.shares:0}  </Text>
                    </TouchableOpacity>
                      <Text style={{fontSize:20}}> <FeatherIcon  name='eye' size={25} color='black' /> {vidCntxt.noOfViewsMap.get(vidObj.id)}</Text>
                  </View>
                  <View style={{position:'absolute', right:10, top:8}}>
                    <TouchableOpacity onPress={()=>{
                      usrCntxt.updateFollowing(usrCntxt.fllwingMap.get(vidObj.userid)?"unfollow":"follow", vidObj.userid).then(resp=>{
                        if(resp === "followed"||resp === "unfollowed")
                        {
                            if(Platform.OS === "android")
                            {  if(resp === "followed")
                              ToastAndroid.show(`Following `, ToastAndroid.LONG)
                              else
                              ToastAndroid.show(`Unfollowed `, ToastAndroid.LONG)
                            }
                            else (Platform.OS === "ios")
                            {
                              if(resp === "followed")
                              Alert.alert(`Following `, ToastAndroid.LONG)
                              else
                              Alert.alert(`Unfollowed `, ToastAndroid.LONG)
                            }
                        }
                      })
                    }}>
                      <Text style={{backgroundColor:usrCntxt.fllwingMap.get(vidObj.userid)?'grey':'red', color:'white', paddingHorizontal:10, paddingVertical:5, borderRadius:10,fontSize:20}}>{usrCntxt.fllwingMap.get(vidObj.userid)?'Following':'Follow'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                </View>
            </View>
            :
            <View>
            <Text>Loading</Text>
            </View>
            }
        </SafeAreaView>
    )
};

const styles  = StyleSheet.create ({
    icon:{
        justifyContent:'center'
    },
    centeredView: {
        flex:1,
      // justifyContent:'center',
      alignSelf:'center',
      // alignItems: "center",
      backgroundColor: "white",
      // padding: 35,
      // alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });