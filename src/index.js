import 'react-native-gesture-handler';
import HomeScreen from './screens/Home/HomeScreen';
import UploadScreen from './screens/Upload/UploadScreen.js';
import ExploreScreen from './screens/Explore/Explore.js';
import React from 'react';
import {ContestStack} from './navigations/DrawerStack.js';

import {Image, Text, View, Platform, Linking, scrollToItem} from 'react-native';
import auth from '@react-native-firebase/auth';

import VideosContext from './contexts/VideosContext.js';
import AuthContext from './contexts/AuthContext.js';
import UserContext from './contexts/UserContext.js';

import {NavigationContainer, useLinkProps} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ContestRegistration from './screens/Contests/ContestRegistration';
import ContestRegistrationHome from './screens/Contests/ContestRegistrationHome';
import UnderConstruction from './screens/UnderConstruction/UnderConstruction.js';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {UnauthorizedStack} from './navigations/UnauthorizedStack';
// import VideosContext from './contexts/VideosContext.js';
import DrawerStack from './navigations/DrawerStack';
import ExploreProfile from './screens/Profile/ExploreProfile.js';
import ExploreLearn from './screens/Explore/ExploreLearn.js';

import {FONT_BOLD} from './constants/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Link} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Explore from './screens/Explore/Explore.js';
import image from './assets/images/logo.png';
import {TouchableOpacity} from 'react-native-gesture-handler';
import IconFB from './assets/images/facebook.png';
import IconInsta from './assets/images/instagram.png';

function SettingsScreen() {
  return (
    <View style={{flex: 1, padding: 20}}>
      <>
        <Image
          source={image}
          style={{
            width: 142,
            height: 41,
            alignSelf: 'center',
            marginBottom: 20,
            marginTop: 20,
          }}
        />
        <Text
          style={{
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 10,
          }}>
          Help us to serve you better
        </Text>
        <Text style={{textAlign: 'justify', fontSize: 17}}>
          we are creating world's biggest Talent community where MobiWood will
          support all talented people to grow and earn + community people will
          help each other to grow and learn.
        </Text>
        <Text style={{textAlign: 'justify', fontSize: 17, marginTop: 10}}>
          Help us by suggesting ideas that what we do more to improve your
          talent's quality, to make you earn more, to make this community more
          strong.
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            marginTop: 10,
            fontWeight: 'bold',
          }}>
          Share your ideas on
        </Text>
        <Text
          style={{textAlign: 'center', fontSize: 17, marginTop: 0}}
          onPress={() => {
            Linking.openURL('mailto:feedback@mobiwood.net');
          }}>
          feedback@mobiwood.net
        </Text>
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <TouchableOpacity
            style={{
              textAlign: 'center',
              alignSelf: 'center',
              marginTop: 10,
              marginRight: 10,
            }}
            onPress={() => {
              Linking.openURL('https://www.facebook.com/mobiwoodapp/');
            }}>
            <Image
              source={IconFB}
              width={10}
              height={20}
              resizeMode={'contain'}
              style={{width: 28, height: 28}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{textAlign: 'center', alignSelf: 'center', marginTop: 10}}
            onPress={() => {
              Linking.openURL(
                'https://www.instagram.com/mobiwoodentertainment/',
              );
            }}>
            <Image
              source={IconInsta}
              width={10}
              height={20}
              resizeMode={'contain'}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
        </View>
      </>
    </View>
  );
}

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const TabNavigator = (props) => {
  // console.log(`props.navigation inside TabNavigator: ${JSON.stringify(props.navigation)}`)
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Notification') {
            iconName = focused
              ? 'information-circle-outline'
              : 'information-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-outline' : 'person-outline';
          } else if (route.name === 'Upload') {
            iconName = focused ? 'add-circle-outline' : 'add-circle-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search-outline' : 'search-outline';
          }
          // You can return any component that you like here!
          if (Platform.OS === 'ios') {
            return (
              <Ionicons
                name={iconName}
                size={25}
                color={color}
                style={{marginBottom: 0}}
              />
            );
          }
          if (Platform.OS === 'android') {
            return (
              <Ionicons
                name={iconName}
                size={25}
                color={color}
                style={{marginBottom: 18}}
              />
            );
          }
        },
      })}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: 'white',
        keyboardHidesTabBar: true,
        inactiveTintColor: 'white',
        labelStyle: {
          margin: 4,
        },
        backgroundColor: 'black',
        style: {
          backgroundColor: 'black',
          borderTopWidth: 0,
          paddingTop: 15,
        },
      }}>
      <Tab.Screen
        options={{unmountOnBlur: true}}
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen name="Search" component={ExploreScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />

      <Tab.Screen name="Notification" component={SettingsScreen} />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        name="Profile"
        component={DrawerStack}
      />
    </Tab.Navigator>
  );
};

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
              {isSignedIn ? (
                <Stack.Screen
                  name="TabNavigator"
                  options={{headerShown: false}}
                  component={TabNavigator}
                />
              ) : (
                <Stack.Screen
                  name="Login"
                  options={{headerShown: false}}
                  component={UnauthorizedStack}
                />
              )}
              <Stack.Screen
                name="contestScreen"
                options={{headerShown: false}}
                component={ContestRegistration}
              />
              <Stack.Screen
                name="contestScreenHome"
                options={{headerShown: false}}
                component={ContestRegistrationHome}
              />
              <Stack.Screen
                name="exploreProfile"
                options={{headerShown: false}}
                component={ExploreProfile}
              />
              <Stack.Screen
                name="explorelearn"
                options={{headerShown: false}}
                component={ExploreLearn}
              />
              <Stack.Screen
                name="underConstruction"
                options={{headerShown: false}}
                component={UnderConstruction}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </VideosContext>
      </UserContext>
    </AuthContext>
  );
};

export {App};
