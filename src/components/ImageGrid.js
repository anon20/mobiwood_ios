import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  RefreshControl,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import ImageGridItem from './ImageGridItem.js';
import {VideosContext} from '../contexts/VideosContext.js';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {UserContext} from '../contexts/UserContext';
import CircleTop from './CircleTop.js';
import IconClose from 'react-native-vector-icons/Ionicons';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default function ImageGrid(props) {
  let flatListRef = null;
  const [currentVisibleVideo, setCurrentVisibleVideo] = React.useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState(0);
  const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 70});
  const videoContext = React.useContext(VideosContext);
  const usrCntxt = React.useContext(UserContext);
  const onViewRef = React.useRef((viewableItems) =>
    viewableItems.viewableItems.length
      ? setCurrentVisibleVideo(viewableItems.viewableItems[0].index)
      : null,
  );
  //const {setNoOfViewsMap} = React.useContext(VideosContext);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  // const ScrollToTop = (React.goIndex = () => {
  //   this.flatListRef.scrollToIndex({animated: true, index: 5});
  // });

  // const date = AuthContext.getItem('uploadTime');
  // React.useEffect(() => {
  //   console.log(`currentVisibleVideo : ${currentVisibleVideo}`);
  // }, [currentVisibleVideo]);
  return (
    <View style={styles.imageGrid}>
      <FlatList
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onRefresh={onViewRef.onRefresh}
        onViewableItemsChanged={onViewRef.current}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewConfigRef.current}
        ref={(input) => (flatListRef = input)}
        data={videoContext.videos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View style={styles.imgContainer}>
            {index == 0 ? <CircleTop navigation={props.navigation} /> : null}
            <View style={{paddingTop: 5, flex: 0.2}}>
              {/* {console.log(`item.profile : ${item.profile}`)} */}
              <TouchableOpacity
                onPress={() => {
                  videoContext.setViewProfile(item.userid);
                  videoContext.setViewDisplayName(item.displayName);
                  props.navigation.navigate('exploreProfile');
                }}>
                {!item.profile ? (
                  <Image
                    source={require('../assets/images/user-placeholder.png')}
                    style={{
                      width: 28,
                      height: 28,
                      marginLeft: 10,
                      marginTop: 8,
                      marginBottom: 8,
                      borderRadius: 60,
                      borderWidth: 0,
                      borderColor: '#bbb',
                    }}
                  />
                ) : (
                  <Image
                    source={{uri: item.profile}}
                    style={{
                      width: 28,
                      height: 28,
                      marginLeft: 10,
                      marginTop: 8,
                      marginBottom: 8,
                      borderRadius: 60,
                      borderWidth: 1,
                      borderColor: '#bbb',
                    }}
                  />
                )}
              </TouchableOpacity>

              <View>
                <TouchableOpacity
                  onPress={() => {
                    videoContext.setViewProfile(item.userid);
                    videoContext.setViewDisplayName(item.displayName);
                    props.navigation.navigate('exploreProfile');
                  }}>
                  <Text
                    style={{
                      marginTop: 12,
                      marginLeft: 0,
                      fontWeight: 'bold',
                      fontSize: 15,
                      position: 'absolute',
                      top: -45,
                      left: 45,
                    }}>
                    {!item.displayName ? 'MobiWood User' : item.displayName}
                  </Text>
                  <Text
                    style={{
                      position: 'absolute',
                      top: -27,
                      left: 62,
                      fontSize: 12,
                      color: 'grey',
                      display: 'none',
                      opacity: 0,
                    }}>
                    @{item.displayName}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{position: 'absolute', right: 15, marginTop: 15}}
                onPress={() => props.reportModal(item.id, item, true)}>
                <FeatherIcon name="more-horizontal" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={{flex: 0.7, marginTop: 5}}>
              <ImageGridItem
                item={item}
                currentVisibleVideo={currentVisibleVideo}
                myIndex={index}
                setPlaying={setCurrentlyPlaying}
                currentlyPlaying={currentlyPlaying}
              />
            </View>
            <View
              style={{
                paddingLeft: 10,
                marginTop: 12,
                marginBottom: 10,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => {
                  usrCntxt
                    .updateLikes(
                      item.id,
                      videoContext.vidLikesMap.get(item.id),
                      videoContext.myLikedVideos,
                    )
                    .then((reslt) => {
                      // console.log(`vidLiked : ${reslt}`)
                      let ttmp = new Map(videoContext.myLikedVideos);

                      if (reslt > videoContext.vidLikesMap.get(item.id)) {
                        ttmp.set(item.id, true);
                        if (Platform.OS === 'android')
                          ToastAndroid.show(
                            `You Like This Video`,
                            ToastAndroid.LONG,
                          );
                      } else {
                        ttmp.delete(item.id);
                      }
                      videoContext.setMyLikedVideos(ttmp);
                      // else
                      //   ToastAndroid.show(`Like Cleared!`, ToastAndroid.LONG);
                      let tmp = new Map(videoContext.vidLikesMap);
                      tmp.set(item.id, reslt);
                      videoContext.setVidLikesMap(tmp);
                    });
                }}
                style={{paddingLeft: 3, paddingRight: 3}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 17, marginRight: 5}}>
                    <IconClose
                      name={
                        !videoContext.myLikedVideos.get(item.id)
                          ? 'heart-outline'
                          : 'heart'
                      }
                      size={20}
                      color={
                        !videoContext.myLikedVideos.get(item.id)
                          ? 'black'
                          : 'red'
                      }
                    />
                  </Text>
                  <Text style={{fontSize: 17}}>
                    {videoContext.vidLikesMap.get(item.id)}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 0}}
                onPress={() => {
                  usrCntxt.handleShare(item.id, item.description);
                }}>
                <Text style={{marginLeft: 15, fontSize: 17}}>
                  <IconClose
                    name="arrow-redo-outline"
                    size={20}
                    color="black"
                  />{' '}
                  {item.shares ? item.shares : 0}{' '}
                </Text>
              </TouchableOpacity>
              <Text style={{marginLeft: 15, fontSize: 17}}>
                <IconClose name="eye-outline" size={20} color="black" />{' '}
                {videoContext.noOfViewsMap.get(item.id)}
              </Text>
              {/* <Text style={{right:0, position:'absolute', marginRight:10, color:'grey', fontSize:12, paddingTop:5}}>
                  @{`${new Date(videoContext.uploadTime).getDate()}, ${month[new Date(videoContext.uploadTime).getMonth()]}`}  
                 </Text> */}
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text style={{padding: 10, paddingTop: 0, paddingLeft: 13}}>
                <Text style={{fontWeight: 'bold'}}>
                  {!item.displayName ? 'MobiWood User' : item.displayName}{' '}
                </Text>
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = ScaledSheet.create({
  imageGrid: {
    flex: 1,
  },
  imgContainer: {
    position: 'relative',
  },
  img: {},
  ImageGridItem: {
    display: 'none',
  },
});

const month = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];
