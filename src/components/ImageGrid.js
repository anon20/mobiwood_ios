import React from 'react'
import {View,Text,Image, FlatList, TouchableOpacity, ToastAndroid, Platform, Alert}from 'react-native'
import { ScaledSheet } from 'react-native-size-matters';
import ImageGridItem from './ImageGridItem.js';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video-player';
import {VideosContext} from '../contexts/VideosContext.js';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { UserContext } from '../contexts/UserContext';
import CircleTop from './CircleTop.js';
 
export default function ImageGrid(props){
    let flatListRef = null;
    const [currentVisibleVideo, setCurrentVisibleVideo] = React.useState(0);
    const [currentlyPlaying, setCurrentlyPlaying] = React.useState(0);
    const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 70});
    const videoContext = React.useContext(VideosContext);
    const usrCntxt = React.useContext(UserContext);
    const onViewRef = React.useRef(viewableItems => viewableItems.viewableItems.length
      ? setCurrentVisibleVideo(viewableItems.viewableItems[0].index)
      : null
    );
    // React.useEffect(()=>{
    //   console.log(`currentVisibleVideo : ${currentVisibleVideo}`);
    // },[currentVisibleVideo])
    return(
        <View style={styles.imageGrid}>
            <FlatList 
              onViewableItemsChanged={onViewRef.current}
              showsVerticalScrollIndicator={false}
              viewabilityConfig={viewConfigRef.current}
              ref={input => (flatListRef = input)}
              data = {videoContext.videos}
              keyExtractor={(item, index) => index.toString()}
              renderItem = {({item, index}) =>  (
                <View style={styles.imgContainer}> 
                {index==0 ?
                <CircleTop navigation={props.navigation} />
                :null
                }
                  <View style={{paddingTop:5, flex:0.2}}>
                  {/* {console.log(`item.profile : ${item.profile}`)} */}

                    {
                      !item.profile?
                    <Image source={require('../assets/images/user-placeholder.png')} style={{width:40, height:40, marginLeft:10, marginTop:8, marginBottom:8, borderRadius:60, borderWidth:0, borderColor:'#bbb',}} />:
                    <Image source={{uri:item.profile}} style={{width:40, height:40, marginLeft:10, marginTop:8, marginBottom:8, borderRadius:60, borderWidth:1, borderColor:'#bbb',}} />
                    
                    }
                    <View style={{}}>
                      <Text style={{marginTop:8, marginLeft:12, fontWeight:'bold', fontSize:15, position:'absolute', top:-45, left:50}}>{!item.displayName?"MobiWood User":item.displayName}</Text>
                      <Text style={{position:'absolute', top:-27, left:62, fontSize:12, color:'grey', display:'none', opacity:0}}>@{item.username}</Text>
                      <Text style={{padding:10}}>{item.description}</Text>
                    </View>
                    <TouchableOpacity style={{position:'absolute', right:20, marginTop:20 }} onPress={() => props.reportModal(item.id, item, true)}>
                      <FeatherIcon
                        name='more-horizontal'
                        size={24} color='black' 
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{flex:0.7}}>
                    <ImageGridItem item={item} currentVisibleVideo={currentVisibleVideo} myIndex={index} setPlaying={setCurrentlyPlaying} currentlyPlaying={currentlyPlaying} />

                  </View>

                  <View style={{paddingLeft:20, marginTop:12, marginBottom:20, flex:0.1, flexDirection:'row'}}>
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
                    <Text style={{fontSize:17}}><FeatherIcon name='thumbs-up' size={20} color={videoContext.vidLikesMap.get(item.id)?'#3b5998':'black'} />  {videoContext.vidLikesMap.get(item.id)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{marginLeft:5}} onPress={()=>{usrCntxt.handleShare(item.id, item.description)}}>
                    <Text style={{marginLeft:20, fontSize:17}} ><FeatherIcon  name='share-2' size={20} color='black' /> {item.shares?item.shares:0}</Text>
                  </TouchableOpacity>
                  
                  <Text style={{marginLeft:25, fontSize:17,}}><FeatherIcon name='eye' size={20} color='black' /> {videoContext.noOfViewsMap.get(item.id)}</Text> 
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
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        // alignItems: 'flex-start',
    },
    imgContainer:{
        // padding:"0@ms",
    },
    img:{
        // width:wp('100%'),
        // borderRadius:"0@ms"
    },
    ImageGridItem:{
      display:'none'
    }
})