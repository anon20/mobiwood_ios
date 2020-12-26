import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {LoginScreen, SignupScreen, ResetPasswordScreen} from '../screens';
import {AppHeader} from '../components';

const Stack = createStackNavigator();

const UnauthorizedStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{header: AppHeader, headerTransparent: true}}
      headerMode="screen">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export {UnauthorizedStack};
