import React from 'react';
import {View, Dimensions} from 'react-native';
import Video from 'react-native-video-player';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default props => {
    let vidRef = null;

    React.useEffect(()=>{
        if(props.myIndex!=props.currentlyPlaying)
            vidRef.pause();
    },[props.currentlyPlaying]);

    React.useEffect(() => {
        if(props.myIndex != props.currentVisibleVideo)
            vidRef.pause();
        else
            vidRef.resume();
    },[props.currentVisibleVideo]);

    return (
        <Video resizeMode={"cover"} onLoad={itm => {console.log(`${itm}`)}} style={{flex:1, height:windowHeight/1.85,}} fullScreenOnLongPress={true} defaultMuted={true} ref={inpt => vidRef = inpt} onStart={()=>{props.setPlaying(props.myIndex)}} onPlayPress={()=>{props.setPlaying(props.myIndex)}}  thumbnail={{uri:props.item.thumbnail}} video={{uri:props.item.videoUrl}} autoplay={props.myIndex === props.currentVisibleVideo}/>
    )
};