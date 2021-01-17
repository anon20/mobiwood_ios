import React,{useState} from 'react';
import {View,
  StyleSheet,
  TouchableOpacity, 
  TextInput,
  Platform,
  SafeAreaView,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ExploreVideoBottom from '../../components/ExploreVideoBottom';
const windowWidth = Dimensions.get('window').width;
import VideoDisplayModal from '../../components/VideoDisplayModal.js';
export default props => {
 
  const [modalVisible, setModalVisible] = useState(false);
  const [vidObj, setVidObj] = useState({});
  const [followProcessing, setFollowProcessing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchVid, setSearchVid] = useState(false);
  const HandleClick = (item) => {
    setVidObj(item);
    // console.log(`CURRENT VIDEO ON MODAL : ${vidCntxt.noOfViewsMap.get(item.id)} , item : ${JSON.stringify(item)}`);
    setModalVisible(true);
  }
    return(
        <SafeAreaView style={{flex:1}}>
          <Modal
            animationType="fade"
            transparent={false}
            style={{backgroundColor:'black'}}
            // backgroundColor={"black"}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false)
              setVidObj({});
            }}
          >
            <VideoDisplayModal vidObj={vidObj} setModalVisible={setModalVisible} followProcessing={followProcessing} setFollowProcessing={setFollowProcessing} />
          </Modal>
  
          <View style={styles.searchContainer}>
            <View style={{flexDirection:'row', backgroundColor:'white', borderRadius:10}}>
              <View style={{flex:0.9}}>
                <TextInput
                  placeholder="Search"
                  placeholderTextColor = "#1a202c"
                  keyboardType={"ascii-capable"}
                  style={{padding:Platform.OS === 'android'?10:15}}
                  onChangeText={inpt => {console.log(`inpt : ${inpt}`); setSearchKeyword(inpt)}}
                />
              </View>
              <View style={{flex:0.1}}>
                <TouchableOpacity>
                  <Icon name="search-outline" onPress={()=>setSearchVid(true)} style={{marginTop:10}} size={25} color="#1a202c"/>
                </TouchableOpacity>
              </View>
            </View>
            </View>

            <View style={{flex:1,marginTop:10}}>
              <ExploreVideoBottom searchKeyword={searchKeyword} setSearchVid={setSearchVid} searchVid={searchVid} clicked={HandleClick}/>
            </View>
        </SafeAreaView>
    )
}

const styles  = StyleSheet.create ({
    closeBtn:{
      backgroundColor:'white',
      borderRadius:3,
      position:'absolute',
      zIndex:2,
      right:20,
      // top:10,
    },
    searchContainer:{
        marginTop:10,
        width:'95%',
        marginLeft:10,
        // backgroundColor:'black'
    },
    shareBtns:{
      flexDirection:'row', 
      // paddingTop:15, 
      // marginTop:15,
      bottom:25,
      position:'absolute',
      paddingBottom:15, 
      paddingLeft:20, 
      // backgroundColor:'rgb(0,0,0)', 
      // position:'absolute', width:'100%', 
      // bottom:Platform.OS==="ios"?75:48
    },
    followBtnContainer:{
      // position:'absolute',
      paddingHorizontal:10,
      // right:20,
      // top:10,
      position:'absolute',
      marginLeft:'59%',
      height:33,
      width:95,
      textAlign:'center',
      display:'flex',
      alignItems:'center',
      // right:20,
      borderRadius:6,
      paddingVertical:5, 
    },
    followBtn:{
      color:'white', 
      fontSize:17, 
      fontWeight:'600',
    },
    icon:{
        justifyContent:'center'
    },
    centeredView: {
      // height:windowHeight/1.3,
      // marginTop:-10,
      // zIndex:100,
      width:windowWidth,
      // justifyContent:'center',
      // position:'absolute',
      // top:Platform.OS==="android"?50:undefined,
      // alignItems: "center",
      backgroundColor: "black",
      // padding: 35,
      // alignItems: "center",
      shadowColor: "#000",
      // shadowOffset: {
      //   width: 0,
      //   height: 100
      // },
      // shadowOpacity:0.8,
      // shadowRadius: 3.84,
      // elevation: 100
    },
    
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });