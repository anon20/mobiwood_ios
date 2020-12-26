import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';

export const AuthContext = React.createContext({});

export default props => {
  const [user, setUser] = React.useState({});
  const [uid, setUid] = React.useState('');

  const onAuthStateChanged = (u) => {
    if (u && u.uid) {
      console.log(`USER DETAILS : ${JSON.stringify(u)}`)
      setUser(u);
      setUid(u.uid);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userDetails:user,
        setUser,
        uid,
        setUid,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};
