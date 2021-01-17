import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import video from '../../assets/videos/video.mp4';
import InputField from '../../components/InputField';
import {Formik} from 'formik';
import FeatherIcon from 'react-native-vector-icons/Feather';

import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import TNC from '../../components/TNC';
import styles from './Style';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import UUIDGenerator from 'react-native-uuid-generator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconClose from 'react-native-vector-icons/Ionicons';
import { useLinkProps } from '@react-navigation/native';

const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;
const pinRegExp = /^[1-9][0-9]{5}$/;
const radio = [
  {
    key: 'adult',
    text:
      ' I am 18 or above and I agree to the Terms and conditions and Privacy policy',
  },
  {key: 'minor', text: ' I am below 18'},
];

export default function Contestregistration({navigation}) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [adult, setAdult] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selGender, setSelGender] = useState('');
  const [user, setUser] = useState('');
  const [uuid, setUuid] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const contestValidationSchema = yup.object().shape({
    name: yup.string().required('Name is Required'),
    username: yup.string().required('Username is Required'),
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
    mno: yup
      .string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Mobile Number is required'),
    city: yup.string().required('City is Required'),
    country: yup.string().required('Country is Required'),
    pin: yup
      .string()
      .matches(pinRegExp, 'Pin is not valid')
      .required('Pin Code is required'),
  });

  const handleAuthStateChange = (u) => {
    if (u && u.uid) {
      setUser(u.displayName);
    }
  };

  useEffect(() => {
    const sub = auth().onAuthStateChanged(handleAuthStateChange);
    return sub;
  });

  useEffect(() => {
    if (auth().currentUser) {
      firestore()
        .collection('user')
        .doc(auth().currentUser.uid)
        .collection('videos')
        .get()
        .then(async function (vidData) {
          //console.log(vidData)
          if (vidData.docs.length > 0) {
            UUIDGenerator.getRandomUUID().then((uid) => setUuid(uid));
            await AsyncStorage.setItem('vid', uuid);
            await AsyncStorage.setItem('register', 'true');
            const isUnderAge = await AsyncStorage.getItem('underage');
            if (adult === 'minor' && isUnderAge != 'true')
              navigation.navigate('UnderAge');
            //else navigation.navigate('Upload');
          }
        });
    }
  });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(selectedDate);
  };

  const toggleTnc = (val) => {
    setModalVisible(val);
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <KeyboardAvoidingView style={[styles.formContainer, {flex:1}]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          <View style={{flexDirection:'row', display:'flex'}}>
            {/* <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginRight:10}}>
              <IconClose
                name="chevron-back-outline"
                size={28}
                color="black"
                backgroundColor="white"
              />
              </TouchableOpacity> */}
            <Text style={styles.heading}> Register for Contest</Text>
          </View>
          
 
          <VideoPlayer
            video={video}
            thumbnail={{uri: 'https://i.picsum.photos/id/866/1600/900.jpg'}}
          />
          <Text style={styles.txt}>
            Watch this video to know more about World Talent League
          </Text>

          <Formik
            initialValues={{
              name: '',
              username: '',
              email: '',
              mno: '',
              dob: date,
              gender: selGender,
              city: '',
              country: '',
              pin: '',
            }}
            onSubmit={(values) => {
              // console.log(values);
              setIsLoading(true);
              // console.log('username: ', user);
              // console.log('input username: ', values.username);
              if (values.username.trim() !== user.trim()) {
                alert('Use the username used to sign in');
                setIsLoading(false);
              } else {
                // console.log('here');
                UUIDGenerator.getRandomUUID().then((uid) => setUuid(uid));
                // console.log('vid:', uuid);
                // await AsyncStorage.setItem('vid',vid)
                // await AsyncStorage.setItem('register',values)
                var data = {
                  name: values.name,
                  username: values.username,
                  email: values.email,
                  number: values.mno,
                  city: values.city,
                  country: values.country,
                  dob: date,
                  gender: selGender,
                  pin: values.pin,
                };
                // console.log(data);
                firestore()
                  .collection('user')
                  .doc(auth().currentUser.uid)
                  .collection('videos')
                  .doc(uuid)
                  .set(data)
                  .then(() => {
                    if (adult == 'adult') {
                      navigation.navigate('Upload');
                    } else {
                      navigation.navigate('UnderAge');
                    }
                  })
                  .catch((e) => {
                    console.log(e);
                    setIsLoading(false);
                  });
              }
            }}
            validationSchema={contestValidationSchema}>
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
                <Text style={styles.label}>Name</Text>
                <InputField type="text"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  containerStyles={styles.containerStyles}
                />
                {errors.name && <Text style={[styles.error],{marginTop:-10, marginBottom:15, color:'red'}}>{errors.name}</Text>}

                <Text style={styles.label}>Username</Text>
                <InputField  type="text"
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                  containerStyles={styles.containerStyles}
                />
                {errors.username && (
                  <Text style={[styles.error],{marginTop:-10, marginBottom:15, color:'red'}}>{errors.username}</Text>
                )}

                <Text style={styles.label}>Email</Text>
                <InputField  type="text"
                  placeholderTextColor="#a0aec0"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  containerStyles={styles.containerStyles}
                />
                {errors.email && (
                  <Text style={[styles.error],{marginTop:-10, marginBottom:15, color:'red'}}>{errors.email}</Text>
                )}

                <Text style={styles.label}>Mobile</Text>
                <InputField  type="text"
                  keyboardType="numeric"
                  onChangeText={handleChange('mno')}
                  onBlur={handleBlur('mno')}
                  value={values.mno}
                  containerStyles={styles.containerStyles}
                />

                {errors.mno && <Text style={[styles.error],{marginTop:-10, marginBottom:15, color:'red'}}>{errors.mno}</Text>}

                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity
                  style={styles.dob}
                  onPress={() => setShow(true)}>
                  <View>
                    <Text>{date.toDateString()}</Text>
                  </View>
                </TouchableOpacity>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                  />
                )}
                {errors.dob && <Text style={[styles.error],{marginTop:-10, marginBottom:15, color:'red'}}>{errors.dob}</Text>}

                <Text style={[styles.label],{marginTop:10, fontSize:18, marginBottom:10}}>Gender</Text>
                <DropDownPicker
                  items={[
                    {value: 'F', label: 'Female'},
                    {value: 'M', label: 'Male'},
                    {value: 'O', label: 'Others'},
                  ]}
                  defaultValue=""
                  containerStyle={styles.containerStyles}
                  style={styles.picker}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  dropDownStyle={{backgroundColor: '#fafafa'}}
                  onChangeItem={(item) => {
                    setSelGender(item.label);
                  }}
                />
                {selGender === '' && (
                  <Text style={[styles.error],{marginTop:-10, marginBottom:15, color:'red'}}>{errors.selGender}</Text>
                )}

                <Text style={styles.label}>Country</Text>
                <InputField  type="text"
                  onChangeText={handleChange('country')}
                  onBlur={handleBlur('country')}
                  value={values.country}
                  containerStyles={styles.containerStyles}
                />
                {errors.country && (
                  <Text style={[styles.error],{marginTop:-10, marginBottom:15, color:'red'}}>{errors.country}</Text>
                )}

                <Text style={styles.label}>City</Text>
                <InputField  type="text"
                  onChangeText={handleChange('city')}
                  onBlur={handleBlur('city')}
                  value={values.city}
                  containerStyles={styles.containerStyles}
                />
                {errors.city && <Text style={[styles.error],{marginTop:-10, marginBottom:15, color:'red'}}>{errors.city}</Text>}

                <Text style={styles.label}>Pincode</Text>
                <InputField  type="text"
                  keyboardType="numeric"
                  onChangeText={handleChange('pin')}
                  onBlur={handleBlur('pin')}
                  value={values.pin}
                  containerStyles={styles.containerStyles}
                />
                {errors.pin && <Text style={[styles.error],{marginTop:-10, marginBottom:15, color:'red'}}>{errors.pin}</Text>}

                {radio.map((res) => {
                  return (
                    <TouchableOpacity
                      key={res.key}
                      style={styles.radioContainer}
                      onPress={() => {
                        setAdult(res.key);
                        // console.log(res.key);
                      }}>
                      <View style={styles.radioCircle}>
                        {adult === res.key && (
                          <View style={styles.selectedRb} />
                        )}
                      </View>
                      <Text style={styles.radioText}>{res.text}</Text>
                    </TouchableOpacity>
                  );
                })}

                <View style={styles.tnc}>
                  <Text>By registering, you agree to our</Text>
                  <TouchableOpacity onPress={() => toggleTnc(true)}>
                    <Text style={{color: '#4299e1'}}> Terms & Conditions</Text>
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
                        marginTop:50
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
                {isLoading ? (
                  <Text style={styles.btnText}>
                  Next 
                 </Text>
                ) :
                 ( <Text style={styles.btnText}>
                  <ActivityIndicator animating={isLoading} color="white" style={{position:'absolute', marginTop:25,  width:200, }} />
                 </Text>
                )}
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
