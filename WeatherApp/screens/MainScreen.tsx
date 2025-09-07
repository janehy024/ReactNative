// import React, { useContext, useEffect, useState, useRef  } from "react";
// import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Animated, ActivityIndicator, ViewToken } from 'react-native';
// import WeatherListItem from "../components/WeatherListItem";
// import { useTheme } from "../hooks/useTheme";
// import { useLocation } from "../hooks/useLocation";
// import Toast from "react-native-toast-message";
// import { NetErrorToast } from "../components/ErrorToast";
// import Icon from "react-native-vector-icons/Ionicons";

// function MainScreen({navigation}: {navigation: any}) {

//     const { themeColor } = useTheme();
//     const { allLocations, loading:locationLoading, error:locationError } = useLocation();

//     const [currentIndex, setCurrentIndex] = useState(0); // 현재 페이지 인덱스
//     const scrollX = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         if(locationError === '')
//             return;

//         NetErrorToast(locationError);
//     },[locationError]);

//   // 스크롤 위치를 감지하여 현재 페이지 인덱스를 업데이트
//     const onScroll = Animated.event(
//         [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//         { useNativeDriver: false }
//     );

//     const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
//         if (viewableItems.length > 0 && viewableItems[0].index !== null) {
//             setCurrentIndex(viewableItems[0].index);
//         }
//     }).current;

//     if(locationLoading){
//         return(
//             <View style={{flex:1, backgroundColor: themeColor.background, justifyContent: 'center', alignItems:'center'}}>
//                 <ActivityIndicator style={{alignItems:'center'}} size="small" color="#cad48eff"/>
//             </View>
//         )
//     }

//     return (
//         <View style={{flex:1, backgroundColor: themeColor.background, paddingTop: 10, }}>
//             <View style={{flex: 0.2, marginHorizontal:25,flexDirection:'row'}}>
//                 <View style={{flex:1, alignItems:'flex-start', justifyContent:'flex-end',}}>
//                     <TouchableOpacity style={{ alignItems: 'center', padding:5, paddingLeft:0}} onPress={() => navigation.navigate('search')}>
//                         <Icon name={'search'} color={themeColor.text} size={20} />
//                     </TouchableOpacity>
//                 </View>
//                 <View style={{flex:1, alignItems:'flex-end', justifyContent:'flex-end',}}>
//                     <TouchableOpacity style={{ alignItems: 'center', padding:5, paddingRight:0 }} onPress={() => navigation.navigate('setting')}>
//                         <Icon name={'ellipsis-vertical'} color={themeColor.text} size={20} />
//                     </TouchableOpacity>
//                 </View>
//             </View>
//             <View style={{flex:3, margin: 20, marginTop:15 }}>
//                 <FlatList
//                     data={allLocations}
//                     renderItem={({item}) => <WeatherListItem location={item}/>} 
//                     pagingEnabled={true}
//                     showsHorizontalScrollIndicator={false}
//                     onScroll={onScroll}

//                     viewabilityConfig={{
//                         itemVisiblePercentThreshold: 50 // 아이템의 50%가 보이면 감지
//                     }}
//                     onViewableItemsChanged={onViewableItemsChanged}
//                     horizontal={true}
//                     />
//             </View>
//             <View style={styles.indicatorContainer}>
//                 {allLocations.map((_, index) => {
//                 return (
//                     <View
//                     key={index}
//                     style={[
//                         styles.dot,
//                         {
//                             backgroundColor: index === currentIndex ? '#cad48eff' : 'gray',
//                         },
//                     ]}
//                     />
//                 );
//                 })}
//             </View>
//             <Toast/>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//   indicatorContainer: {
//     flexDirection: 'row',
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//   },
//   dot: {
//     width: 6,
//     height: 6,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
// });

// export default MainScreen;