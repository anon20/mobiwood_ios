import React from 'react';
import { ScaledSheet } from 'react-native-size-matters';
import Video from 'react-native-video-player';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
export default props => {
    let vidRef = null;
    React.useEffect(()=>{
        // console.log(`from useEffect, currentlyPlaying : ${props.currentlyPlaying}`)
        if(props.myIndex!=props.currentlyPlaying)
            vidRef.pause();
    },[props.currentlyPlaying]);
    React.useEffect(() => {
        if(props.myIndex != props.currentVisibleVideo)
        {
            vidRef.pause();
        }
        else{
            vidRef.resume();
        }
    },[props.currentVisibleVideo]);
    return (
            <Video ref={inpt => vidRef = inpt} onStart={()=>{props.setPlaying(props.myIndex)}} onPlayPress={()=>{props.setPlaying(props.myIndex)}}  thumbnail={{uri:props.item.thumbnail}} video={{uri:props.item.videoUrl}}  resizeMode={"cover"}  style={styles.img} autoplay={props.myIndex==props.currentVisibleVideo?true:false}/>
        )
}
const styles = ScaledSheet.create({
    imageGrid:{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    imgContainer:{
        padding:"0@ms",
    },
    img:{
        width:wp('100%'),
        borderRadius:"0@ms",
    }
})