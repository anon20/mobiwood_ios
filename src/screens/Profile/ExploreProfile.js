import React,{useState} from 'react';
import {View, Text, Image, ActivityIndicator, SafeAreaView, StyleSheet, ToastAndroid, FlatList, Dimensions, Modal, TouchableOpacity, Platform, Alert} from 'react-native';
import {UserContext} from '../../contexts/UserContext.js';
import {AuthContext} from "../../contexts/AuthContext.js";
import {VideosContext} from '../../contexts/VideosContext.js';

import VideoPlayer from 'react-native-video-player';

import VideoDisplayModal from '../../components/VideoDisplayModal.js';

import ImagePicker from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default props => {
    const [userCont, setUserCont] = useState(null);
    const usrCntxt = React.useContext(UserContext);
    const [vidObj, setVidObj] = useState(vidObj);
    const vidCntxt = React.useContext(VideosContext);
    const [followProcessing, setFollowProcessing] = useState(false);
    const [currentUserID, setCurrentUserID] = useState(null);
    const { userDetails, uid } = React.useContext(AuthContext);
    React.useEffect(()=>{
        // userCont.updateFollowers();
        async function getData(){
            let tmp = {};
            await firestore().collection("user").doc(vidCntxt.viewProfile).get().then(resp => {
                tmp.followers = resp.data().followers;
                tmp.following = resp.data().following;
                tmp.profilePhoto = resp.data().profile;
            });
            let vidArray = [];
            let vidObj = await firestore().collection("user").doc(vidCntxt.viewProfile).collection("videos")
            let vids = await vidObj.get();
            vids.forEach(vid => {

                let y = vid.data();
                y.id = vid.id;
                y.userid = vidCntxt.viewProfile;
                vidArray.push(vid.data());
                console.log(`vid from vids array : ${JSON.stringify(vid.data())}`)
            })
            tmp.myVideos = vidArray;
            setUserCont(tmp);

        }
        getData();
    },[])

    const HandleClick = (item) => {
        setVidObj(item)
        setModalVisible(true);
      }
      
 
  const [modalVisible, setModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail,setThumbnail] = useState('');
  const [filePath, setFilePath] = useState({});
  const [uploadPercent, setUploadPercent] = useState(0);


  const chooseFile = () => {
    let options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality:0.5
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        let source = response;
        let imgName = "prf_img_"+uid;
        let metadata = {
          contentType: "image/png",
        };
        let uploadTask = storage()
        .ref()
        .child("profile/" + imgName)
        .putFile(Platform.OS==="ios"?source.uri.substr(7):source.uri, metadata);
        setFilePath(source);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            let progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadPercent(progress);
            console.log("Upload is " + progress + "% done");
          },
          (err) => {
            console.log(err);
          },
          () => {
            console.log(`Profile photo has been updated!`)
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log(`downloadURL : ${downloadURL}`);
              firestore()
                .collection("user")
                .doc(uid)
                .update({profile:downloadURL})
                .then(() => {
                  console.log(`Profile photo has been linked!`)
                  if(Platform.OS==="android")
                    ToastAndroid.show(`Profile Photo Updated!`, ToastAndroid.LONG);
                  else
                    Alert.alert(`Profile Photo Updated!`);
                });
            });
          }
        );
      }
    });
  };

    return (
        <SafeAreaView style={{flex:1}}>
        <Modal
            animationType="fade"
            transparent={true}
            // style={{}}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false)
              setVideoUrl('');
            }}
          >
            <VideoDisplayModal vidObj={vidObj} setModalVisible={setModalVisible} followProcessing={followProcessing} setFollowProcessing={setFollowProcessing} />

          </Modal>
            {/* {console.log(`userCont :  ${JSON.stringify(userCont.profilePhoto)}`)} */}
            <View style={{flex:0.05}}>
                <TouchableOpacity onPress={()=>props.navigation.goBack()} style={{marginTop:10, alignSelf:'flex-start', marginLeft:10}}>
                    <FeatherIcon  name='chevron-left' size={30} color='black' />
                </TouchableOpacity>
            </View>
            {userCont?
                <>
                
                <View style={{flex:0.95}}>
                    <View style={{marginBottom:20}}>
                      <View style={{backgroundColor:'black',borderRadius:1000, width:150, height:150,alignSelf:'center', marginTop:20}}>

                      
                        {userCont.profilePhoto?<Image
                            source={{uri: userCont.profilePhoto?userCont.profilePhoto:filePath.uri}}
                            style={{width:150, height:150,alignSelf:'center',borderRadius:1000,resizeMode:'cover',borderWidth:1}}
                        />
                        :
                            <Image
                            source={require('../../assets/images/user-placeholder.png')}
                            style={{width:150, height:150,alignSelf:'center',borderRadius:1000,resizeMode:'cover',borderWidth:1}}
                        />
                        }

                      </View>



                            <TouchableOpacity style={[styles.followBtnContainer, {backgroundColor:usrCntxt.fllwingMap.get(vidCntxt.viewProfile)?'grey':'#a70624', }]} onPress={()=>{
                            setFollowProcessing(true);
                            usrCntxt.updateFollowing(usrCntxt.fllwingMap.get(vidCntxt.viewProfile)?"unfollow":"follow", vidCntxt.viewProfile).then(resp=>{
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
                              usrCntxt.fllwingMap.get(vidCntxt.viewProfile)?'Following':'Follow'}
                            </Text>
                          </TouchableOpacity>



                        <Text style={{fontSize:20,fontWeight:'700',alignSelf:'center', marginBottom:10,marginTop:20}}>{vidCntxt.viewDisplayName}</Text>
                        <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:5}}>
                                <Text style={{fontSize:16,fontWeight:'600'}}>Followers : {userCont.followers&&userCont.followers.length!=0?userCont.followers.length:0} </Text>
                                <Text style={{fontSize:16,fontWeight:'600'}}>Following : {userCont.following&&userCont.following.length!=0?userCont.following.length:0} </Text>
                        </View>
                    </View>
                    <View style={{width:'100%',height:1,backgroundColor:"black"}}></View>
                    {/* {console.log(`MYVIDEOS : ${JSON.stringify(userCont.myVideos)}`)} */}
                    {userCont.myVideos!=""? 
                    <FlatList 
                        data={userCont.myVideos}
                        numColumns={3}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index})=>(
                            <View key={index}  style={styles.layoutA}>
                                <TouchableOpacity onPress={()=>HandleClick(item)} >
                                <Image
                            source={item.thumbnail?{uri:item.thumbnail}:(require('../../assets/images/loading.jpg'))}
                            style={{height:"100%",width:"100%"}}
                        />
                        </TouchableOpacity>
                        
                    </View>)
                         }
            /> : <Text style={{justifyContent:'center',alignSelf:'center',marginTop:80,fontWeight:'700',fontSize:18, textAlign:'center', color:'grey'}}>
              <FeatherIcon name="video-off" size={50} color={'grey'} />{"\n"}{"\n"}No Videos Uploaded Yet!</Text>}
                </View>
                
                
                </>
                :
                <View style={{justifyContent:"center", flex:1,}}>
                  <ActivityIndicator  animating={true} color="black" />
                  <Text style={{alignItems:'center', alignSelf:'center', marginTop:10}}>Fetching Profile Details..</Text>
                </View>
            }
        </SafeAreaView>

    )
};

const styles = StyleSheet.create({
    layoutA :{height:150,width:windowWidth/3,backgroundColor:'black'},
    layoutB:{height:150,width:windowWidth/3,backgroundColor:'white'} ,
    followBtnContainer:{
      paddingHorizontal:10,
      height:33,
      alignSelf:'center',
      marginTop:20,
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
    centeredView: {
        height:windowHeight/1.4,
        width:windowWidth-50,
        justifyContent:'center',
        alignSelf:'center',
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
})