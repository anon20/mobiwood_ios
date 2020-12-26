import React from 'react'
import {View,Text,Image, FlatList, TouchableOpacity, ToastAndroid, Platform}from 'react-native'
import { ScaledSheet } from 'react-native-size-matters';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video-player';
import {VideosContext} from '../contexts/VideosContext.js';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { UserContext } from '../contexts/UserContext';


let codeBlock = "@abhishekgill";
export default function ImageGrid(props){
    const videoContext = React.useContext(VideosContext);
    const usrCntxt = React.useContext(UserContext);

    return(
        <View style={styles.imageGrid}>
            <FlatList 
              ref={input => (flatListRef = input)}
              data = {videoContext.videos}
              keyExtractor={(item, index) => index.toString()}
              renderItem = {({item, index}) =>  (
                <View style={styles.imgContainer}> 
                  <View style={{paddingTop:5}}>
                  <Image source={require('../assets/images/usericon.png')} style={{width:40, height:40, marginLeft:10, marginTop:8, marginBottom:8, borderRadius:60, borderWidth:1, borderColor:'#bbb',}} />
                  <View style={{}}>
                  <Text style={{marginTop:8, marginLeft:12, fontWeight:'bold', fontSize:15, position:'absolute', top:-55, left:50}}>{!item.displayName?"Abhishek":item.displayName}</Text>
                  <Text style={{position:'absolute', top:-27, left:62, fontSize:12, color:'grey'}}>@{item.username}</Text>
                  <Text style={{padding:10}}>{item.description}</Text>
                  </View>
                  <FeatherIcon
                    name='more-horizontal'
                    size={24} color='black' 
                    style={{position:'absolute', right:25, marginTop:20 }} />
                  </View>
                  <Video thumbnail={{uri:item.thumbnail}} video={{uri:item.videoUrl}} style={styles.img}/>
                  <View style={{paddingLeft:20, marginTop:12, marginBottom:20, display:'flex', flexDirection:'row'}}>
                  <TouchableOpacity onPress={()=>{
                    usrCntxt.updateLikes(item.id, videoContext.vidLikesMap.get(item.id)).then(reslt => {
                      // console.log(`vidLiked : ${reslt}`)
                      if(Platform.OS === "android")
                        if(reslt>videoContext.vidLikesMap.get(item.id))
                          ToastAndroid.show(`You Like This Video`, ToastAndroid.LONG)
                        // else
                        //   ToastAndroid.show(`Like Cleared!`, ToastAndroid.LONG);
                      let tmp = new Map(videoContext.vidLikesMap);
                      tmp.set(item.id, reslt);
                      videoContext.setVidLikesMap(tmp);
                    })
                  }}>
                  <Text style={{fontSize:17}}><FeatherIcon name='thumbs-up' size={20} color={videoContext.vidLikesMap.get(item.id)?'red':'black'} />  {videoContext.vidLikesMap.get(item.id)}</Text>
                  </TouchableOpacity>
                  <Text style={{marginLeft:20, fontSize:17}} ><FeatherIcon  onPress={props.shareModal}  name='share-2' size={20} color='black' /> {item.shares?item.shares:0}</Text>
                  <Text style={{marginLeft:20, fontSize:17,}}><FeatherIcon name='eye' size={20} color='black' /> {videoContext.noOfViewsMap.get(item.id)}</Text> 
                  </View> 
                </View>
              )}
            />
        </View>
    );
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
        borderRadius:"0@ms"
    }
})