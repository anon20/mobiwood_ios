import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity,
  Platform,
  Alert,
  ImageBackground,
} from 'react-native';
import {UserContext} from '../../contexts/UserContext.js';
import {AuthContext} from '../../contexts/AuthContext.js';
import {VideosContext} from '../../contexts/VideosContext.js';
import VideoPlayer from 'react-native-video-player';
import ImagePicker from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import IconClose from 'react-native-vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default (props) => {
  let userCont = React.useContext(UserContext);
  const vidCntxt = React.useContext(VideosContext);
  const {userDetails, uid} = React.useContext(AuthContext);

  const showVideos = () => {
    // console.log(`videodata received from context is : ${JSON.stringify(vidCntxt.videos)}`)
    // firestore().collection("user").doc(uid).collection("videos").get().then(resp => {
    //   resp.forEach(item => {
    //     console.log(`resp from Profile.js : ${JSON.stringify(item.data())}`);
    //     console.log(`********************************`)
    //     console.log(`ID of the video is : ${item.id}`);
    //     console.log(`********************************`)
    //   })
    // })
  };

  const deleteVideo = (vidId) => {
    Alert.alert('Are you Sure?', 'Delete This Video?', [
      {text: 'NO', onPress: () => {}},
      {
        text: 'YES',
        onPress: () => {
          firestore()
            .collection('user')
            .doc(uid)
            .collection('videos')
            .doc(vidId)
            .delete()
            .then((resp) => {
              firestore()
                .collection('contest')
                .doc(vidId)
                .delete()
                .then((resp) => {
                  if (Platform.OS === 'android')
                    ToastAndroid.show(
                      `Video Removed Successfully!`,
                      ToastAndroid.LONG,
                    );
                  else Alert.alert(`Video Removed Successfully`);
                  vidCntxt.fetchLimitedVideos();
                });
            });
        },
      },
    ]);
  };

  React.useEffect(() => {
    // userCont.updateFollowers();
    showVideos();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [activeVidID, setActiveVidID] = useState(null);
  const [filePath, setFilePath] = useState({});
  const [uploadPercent, setUploadPercent] = useState(0);

  const HandleClick = (e, t, id) => {
    // console.log(`videoUrl : ${e}`)
    setVideoUrl(e);
    setThumbnail(t);
    setActiveVidID(id);
    setModalVisible(true);
  };

  const chooseFile = () => {
    let options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.5,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        let source = response;
        let imgName = 'prf_img_' + uid;
        let metadata = {
          contentType: 'image/png',
        };
        let uploadTask = storage()
          .ref()
          .child('profile/' + imgName)
          .putFile(
            Platform.OS === 'ios' ? source.uri.substr(7) : source.uri,
            metadata,
          );
        setFilePath(source);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            let progress = parseInt(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );
            setUploadPercent(progress);
            console.log('Upload is ' + progress + '% done');
          },
          (err) => {
            console.log(err);
          },
          () => {
            console.log(`Profile photo has been updated!`);
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log(`downloadURL : ${downloadURL}`);
              firestore()
                .collection('user')
                .doc(uid)
                .update({profile: downloadURL})
                .then(() => {
                  console.log(`Profile photo has been linked!`);
                  if (Platform.OS === 'android')
                    ToastAndroid.show(
                      `Profile Photo Updated!`,
                      ToastAndroid.LONG,
                    );
                  else Alert.alert(`Profile Photo Updated!`);
                });
            });
          },
        );
      }
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#c9c9c9'}}>
      <Modal
        animationType="fade"
        transparent={true}
        // style={{}}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setVideoUrl('');
        }}>
        <View
          style={{justifyContent: 'center', flex: 1, backgroundColor: 'black'}}>
          <View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={{
                backgroundColor: 'grey',
                borderRadius: 1000,
                borderWidth: 2,
                borderColor: 'black',
                position: 'absolute',
                padding: 5,
                zIndex: 10,
                top: -30,
                right: 10,
                alignSelf: 'flex-end',
              }}>
              <FeatherIcon name="x" size={25} color="white" />
            </TouchableOpacity>
            <VideoPlayer
              video={{uri: videoUrl}}
              style={{height: windowHeight / 1.3, width: windowWidth - 0}}
              thumbnail={{uri: thumbnail}}
              autoplay
            />
            <TouchableOpacity
              onPress={() => {
                deleteVideo(activeVidID);
              }}
              style={{
                padding: 10,
                marginTop: 10,
                backgroundColor: 'red',
                alignSelf: 'center',
                borderRadius: 5,
              }}>
              <Text style={{color: 'white'}}>
                <IconClose
                  name="trash-outline"
                  size={14}
                  color="white"></IconClose>{' '}
                Delete Video
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* {console.log(`userCont :  ${JSON.stringify(userCont.profilePhoto)}`)} */}
      {userCont ? (
        <>
          <View style={{flex: 1}}>
            <View
              style={{
                marginBottom: 20,
                backgroundColor: 'white',
                width: '95%',
                alignSelf: 'center',
                paddingBottom: 22,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}>
              <View
                style={{
                  backgroundColor: 'black',
                  borderRadius: 1000,
                  width: 100,
                  height: 100,
                  alignSelf: 'center',
                  marginTop: 20,
                }}>
                <Image
                  source={{
                    uri: userCont.profilePhoto
                      ? userCont.profilePhoto
                      : filePath.uri,
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    alignSelf: 'center',
                    borderRadius: 1000,
                    resizeMode: 'cover',
                    borderWidth: 1,
                  }}
                />

                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    backgroundColor: 'black',
                    width: 25,
                    height: 25,
                    padding: 5.5,
                    alignSelf: 'flex-end',
                    top: -windowHeight / 20,
                    borderRadius: 200,
                  }}
                  onPress={chooseFile}>
                  <FeatherIcon name="plus" size={15} color={'white'} />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  alignSelf: 'center',
                  marginBottom: 5,
                  marginTop: 5,
                }}>
                {userDetails.providerData[0].displayName}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 5,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    backgroundColor: '#950a3e',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 14,
                    padding: 10,
                    paddingLeft: 10,
                    paddingRight: 0,
                    borderTopLeftRadius: 40,
                    borderBottomLeftRadius: 40,
                    position: 'absolute',
                    left: '5%',
                    width: '45%',
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 18}}>
                    {userCont.followers && userCont.followers.length != 0
                      ? userCont.followers.length
                      : 0}
                  </Text>
                  {'\n'} Followers
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    backgroundColor: '#b50351',
                    color: 'white',
                    textAlign: 'center',
                    padding: 10,
                    fontSize: 14,
                    paddingLeft: 0,
                    paddingRight: 10,
                    borderTopRightRadius: 40,
                    borderBottomRightRadius: 40,
                    position: 'absolute',
                    right: '5%',
                    width: '45%',
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 18}}>
                    {userCont.following && userCont.following.length != 0
                      ? userCont.following.length
                      : 0}
                  </Text>
                  {'\n'} Following
                </Text>
              </View>
            </View>
            <View style={{width: '100%', height: 1, marginBottom: 30}}></View>
            {/* {console.log(`MYVIDEOS : ${JSON.stringify(userCont.myVideos)}`)} */}
            {userCont.myVideos != '' ? (
              <FlatList
                data={vidCntxt.videos.filter((item) => item.userid === uid)}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <View key={index} style={styles.layoutA}>
                    {console.log(item)}
                    <TouchableOpacity
                      onPress={() =>
                        HandleClick(item.videoUrl, item.thumbnail, item.id)
                      }
                      style={{margin: 1}}>
                      <Image
                        source={
                          item.thumbnail
                            ? {uri: item.thumbnail}
                            : require('../../assets/images/loading.jpg')
                        }
                        style={{height: '100%', width: '100%', borderWidth: 1}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            ) : (
              <Text
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: 80,
                  fontWeight: '700',
                  fontSize: 18,
                  textAlign: 'center',
                  color: 'grey',
                }}>
                <FeatherIcon name="video-off" size={50} color={'grey'} />
                {'\n'}
                {'\n'}No Videos Uploaded Yet!
              </Text>
            )}
          </View>
        </>
      ) : (
        <View>
          <Text>HELLO</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layoutA: {height: 150, width: windowWidth / 3},
  layoutB: {height: 150, width: windowWidth / 3, backgroundColor: 'white'},
  centeredView: {
    height: windowHeight / 1.35,
    width: windowWidth - 50,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imgbackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 100,
  },
});
