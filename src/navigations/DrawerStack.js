import React from 'react';
import {Text,Image,View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
const Stack = createStackNavigator();
import image from '../assets/images/logo1.png';
import {AppHeader} from '../components';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Profile from '../screens/Profile/Profile.js';
import {ScaledSheet} from 'react-native-size-matters';
import {Colors, Typography} from '../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from '../screens/DrawerContent';
import Home from '../screens/Home/HomeScreen';
import UserContext from '../contexts/UserContext.js';
import ContestRegistration from '../screens/Contests/ContestRegistration';
import Upload from '../screens/Contests/Upload';
import UnderAge from '../screens/Contests/UnderAge';
import { LoginScreen } from '../screens';
import FeatherIcon from 'react-native-vector-icons/Feather';
function SettingsScreen() {
  return (
    <View style={{flex: 1,  padding:50, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

function Construction() {
  return (
    <View style={{flex: 1,  padding:50, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{alignSelf:'center',fontSize:24,fontWeight:'700'
    }}>Under Construction ...</Text>
    </View>
  );
}

function MyTabBar({ navigation }) {
  return (
    <Button
      title="Go somewhere"
      onPress={() => {
        // Navigate using the `navigation` prop that you received
        navigation.navigate('SomeScreen');
      }}
    />
  );
}

const Drawer = createDrawerNavigator();

const logout = () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};

export default function DrawerStack() {
  return (
    <Drawer.Navigator
      initialRouteName="Profile"
      drawerContent={(props) => <DrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: '#000000',
      }}
      sceneContainerStyle={{backgroundColor: 'black'}}>
      <Drawer.Screen name="Profile" component={ProfileStack} />
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="Contest" component={ContestStack} />
      <Drawer.Screen name="Construction" component={SampleStack}/>
    </Drawer.Navigator>
  );
}
function ProfileStack() {
  return (<Stack.Navigator
      headerMode="screen"
      screenOptions={({navigation}) => ({					
        //title: 'hello',
    headerTitle: (<Image source={image} style={{width:142, height:41}} />),
    headerTitleStyle: {
      fontWeight: 'bold',
      alignSelf:'center',
      height:70,
    },
        headerStyle: {
        backgroundColor: 'black',
        },
        headerRight: () => (
          <TouchableOpacity style={[styles.btn],{display:'none'}} onPress={() => logout()}>
            <Text style={styles.txt}>Logout</Text>
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity
            style={[styles.menu]}
            onPress={() => navigation.openDrawer()}>
            <FeatherIcon name="menu" size={25} color='white' />
			
          </TouchableOpacity>
        ),
		
      })}>
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>)
}
function HomeStack() {
  return (
		 
    <Stack.Navigator
      headerMode="screen"
      screenOptions={({navigation}) => ({					
        //title: 'hello',
    headerTitle: (<Image source={image} style={{width:142, height:41}} />),
    headerTitleStyle: {
      fontWeight: 'bold',
      alignSelf:'center',
      height:70,
    },
        headerStyle: {
        backgroundColor: 'black',
        },
        headerRight: () => (
          <TouchableOpacity style={[styles.btn],{display:'none'}} onPress={() => logout()}>
            <Text style={styles.txt}>Logout</Text>
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity
            style={[styles.menu]}
            onPress={() => navigation.openDrawer()}>
            <Icon name="ellipsis-horizontal-circle" size={32} color='grey' />
			
          </TouchableOpacity>
        ),
		
      })}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function ContestStack() {
  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={({navigation}) => ({
        title: '',
        headerStyle: {
          backgroundColor: 'black',
        },
        // headerRight: () => (
        //   <TouchableOpacity style={styles.btn} onPress={() => logout()}>
        //     <Text style={styles.txt}>Logout</Text>
        //   </TouchableOpacity>
        // ),
        headerLeft: () => (
          <TouchableOpacity
            style={styles.menu}
            onPress={() => navigation.openDrawer()}>
            <Icon name="menu" size={32} color={Colors.PRIMARY} />
          </TouchableOpacity>
        ),
      })}>
      <Stack.Screen
        name="ContestRegistration"
        component={ContestRegistration}
      />
      <Stack.Screen name="Upload" component={Upload} />
      <Stack.Screen name="UnderAge" component={UnderAge} />
    </Stack.Navigator>
  );
}


function SampleStack() {
  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={({navigation}) => ({
        title: '',
        headerStyle: {
          backgroundColor: 'black',
        },
        // headerRight: () => (
        //   <TouchableOpacity style={styles.btn} onPress={() => logout()}>
        //     <Text style={styles.txt}>Logout</Text>
        //   </TouchableOpacity>
        // ),
        headerLeft: () => (
          <TouchableOpacity
            style={styles.menu}
            onPress={() => navigation.openDrawer()}>
            <Icon name="menu" size={32} color={Colors.PRIMARY} />
          </TouchableOpacity>
        ),
      })}>
      <Stack.Screen
        name="Construction"
        component={Construction}
      />
    </Stack.Navigator>
  );
}

const styles = ScaledSheet.create({
  txt: {
    color: Colors.PRIMARY,
    textAlign: 'center',
    ...Typography.FONT_BOLD,
  },
  btn: {
    width: wp('20%'),
    backgroundColor: '#f91111',
    padding: '8@ms',
    marginRight: '15@ms',
    borderRadius: '5@s',
  },
  menu: {
    marginLeft: '15@ms',
  },
});
