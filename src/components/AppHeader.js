import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Images, Colors, Typography} from '../constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBarOptions={{
        activeTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: 'Updates',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const AppHeader = ({scene, navigation}) => {
  const {options} = scene.descriptor;
  const {name: routeName} = scene.route;

  const renderLeftHeader = () => {
    let pageNumber = '',
      title = '';

    switch (routeName) {
      case 'SelectServices':
        pageNumber = '02';
        title = 'Services';
        break;
      case 'SelectSoftware':
        pageNumber = '04';
        title = 'DAW';
        break;
      case 'SelectGenre':
        pageNumber = '05';
        title = 'Genre';
        break;
      default:
        break;
    }

    if (!pageNumber && !title) {
      return null;
    }

    return (
      <View style={styles.headerLeftTitleContainer}>
        <Text style={styles.headerLeftTitle}>
          <Text style={styles.headerLeftTitleNumberText}>
            {pageNumber + ' '}
          </Text>
          {title}
        </Text>
      </View>
    );
  };

  if (routeName === 'Map' || routeName === 'List') {
    return (
      <SafeAreaView>
        <View
          style={[
            styles.container,
            {
              backgroundColor:
                routeName === 'Map' ? 'transparent' : Colors.LIGHT_BLACK,
            },
          ]}>
          <TouchableOpacity>
            <View style={styles.backButtonContainer}>
              <Image source={Images.MenuIcon} />
            </View>
          </TouchableOpacity>
          <View style={styles.leftIconsContainer}>
            <TouchableOpacity>
              <View style={styles.filterIconContainer}>
                <Image source={Images.FilterIcon} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.notificationIconContainer}>
                <Image source={Images.NotificationIcon} />
                <View style={styles.notificationBadgeContainer}>
                  <Text style={styles.notificationBadgeText}>6</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backButtonContainer}>
            <Image source={Images.BackIcon} />
            <Text style={styles.headerBackTitleText}>
              {options.headerBackTitle}
            </Text>
          </View>
        </TouchableOpacity>
        {renderLeftHeader()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: hp('6.5%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('2.5%'),
  },
  containerBackgroundColor: {
    backgroundColor: Colors.LIGHT_BLACK,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('2.5%'),
  },
  headerBackTitleText: {
    ...Typography.FONT_MEDIUM,
    color: Colors.WHITE,
    fontSize: wp('5%'),
    marginLeft: wp('4%'),
  },
  headerLeftTitleContainer: {
    paddingRight: wp('2.5%'),
  },
  headerLeftTitleNumberText: {
    ...Typography.FONT_MEDIUM,
    color: Colors.WHITE,
    fontSize: wp('3.5%'),
  },
  headerLeftTitle: {
    ...Typography.FONT_REGULAR,
    color: Colors.GREY,
    fontSize: wp('3.5%'),
  },
  searchInputContainer: {
    height: 33,
    flex: 1,
    marginRight: wp('1.25%'),
    marginLeft: wp('3%'),
  },
  leftIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('17.5%'),
  },
  notificationBadgeContainer: {
    position: 'absolute',
    height: 14,
    width: 14,
    top: 10,
    right: 6,
    borderRadius: 7,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  notificationBadgeText: {
    ...Typography.FONT_REGULAR,
    color: Colors.WHITE,
    fontSize: wp('2%'),
  },
  filterIconContainer: {
    paddingVertical: 10,
    paddingLeft: 10,
  },
  notificationIconContainer: {
    paddingVertical: 10,
    paddingRight: 10,
  },
});

export {AppHeader};
