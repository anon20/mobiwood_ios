import {Colors, Typography} from '../../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ScaledSheet } from 'react-native-size-matters';

export default ScaledSheet.create({
    formContainer:{padding:"20@ms",},
    heading: {
        fontSize: '20@s',
        color: Colors.SECONDARY,
        marginBottom:"15@ms",
        fontWeight:'bold',
      },
    backgroundVideo:{ 
        width:wp('90%'),
        height:hp('30%'),
    },
    txt:{
         
         marginBottom:"25@ms",
         marginTop:"10@ms",
         textAlign:"center",
         fontSize:"17@s",
    },
    label:{
        marginBottom:"10@ms",
        fontSize:"15@s",  
        
    },
    containerStyles:{
        marginBottom:"8@ms",
    },
    error:{
        color:"#FF0000",
        fontSize:"15@ms",
        paddingBottom:"5@ms"
      },
    btn:{
        width: Platform.OS==="ios"?wp('30%'):wp('30%'),
        padding:"10@ms",
        backgroundColor:"black",
        borderRadius:"7@ms",
        alignItems:"center",
        alignSelf:"center",
        marginBottom:"15@ms"
      },
      btnText:{
        
        fontSize: '15@s',
        color: "#f7fafc",
        alignSelf: 'center',
      },
      tnc:{
          flexDirection:"row",
          marginBottom:"30@ms",
      },
      modalContent: {
        backgroundColor: 'white',
        width: wp('95%'),
        alignSelf:"center",
        borderRadius: "7@ms",
        padding:"15@ms",
        flex:1
      },
      modalContainer:{
          padding:"10@ms",
      },
      row:{
          flexDirection:"row",
          alignItems: 'flex-start',
          flexWrap: 'wrap',
      },
      picker:{
          backgroundColor: 'white',
          borderColor:"#edf2f7",
          borderRadius:"3@ms",
        },
     inputFile:{
         flexDirection:"row",
         borderColor: '#edf2f7',
        borderWidth: 1,
        padding:"10@ms",
        borderRadius:"3@ms",
        width:wp('90%'),
        backgroundColor:"white",
        marginBottom:"8@ms"
     },
     inputBtn:{
         backgroundColor:"#e2e8f0",
         padding:"5@ms"
     },
     radioContainer: {
      marginBottom: "10@ms",
      flexDirection: 'row',
      padding:"5@s",
      justifyContent:"flex-start"
},
  radioText: {
      fontSize: "12@ms",
      color: '#000',
      paddingLeft:"5@ms",
  },
radioCircle: {
  height: "15@ms",
  width: "15@ms",
  borderRadius: "7@s",
  borderWidth: "2@s",
  borderColor: '#a0aec0',
  alignItems: 'center',
  justifyContent: 'center',
},
selectedRb: {
  width: "8@ms",
  height: "8@ms",
  borderRadius: "4@s",
  backgroundColor: '#3740ff',
  },
  dob:{
    borderColor: '#edf2f7',
    borderWidth: 1,
    padding:"15@ms",
    borderRadius:"3@ms",
    width:wp('90%'),
    marginBottom:"8@ms",
    backgroundColor:"white",
  },
})

