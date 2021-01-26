import {ms, ScaledSheet} from 'react-native-size-matters';
import {Colors, Typography} from '../../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Platform} from 'react-native';

export default ScaledSheet.create({
  logo: {
    width: wp('40%'),
    height: hp('10%'),
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  abovekeyboardContainer: {
    padding: '20@ms',
    top: '10@ms',
  },
  socialBtnContainer: {
    padding: '20@ms',
  },
  socialBtn: {
    width: wp('90%'),
    padding: '18@ms',
    paddingLeft: '70@ms',
    borderBottomWidth: 10,
    borderBottomColor: '#faf5ff',
  },
  socialBtnText: {
    ...Typography.FONT_BOLD,
    fontSize: '15@s',
    color: Colors.PRIMARY,
  },
  heading: {
    fontSize: '20@s',
    color: Colors.SECONDARY,
    alignSelf: 'center',
    marginTop: '18@s',
    marginBottom: Platform.OS === 'android' ? '10@s' : 0,
    fontWeight: 'bold',
  },
  formContainer: {
    paddingBottom: '30@ms',
    paddingTop: '20@ms',
  },
  containerStyles: {
    marginBottom: '10@s',
    height: '60@ms',
  },
  error: {
    color: '#FF0000',
    fontSize: '15@ms',
    paddingBottom: '8@ms',
  },
  btn: {
    paddingVertical: 13,
    backgroundColor: 'black',
    borderRadius: '7@ms',
    alignItems: 'center',
    height: 55,
  },
  btnText: {
    fontSize: '15@s',
    color: '#f7fafc',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  terms: {
    fontSize: '15@s',
    textAlign: 'center',
  },
  txt: {
    fontSize: '15@s',
    textAlign: 'center',
    borderRadius: '7@ms',
  },
  altText: {
    paddingTop: '15@ms',
  },
  radioBtnContainer: {
    paddingTop: '15@ms',
  },
  radioBtn: {
    width: Platform.OS === 'ios' ? wp('45%') : wp('95%'),
    padding: '8@ms',
    marginTop: '8@ms',
  },
  icon: {
    alignSelf: 'center',
    marginTop: '-10@ms',
  },
  modalContent: {
    backgroundColor: 'white',
    width: wp('100%'),
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: '7@ms',
    padding: '15@ms',
    flex: 1,
    paddingTop: 50,
  },
  modalContainer: {
    padding: '10@ms',
  },
});
