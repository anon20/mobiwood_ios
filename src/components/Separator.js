import React from 'react';
import {
  View,
  Text,
} from 'react-native';
export default function Separator({text}){
    return(
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
          <View>
    <Text style={{ textAlign: 'center',color:"#718096"}}>{text}</Text>
          </View>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        </View>
    );
}