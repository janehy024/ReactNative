// import React, { useEffect, useState, useRef } from "react";
// import { View, Text, FlatList, Alert, Dimensions, ScrollView, ActivityIndicator, Animated} from 'react-native';
// import { LocalItem, LocationType } from '../types/WetherItem';
// import { useTheme } from "../hooks/useTheme";
// import { useWeather } from "../hooks/useWeather";
// import WeatherScrollItem from "./WeatherScrollItem";

// function WeatherListItem({location}:{location: LocationType}) {

//     const { themeColor } = useTheme();
//     const { height, width } = Dimensions.get('window');

//     const [ weather, setWeather]  = useState<LocalItem>();
//     const { GetWeatherItem, isLoading, error } = useWeather();

//     const [isScrollHalf, setScrollHalf] = useState(false);

//     useEffect(() => {
//         const GetWeather = async() => {
//             const item = await GetWeatherItem(location, location.type);

//             if(item){
//                 setWeather(item);
//             }
//         }

//         GetWeather();
//     }, []);

//     const handleScroll = (event:any) => {
//         const scrollOffset = event.nativeEvent.contentOffset.y;
//         const contentHeight = event.nativeEvent.contentSize.height;
//         const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

//         const scrollableHeight = contentHeight - scrollViewHeight;

//         // 스크롤 가능한 공간이 0보다 클 때만 계산
//         if (scrollableHeight > 0) {
//             const scrollPercentage = (scrollOffset / scrollableHeight) * 100;

//             if(isScrollHalf){
//                 if(scrollPercentage == 0){
//                     setScrollHalf(false);
//                 }
//             }
//             else{
//                 if(scrollPercentage > 60){
//                     setScrollHalf(true);
//                 }
//             }
//         }
//     };

//     const scrollItem = () => {
//         if(!weather)
//             return null

//         return (<WeatherScrollItem weather={weather}/>)
//     }

//     if(isLoading){
//         return(
//             <View style={{flex:1, backgroundColor: themeColor.background, justifyContent: 'center', alignItems:'center', width:width-50, margin:5}}>
//                 <ActivityIndicator style={{alignItems:'center'}} size="small" color="#cad48eff"/>
//             </View>
//         )
//     }

//     const currentTmp = weather? weather.currentWeather.filter(item => item.category === 'T1H')[0].values[0].value : 0;

//     const smallScreen = () => {
//         return (
//             <View style={{flex:1}}>
//                 <View style={{height: 80, justifyContent:'center', alignItems:'center'}}>
//                     <Text style={{fontSize:20, fontWeight:'400', color:themeColor.text}}>{location.address_main} {location.address_sub}</Text>
//                     <Text style={{fontSize:24, fontWeight:'500', marginVertical:6, color:themeColor.text}}>{currentTmp}˚</Text>
//                 </View>
//                 <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false} onScroll={handleScroll} contentOffset={{x:0,y:130}}>
//                     <View style={{height:130, backgroundColor:'Transparent'}}></View>
//                     {scrollItem()}
//                 </ScrollView>
//             </View>
            
//         )
//     }

//     const largeScreen = () => {
//         return(
//             <ScrollView showsVerticalScrollIndicator={false} style={{}} onScroll={handleScroll} >
//                 <View style={{height: 270, justifyContent:'center', alignItems:'center'}}>
//                     <Text style={{fontSize:24, fontWeight:'500', color:themeColor.text}}>{location.address_main} {location.address_sub}</Text>
//                     <Text style={{fontSize:40, fontWeight:'500', marginVertical:6, color:themeColor.text}}>{currentTmp}˚</Text>
//                     <Text style={{fontSize:15, fontWeight:'400' ,color:themeColor.text}}>최저: {weather? weather.min : ''}˚   최대: {weather? weather.max : ''}˚ </Text>
//                 </View>
//                 {scrollItem()}
//             </ScrollView>
//         )
//     }
    
//     return(
//         <View style={{height:height, width:width-50, margin:5}}>
//             {isScrollHalf? smallScreen() : largeScreen()}
//         </View>
//     )
// }

// export default WeatherListItem;