import React,{useState} from 'react'
import {Text, View, Share, SafeAreaView} from 'react-native'
import HeaderIcon from '../../HOC/HeaderIcon.js';
import { ScaledSheet } from 'react-native-size-matters';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import {Colors, Typography} from '../../constants';
import ImageGrid from '../../components/ImageGrid'
 

const TrendingName = ({name}) =>{
    return(
        <View>
            <Text style={styles.trendingName}>{name}</Text>
        </View>
    )
}

const Category = ({name}) => {
    return(
        <View style={styles.category}>
            <Text style={styles.catTxt}>{name}</Text>
        </View>
    );
}
const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

export default HeaderIcon(function HomeScreen(){
    const [modalVisible,setModalVisible] = useState(false)
    const toggleModal = (val) =>{
        setModalVisible(val)
        //getData()
    }
    return(
          <SafeAreaView style={styles.releaseCont}>
            <ImageGrid shareModal={onShare} />
          </SafeAreaView>
    )
})

const styles = ScaledSheet.create({
    container:{
    },
    releaseCont:{flex:1},
    searchContainer:{
        flexDirection:"row",
        backgroundColor:"#edf2f7",
        borderRadius:"7@ms",
        width:wp('85%'),
    },
    icon:{
        marginTop:"12@ms"
    },
    containerStyles:{
        width:wp('75%'),
        backgroundColor:"#edf2f7",
    },
    trendingSearch:{
        flexDirection:"row",
        flexWrap:"wrap",
        marginBottom:"10@ms"
    },
    trendingName:{
        fontSize:"12@s",
        color:"#1a202c"
    },
    btn:{
        backgroundColor:"black",
        justifyContent:"center",
        flexDirection:"row",
        padding:"8@ms",
      },
      btnText:{
        fontSize: '12@s',
        color: "#f7fafc",
        alignSelf: 'center',
        marginLeft:"5@ms"
      },
      modalContent: {
        backgroundColor: 'white',
        width: wp('95%'),
        alignSelf:"center",
        top:"10@ms",
        borderRadius: "7@ms",
        padding:"15@ms",
        elevation:5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,  
      },
      modalContainer:{
          padding:"10@ms",
          height:wp('0%')
      },
      heading: {
        ...Typography.FONT_BOLD,
        fontSize: '28@s',
        color: Colors.SECONDARY,
        marginBottom:"28@ms"
      },
      modalHeading:{
          flexDirection:"row",
          justifyContent:"space-between",
      },
      categoryCont:{
          padding:"30@ms",
      },
      catTxt:{fontSize:"16@s"},
      category:{
          borderWidth:1,
          alignItems:"center",
          borderRadius:"7@ms",
          marginBottom:"12@ms",
          padding:"10@ms",
      },
      gridContainer:{
          paddingTop:"25@ms"
      },
      
})