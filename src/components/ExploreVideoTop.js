import React from 'react'
import {View,StyleSheet,Dimensions,Image} from 'react-native'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ExploreVideoTop = (props) => {
    return (
        <View style={{height:windowHeight/2.5,backgroundColor:'orange',flexDirection:'row'}}>
        <View style={{height:windowHeight/2.5,backgroundColor:'pink',width:windowWidth/3}}>
            <View style={{height:windowHeight/5,backgroundColor:'black'}}>
                <Image 
                      style={{height:"100%",width:"100%"}}
                source={props.video[0].img}/>
            </View>
            <View style={{height:windowHeight/5,backgroundColor:'pink'}}>
                  <Image 
                     style={{height:"100%",width:"100%"}} 
                  source={props.video[1].img}/>
            </View>
        </View>
        <View style={{height:windowHeight/2.5,width:windowWidth-windowWidth/3,backgroundColor:'blue'}}>
              <Image 
                style={{height:"100%",width:"100%"}}
              source={props.video[2].img}/>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({

})
export default ExploreVideoTop;