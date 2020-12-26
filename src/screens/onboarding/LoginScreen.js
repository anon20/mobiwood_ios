import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import InputField from '../../components/InputField';
import {Formik} from 'formik';
import * as yup from 'yup';
import styles from './style';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import TNC from '../../components/TNC';
import IconClose from 'react-native-vector-icons/Ionicons';

const loginValidationSchema = yup.object().shape({
  username: yup.string().required('Username is Required'),
  password: yup.string().required('Password is required'),
});

const LoginScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const toggleTnc = (val) => {
    setModalVisible(val);
  };
  return (
    <SafeAreaView>
      <KeyboardAvoidingView>
        <ScrollView style={styles.abovekeyboardContainer}>
          <Image 
                source={require('../../assets/images/logo.png')}
                style={styles.logo} 
                />
          <Text style={styles.heading}>Log In to Your Account</Text>
          {/* <View style={styles.socialBtnContainer}>
           <Icon.Button
            name="google"
            backgroundColor="#dc4e41"
            style={styles.socialBtn}
            onPress={() => signIn()}>
            <Text style={styles.socialBtnText}>
               Login with Google
             </Text>
          </Icon.Button>

          <Icon.Button
            name="facebook"
            backgroundColor="#3b5998"
            style={styles.socialBtn}
            onPress={() => alert('Login with Facebook')}>
            <Text style={styles.socialBtnText}>
              Login with Facebook
            </Text>
          </Icon.Button>

          <Icon.Button
            name="twitter"
            backgroundColor="#00a0dc"
            style={styles.socialBtn}
            onPress={() => alert('Login with Twitter')}>
            <Text style={styles.socialBtnText}>
              Login with Twitter
            </Text>
          </Icon.Button>
          </View> */}

          {/* <Separator text="Or Log In Using Username"/> */}

          <View style={styles.formContainer}>
            <Formik
              initialValues={{username: '', password: ''}}
              onSubmit={(values) => {
                setLoading(true);
                firestore()
                  .collection('username')
                  .doc(values.username)
                  .get()
                  .then(function (details) {
                    if (details.exists) {
                      firestore()
                        .collection('user')
                        .doc(details.data().uid)
                        .get()
                        .then(function (userVals) {
                          console.log(
                            'Values: ',
                            details.data().uid,
                            userVals.data(),
                            values,
                          );
                          auth()
                            .signInWithEmailAndPassword(
                              userVals.data().email,
                              values.password,
                            )
                            .then(async function () {
                              //storeData(value.username)
                              await AsyncStorage.setItem(
                                'username',
                                values.username,
                              );
                              firestore()
                                .collection('user')
                                .doc(details.data().uid)
                                .set(
                                  {last_login_datetime: new Date()},
                                  {merge: true},
                                );
                              navigation.navigate('Home');
                            })
                            .catch(function (e) {
                              console.log('Signin Error: ', e.message);
                              setLoading(false);
                              alert('Invalid Credentials');
                            });
                        });
                    } else {
                      setLoading(false);
                      alert('Invalid Credentials');
                    }
                  })
                  .catch(function (error) {
                    setLoading(false);
                    console.log('others', error.message);
                  });
              }}
              validationSchema={loginValidationSchema}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                isValid,
              }) => (
                <>
                  {errors.username && (
                    <Text style={styles.error}>{errors.username}</Text>
                  )}
                  <InputField
                  type="text"
                    placeholder="Username"
                    placeholderTextColor="#656565"
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                    containerStyles={styles.containerStyles}
                  />
                  {errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}
                  
                  <InputField
                  type="password" 
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor="#656565"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    containerStyles={styles.containerStyles}
                  />
                  <Text
              onPress={() => navigation.navigate('ResetPassword')}
              style={[styles.txt, {marginTop: 0, textAlign: "right", marginBottom: 20, color:'grey'}]}>
              Forgot Password?
            </Text>
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={handleSubmit}
                    disabled={!isValid}>

                    {isLoading ? (
                      <ActivityIndicator animating={isLoading} color="white" style={{position:'absolute', marginTop:25,  width:200, }} />
                 
                    ) : (
                      <Text style={[styles.btnText, {fontSize:22, flex: 1, justifyContent: "center", alignItems: "center", display:'flex', alignItems:'center', justifyContent:'center'}]}>Log In </Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
          <View
            style={{flexDirection: 'row', marginBottom: 15, flexWrap: 'wrap', display: 'none'}}>
            <Text>By logging, you agree to our</Text>
            <TouchableOpacity onPress={() => toggleTnc(true)}>
              <Text style={{color: '#4299e1'}}> Terms & Conditions</Text>
            </TouchableOpacity>
            <Text> and</Text>
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
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.heading}>Terms & Conditions</Text>
                <IconClose.Button
                  name="close-outline"
                  size={40}
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

          <View style={[styles.altText, {marginTop:-20}]}>
          
            <Text style={[styles.test], { fontSize:20, marginTop:-10, marginBottom:10, marginLeft:'auto', marginRight:'auto'}}>OR</Text>
            <Text
              onPress={() => navigation.navigate('Signup')}
              style={[styles.txt, {fontWeight: 'bold', fontSize:22, backgroundColor:'#333', padding:18, color:'white', borderRadius:6}]}>
              {' '}
              Create an account
            </Text>
            
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};




export {LoginScreen};
