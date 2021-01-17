import React from 'react';
import {View, TouchableOpacity, Text, Dimensions, Platform, ActivityIndicator, ToastAndroid, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FeatherIcon from 'react-native-vector-icons/Feather';
import VideoPlayer from 'react-native-video-player';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import {UserContext} from '../contexts/UserContext.js';
import {VideosContext} from '../contexts/VideosContext.js';

export default ({vidObj, setModalVisible, followProcessing, setFollowProcessing}) => {
    const vidCntxt = React.useContext(VideosContext);
    const usrCntxt = React.useContext(UserContext);
    // console.log(`vidObj inside VideoDisplayModal : ${JSON.stringify(vidObj)}, vidObj.id : ${vidObj.id}`)
    return (
        <View style={{justifyContent:'center',flex:1, backgroundColor:'black'}}>
                <View style={styles.centeredView}>
                  <TouchableOpacity onPress={()=>{setModalVisible(false)}} style={styles.closeBtn}>
                    <FeatherIcon  name='x' size={30} color='grey' />
                  </TouchableOpacity>
                  <VideoPlayer
                    video={{uri:vidObj.videoUrl}}
                    style={{height: Platform.os==="ios"? windowHeight : windowHeight/1.16, marginTop:-40, width:windowWidth}}
                    thumbnail={{uri: vidObj.thumbnail}}
                    onPlayPress={()=>{
                      firestore().collection("contest").doc(vidObj.id).update({
                        views: vidCntxt.noOfViewsMap.get(vidObj.id)+1,
                      })
                      .then(resp => {
                        let tmpViewsMap = new Map(vidCntxt.noOfViewsMap);
                        tmpViewsMap.set(vidObj.id, tmpViewsMap.get(vidObj.id)+1);
                        vidCntxt.setNoOfViewsMap(tmpViewsMap);
                      })
                      .catch(err => {
                      })
                    }}
                  />
                </View>
                <View style={styles.shareBtns}>
                  <View style={{width:'99%', flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>{
                      usrCntxt.updateLikes(vidObj.id, vidCntxt.vidLikesMap.get(vidObj.id)).then(reslt => {
                        if(Platform.OS === "android")
                          if(reslt>vidCntxt.vidLikesMap.get(vidObj.id))
                            ToastAndroid.show(`You Liked This Video`, ToastAndroid.LONG)
                        let tmp = new Map(vidCntxt.vidLikesMap);
                        tmp.set(vidObj.id, reslt);
                        vidCntxt.setVidLikesMap(tmp);
                      })
                      
                    }}>
                      <Text style={{color:'white', fontSize:18, marginTop:3, marginRight:8}}> <FeatherIcon name='thumbs-up' size={22} color={!usrCntxt.likedVideosMap.get(vidObj.id)?'white':'#3b5998'} />  {vidCntxt.vidLikesMap.get(vidObj.id)}  </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{usrCntxt.handleShare(vidObj.id, vidObj.description)}}>
                      <Text style={{color:'white',fontSize:18, marginTop:3, marginRight:8}}> <FeatherIcon  name='share' size={22} color='white' />  {vidObj.shares?vidObj.shares:0}  </Text>
                    </TouchableOpacity>
                      <Text style={{fontSize:18, marginTop:3, color:'white'}}> <FeatherIcon  name='eye' size={22} color='white' /> {" "}{vidCntxt.noOfViewsMap.get(vidObj.id)}</Text>
                    <TouchableOpacity style={[styles.followBtnContainer, {backgroundColor:usrCntxt.fllwingMap.get(vidObj.userid)?'grey':'#a70624', }]} onPress={()=>{
                      setFollowProcessing(true);
                      usrCntxt.updateFollowing(usrCntxt.fllwingMap.get(vidObj.userid)?"unfollow":"follow", vidObj.userid).then(resp=>{
                        if(resp === "followed"||resp === "unfollowed")
                        {
                          setFollowProcessing(false);
                          if(Platform.OS === "android")
                          {  
                            if(resp === "followed")
                              ToastAndroid.show("Following", ToastAndroid.LONG)
                            else
                              ToastAndroid.show("Unfollowed", ToastAndroid.LONG)
                          }
                        }
                      })
                    }}>
                      <Text style={[styles.followBtn]}>
                        {followProcessing?<ActivityIndicator size={34} color="white" />
                        :
                        usrCntxt.fllwingMap.get(vidObj.userid)?'Following':'Follow'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </View>
    )
};

const styles  = StyleSheet.create ({
    closeBtn:{
      backgroundColor:'white',
      borderRadius:3,
      position:'absolute',
      zIndex:2,
      right:20,
      // top:10,
    },
    searchContainer:{
        marginTop:10,
        width:'95%',
        marginLeft:10,
    },
    shareBtns:{
      flexDirection:'row', 
      bottom:25,
      position:'absolute',
      paddingBottom:15, 
      paddingLeft:20, 
    },
    followBtnContainer:{
      paddingHorizontal:10,
      position:'absolute',
      marginLeft:'59%',
      height:33,
      width:95,
      textAlign:'center',
      display:'flex',
      alignItems:'center',
      borderRadius:6,
      paddingVertical:5, 
    },
    followBtn:{
      color:'white', 
      fontSize:17, 
      fontWeight:'600',
    },
    icon:{
        justifyContent:'center'
    },
    centeredView: {
      width:windowWidth,
      backgroundColor: "black",
      shadowColor: "#000",
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