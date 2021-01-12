import React,{useState} from 'react';
import {View,
  StyleSheet,
  Text,
  TouchableOpacity, 
  TextInput,
  ToastAndroid,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ExploreVideoBottom from '../../components/ExploreVideoBottom';
import VideoPlayer from 'react-native-video-player';
import {VideosContext} from '../../contexts/VideosContext.js';
const windowWidth = Dimensions.get('window').width;
import FeatherIcon from 'react-native-vector-icons/Feather';
const windowHeight = Dimensions.get('window').height;
import {UserContext} from '../../contexts/UserContext.js';

import firestore from '@react-native-firebase/firestore';

export default props => {
 
  const [modalVisible, setModalVisible] = useState(false);
  const [vidObj, setVidObj] = useState({});
  const [followProcessing, setFollowProcessing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const vidCntxt = React.useContext(VideosContext);
  const usrCntxt = React.useContext(UserContext);
  const [searchVid, setSearchVid] = useState(false);
  const HandleClick = (item) => {
    setVidObj(item);
    // console.log(`CURRENT VIDEO ON MODAL : ${vidCntxt.noOfViewsMap.get(item.id)} , item : ${JSON.stringify(item)}`);
    setModalVisible(true);
  }
    return(
        <SafeAreaView style={{flex:1}}>
          <Modal
            animationType="fade"
            transparent={false}
            style={{backgroundColor:'black'}}
            // backgroundColor={"black"}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false)
              setVidObj({});
            }}
          >
            <View style={{justifyContent:'center',flex:1, backgroundColor:'black'}}>
                <View style={styles.centeredView}>
                  <TouchableOpacity onPress={()=>{setModalVisible(false)}} style={styles.closeBtn}>
                    <FeatherIcon  name='x' size={30} color='grey' />
                  </TouchableOpacity>
                  <VideoPlayer
                    video={{uri:vidObj.videoUrl}}
                    style={{height: Platform.os==="ios"? windowHeight : windowHeight/1.16, width:windowWidth}}
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
                      <Text style={{color:'white',fontSize:18, marginTop:3, marginRight:8}}> <FeatherIcon  name='share-2' size={22} color='white' />  {vidObj.shares?vidObj.shares:0}  </Text>
                    </TouchableOpacity>
                      <Text style={{fontSize:18, marginTop:3, color:'white'}}> <FeatherIcon  name='eye' size={22} color='white' /> {" "}{vidCntxt.noOfViewsMap.get(vidObj.id)}</Text>
                    <TouchableOpacity style={[styles.followBtnContainer, {backgroundColor:usrCntxt.fllwingMap.get(vidObj.userid)?'grey':'red', }]} onPress={()=>{
                      setFollowProcessing(true);
                      usrCntxt.updateFollowing(usrCntxt.fllwingMap.get(vidObj.userid)?"unfollow":"follow", vidObj.userid).then(resp=>{
                        if(resp === "followed"||resp === "unfollowed")
                        {
                          // console.log(`resp from follow button : ${resp}, platform : ${Platform.OS}`)
                          setFollowProcessing(false);
                          if(Platform.OS === "android")
                          {  
                            if(resp === "followed")
                              ToastAndroid.show("Following", ToastAndroid.LONG)
                            else
                              ToastAndroid.show("Unfollowed", ToastAndroid.LONG)
                          }
                          else
                          {
                            // if(resp === "followed")
                            //   Alert.alert("Following")
                            // else
                            //   Alert.alert("Unffolowed")
                          }
                        }
                      })
                    }}>
                      <Text style={[styles.followBtn]}>
                        {followProcessing?<ActivityIndicator size="small" color="white" />
                        :
                        usrCntxt.fllwingMap.get(vidObj.userid)?'Following':'Follow'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </View>
          </Modal>
  
          <View style={styles.searchContainer}>
            <View style={{flexDirection:'row', backgroundColor:'white', borderRadius:10}}>
              <View style={{flex:0.9}}>
                <TextInput
                  placeholder="Search"
                  placeholderTextColor = "#1a202c"
                  keyboardType={"ascii-capable"}
                  style={{padding:Platform.OS === 'android'?10:15}}
                  onChangeText={inpt => {console.log(`inpt : ${inpt}`); setSearchKeyword(inpt)}}
                />
              </View>
              <View style={{flex:0.1}}>
                <TouchableOpacity>
                  <Icon name="search-outline" onPress={()=>setSearchVid(true)} style={{marginTop:10}} size={25} color="#1a202c"/>
                </TouchableOpacity>
              </View>
            </View>
            </View>

            <View style={{flex:1,marginTop:10}}>
              <ExploreVideoBottom searchKeyword={searchKeyword} setSearchVid={setSearchVid} searchVid={searchVid} clicked={HandleClick}/>
            </View>
        </SafeAreaView>
    )
}

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
        // backgroundColor:'black'
    },
    shareBtns:{
      flexDirection:'row', 
      // paddingTop:15, 
      // marginTop:15,
      bottom:10,
      position:'absolute',
      paddingBottom:15, 
      paddingLeft:20, 
      // backgroundColor:'rgb(0,0,0)', 
      // position:'absolute', width:'100%', 
      // bottom:Platform.OS==="ios"?75:48
    },
    followBtnContainer:{
      // position:'absolute',
      paddingHorizontal:10,
      // right:20,
      // top:10,
      position:'relative',
      marginLeft:'22%',
      // right:20,
      borderRadius:6,
      paddingVertical:5, 
    },
    followBtn:{
      color:'white', 
      fontSize:18, 
      fontWeight:'600', 
    },
    icon:{
        justifyContent:'center'
    },
    centeredView: {
      // height:windowHeight/1.3,
      // marginTop:-10,
      // zIndex:100,
      width:windowWidth,
      // justifyContent:'center',
      // position:'absolute',
      // top:Platform.OS==="android"?50:undefined,
      // alignItems: "center",
      backgroundColor: "black",
      // padding: 35,
      // alignItems: "center",
      shadowColor: "#000",
      // shadowOffset: {
      //   width: 0,
      //   height: 100
      // },
      // shadowOpacity:0.8,
      // shadowRadius: 3.84,
      // elevation: 100
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