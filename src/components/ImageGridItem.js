import React from 'react';
import {View, Dimensions} from 'react-native';
import Video from 'react-native-video-player';
import firestore from '@react-native-firebase/firestore';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default (props) => {
  let vidRef = null;

  //     React.useEffect(()=>{
  //         if(props.myIndex!=props.currentlyPlaying)
  //             vidRef.pause();
  //     },[props.currentlyPlaying]);

  //     React.useEffect(() => {
  //         if(props.myIndex != props.currentVisibleVideo)
  //             vidRef.resume();
  //         else
  //             vidRef.pause();
  //     },[props.currentVisibleVideo]);

  return (
    // console.log(props.item.thumbnail),
    <Video
      resizeMode={'cover'}
      //onLoad={itm => {console.log(`${itm}`)}}
      style={{flex: 1, height: windowHeight / 1.85}}
      fullScreenOnLongPress={false}
      defaultMuted={true}
      ref={(inpt) => (vidRef = inpt)}
      onStart={() => {
        props.setPlaying(props.myIndex);
        console.log(props.noOfViewsMap);
        firestore()
          .collection('contest')
          .doc(props.item.id)
          .get()
          .then((res) => {
            const prevData = res.data();
            firestore()
              .collection('contest')
              .doc(props.item.id)
              .update({
                views: prevData.views + 1,
              });
            // props.setNoOfViewsMap(
            //   prevData.id,
            //   prevData.views ? prevData.views : 0,
            // );
          });
      }}
      onPlayPress={() => {
        props.setPlaying(props.myIndex);
      }}
      thumbnail={{uri: props.item.thumbnail}}
      video={{uri: props.item.videoUrl}}
      autoplay={true}
    />
  );
};
