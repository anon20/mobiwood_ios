import 'react-native-gesture-handler';
import HomeScreen from './screens/Home/HomeScreen'
import UploadScreen from './screens/Upload/UploadScreen.js';
import ExploreScreen from './screens/Explore/Explore.js';
import React from 'react';
import {ContestStack} from './navigations/DrawerStack.js';

import { Text, View, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';

import VideosContext from './contexts/VideosContext.js';
import AuthContext from './contexts/AuthContext.js';
import UserContext from './contexts/UserContext.js';

import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ContestRegistration from './screens/Contests/ContestRegistration';
import ContestRegistrationHome from './screens/Contests/ContestRegistrationHome';
import UnderConstruction from './screens/UnderConstruction/UnderConstruction.js';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {UnauthorizedStack} from './navigations/UnauthorizedStack';
// import VideosContext from './contexts/VideosContext.js';
import DrawerStack from './navigations/DrawerStack';
import ExploreProfile from './screens/Profile/ExploreProfile.js';

import { FONT_BOLD } from './constants/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Link } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Explore from './screens/Explore/Explore.js';
function SettingsScreen() {
  return (
    <View style={{flex: 1,  padding:50, justifyContent: 'center', alignItems: 'center' }}>
      <Text><FeatherIcon name="bell" size={20} color="black" style={{marginBottom:0}} /></Text>
      <Text>No Nofications</Text>
    </View>
  );
}

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const TabNavigator = props => {
  // console.log(`props.navigation inside TabNavigator: ${JSON.stringify(props.navigation)}`)
  return (
    <Tab.Navigator 
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused
                  ? 'home'
                  : 'home';
              } 
              else if (route.name === 'Notification') {
                iconName = focused ? 'bell' : 'bell';
              }
              else if (route.name === 'Profile') {
                iconName = focused ? 'user' : 'user';
              }
              else if (route.name === 'Upload') {
                iconName = focused ? 'plus-circle' : 'plus-circle';
              }
              else if (route.name === 'Search') {
                iconName = focused ? 'search' : 'search';
              }
              // You can return any component that you like here!
              if(Platform.OS==='ios'){
              return <FeatherIcon name={iconName} size={25} color={color} style={{marginBottom:0}} />
              } 
              if(Platform.OS==='android'){
                return <FeatherIcon name={iconName} size={22} color={color} style={{marginBottom:18}} />
                } 

              ;
            },
          })}
          tabBarOptions={{
            showLabel: false,
            activeTintColor: 'white',
            keyboardHidesTabBar: true,
            inactiveTintColor: 'white',
            labelStyle: {
                margin:4
            },
            backgroundColor: 'black',
            style:{
              backgroundColor: 'black',
              borderTopWidth:0,
              paddingTop:15
            }
          }}
          >
            <Tab.Screen options={{"unmountOnBlur":true}} name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={ExploreScreen} />
            <Tab.Screen name="Upload" component={UploadScreen} />
            <Tab.Screen name="Notification" component={SettingsScreen} />
            <Tab.Screen options={{"unmountOnBlur":true}} name="Profile" component={DrawerStack} />
            
          </Tab.Navigator>
  )
}

const App = () => {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const onAuthStateChanged = (u) => {
    setIsSignedIn(u && u.uid);
  };

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  return (
    <AuthContext>
      <UserContext>
        <VideosContext>
          <NavigationContainer>
            <Stack.Navigator>
              {isSignedIn?
              <Stack.Screen name="TabNavigator" options={{headerShown:false}} component={TabNavigator} />:
              <Stack.Screen name="Login" options={{headerShown:false}} component={UnauthorizedStack} />}
              <Stack.Screen name="contestScreen" options={{headerShown:false}} component={ContestRegistration} />
              <Stack.Screen name="contestScreenHome" options={{headerShown:false}} component={ContestRegistrationHome} />
              <Stack.Screen name="exploreProfile" options={{headerShown:false}} component={ExploreProfile} />
              <Stack.Screen name="underConstruction" options={{headerShown:false}} component={UnderConstruction} />
            </Stack.Navigator>
          </NavigationContainer>
        </VideosContext>
      </UserContext>
    </AuthContext>
  );
};

export {App};