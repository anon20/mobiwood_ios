import React from 'react';
import {Image, SafeAreaView, View, StyleSheet} from 'react-native';
import image from '../assets/images/logo.png';
import Icon from 'react-native-vector-icons/Ionicons';

export default InnerComp => {
    return props => {
        return (
        <SafeAreaView style={{flex:1}}>
            <View style={[styles.headerStyle]}>
                <Image source={image} style={[styles.headerTitleStyle],{width:142, height:41}} />
            </View>
            <View  style={{flex:1}} >
                <InnerComp navigation={props.navigation} />
            </View>
        </SafeAreaView>
        )
    }
};

const styles = StyleSheet.create({
    headerTitleStyle: {
        fontWeight: 'bold',
    },
    headerStyle: {
        backgroundColor: 'white',
        elevation:5,
        borderBottomColor:'black',
        borderBottomWidth:0.1,
        alignItems:'center',
        justifyContent:'center',
        height:57,
    },
});