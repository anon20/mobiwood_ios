import React, {useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import video from '../../assets/videos/video.mp4';
import {Colors, Typography} from '../../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import InputField from '../../components/InputField';
import {Formik} from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import TNC from '../../components/TNC';
import styles from './Style';
import DocumentPicker from 'react-native-document-picker';
import CheckBox from '@react-native-community/checkbox';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import MediaMeta from 'react-native-media-meta';
import RNFS, {uploadFiles} from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {utils} from '@react-native-firebase/app';
import UUIDGenerator from 'react-native-uuid-generator';

export default function Upload({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [singleFile, setSingleFile] = useState(null);
  const [file, setFile] = useState();
  const [talentVal, setTalentVal] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [videoPath, setVideoPath] = useState();

  React.useEffect(() => {
    requestReadStoragePermission();
    requestWriteStoragePermission();
    console.log(utils.FilePath.PICTURES_DIRECTORY);
  }, []);

  async function getPathForFirebaseStorage(uri) {
    return uri;
    if (Platform.OS === 'ios') return uri;
    const data = await RNFS.readFile(uri, 'base64');
    console.log('PATH: ', data);
    return data;
  }

  const uploadValidationSchema = yup.object().shape({
    title: yup.string().required('Please Provide a Title'),
    about: yup.string().required('Please Provide a Description'),
    social: yup
      .string()
      .required(
        'Enter the Name of the Platform with the Highest Follower Count',
      ),
    count: yup.number().required('Enter the Follower Count on the Platform'),
  });

  const toggleTnc = (val) => {
    setModalVisible(val);
  };

  const requestReadStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Read Files Permission',
          message:
            'Mobiwood needs access to read and upload video files ' +
            'so you can upload your videos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can read files');
      } else {
        console.log('File permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestWriteStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Write Files Permission',
          message:
            'Mobiwood needs access to write and upload video files ' +
            'so you can upload your videos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can write files');
      } else {
        console.log('File permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const chooseFile = () => {
    const options = {
      title: '', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Record Video', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Upload Video', // specify null or empty string to remove this button
      cameraType: 'back', // 'front' or 'back'
      thumbnail: true,
      durationLimit: 90,
      allowsEditing: true,
      mediaType: 'video',
      base64: true,
      videoQuality: 'high',
      storageOptions: {
        // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
        skipBackup: true, // image will NOT be backed up to icloud
        path: 'videos', // will save image at /Documents/images rather than the root
      },
    };
    ImagePicker.showImagePicker(options, (video) => {
      const path =
        Platform.OS === 'android'
          ? video.path ?? video.uri
          : video.uri.substring(7);
      const maxTime = 90000;
      console.log('vidD', video);
      if (video.path || video.uri) {
        // MediaMeta.get(path)
          // .then((metadata) => {
            // // console.log(metadata.duration);
            // if (metadata.duration > maxTime) {
            //   Alert.alert(
            //     'Sorry',
            //     'Video duration must be less then 90 seconds',
            //     [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            //     {cancelable: false},
            //   );
            // } else {
              const name = path.substring(
                path.lastIndexOf('/') + 1,
                path.length,
              );
              setSingleFile(name);
              setVideoPath(video.path || video.uri);
            // }
          // })
          // .catch((err) => console.error(err));
      }
    });
  };
  return (
    <ScrollView>
      <View style={styles.formContainer}>
        <View>
          <Text style={styles.heading}>Upload Your Video</Text>
        </View>
        <TNC />
      </View>
      <View style={styles.formContainer}>
        <Formik
          initialValues={{
            other: '',
            title: '',
            about: '',
            social: '',
            group: '',
          }}
          onSubmit={async (values) => {
            setLoading(true);
            console.log('Upload form values: ', values);

            var vid = await AsyncStorage.getItem('vid');

            UUIDGenerator.getRandomUUID((uuid) => {
              const ref = storage().ref(`/users/${uuid}.mp4`);
              getPathForFirebaseStorage(videoPath).then((path) => {
                console.log('Uploading: ', path);
                ref
                  .putFile(path, {
                    contentType: 'video/mp4',
                  })
                  .then(() => ref.getDownloadURL())
                  .then((url) => {
                    console.log('url', url);
                    var data = {
                      videoUrl: url,
                      talent: talentVal,
                      description: values.about,
                      title: values.title,
                      socialMedia: values.social,
                      followerCount: values.count,
                      groupCheck: toggleCheckBox ? 'yes' : 'no',
                      otherTalent:
                        talentVal === 'Others' ? values.other : 'none',
                      uploadTime: new Date(),
                    };
                    firestore()
                      .collection('user')
                      .doc(auth().currentUser.uid)
                      .collection('videos')
                      .doc(vid)
                      .set(data, {merge: true})
                      .then(() => {
                        data.userid = auth().currentUser.uid;
                        firestore()
                          .collection('contest')
                          .doc(vid)
                          .set(data)
                          .then(() => {
                            setLoading(false);
                            Alert.alert('Upload Successful');
                            navigation.navigate('Home');
                          });
                      });
                  })
                  .catch((e) => {
                    setLoading(false);
                    console.log(e);
                  });
              });
            });
          }}
          //validationSchema={uploadValidationSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            isValid,
          }) => (
            <>
              <Text style={styles.label}>Talent</Text>
              <DropDownPicker
                items={[
                  {label: 'Acting', value: 'act'},
                  {label: 'Singing', value: 'sing'},
                  {label: 'Dancing', value: 'dance'},
                  {label: 'Comedy', value: 'comedy'},
                  {label: 'Music', value: 'music'},
                  {label: 'Magic', value: 'magic'},
                  {label: 'Acrobatics', value: 'acrobatics'},
                  {label: 'Others', value: 'others'},
                ]}
                defaultValue=""
                containerStyle={styles.containerStyles}
                style={styles.picker}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={(item) => setTalentVal(item.label)}
              />
              {talentVal === '' && (
                <Text style={styles.error}>
                  Specifying Your Talent is a Necessity
                </Text>
              )}

              {talentVal === 'Others' && (
                <View>
                  <Text style={styles.label}>What's Your Talent</Text>
                  <InputField  type="text"
                    placeholderTextColor="#a0aec0"
                    onChangeText={handleChange('other')}
                    onBlur={handleBlur('other')}
                    value={values.other}
                    containerStyles={styles.containerStyles}
                  />
                  {talentVal === 'Others' && (
                    <Text style={styles.error}>
                      Please Name Your Other Talent
                    </Text>
                  )}
                </View>
              )}

              <Text style={styles.label}>Title</Text>
              <InputField  type="text"
                placeholderTextColor="#a0aec0"
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                containerStyles={styles.containerStyles}
              />
              {errors.title && <Text style={styles.error}>{errors.title}</Text>}

              <Text style={styles.label}>Write Something About the Video</Text>
              <InputField  type="text"
                placeholderTextColor="#a0aec0"
                onChangeText={handleChange('about')}
                onBlur={handleBlur('about')}
                value={values.about}
                multiline={true}
              />
              {errors.about && <Text style={styles.error}>{errors.about}</Text>}

              <Text style={styles.label}>Upload Video</Text>
              <TouchableOpacity onPress={chooseFile} style={styles.inputFile}>
                <View style={styles.inputBtn}>
                  <Text>Choose Files</Text>
                </View>
                {singleFile ? <Text>{singleFile}</Text> : null}
              </TouchableOpacity>

              {singleFile == null && (
                <Text style={styles.error}>{errors.video}</Text>
              )}

              <Text style={styles.label}>
                Social Media With Highest Followers
              </Text>
              <InputField  type="text"
                placeholderTextColor="#a0aec0"
                onChangeText={handleChange('social')}
                onBlur={handleBlur('social')}
                value={values.social}
                containerStyles={styles.containerStyles}
              />
              {errors.social && (
                <Text style={styles.error}>{errors.social}</Text>
              )}

              <Text style={styles.label}>Followers Count on the Platform</Text>
              <InputField  type="text"
                placeholderTextColor="#a0aec0"
                onChangeText={handleChange('count')}
                onBlur={handleBlur('count')}
                value={values.count}
                containerStyles={styles.containerStyles}
              />
              {errors.count && <Text style={styles.error}>{errors.count}</Text>}

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />
                <Text>Are you applying as a group</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 30,
                  flexWrap: 'wrap',
                }}>
                <Text>By registering, you agree to our</Text>
                <TouchableOpacity onPress={() => toggleTnc(true)}>
                  <Text style={{color: '#4299e1'}}> Terms & Conditions</Text>
                </TouchableOpacity>
                <Text>and</Text>
                <TouchableOpacity>
                  <Text style={{color: '#4299e1'}}> Privacy Policy</Text>
                </TouchableOpacity>
              </View>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  toggleTnc(false);
                }}>
                <View style={styles.modalContent}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.heading}>Terms & Conditions</Text>
                    <Icon.Button
                      name="close-outline"
                      size={25}
                      color="black"
                      backgroundColor="white"
                      onPress={() => toggleTnc(false)}
                    />
                  </View>
                  <ScrollView>
                    <TNC />
                  </ScrollView>
                </View>
              </Modal>

              <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                <Text style={styles.btnText}>
                  Next
                  <ActivityIndicator animating={isLoading} color="white" />
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}
