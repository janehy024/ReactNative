// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import Icon from "react-native-vector-icons/Ionicons";

// function BottomTabButton({navigation}:{navigation:any}){
//     return(
//         <View style={{flex:0.3, backgroundColor:'#ecececff',flexDirection:'row'}}>
//             <TouchableOpacity style={ isScrollHalf && scrollPercentage < 65 ? styles.categoryBtnActive :styles.categoryBtn} onPress={()=>{setOffset(130); setScrollBtn(true);}}>
//                 <Icon name={'sunny'} color={'black'} size={20}/>
//                 <Text style={{fontWeight:'bold', color:'black'}}>예보</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={scrollPercentage >=65 && scrollPercentage < 95 ? styles.categoryBtnActive : styles.categoryBtn} onPress={()=>{setOffset(930); setScrollBtn(true);}}>
//                 <Icon name={'leaf'} color={'black'} size={20} />
//                 <Text style={{fontWeight:'bold',color:'black'}}>대기질</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={scrollPercentage >=95 ? styles.categoryBtnActive : styles.categoryBtn} onPress={()=>{setOffset(1500); setScrollBtn(true);}}>
//                 <Icon name={'play'} color={'black'} size={20} />
//                 <Text style={{fontWeight:'bold', color:'black'}}>영상</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={scrollPercentage >=95 ? styles.categoryBtnActive : styles.categoryBtn} onPress={()=>navigation.navigate('report')}>
//                 <Icon name={'play'} color={'black'} size={20} />
//                 <Text style={{fontWeight:'bold', color:'black'}}>특보</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={scrollPercentage >=95 ? styles.categoryBtnActive : styles.categoryBtn} onPress={()=>navigation.navigate('earthquake')}>
//                 <Icon name={'play'} color={'black'} size={20} />
//                 <Text style={{fontWeight:'bold', color:'black'}}>지진</Text>
//             </TouchableOpacity>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     categoryBtn:{
//         flex:1,justifyContent:'center', alignItems:'center'
//     },
//     categoryBtnActive:{
//         flex:1,justifyContent
//         :'center', alignItems:'center', backgroundColor:'#b2cefa96',borderRadius:5,margin:3
//     },
// });