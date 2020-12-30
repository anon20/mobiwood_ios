import React,{Component} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Image1 from "../assets/images/image1.jpeg"
import Image2 from "../assets/images/image2.jpeg";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import {Colors, Typography} from '../constants';

const cards = [
    {
      postId: "1",
      postImageSrc: Image1,
      title: "Enjoying the beach life while on a vacation",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Adam Cuppy",
      url: "/v",
    },
    {
      postId: "2",
      postImageSrc: Image2,
      title: "Getting the most out of your vacation",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Aaron Patterson",
      url: "/v",
    },
    {
      postId: "3",
      postImageSrc: Image1,
      title: "Choosing the perfect Safaris in Africa",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Sam Phipphen",
      url: "/v",
    },
    {
      postId: "4",
      postImageSrc: Image2,
      title: "Hiking during the monsoon in Asia",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Tony Hawk",
      url: "/v",
    },
    {
      postId: "5",
      postImageSrc: Image1,
      title: "Must carry items while travelling to Thailand",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Himali Turn",
      url: "/v",
    },
    {
      postId: "6",
      postImageSrc: Image2,
      title: "Hiking during the monsoon in Asia",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Tony Hawk",
      url: "/v",
    },
  ];

  const device_width = Dimensions.get("window").width



export default class Slider extends Component{
  scrollRef = React.createRef()
  constructor(props){
    super(props)
    this.state ={
      selectedIndex:0
    }
  }

  componentDidMount = () =>{
    setInterval(()=>{
      this.setState(prev => ({selectedIndex: prev.selectedIndex === cards.length -1 ? 0 : prev.selectedIndex+1}),
      ()=>{
        this.scrollRef.current.scrollTo({
          animated:true,
          y:0,
          x: device_width*this.state.selectedIndex
        })
      })
    },3000)
  }
  
  setSelectedIndex = event =>{
     const viewSize = event.nativeEvent.layoutMeasurement.width;
      const contentOffset = event.nativeEvent.contentOffset.x;
      const selectedIndex = Math.floor(contentOffset/viewSize)
      this.setState({selectedIndex})
  }

  render(){
    const {selectedIndex} = this.state
    return(
            <View>
              <ScrollView
                horizontal
                pagingEnabled 
                onMomentumScrollEnd={this.setSelectedIndex}
                ref={this.scrollRef}
              >
                {cards.map(item => (
                  <View style={{position:"relative",}} key={item.postId}>
                      <Image 
                        source={item.postImageSrc}
                        style={styles.sliderImg}
                      />
                    <View style={styles.textContainer} >
                     <Text style={styles.title}>{item.title}</Text>
                     <Text style={styles.author}>Album by {item.authorName}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
             
            </View>
          );
  }
}

const styles = ScaledSheet.create({
  sliderImg:{
    width:wp('100%'),
    height:hp('30%')
  },
  textContainer:{position:"absolute",bottom:0,padding:"25@ms"},
  title:{
    fontSize: '14@s',
    color: "white",
    marginBottom:"12@ms",
    ...Typography.FONT_BOLD,
  },
  author:{
    fontSize: '14@s',
    color: "white",
  },
})