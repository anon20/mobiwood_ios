import React from 'react'
import {View, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList} from 'react-native'
import {VideosContext} from '../contexts/VideosContext.js';
import Video from 'react-native-video-player';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ExplorVideoBottom = props => {
    let vidContext = React.useContext(VideosContext);
    const [Videos, setVideos] = React.useState(vidContext.videos);
    React.useEffect(()=>{
        if(props.searchVid)
        {
            let rslt = vidContext.videos.filter(data=>data.talent.match(props.searchKeyword.toLowerCase()));
            console.log(`vidContext.videos : ${JSON.stringify(vidContext.videos)}`)
            console.log(`props.searchKeyworkd : ${props.searchKeyword} Results Found While Filtering : ${rslt.length}`);
            setVideos(rslt);
            props.setSearchVid(false);
        }
        if(!props.searchKeyword&&Videos.length!=vidContext.videos.length)
        {
            let rslt = vidContext.videos.filter(data=>data.talent.match(''));
            setVideos(rslt);
        }
    },[props.searchVid, props.searchKeyword])
    return (
       
            <FlatList 
                data={Videos}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index})=>(
                    <View key={index}  style={styles.layoutB}>
                        <TouchableOpacity onPress={()=>props.clicked(item)} >
                        <Image
                            source={item.thumbnail?{uri:item.thumbnail}:(require('../assets/images/loading.jpg'))}
                            style={{height:"100%",width:"100%", margin:2}}
                        />
                        </TouchableOpacity>
                        
                    </View>)
                }
            />
    )
}

const styles = StyleSheet.create({
    layoutA :{height:150,width:windowWidth/3,backgroundColor:'black'},
    layoutB:{height:150,width:windowWidth/3,backgroundColor:'white'} 
})
export default ExplorVideoBottom;