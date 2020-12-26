import React,{useState} from 'react'
import{Text,View,ScrollView,Modal, ActivityIndicator} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player'
import video from '../../assets/videos/video.mp4'
import {Colors, Typography} from '../../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {  TouchableOpacity } from 'react-native-gesture-handler';
import InputField from '../../components/InputField';
import { Formik } from 'formik'
import * as yup from 'yup'
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import TNC from '../../components/TNC'
import styles from './Style'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UUIDGenerator from 'react-native-uuid-generator';


const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/


const underAgeValidationSchema = yup.object().shape({
    name: yup
        .string()
        .required('Name Required'),
    email: yup
        .string()
        .email("Invalid Email")
        .required('Email Required'),
    mno: yup
        .string()
        .matches(phoneRegExp, 'Invalid Phone Number. 10 Digits Required')
        .required('Phone Number required'),
  })


 

export default function UnderAge({navigation}){
    const [modalVisible,setModalVisible] = useState(false)
    const [modalPrivacy,setModalPrivacy] = useState(false)
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [selGender,setSelGender] = useState('')
    const [isLoading,setLoading] = useState(false)
    const [uuid,setUuid] = useState('');

    const toggleTnc = (val) => {
        setModalVisible(val)
    }

    const togglePrivacy = (val) =>{
        setModalPrivacy(val)
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(selectedDate);
      };

  

    return(
        <ScrollView>
            <View style={styles.formContainer}>
            <View>
                <Text style={styles.heading}>Registration for Below 18 Years</Text>
            </View>
            <TNC />   
            </View>
            <View style={styles.formContainer}>
            <Formik
                  initialValues={{ 
                      name: '',
                      email:'',
                      dob:date, 
                      mno:'', 
                  }}
                  onSubmit={async (values) => {
                     setLoading(true)
                      //console.log(values)
                    var vid = await AsyncStorage.getItem("vid");
                    var data = {};
                    data.parentName = values.name;
                    data.parentEmail = values.email;
                    data.parentNumber = values.mno;
                    data.parentDob = date;
                    data.parentGender = selGender;
                    firestore()
                            .collection("user")
                            .doc(auth().currentUser.uid)
                            .collection("videos")
                            .doc(vid)
                            .set(data, { merge: true })
                            .then(async () => {
                                setLoading(false)
                                await AsyncStorage.setItem("underage", "true");
                                navigation.navigate('Upload')
                            })
                  }}
                  validationSchema={underAgeValidationSchema}
              >
                  {({ handleChange, 
                      handleBlur, 
                      handleSubmit, 
                      setFieldValue,
                      values,
                      errors,
                      isValid,
                  }) => (
                  <>
                     <Text style={styles.label}>Name</Text>
                      <InputField  type="text"
                          onChangeText={handleChange('name')}
                          onBlur={handleBlur('name')}
                          value={values.name}
                          containerStyles = {styles.containerStyles}
                          />
                          {errors.name &&
                              <Text style={styles.error}>{errors.name}</Text>
                          }
                     
                      <Text style={styles.label}>Parent's/Gurdian's Email</Text> 
                      <InputField  type="text"
                        keyboardType="email-address"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        containerStyles = {styles.containerStyles}
                      />  
                      {errors.email &&
                          <Text style={styles.error}>{errors.email}</Text>
                      }

                    
                    <Text style={styles.label}>Parent's/Gurdian's Date of Birth</Text>
                      <TouchableOpacity style={styles.dob} onPress={() => setShow(true)}>
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
                        {errors.date &&
                          <Text style={styles.error}>{errors.date}</Text>
                        }
                        <Text style={styles.label}>Parent's/Gurdian's Mobile</Text>
                        <InputField  type="text"
                            keyboardType="numeric"
                            onChangeText={handleChange('mno')}
                            onBlur={handleBlur('mno')}
                            value={values.mno}
                            containerStyles = {styles.containerStyles}
                            />
                        
                        {errors.mno &&
                            <Text style={styles.error}>{errors.mno}</Text>
                            }


                      <Text style={styles.label}>Gender</Text>
                      <DropDownPicker
                            items={[{value:"F",label:"Female"},{value:"M",label:"Male"},{value:"O",label:"Others"}]}
                            defaultValue=""
                            containerStyle={styles.containerStyles}
                            style={styles.picker}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{backgroundColor: '#fafafa'}}
                            onChangeItem={item =>  setSelGender(item.label)}
                        />
                        {(selGender === '') &&
                          <Text style={styles.error}>Gender is Required</Text>
                        }

                    

                        <View style={{flexDirection:"row",marginBottom:30,flexWrap:"wrap"}}>
                            <Text>By registering, you agree to our</Text>
                            <TouchableOpacity onPress={() => toggleTnc(true)}>
                                <Text style={{color:"#4299e1"}}> Terms & Conditions</Text>
                            </TouchableOpacity>
                            <Text>and</Text>
                            <TouchableOpacity onPress={() => togglePrivacy(true)}>
                             <Text style={{color:"#4299e1"}}> Privacy Policy</Text>
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
                            <View style={styles.modalContent}>
                                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
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
                            <Text style={styles.btnText}>Next
                            <ActivityIndicator animating={isLoading} color="white" />
                            </Text>
                        </TouchableOpacity>

                  </>
                  )} 
                </Formik>    
            </View> 
        </ScrollView>
    )
}

