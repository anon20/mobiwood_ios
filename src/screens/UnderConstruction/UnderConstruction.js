import React from 'react';

import {Text, SafeAreaView, TouchableOpacity, View} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export default props => {
    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:0.1}}>
                <TouchableOpacity onPress={()=>props.navigation.goBack()} style={{marginTop:10, alignSelf:'flex-start', marginLeft:10}}>
                    <FeatherIcon  name='chevron-left' size={30} color='black' />
                </TouchableOpacity>
            </View>
            <View style={{flex:0.9, alignContent:'center', justifyContent:'center', alignItems:'center'}}>
                <Text style={{alignSelf:'center', justifyContent:'center', fontSize:20, marginTop:-100}}>The page is under Construction</Text>
            </View>
        </SafeAreaView>
    )
};