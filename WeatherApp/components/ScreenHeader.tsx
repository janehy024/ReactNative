// import React, { useContext, useEffect, useState, useRef, useCallback  } from "react";
// import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Animated, ActivityIndicator, ViewToken, ScrollView, Dimensions } from 'react-native';
// import Icon from "react-native-vector-icons/Ionicons";
// import { useTheme } from "../hooks/useTheme";

// export function HomeScreenHeader({navigation}: {navigation: any}){

//     const { themeColor } = useTheme();

//     return(
//         <View style={{flex: 0.2, marginHorizontal:25,flexDirection:'row'}}>
//             <View style={{flex:1, alignItems:'flex-start', justifyContent:'flex-end',}}>
//                 <TouchableOpacity style={{ alignItems: 'center', padding:5, paddingLeft:0}} onPress={() => navigation.navigate('search')}>
//                     <Icon name={'search'} color={themeColor.text} size={20} />
//                 </TouchableOpacity>
//             </View>
//             <View style={{flex:1, alignItems:'flex-end', justifyContent:'flex-end',}}>
//                 <TouchableOpacity style={{ alignItems: 'center', padding:5, paddingRight:0 }} onPress={() => navigation.navigate('setting')}>
//                     <Icon name={'ellipsis-vertical'} color={themeColor.text} size={20} />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     )
// }