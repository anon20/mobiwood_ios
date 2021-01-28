import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
//import HeaderIcon from '../../HOC/HeaderIcon.js';
import Video from 'react-native-video';
import ImagePicker, {launchImageLibrary} from 'react-native-image-picker';
import InputField from '../../components/InputField';
import DropDownPicker from 'react-native-dropdown-picker';
import Checkbox from '@react-native-community/checkbox';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../contexts/AuthContext.js';
import {UserContext} from '../../contexts/UserContext.js';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import FeatherIcon from 'react-native-vector-icons/Feather';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const UploadScreen = (props) => {
  const [filePath, setFilePath] = useState({});
  const athCntxt = React.useContext(AuthContext);
  const usrCntxt = React.useContext(UserContext);
  const [talent, setTalent] = useState('Acting');
  const [title, setTitle] = useState('');
  const [socialMedia, setSocialMedia] = useState('');
  const [follower, setFollower] = useState('');
  const [desc, setDesc] = useState('');
  const [isSelected, setSelection] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const chooseFile = () => {
    let options = {
      title: 'Video Picker',
      mediaType: 'video',

      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        setFilePath(source);
      }
    });
  };
  const handleTextChange = (e, type) => {
    switch (type) {
      case 'title': {
        setTitle(e);
        break;
      }
      case 'desc': {
        setDesc(e);
        break;
      }
      case 'social': {
        setSocialMedia(e);
        break;
      }
      case 'follower': {
        setFollower(e);
        break;
      }
      default: {
      }
    }
  };
  const removeFile = () => {
    setFilePath({});
  };
  const validations = () => {
    if (desc == '' || follower == '' || socialMedia == '') {
      if (Platform.OS === 'android')
        ToastAndroid.show(
          'Fill all the details before Uploading',
          ToastAndroid.LONG,
        );
      else Alert.alert(`Fill all the details before uploading`);
      return false;
    }
    if (!filePath.uri && !filePath.path) {
      if (Platform.OS === 'android')
        ToastAndroid.show(`Add a Video First!`, ToastAndroid.LONG);
      else Alert.alert(`No Video Added!`);
    } else {
      return true;
    }
  };

  const uploadVideo = () => {
    if (validations()) {
      // let vid = new Date().getTime()+"_"+parseInt(Math.random()*10000);
      // const ref = storage().ref().child("users/"+vid)
      // let uploadBlob = null;
      // ref.putFile(filePath.path, {contentType:"image/jpg"})
      // .then((resp)=>{
      //   console.log(`UPLOADED!`)
      // })
      // if (!auth.currentUser) {
      //   alert("You need to login first");
      //   // navigate("/contest");
      // }
      // var vid = localStorage.getItem("");
      let vid = new Date().getTime() + '_' + parseInt(Math.random() * 10000);

      // console.log(`filePath.path : ${filePath.path} filePath.uri : ${filePath.uri.substr(7)}`)
      setIsUploading(true);
      let uploadTask = storage()
        .ref()
        .child('users/' + vid)
        .putFile(
          Platform.OS === 'android' ? filePath.uri : filePath.uri.substr(7),
        );
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
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            let uploadData = {
              videoUrl: downloadURL,
              talent: talent,
              description: desc,
              title: title,
              userId: athCntxt.uid,
              profile: usrCntxt.profilePhoto,
              displayName: athCntxt.userDetails.displayName,
              userName: athCntxt.userDetails.username,
              socialMedia: socialMedia,
              followerCount: follower,
              groupCheck: isSelected ? 'yes' : 'no',
              otherTalent: talent === 'others' ? otherTalent : 'none',
              uploadTime: new Date(),
              thumbnail: null,
            };
            firestore()
              .collection('user')
              .doc(auth().currentUser.uid)
              .collection('videos')
              .doc(vid)
              .set(uploadData, {merge: true})
              .then(() => {
                uploadData.userid = auth().currentUser.uid;
                firestore()
                  .collection('contest')
                  .doc(vid)
                  .set(uploadData)
                  .then(() => {
                    if (Platform.OS === 'android')
                      ToastAndroid.show(
                        'Video Uploaded Successfully!',
                        ToastAndroid.LONG,
                      );
                    else Alert.alert(`Video Uploaded Successfully`);
                    setIsUploading(false);
                    // setTalent('');
                    setTitle('');
                    setSocialMedia('');
                    setFollower('');
                    setFilePath('');
                    setDesc('');
                  });
              });
          });
        },
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {!isUploading ? (
          <View>
            <View style={styles.uploadView}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 24,
                  padding: 20,
                  display: 'none',
                }}>
                Upload A Video
              </Text>
              {filePath.uri && (
                <>
                  <Video
                    source={{uri: `${filePath ? filePath.uri : ''}`}} // Can be a URL or a local file.
                    shouldPlay={false}
                    controls={true}
                    resizeMode="cover"
                    style={{
                      height: windowHeight / 2,
                      width: windowWidth - 0,
                      alignSelf: 'center',
                    }}
                  />
                </>
              )}
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              {!filePath.uri ? (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: -220,
                    left: 0,
                    width: '100%',
                  }}
                  onPress={chooseFile}>
                  <Text
                    style={{
                      width: 200,
                      height: 100,
                      color: 'grey',
                      width: '100%',
                      textAlign: 'center',
                    }}>
                    <FeatherIcon
                      name="film"
                      size={40}
                      color="grey"
                      style={{marginBottom: 100}}
                    />
                  </Text>
                  <Text
                    style={{
                      color: 'grey',
                      fontWeight: '400',
                      position: 'absolute',
                      width: '100%',
                      textAlign: 'center',
                      marginTop: 28,
                    }}>
                    {'\n'}Click to Select Video
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={removeFile}>
                  <Text
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      padding: 10,
                      borderRadius: 5,
                      marginTop: 10,
                    }}>
                    <FeatherIcon
                      name="x"
                      size={13}
                      color="white"
                      style={{marginTop: 20, position: 'absolute', top: 3}}
                    />{' '}
                    Remove
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{alignSelf: 'center', marginTop: 25, paddingLeft: 0}}>
              <Text style={([styles.label], {marginLeft: 0, marginBottom: 10})}>
                Talent
              </Text>

              <DropDownPicker
                items={[
                  {value: 'Acting', label: 'Acting'},
                  {value: 'Singing', label: 'Singing'},
                  {value: 'Dancing', label: 'Dancing'},
                  {label: 'Teach to Make Superstars', value: 'teaching'},
                  {value: 'Comedy', label: 'Comedy'},
                  {value: 'Music', label: 'Music'},
                  {value: 'Magic', label: 'Magic'},
                  {value: 'Acrobatic', label: 'Acrobatic'},
                  {value: 'Others', label: 'Others'},
                ]}
                defaultIndex={talent}
                placeholder={'Select a Category'}
                containerStyle={{height: 50}}
                style={styles.picker}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={(item) => setTalent(item.value)}
              />

              <Text style={[styles.label, {marginTop: 20, marginLeft: 0}]}>
                Title
              </Text>

              <InputField
                placeholderTextColor="#a0aec0"
                onChangeText={(e) => {
                  handleTextChange(e, 'title');
                }} //onBlur={handleBlur('email')}
                value={title}
                containerStyles={{width: '100%'}}
              />

              <Text
                style={[
                  styles.label,
                  {marginTop: Platform.OS === 'ios' ? 0 : 10, marginLeft: 0},
                ]}>
                Video Caption
              </Text>
              <InputField
                style={{
                  textAlignVertical: 'top',
                  width: windowWidth / 1.1,
                  height: Platform.OS === 'ios' ? 150 : 0,
                  backgroundColor: 'white',
                  padding: 10,
                  paddingTop: 10,
                }}
                placeholderTextColor="#a0aec0"
                onChangeText={(e) => {
                  handleTextChange(e, 'desc');
                }} //onBlur={handleBlur('email')}
                value={desc}
                numberOfLines={10}
                containerStyles={{width: '100%'}}
                multiline={true}
              />

              <Text
                style={[
                  styles.label,
                  {marginTop: Platform.OS === 'ios' ? 20 : 10, marginLeft: 0},
                ]}>
                Social Media With Highest Followers
              </Text>
              <InputField
                placeholderTextColor="#a0aec0"
                onChangeText={(e) => {
                  handleTextChange(e, 'social');
                }} //onBlur={handleBlur('email')}
                value={socialMedia}
                containerStyles={{width: '100%'}}
              />
              <Text
                style={[
                  styles.label,
                  {marginTop: Platform.OS === 'ios' ? 0 : 10, marginLeft: 0},
                ]}>
                Follower Count On The platform
              </Text>
              <InputField
                placeholderTextColor="#a0aec0"
                onChangeText={(e) => {
                  handleTextChange(e, 'follower');
                }} //onBlur={handleBlur('email')}
                value={follower}
                containerStyles={{width: '100%'}}
              />

              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={isSelected}
                  onValueChange={setSelection}
                  checkboxSize={20}
                  CheckboxIconSize={20}
                  style={([styles.checkbox], {marginTop: 0})}
                  // lineWidth={10}
                />
                <Text style={{marginTop: 5, marginRight: 10}}>
                  {' '}
                  Are you participating as a group?
                </Text>
              </View>
              <View style={{justifyContent: 'space-around'}}>
                <TouchableOpacity
                  style={styles.buttons}
                  onPress={() => uploadVideo()}>
                  <Text style={styles.btnText}>Upload Video</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              flex: 1,
              alignSelf: 'center',
              marginTop: windowHeight / 2.5,
            }}>
            <ActivityIndicator color="black" size="large" />
            <Text style={{fontSize: 18, alignSelf: 'center'}}>
              {uploadPercent} %
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textarea: {
    textAlignVertical: 'top',
    justifyContent: 'flex-start',
    borderColor: 'black',
    borderWidth: 1,
    width: '100%',
  },

  textStyle: {
    padding: 10,
    color: 'black',
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
    padding: 5,
  },
  uploadView: {
    marginTop: 0,
    height: windowHeight / 2,
    width: windowWidth - 0,
    backgroundColor: 'black',
    alignSelf: 'center',
    borderWidth: 0,
    borderColor: '#efefef',
    elevation: 0,
  },
  buttons: {
    backgroundColor: 'black',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 30,
    // zIndex:9999,
    width: '100%',
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    padding: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  picker: {
    backgroundColor: 'white',
    borderColor: '#edf2f7',
    borderRadius: 3,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
    marginTop: Platform.OS === 'ios' ? 25 : 20,
    height: Platform.OS === 'ios' ? 10 : 30,
  },
  label: {
    margin: 8,
  },
});

export default UploadScreen;
