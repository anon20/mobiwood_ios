import React from 'react'
import {View,Text,ScrollView,TouchableOpacity,ImageBackground, Platform} from 'react-native'
import Unorderedlist from 'react-native-unordered-list';
import {Colors, Typography} from '../constants';
import {ScaledSheet} from 'react-native-size-matters';
import ContestsImage from '../assets/images/contests.png';
import JobsImage from '../assets/images/jobs.png';
import NewsImage from '../assets/images/news.png';
import BusinessImage from '../assets/images/business.png';
import LearnImage from '../assets/images/learn.png';

import { useLinkProps } from '@react-navigation/native';
export default function Circles(props){
  return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.circlewrapper}>
          <TouchableOpacity onPress={()=>{props.navigation.navigate("contestScreenHome")}} style={styles.circlewrap}>
            <ImageBackground source={ContestsImage} style={styles.imgbackground}>
            </ImageBackground> 
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{props.navigation.navigate("underConstruction")}} style={styles.circlewrap}>
            <ImageBackground source={JobsImage} style={styles.imgbackground}>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{props.navigation.navigate("underConstruction")}} style={styles.circlewrap}>
            <ImageBackground source={NewsImage} style={styles.imgbackground}>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{props.navigation.navigate("underConstruction")}} style={styles.circlewrap}>
            <ImageBackground source={BusinessImage} style={styles.imgbackground}>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{props.navigation.navigate("underConstruction")}} style={styles.circlewrap}>
            <ImageBackground source={LearnImage} style={styles.imgbackground}>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </ScrollView>
                
)
} 

const styles = ScaledSheet.create({
  
    para:{
      textAlign: "justify",
      paddingRight:5,
    },
    imgbackground: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
      width: Platform.OS==="ios"?65:70,
      height: Platform.OS==="ios"?65:70,
    },circles:
    {
      borderWidth:0,
      borderRadius: '31@ms',
      borderColor:'black',
      width: Platform.OS==="ios"?75:70,
      height:75,
      paddingTop:30,
      textAlign:'center',
      marginRight:10,
      color:'#353535',
      fontWeight:'600',
      fontSize:13,
    },
    circlewrap:
    {
      margin:5,
      // backgroundColor:'red',
    },
    circlewrapper:
    {
      marginLeft:10,
      marginTop:10,
      display:'flex',
      flexDirection:'row',
    },
})
