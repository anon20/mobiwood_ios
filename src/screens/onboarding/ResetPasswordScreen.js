import React,{ useState, useContext } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ToastAndroid,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import InputField from '../../components/InputField';
import { Formik } from 'formik'
import * as yup from 'yup'
import styles from './style'
import Auth from '@react-native-firebase/auth';

const resetPassValidation = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required('Email Address is Required'),
})


const ResetPasswordScreen = ({navigation}) => {
  const [emailSent, setEmailSent] = useState(false);
  const HandleResetPassword = email => {
    Auth().sendPasswordResetEmail(email)
    .then(resp=>{
      setEmailSent(true);
    })
    .catch(err => {
      if(Platform.OS==="android")
      {
        // if(err.code==="auth/no-user-found")
        ToastAndroid.show("You are Not Registered! Please Sign up!", ToastAndroid.LONG);
      }
      else{
        Alert.alert(`You are Not Registered! Please Sign UP!`);
      }
    })
  }
  return (
    <SafeAreaView>

      {!emailSent?<KeyboardAvoidingView>
        <View style={styles.abovekeyboardContainer}>
             <Text style={styles.heading}>Reset Password</Text>

          <View style={styles.formContainer}>
          <Formik
            initialValues={{ email: '' }}
            onSubmit={values => console.log(values)}
            validationSchema={resetPassValidation}
          >
            {({ handleChange, 
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
                    placeholderTextColor = "#a0aec0"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />   
                   {errors.email &&
                          <Text style={styles.error}>{errors.email}</Text>
                  }
           <TouchableOpacity style={styles.btn} onPress={()=>{HandleResetPassword(values.email)}} disabled={!isValid}>
             <Text style={styles.btnText}>Reset Password</Text>
           </TouchableOpacity>
           </>
            )}
          </Formik>
          </View>
        </View>
      </KeyboardAvoidingView>:
      <View style={{flex:1, alignContent:'center', justifyContent:'center'}}>
        <Text style={{color:'black'}}>Email has been Sent for Password Reset.</Text>
      </View>
      }
    </SafeAreaView>
  );
};



export {ResetPasswordScreen};
