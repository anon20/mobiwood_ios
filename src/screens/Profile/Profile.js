import React,{useState} from 'react';
import {View, Text, Image, SafeAreaView, StyleSheet, FlatList, Dimensions, Modal, TouchableOpacity} from 'react-native';
import {UserContext} from '../../contexts/UserContext.js';
import {AuthContext} from "../../contexts/AuthContext.js";
import {VideosContext} from '../../contexts/VideosContext.js';
import VideoPlayer from 'react-native-video-player';
import FeatherIcon from 'react-native-vector-icons/Feather';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default props => {
    let userCont = React.useContext(UserContext);
    const vidCntxt = React.useContext(VideosContext);
    const { userDetails, uid } = React.useContext(AuthContext);
    React.useEffect(()=>{
        // userCont.updateFollowers();
    },[])

    const HandleClick = (e,t) => {
        setVideoUrl(e);
        setThumbnail(t)
        setModalVisible(true);
      }
      
 
  const [modalVisible, setModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail,setThumbnail] = useState('');
    return (
        <SafeAreaView style={{flex:1}}>
        <Modal
            animationType="fade"
            transparent={true}
            // style={{}}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false)
              setVideoUrl('');
            }}
          >
            <View style={{justifyContent:'center',flex:1, backgroundColor:'rgba(0,0,0,0.8)'}}>
                <View style={styles.centeredView}>
                  <TouchableOpacity onPress={()=>{setModalVisible(false)}} style={{backgroundColor:'white', borderRadius:1000, borderWidth:2, borderColor:'black', position:'absolute', zIndex:10, top:-10, right:-10, alignSelf:'flex-end'}}>
                  
                    <FeatherIcon  name='x' size={30} color='grey' />
                </TouchableOpacity>
                <VideoPlayer
                    video={{uri:videoUrl}}
                    style={{height:windowHeight/1.45,width:windowWidth-50, borderTopStartRadius:20, borderTopEndRadius:20}}
                    thumbnail={{uri: thumbnail}}
                  />
                </View>
            </View>
            
          </Modal>
            {userCont?
                <>

                <View style={{flex:1}}>
                    <View style={{marginBottom:20}}>
                        <Image
                            source={require('../../assets/images/usericon.png')}
                            style={{height:50,width:50,alignSelf:'center', marginTop:20}}
                        />
                        <Text style={{fontSize:20,fontWeight:'700',alignSelf:'center', marginBottom:10}}>{userDetails.providerData[0].displayName}</Text>
                        <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:5}}>
                                <Text style={{fontSize:16,fontWeight:'400'}}>Followers : {userCont.followers&&userCont.followers.length!=0?userCont.followers.length:0} </Text>
                                <Text style={{fontSize:16,fontWeight:'400'}}>Following : {userCont.following&&userCont.following.length!=0?userCont.following.length:0} </Text>
                        </View>
                    </View>
                    <View style={{width:'100%',height:1,backgroundColor:"black"}}></View>
                    {/* {console.log(`MYVIDEOS : ${JSON.stringify(userCont.myVideos)}`)} */}
                    {userCont.myVideos!=""? 
                    <FlatList 
                        data={vidCntxt.videos.filter(item=>item.userid === uid)}
                        numColumns={3}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index})=>(
                            <View key={index}  style={styles.layoutA}>
                                {console.log(item)}
                                <TouchableOpacity onPress={()=>HandleClick(item.videoUrl,item.thumbnail)} >
                                <Image
                            source={item.thumbnail?{uri:item.thumbnail}:(require('../../assets/images/loading.jpg'))}
                            style={{height:"100%",width:"100%"}}
                        />
                        </TouchableOpacity>
                        
                    </View>)
                         }
            /> : <Text style={{justifyContent:'center',alignSelf:'center',marginTop:80,fontWeight:'700',fontSize:18, textAlign:'center', color:'grey'}}>
              <FeatherIcon name="video-off" size={50} color={'grey'} />{"\n"}{"\n"}No Videos Uploaded</Text>}
                </View>
                
                
                </>
                :
                <View>
                    <Text>HELLO</Text>
                </View>
            }
        </SafeAreaView>

    )
};

const styles = StyleSheet.create({
    layoutA :{height:150,width:windowWidth/3,backgroundColor:'black'},
    layoutB:{height:150,width:windowWidth/3,backgroundColor:'white'} ,
    centeredView: {
        height:windowHeight/1.4,
        width:windowWidth-50,
        justifyContent:'center',
        alignSelf:'center',
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
})