import React, {useState, useCallback, useEffect} from 'react';
import {LayoutAnimation, View, Image, TextInput, Text, Platform} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Colors} from '../constants';

const InputField = ({leftIcon, floatingInput = true, ...props}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    LayoutAnimation.spring();
    setIsFocused(true);
  }, [LayoutAnimation]);

  const handleBlur = useCallback(() => {
    if (props.value === '' || props.value == null) {
      LayoutAnimation.spring();
      setIsFocused(false);
    }
  }, [props, LayoutAnimation]);

  useEffect(() => {
    if (props.value) {
      setIsFocused(true);
    }
    return () => {
      setIsFocused(false);
    };
  }, [props.value]);

  return (
  
        <View style={{width: '100%', alignSelf:'center'}}>
            <TextInput 
              style={[Styles.inputContainer,{padding:Platform.OS==="ios"?15:0}]}
              underlineColorAndroid="transparent"
              {...props}/>
        </View>
   
  );
};

const Styles= ScaledSheet.create({
  inputContainer:{
    borderColor: '#edf2f7',
    borderWidth: 1,
    borderRadius:"3@ms",
    paddingLeft:10,
    marginBottom:20,
    // padding:15,
    width:wp('90%'),
    backgroundColor:"white",
  },
  numberInput : {
    backgroundColor:'white',
    width:'100%'
  }
})

export default InputField;
