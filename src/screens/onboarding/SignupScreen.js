import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  ToastAndroid,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
  ImageBackground,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import Separator from '../../components/Separator';
import InputField from '../../components/InputField';
import {Formik} from 'formik';
import * as yup from 'yup';
import styles from './style';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconClose from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import TNC from '../../components/TNC';
import Privacy from '../../components/Privacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from './style';

const signUpValidationSchema = yup.object().shape({
  name: yup.string().required('Please Enter Your Name'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Please Enter Your Email Address'),
  username: yup.string().required('Please Enter Username'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Please enter your password'),
});

const SignupScreen = ({navigation}) => {
  const [radioValue, setRadioValue] = useState('a18');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const toggleTnc = (val) => {
    setModalVisible(val);
  };
  const togglePrivacy = (val) => {
    setModalVisible2(val);
  };
  return (
    <SafeAreaView>
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={styles.abovekeyboardContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.heading}>Create New Account</Text>
            {/* <View style={styles.socialBtnContainer}>
           <Icon.Button
            name="google"
            backgroundColor="#dc4e41"
            style={styles.socialBtn}
            onPress={() => signIn()}>
            Sign Up with Google
          </Icon.Button>

          <Icon.Button
            name="facebook"
            backgroundColor="#3b5998"
            style={styles.socialBtn}
            onPress={() => alert('Login with Facebook')}>
            Sign Up with Facebook
          </Icon.Button>

          <Icon.Button
            name="twitter"
            backgroundColor="#00a0dc"
            style={styles.socialBtn}
            onPress={() => alert('Login with Twitter')}>
            Sign Up with Twitter
          </Icon.Button>
          </View>
           
          <Separator text="Or Sign Up Using Mail"/> */}

            <View
              style={[
                styles.radioBtnContainer,
                {
                  flexDirection: 'row',
                  /*  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between', */
                },
              ]}>
              <TouchableOpacity
                style={[
                  styles.radioBtn,
                  {
                    backgroundColor: radioValue == 'b18' ? '#000' : 'grey',
                    color: radioValue == 'b18' && '#fff',
                  },
                ]}
                onPress={() => setRadioValue('b18')}>
                <Text style={[styles.btnText, {}]}>Below 18 Years</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.radioBtn,
                  {
                    backgroundColor: radioValue == 'a18' ? '#000' : 'grey',
                    color: radioValue == 'a18' && '#fff',
                  },
                ]}
                onPress={() => setRadioValue('a18')}>
                <Text style={[styles.btnText, {}]}>Above 18 Years</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  username: '',
                  password: '',
                }}
                onSubmit={(values) => {
                  setLoading(true);
                  auth()
                    .createUserWithEmailAndPassword(
                      values.email,
                      values.password,
                    )
                    .then(function ({user}) {
                      auth()
                        .currentUser.updateProfile({
                          displayName: values.name,
                        })
                        .then(function () {
                          if (user && user.uid) {
                            console.log('Getting in here');
                            const data = {
                              name: values.name,
                              email: user.email,
                              username: values.username,
                              account_creation_datetime:
                                user.metadata.creationTime,
                              last_login_datetime: user.metadata.creationTime,
                            };
                            firestore()
                              .collection('user')
                              .doc(user.uid)
                              .set(data, {merge: true})
                              .then(function () {
                                const usernamedata = {
                                  uid: user.uid,
                                };
                                firestore()
                                  .collection('username')
                                  .doc(values.username)
                                  .set(usernamedata, {merge: true})
                                  .then(async function () {
                                    // localStorage.setItem("username", values.username);
                                    await AsyncStorage.setItem(
                                      'username',
                                      values.username,
                                    );
                                    // navigation.navigate("Login")
                                  })
                                  .catch(function (error) {
                                    setLoading(false);
                                    console.log('others', error.message);
                                  });
                              })
                              .catch(function (error) {
                                setLoading(false);
                                console.log('others', error.message);
                              });
                          }
                        })
                        .catch(function (error) {
                          console.log(error);
                          if (Platform.OS === 'android')
                            ToastAndroid.show(
                              `${JSON.stringify(error.code)}`,
                              ToastAndroid.LONG,
                            );
                          else Alert.alert(`${JSON.stringify(error.code)}`);
                        })
                        .catch(function (error) {
                          console.log(error);
                          if (Platform.OS === 'android')
                            ToastAndroid.show(
                              `${JSON.stringify(error.code)}`,
                              ToastAndroid.LONG,
                            );
                          else Alert.alert(`${JSON.stringify(error.code)}`);
                        });
                    })
                    .catch(function (error) {
                      var errorCode = error.code;
                      var errorMessage = error.message;
                      if (errorCode === 'auth/weak-password') {
                        console.log('password', 'The password is too weak');
                      } else if (errorCode === 'auth/email-already-in-use') {
                        console.log('email', 'Email already exists');
                      } else if (errorCode === 'auth/invalid-email') {
                        console.log('email', 'Invalid email');
                      } else {
                        console.log('others', errorMessage);
                      }
                    });
                }}
                validationSchema={signUpValidationSchema}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  isValid,
                }) => (
                  <>
                    {errors.name && (
                      <Text style={styles.error}>{errors.name}</Text>
                    )}
                    <InputField
                      type="text"
                      placeholder="Name"
                      placeholderTextColor="#a0aec0"
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      containerStyles={styles.containerStyles}
                    />
                    {errors.email && (
                      <Text style={styles.error}>{errors.email}</Text>
                    )}
                    <InputField
                      type="email"
                      placeholder="Email"
                      keyboardType="email-address"
                      placeholderTextColor="#a0aec0"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      containerStyles={styles.containerStyles}
                    />
                    {errors.username && (
                      <Text style={styles.error}>{errors.username}</Text>
                    )}
                    <InputField
                      placeholder="Username"
                      placeholderTextColor="#a0aec0"
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      value={values.username}
                      containerStyles={styles.containerStyles}
                    />
                    {errors.password && (
                      <Text style={styles.error}>{errors.password}</Text>
                    )}
                    <InputField
                      type="text"
                      placeholder="Password"
                      secureTextEntry
                      placeholderTextColor="#a0aec0"
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      containerStyles={styles.containerStyles}
                    />
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={handleSubmit}
                      disabled={!isValid}>
                      {isLoading ? (
                        <Text style={styles.loadingbtn}>
                          <ActivityIndicator
                            animating={isLoading}
                            color="white"
                            style={{position: 'absolute'}}
                          />
                        </Text>
                      ) : (
                        <Text style={styles.CreateAccountBtn}>
                          Proceed{' '}
                          <IconClose
                            name="arrow-forward-outline"
                            size={14}
                            color="white"></IconClose>
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </Formik>
            </View>
            <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 15,
                marginTop: -20,
                textAlign: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: '100%',
              }}>
              <Text style={{fontSize: Platform.OS === 'android' ? 12 : 14}}>
                By register, you are agreeing to our{' '}
              </Text>
              <TouchableOpacity onPress={() => toggleTnc(true)}>
                <Text
                  style={{
                    color: '#000',
                    textDecorationLine: 'underline',
                    fontSize: Platform.OS === 'android' ? 12 : 13,
                  }}>
                  Terms
                </Text>
              </TouchableOpacity>
              <Text style={{fontSize: Platform.OS === 'android' ? 12 : 13}}>
                {' '}
                and{' '}
              </Text>
              <TouchableOpacity onPress={() => togglePrivacy(true)}>
                <Text
                  style={{
                    color: '#000',
                    textDecorationLine: 'underline',
                    fontSize: Platform.OS === 'android' ? 12 : 13,
                  }}>
                  Privacy
                </Text>
              </TouchableOpacity>
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                toggleTnc(false);
              }}>
              <SafeAreaView style={styles.modalContent}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: Platform.OS === 'android' ? 0 : 20,
                    paddingRight: Platform.OS === 'android' ? 0 : 20,
                  }}>
                  <Text style={styles.heading}>Terms & Conditions</Text>
                  <IconClose
                    name="close-outline"
                    size={25}
                    color="black"
                    backgroundColor="white"
                    onPress={() => toggleTnc(false)}
                    style={{marginTop: Platform.OS === 'android' ? 10 : 30}}
                  />
                </View>
                <ScrollView>
                  <TNC />
                </ScrollView>
              </SafeAreaView>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible2}
              onRequestClose={() => {
                setModalVisible2(false);
              }}>
              <SafeAreaView style={styles.modalContent}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: Platform.OS === 'android' ? 0 : 20,
                    paddingRight: Platform.OS === 'android' ? 0 : 20,
                  }}>
                  <Text style={styles.heading}>Privacy Policy</Text>
                  <IconClose
                    name="close-outline"
                    size={25}
                    color="black"
                    backgroundColor="white"
                    onPress={() => setModalVisible2(false)}
                    style={{marginTop: Platform.OS === 'android' ? 10 : 30}}
                  />
                </View>
                <ScrollView>
                  <Privacy />
                </ScrollView>
              </SafeAreaView>
            </Modal>

            <View style={[styles.altText, {marginTop: -10}]}>
              <Text style={[styles.txt, {marginBottom: 10}]}>
                Already have an account?
              </Text>
              <Text
                onPress={() => navigation.navigate('Login')}
                style={[
                  styles.txt,
                  {
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginBottom: 20,
                    fontSize: 16,
                  },
                ]}>
                {' '}
                <IconClose
                  name="key-outline"
                  size={14}
                  color="black"></IconClose>{' '}
                Login
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export {SignupScreen};
