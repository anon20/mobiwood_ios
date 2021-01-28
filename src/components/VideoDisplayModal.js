import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  ActivityIndicator,
  ToastAndroid,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ImageGridItem from './ImageGridItem.js';
import FeatherIcon from 'react-native-vector-icons/Feather';
import VideoPlayer from 'react-native-video-player';
import IconClose from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import {UserContext} from '../contexts/UserContext.js';
import {VideosContext} from '../contexts/VideosContext.js';
import MobiwoodVerified from '../assets/images/mobiwood-verified.png';
import BgShadow from '../assets/images/bgshadow1.png';
import PPic from '../assets/images/user-placeholder.png';
import IconCheck from '../assets/images/checkicon.png';

export default ({
  vidObj,
  setModalVisible,
  followProcessing,
  setFollowProcessing,
}) => {
  const vidCntxt = React.useContext(VideosContext);
  const usrCntxt = React.useContext(UserContext);
  const [filePath, setFilePath] = useState({});
  // console.log(`vidObj inside VideoDisplayModal : ${JSON.stringify(vidObj)}, vidObj.id : ${vidObj.id}`)
  return (
    <View style={{justifyContent: 'center', flex: 1, backgroundColor: 'black'}}>
      <View style={styles.centeredView}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(false);
          }}
          style={styles.closeBtn}>
          <FeatherIcon name="x" size={30} color="#e3e3e3" />
        </TouchableOpacity>
        <VideoPlayer
          video={{uri: vidObj.videoUrl}}
          style={{
            height: Platform.os === 'ios' ? windowHeight : '100%',
            width: windowWidth,
          }}
          thumbnail={{uri: vidObj.thumbnail}}
          onPlayPress={() => {
            firestore()
              .collection('contest')
              .doc(vidObj.id)
              .update({
                views: vidCntxt.noOfViewsMap.get(vidObj.id) + 1,
              })
              .then((resp) => {
                let tmpViewsMap = new Map(vidCntxt.noOfViewsMap);
                tmpViewsMap.set(vidObj.id, tmpViewsMap.get(vidObj.id) + 1);
                vidCntxt.setNoOfViewsMap(tmpViewsMap);
              })
              .catch((err) => {});
          }}
        />
      </View>

      <View
        style={{
          paddingBottom: 0,
          bottom: 0,
          width: '100%',
          position: 'absolute',
        }}>
        <ImageBackground
          source={BgShadow}
          style={{
            marginLeft: Platform.OS === 'ios' ? -10 : 0,
            paddingTop: 150,
            paddingBottom: 80,
            paddingLeft: Platform.OS === 'ios' ? '8%' : '5%',
            paddingRight: '20%',
            alignSelf: 'flex-end',
            resizeMode: 'cover',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
              letterSpacing: 0.5,
            }}>
            {vidObj.displayName}
          </Text>
          <Text style={{color: 'white', fontSize: 13}}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when{vidObj.description}
          </Text>

          {/* {console.log(vidObj.displayName)} 
                  <Image
                            source={{uri: vidObj.profile?vidObj.profile:filePath.uri}}
                            style={{width:40, height:40,alignSelf:'center',borderRadius:1000,resizeMode:'cover',borderWidth:1, borderColor:'grey'}}
                        />*/}
        </ImageBackground>
      </View>
      <View style={styles.shareBtns}>
        <View>
          <TouchableOpacity
            onPress={() => {
              usrCntxt
                .updateLikes(vidObj.id, vidCntxt.vidLikesMap.get(vidObj.id))
                .then((reslt) => {
                  if (Platform.OS === 'android')
                    if (reslt > vidCntxt.vidLikesMap.get(vidObj.id))
                      ToastAndroid.show(
                        `You Liked This Video`,
                        ToastAndroid.LONG,
                      );
                  let tmp = new Map(vidCntxt.vidLikesMap);
                  tmp.set(vidObj.id, reslt);
                  vidCntxt.setVidLikesMap(tmp);
                });
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 15,
                marginTop: 3,
                marginRight: -13,
                width: 30,
                height: 30,
                alignSelf: 'center',
              }}>
              <IconClose
                name={
                  !usrCntxt.likedVideosMap.get(vidObj.id)
                    ? 'heart-outline'
                    : 'heart'
                }
                size={30}
                color={
                  !usrCntxt.likedVideosMap.get(vidObj.id) ? 'white' : 'red'
                }
              />
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 15,
                marginTop: 3,
                marginRight: -15,
                alignSelf: 'center',
              }}>
              {vidCntxt.vidLikesMap.get(vidObj.id)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              usrCntxt.handleShare(vidObj.id, vidObj.description);
            }}>
            <Text style={{color: 'white', marginTop: 0, width: 30}}>
              {' '}
              <IconClose
                name="share-outline"
                size={30}
                color="white"></IconClose>
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 15,
                marginTop: 3,
                marginRight: -15,
                alignSelf: 'center',
              }}>
              {vidObj.shares ? vidObj.shares : 0}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              marginTop: 15,
              width: 30,
              marginVertical: 2,
              height: 30,
            }}>
            <FeatherIcon name="eye" size={28} color="white" />{' '}
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 15,
              marginTop: 0,
              marginRight: -15,
              alignSelf: 'center',
            }}>
            {vidCntxt.noOfViewsMap.get(vidObj.id)}
          </Text>

          <TouchableOpacity
            style={styles.followBtnContainer}
            onPress={() => {
              setFollowProcessing(true);
              usrCntxt
                .updateFollowing(
                  usrCntxt.fllwingMap.get(vidObj.userid)
                    ? 'unfollow'
                    : 'follow',
                  vidObj.userid,
                )
                .then((resp) => {
                  if (resp === 'followed' || resp === 'unfollowed') {
                    setFollowProcessing(false);
                    if (Platform.OS === 'android') {
                      if (resp === 'followed')
                        ToastAndroid.show('Following', ToastAndroid.LONG);
                      else ToastAndroid.show('Unfollowed', ToastAndroid.LONG);
                    }
                  }
                });
            }}>
            <ImageBackground source={PPic} style={{width: 40, height: 40}}>
              <Image
                source={{uri: vidObj.profile ? vidObj.profile : filePath.uri}}
                style={{
                  width: 40,
                  height: 40,
                  alignSelf: 'center',
                  borderRadius: 60,
                  resizeMode: 'cover',
                }}
              />
            </ImageBackground>
            <Text style={[styles.followBtn]}>
              {followProcessing ? (
                <ActivityIndicator size={22} color="#0ad4ff" />
              ) : usrCntxt.fllwingMap.get(vidObj.userid) ? (
                <IconClose
                  name="checkmark-circle-sharp"
                  size={21}
                  color="#0ad4ff"
                  style={styles.followIcon}></IconClose>
              ) : (
                <IconClose
                  name="add-circle"
                  size={21}
                  color="#11ece5"
                  style={styles.followIcon}></IconClose>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  closeBtn: {
    borderRadius: 3,
    position: 'absolute',
    zIndex: 9999,
    right: 20,
    top: 55,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  searchContainer: {
    marginTop: 10,
    width: '95%',
    marginLeft: 10,
  },
  shareBtns: {
    bottom: 55,
    right: 35,
    width: 15,
    position: 'absolute',
    zIndex: 9999,
  },
  followBtnContainer: {
    position: 'absolute',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 1,
    marginTop: -70,
    marginLeft: -5,
  },
  followBtn: {
    fontWeight: '600',
    position: 'absolute',
    marginTop: 30,
    borderRadius: 60,
    width: 22,
    paddingLeft: 1,
  },
  icon: {
    justifyContent: 'center',
  },
  centeredView: {
    width: windowWidth,
    backgroundColor: 'black',
    shadowColor: '#000',
  },

  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
