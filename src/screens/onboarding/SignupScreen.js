import React,{useState} from 'react';
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
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from '@react-native-community/google-signin';
import Separator from '../../components/Separator'
import  InputField  from '../../components/InputField';
import { Formik } from 'formik'
import * as yup from 'yup'
import styles from './style'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconClose from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import TNC from '../../components/TNC'
import Privacy from '../../components/Privacy'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP } from 'react-native-responsive-screen';


const signUpValidationSchema = yup.object().shape({
  name: yup
       .string()
       .required('Please Enter Your Name'),
  email: yup
    .string()
    .email("Invalid email address")
    .required('Please Enter Your Email Address'),
  username: yup
          .string()
          .required('Please Enter Username'),
  password: yup
    .string()
    .min(6,'Password must be at least 6 characters')
    .required('Please enter your password'),
})


const SignupScreen = ({navigation}) => {
  const [radioValue, setRadioValue] = useState("a18");
  const [modalVisible,setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const[isLoading,setLoading] = useState(false)
  const toggleTnc = (val) => {  
    setModalVisible(val)
  }
  const togglePrivacy = (val) => {  
    setModalVisible2(val)
  }
  return (
    <SafeAreaView>
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={styles.abovekeyboardContainer}>
            
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
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

          <View style={[styles.radioBtnContainer, {flexDirection: 'row',}]}>
            <TouchableOpacity style={[styles.radioBtn,{backgroundColor:"#e2e8f0", width:170, marginRight:10,}]} onPress={() => setRadioValue("b18")}>
              <Text style={[styles.btnText,{color:"#1a202c"}]}>Below 18 Years</Text>
              
            </TouchableOpacity>
            {radioValue == "b18" && (<Icon  name="check-circle" size={24} color="#2f855a" style={[styles.icon, {position:'absolute', top:18, marginLeft:70}]} />)}
           
           <TouchableOpacity style={[styles.radioBtn,{backgroundColor:"#e2e8f0", width:170}]} onPress={() => setRadioValue("a18")}>
             <Text style={[styles.btnText,{color:"#1a202c"}]}>Above 18 Years</Text>
             
           </TouchableOpacity>
           {radioValue == "a18" && (<Icon  name="check-circle" size={24} color="#2f855a" style={[styles.icon, {position:'absolute', top:18, right:0, marginRight:80}]} />)}
          
           
           </View>

          <View style={styles.formContainer}>
          <Formik
            initialValues={{ name: '', email: '',username:'',password:'' }}
            onSubmit={values => {
              setLoading(true)
              auth()
              .createUserWithEmailAndPassword(values.email, values.password)
              .then(function ({ user }) {
                auth().currentUser
                  .updateProfile({
                    displayName: values.name,
                  })
                  .then(function () {
                    if (user && user.uid) {
                      console.log("Getting in here");
                      const data = {
                        name: values.name,
                        email: user.email,
                        username: values.username,
                        account_creation_datetime: user.metadata.creationTime,
                        last_login_datetime: user.metadata.creationTime,
                      };
                      firestore()
                        .collection("user")
                        .doc(user.uid)
                        .set(data, { merge: true })
                        .then(function () {
                          const usernamedata = {
                            uid: user.uid,
                          };
                          firestore()
                            .collection("username")
                            .doc(values.username)
                            .set(usernamedata, { merge: true })
                            .then(async function () {
                             // localStorage.setItem("username", values.username);
                             await AsyncStorage.setItem("username",values.username)
                            // navigation.navigate("Login")
                            })
                            .catch(function (error) {
                              setLoading(false)
                              console.log("others", error.message);
                            });
                        })
                        .catch(function (error) {
                          setLoading(false)
                          console.log("others", error.message);
                        });
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              })
              .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === "auth/weak-password") {
                  console.log("password", "The password is too weak");
                } else if (errorCode === "auth/email-already-in-use") {
                  console.log("email", "Email already exists");
                } else if (errorCode === "auth/invalid-email") {
                  console.log("email", "Invalid email");
                } else {
                  console.log("others", errorMessage);
                }
              });
                
            }}
            validationSchema={signUpValidationSchema}
          >
            {({ handleChange, 
                handleBlur, 
                handleSubmit, 
                values,
                errors,
                isValid,
              }) => (
            <>
          {errors.name &&
                    <Text style={styles.error}>{errors.name}</Text>
            }
          <InputField
          type="text" 
              placeholder="Name"
              placeholderTextColor = "#a0aec0"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              containerStyles = {styles.containerStyles}
            />
            {errors.email &&
                          <Text style={styles.error}>{errors.email}</Text>
                  }
                 <InputField
                 type="email"
                    placeholder="Email"
                    keyboardType="email-address"
                    placeholderTextColor = "#a0aec0"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    containerStyles = {styles.containerStyles}
                  />    
              {errors.username &&
                          <Text style={styles.error}>{errors.username}</Text>
                  }
                <InputField
                    placeholder="Username"
                    placeholderTextColor = "#a0aec0"
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                    containerStyles = {styles.containerStyles}
                  />      
            {errors.password &&
                    <Text style={styles.error}>{errors.password}</Text>
            }
           <InputField
           type="text"
                placeholder="Password"
                secureTextEntry
                placeholderTextColor = "#a0aec0"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                containerStyles = {styles.containerStyles}
           />
           <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={!isValid}>
             <Text style={styles.btnText}>Create Account
             <ActivityIndicator animating={isLoading} color="white" />
             </Text>
           </TouchableOpacity>
           </>
            )}
          </Formik>
          </View>
          <View style={{flexDirection:"row",marginBottom:15, marginTop:-20, textAlign:"center", width:'100%'}}>
                            <Text>By register, you are agreeing to our</Text>
                            <TouchableOpacity onPress={() => toggleTnc(true)}>
                                <Text style={{color:"#4299e1"}}> Terms </Text>
                            </TouchableOpacity>
                            <Text>and</Text>
                            <TouchableOpacity onPress={() => togglePrivacy(true)}>
                             <Text style={{color:"#4299e1"}}> Privacy</Text>
                             </TouchableOpacity>
          </View>   

                  <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                            toggleTnc(false)
                            }}
                        >
                            <SafeAreaView style={styles.modalContent}>
                                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                    <Text style={styles.heading}>Terms & Conditions</Text>
                                     <IconClose.Button
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
                            </SafeAreaView>
                  </Modal>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible2}
                            onRequestClose={() => {
                            setModalVisible2(false)
                            }}
                        >
                            <SafeAreaView style={styles.modalContent}>
                                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                    <Text style={styles.heading}>Privacy Policy</Text>
                                     <IconClose.Button
                                        name="close-outline"
                                        size={25}
                                        color="black"
                                        backgroundColor="white"
                                        onPress={() => setModalVisible2(false)}
                                        />
                                </View>
                                <ScrollView>
                                    <Privacy />
                               </ScrollView>
                            </SafeAreaView>
                        </Modal>
                  
                        <View style={[styles.altText, {marginTop:-10}]}>
             <Text style={[styles.txt, {marginBottom:10}]}>Already have an account?</Text>
             <Text onPress={() => navigation.navigate('Login')} style={[styles.txt,{fontWeight:"bold", fontSize:20, marginBottom:20}]}> Login</Text>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



export {SignupScreen};