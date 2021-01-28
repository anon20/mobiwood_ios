import React, {useState} from 'react'
import {View, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, Text, ScrollView} from 'react-native'
import {VideosContext} from '../contexts/VideosContext.js';
import Video from 'react-native-video-player';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ExplorVideoBottom = props => {
    let vidContext = React.useContext(VideosContext);
    const [Videos, setVideos] = React.useState(vidContext.videos);
    const [myTabState, setMyTabState] = useState(0);
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
       <>
       <View style={styles.suggest}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={[styles.suggestCategory, {backgroundColor:myTabState===1?'black':'grey'}]} onPress={()=>{
                setMyTabState(1);
                props.setSearchKeyword('Acting');
                let rslt = vidContext.videos.filter(data=>data.talent.match(/acting/)); setVideos(rslt); props.setSearchVid(false)}}>
                <Text style={{color:'white'}}>Acting</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.suggestCategory, {backgroundColor:myTabState===2?'black':'grey'}]} onPress={()=>{
                  setMyTabState(2);
                  props.setSearchKeyword('Singing');
                  let rslt = vidContext.videos.filter(data=>data.talent.match(/singing/)); setVideos(rslt); props.setSearchVid(false)}}>
                <Text style={{color:'white'}}>Singing</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={[styles.suggestCategory, {backgroundColor:myTabState===3?'black':'grey'}]} onPress={()=>{
                  setMyTabState(3);
                  props.setSearchKeyword('Dancing');
                  let rslt = vidContext.videos.filter(data=>data.talent.match(/dancing/)); setVideos(rslt); props.setSearchVid(false)}}>
                <Text style={{color:'white'}}>Dancing</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={[styles.suggestCategory, {backgroundColor:myTabState===4?'black':'grey'}]} onPress={()=>{
                  setMyTabState(4);
                  props.setSearchKeyword('Learning');
                  let rslt = vidContext.videos.filter(data=>data.talent.match(/teaching/)); setVideos(rslt); props.setSearchVid(false)}}>
                <Text style={{color:'white'}}>Learning</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={[styles.suggestCategory, {backgroundColor:myTabState===5?'black':'grey'}]} onPress={()=>{
                  setMyTabState(5);
                  props.setSearchKeyword('Comedy');
                  let rslt = vidContext.videos.filter(data=>data.talent.match(/comedy/)); setVideos(rslt); props.setSearchVid(false)}}>
                <Text style={{color:'white'}}>Comedy</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={[styles.suggestCategory, {backgroundColor:myTabState===6?'black':'grey'}]} onPress={()=>{
                  setMyTabState(6);
                  props.setSearchKeyword('Music');
                  let rslt = vidContext.videos.filter(data=>data.talent.match(/music/)); setVideos(rslt); props.setSearchVid(false)}}>
                <Text style={{color:'white'}}>Music</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={[styles.suggestCategory, {backgroundColor:myTabState===7?'black':'grey'}]} onPress={()=>{
                  setMyTabState(7);
                  props.setSearchKeyword('Magic');
                  let rslt = vidContext.videos.filter(data=>data.talent.match(/magic/)); setVideos(rslt); props.setSearchVid(false)}}>
                <Text style={{color:'white'}}>Magic</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.suggestCategory, {backgroundColor:myTabState===8?'black':'grey'}]}  onPress={()=>{
                  setMyTabState(8);
                  props.setSearchKeyword('Aerobatics');
                  let rslt = vidContext.videos.filter(data=>data.talent.match(/aerobatics/)); setVideos(rslt); props.setSearchVid(false)}}>
                <Text style={{color:'white'}}>Aerobatics</Text>
              </TouchableOpacity>
              </ScrollView>
            </View>
            
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
            </>
    )
}

const styles = StyleSheet.create({
    layoutA :{height:150,width:windowWidth/3,backgroundColor:'black'},
    layoutB:{height:150,width:windowWidth/3,backgroundColor:'white'},
    suggest:
    {
      display:'flex',
      flexDirection:'row',
      padding:10,
      paddingTop:5,
      paddingBottom:12,
      display:'none'
    },
    suggestCategory:
    {
      paddingTop:5,
      paddingBottom:5,
      paddingLeft:8,
      paddingRight:8,
      backgroundColor:'grey',
      marginRight:8,
      borderRadius:5
    },
})
export default ExplorVideoBottom;