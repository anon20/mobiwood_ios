import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {UnauthorizedStack} from './UnauthorizedStack';
import DrawerStack from './DrawerStack';
import AuthContext from '../contexts/AuthContext';


const AppNavigator = () => {
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  const onAuthStateChanged = (u) => {
    setIsSignedIn(u && u.uid);
  };

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#faf5ff',
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={MyTheme}>
        {isSignedIn ? <DrawerStack /> : <UnauthorizedStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export {AppNavigator};
