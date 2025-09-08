import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Dimensions,ScrollView,Linking } from 'react-native';
import { useTheme } from "../hooks/useTheme";
import Icon from "react-native-vector-icons/Ionicons";

function EarthquakeScreen({navigation}:{navigation:any}){
    const { themeColor } = useTheme();
    const { width: SCREEN_WIDTH, height:SCREEN_HEIGHT} = Dimensions.get('window');

    const openWebView = () => {
        Linking.openURL('https://www.weather.go.kr/w/eqk-vol/baro/phenom.do');
    };
    return (
        <View style={[styles.containView, {backgroundColor: themeColor.mainBackground,}]}>
            <View style={{flex:3}}>
                <ScrollView style={{flex:1, width:SCREEN_WIDTH, padding:15,}}>
                    <View style={{flexDirection:'row', marginTop:10}}>
                        <TouchableOpacity style={{marginRight:20,}}>
                            <Text style={styles.domesticText}>국내</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={[styles.domesticText,styles.overseasText]}>국외</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{marginTop:10}}>
                        <View style={{flexDirection:'row', borderColor:'#35568C', borderWidth:1.5, height:35, borderRadius:6}}>
                            <Text style={[{flex:1, textAlignVertical:'center', marginLeft:10, color:themeColor.text}]}>정보</Text>
                            <Icon name={'chevron-down'} color={'black'} size={20} style={{marginRight:10, textAlignVertical:'center'}}/>
                        </View>
                    </TouchableOpacity>                  
                    <View style={{marginTop:30}}>
                        <Text style={{fontWeight:'bold',color:themeColor.text}}>진도 등급별 현상 요약</Text>
                    </View>
                    <View style={{marginTop:30}}>
                        <TouchableOpacity onPress={openWebView}>
                            <Text style={{fontWeight:'bold',color:'#35568C'}}>진도 등급별 현상 →</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <View style={{flex:0.3, backgroundColor:'#ecececff',flexDirection:'row'}}>
                <TouchableOpacity style={styles.categoryBtn} onPress={()=>navigation.navigate('main',{naviOffset:130})}>
                    <Icon name={'sunny'} color={'black'} size={20}/>
                    <Text style={{fontWeight:'bold', color:'black'}}>예보</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={()=>navigation.navigate('main',{naviOffset:1220})}>
                    <Icon name={'leaf'} color={'black'} size={20} />
                    <Text style={{fontWeight:'bold',color:'black'}}>대기질</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={()=>navigation.navigate('main',{naviOffset:1600})}>
                    <Icon name={'play'} color={'black'} size={20} />
                    <Text style={{fontWeight:'bold', color:'black'}}>영상</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={()=>navigation.navigate('report')}>
                    <Icon name={'alert-circle-outline'} color={'black'} size={20} />
                    <Text style={{fontWeight:'bold', color:'black'}}>특보</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtnActive} onPress={()=>navigation.navigate('earthquake')}>
                    <Icon name={'earth'} color={'black'} size={20} />
                    <Text style={{fontWeight:'bold', color:'black'}}>지진</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    categoryBtn:{
        flex:1,
        justifyContent:'center', 
        alignItems:'center'
    },
    categoryBtnActive:{
        flex:1,
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:'#b2cefa96',
        borderRadius:5,
    },
    containView:{
        flex:1, 
        alignItems:'center',
        justifyContent:'center'
    },
    
    domesticText:{
        height:35, 
        width:80, 
        backgroundColor:'#35568C', 
        textAlign:'center',
        textAlignVertical:'center', 
        borderRadius:7, 
        color:'white',
        fontWeight:'500'
    },
    overseasText:{
        backgroundColor:'white', 
        borderColor:'#35568C',
        borderWidth:1.5,
        color:'black'
    }
});

export default EarthquakeScreen;