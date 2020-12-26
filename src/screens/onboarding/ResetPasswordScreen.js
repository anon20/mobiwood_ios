import React,{ useState, useContext } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import InputField from '../../components/InputField';
import { Formik } from 'formik'
import * as yup from 'yup'
import styles from './style'


const resetPassValidation = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required('Email Address is Required'),
})


const ResetPasswordScreen = ({navigation}) => {
  return (
    <SafeAreaView>
      <KeyboardAvoidingView>
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
                    containerStyles = {styles.containerStyles}
                  />   
                   {errors.email &&
                          <Text style={styles.error}>{errors.email}</Text>
                  }
           <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={!isValid}>
             <Text style={styles.btnText}>Reset Password</Text>
           </TouchableOpacity>
           </>
            )}
          </Formik>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



export {ResetPasswordScreen};
