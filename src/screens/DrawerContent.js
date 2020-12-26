import React from 'react'
import {View,Text,Image, SafeAreaView} from 'react-native'
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer'
import { ScaledSheet } from 'react-native-size-matters';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

const logout = () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};

export default function DrawerContent(props){
   return(
       <SafeAreaView style={{flex:1}}>
         <DrawerContentScrollView {...props} style={styles.container}> 
           <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                />
               <TouchableOpacity onPress={() => props.navigation.closeDrawer()}> 
                   <Icon name="close-outline" size={30} color="white" style={styles.icon}/>
                </TouchableOpacity>
            </View>
            <View>
            {/* <DrawerItem 
               label="Home"
               icon={({ color, size }) => (<Icon name="home-outline" color={'white'} size={25} /> )}
               labelStyle={[styles.labelStyle],{marginLeft:-20, color:'white', fontSize:22,}}
               style={[styles.drawerItemStyle],{marginRight:-10}}
               onPress={() => {props.navigation.navigate('Construction')}}
			   
            />
            <DrawerItem 
               label="Trending"
               icon={({ color, size }) => (<Icon name="home-outline" color={'white'} size={25} /> )}
               labelStyle={[styles.labelStyle],{marginLeft:-20, color:'white', fontSize:22,}}
               style={[styles.drawerItemStyle],{marginRight:-10}}
               onPress={() => {props.navigation.navigate('Construction')}}
            /> */}
             <DrawerItem 
               label="Contests"
               icon={({ color, size }) => (<Icon name="film-outline" color={'white'} size={25} /> )}
               labelStyle={[styles.labelStyle],{marginLeft:-20, color:'white', fontSize:18,}}
               style={[styles.drawerItemStyle],{marginRight:-10}}
               onPress={() => {props.navigation.navigate('Contest')}}
            />
             
             <DrawerItem 
               label="Support"
               icon={({ color, size }) => (<Icon name="help-circle-outline" color={'white'} size={25} /> )}
               labelStyle={[styles.labelStyle],{marginLeft:-20, color:'white', fontSize:18,}}
               style={[styles.drawerItemStyle],{marginRight:-10}}
               onPress={() => {props.navigation.navigate('Construction')}}
            />
             <DrawerItem 
               label="Feedback"
               icon={({ color, size }) => (<Icon name="happy-outline" color={'white'} size={25} /> )}
               labelStyle={[styles.labelStyle],{marginLeft:-20, color:'white', fontSize:18,}}
               style={[styles.drawerItemStyle],{marginRight:-10}}
               onPress={() => {props.navigation.navigate('Construction')}}
            />
             
			<DrawerItem 
               label="Logout"
               icon={({ color, size }) => (<Icon name="log-out-outline" color={'white'} size={25} /> )}
               labelStyle={[styles.labelStyle],{marginLeft:-20, color:'white', fontSize:18,}}
               style={[styles.drawerItemStyle],{marginRight:-10}}
               onPress={() => {logout()}}
            />
           
            </View>
         </DrawerContentScrollView>
       </SafeAreaView>
   );
}

const styles = ScaledSheet.create({
    container:{
        padding:"10@ms"
    },
    logoContainer:{
        flexDirection:"row",
        justifyContent:"space-around",
        paddingBottom:"10@ms"
    },
    logo:{
        width:wp('40%'),
        height:hp('10%'),
        resizeMode: 'contain',
    },
    icon:{
        paddingTop:"25@ms",
    },
    labelStyle:{
        color:"white",
        fontSize:"16@ms",
    },
    drawerItemStyle:{
       borderBottomColor:"gray",
       borderBottomWidth:1,
       paddingBottom:"5@ms",
    }
})