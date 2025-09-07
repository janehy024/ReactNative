import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useTheme } from "../hooks/useTheme";
import Icon from "react-native-vector-icons/Ionicons";


function EarthquakeScreen({navigation}:{navigation:any}){
    // const { themeColor, setAppTheme } = useTheme();

    const { themeColor } = useTheme();

    return (
        <View style={[styles.containView, {backgroundColor: themeColor.mainBackground,}]}>
            <View style={{flex:3}}>
                <Text>지진</Text>
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
        // padding:3
    },
    containView:{
        flex:1, 
        alignItems:'center',
        justifyContent:'center'
    }
});

export default EarthquakeScreen;