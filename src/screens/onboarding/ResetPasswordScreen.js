import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ToastAndroid,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import InputField from '../../components/InputField';
import {Formik} from 'formik';
import * as yup from 'yup';
import styles from './style';
import Auth from '@react-native-firebase/auth';
import Logo from '../../assets/images/logo.png';
import FeatherIcon from 'react-native-vector-icons/Feather';
const resetPassValidation = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
});

const ResetPasswordScreen = ({navigation}) => {
  const [emailSent, setEmailSent] = useState(false);
  const HandleResetPassword = (email) => {
    Auth()
      .sendPasswordResetEmail(email)
      .then((resp) => {
        setEmailSent(true);
      })
      .catch((err) => {
        if (Platform.OS === 'android') {
          // if(err.code==="auth/no-user-found")
          ToastAndroid.show(
            'You are Not Registered! Please Signup!',
            ToastAndroid.LONG,
          );
        } else {
          Alert.alert(`You are Not Registered! Please Signup!`);
        }
      });
  };
  return (
    <SafeAreaView>
      {!emailSent ? (
        <>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              marginTop: 10,
              alignSelf: 'flex-start',
              marginLeft: '4%',
              zIndex: 9999,
              marginBottom: 0,
            }}>
            <FeatherIcon name="chevron-left" size={30} color="black" />
          </TouchableOpacity>
          <KeyboardAvoidingView>
            <View style={styles.abovekeyboardContainer}>
              <Image
                source={Logo}
                width={200}
                height={50}
                style={{
                  width: 200,
                  height: 80,
                  resizeMode: 'contain',
                  alignContent: 'center',
                  alignSelf: 'center',
                  marginTop: '0%',
                  marginBottom: '3%',
                }}
              />
              <Text style={styles.heading}>Reset Password</Text>
              <View style={styles.formContainer}>
                <Formik
                  initialValues={{email: ''}}
                  onSubmit={(values) => console.log(values)}
                  validationSchema={resetPassValidation}>
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    isValid,
                  }) => (
                    <>
                      <InputField
                        placeholder="Email"
                        keyboardType="email-address"
                        placeholderTextColor="#a0aec0"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                      />
                      {errors.email && (
                        <Text style={styles.error}>{errors.email}</Text>
                      )}
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                          HandleResetPassword(values.email);
                        }}
                        disabled={!isValid}>
                        <Text style={styles.btnText}>Reset Password</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </Formik>
              </View>
            </View>
          </KeyboardAvoidingView>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              marginTop: 10,
              alignSelf: 'flex-start',
              marginLeft: '4%',
              zIndex: 9999,
              marginBottom: 10,
            }}>
            <FeatherIcon name="chevron-left" size={30} color="black" />
          </TouchableOpacity>
          <View
            style={{flex: 0, alignContent: 'center', justifyContent: 'center'}}>
            <Image
              source={Logo}
              width={200}
              height={50}
              style={{
                width: 200,
                height: 80,
                resizeMode: 'contain',
                alignContent: 'center',
                alignSelf: 'center',
                marginTop: '4%',
                marginBottom: '3%',
              }}
            />

            <Text style={{color: 'black', textAlign: 'center', fontSize: 20}}>
              Please check your registered email for password reset!
            </Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export {ResetPasswordScreen};
