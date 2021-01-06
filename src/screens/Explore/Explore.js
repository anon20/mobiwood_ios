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
            transparent={true}
            // style={{}}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false)
              setVidObj({});
            }}
          >
            <View style={{justifyContent:'center',flex:1}}>
                <View style={styles.centeredView}>
                  <TouchableOpacity onPress={()=>{setModalVisible(false)}} style={{backgroundColor:'white', position:'absolute', zIndex:10, top:15, right:15, alignSelf:'flex-end', borderRadius:3}}>
                  
                    <FeatherIcon  name='x' size={30} color='grey' />
                </TouchableOpacity>
                <VideoPlayer
                    video={{uri:vidObj.videoUrl}}
                    style={{height:windowHeight/1.26, width:windowWidth}}
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
                {/* <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Hide Modal</Text>
                </TouchableHighlight>
               */}
               
            </View>
            <View style={{flexDirection:'row', paddingTop:15, paddingBottom:15, paddingLeft:20, backgroundColor:'rgb(0,0,0)', position:'absolute', width:'100%', bottom:75}}>
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
                      <Text style={{color:'white', fontSize:20, marginTop:3, marginRight:8}}> <FeatherIcon name='thumbs-up' size={25} color={!usrCntxt.likedVideosMap.get(vidObj.id)?'white':'red'} />  {vidCntxt.vidLikesMap.get(vidObj.id)}  </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{usrCntxt.handleShare(vidObj.id, vidObj.description)}}>
                      <Text style={{color:'white',fontSize:20, marginTop:3, marginRight:8}}> <FeatherIcon  name='share-2' size={25} color='white' />  {vidObj.shares?vidObj.shares:0}  </Text>
                    </TouchableOpacity>
                      <Text style={{fontSize:20, marginTop:3, color:'white'}}> <FeatherIcon  name='eye' size={25} color='white' /> {" "}{vidCntxt.noOfViewsMap.get(vidObj.id)}</Text>
                  </View>
                  <View style={{top:8, position:'absolute', right:115, marginTop:6}}>
                    <TouchableOpacity onPress={()=>{
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
                            if(resp === "followed")
                              Alert.alert("Following")
                            else
                              Alert.alert("Unffolowed")
                          }
                        }
                      })
                    }}>
                      <Text style={{backgroundColor:usrCntxt.fllwingMap.get(vidObj.userid)?'grey':'red', color:'white', paddingHorizontal:10, paddingVertical:5, borderRadius:10,fontSize:18, fontWeight:'600', position:'absolute'}}>{followProcessing?
                      <ActivityIndicator animating={followProcessing} color="white" />
                      :
                      usrCntxt.fllwingMap.get(vidObj.userid)?'Following':'Follow'}</Text>
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
                  style={{padding:15}}
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
   
    searchContainer:{
        marginTop:10,
        width:'95%',
        marginLeft:10,
        // backgroundColor:'black'
    },
    icon:{
        justifyContent:'center'
    },
    centeredView: {
      height:windowHeight/1.3,
      width:windowWidth,
      // justifyContent:'center',
      position:'absolute',
      top:50,
      // alignItems: "center",
      backgroundColor: "white",
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