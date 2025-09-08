import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { WeatherReportScreen, PreReportScreen, } from '../screens/SpecialReportScreen';
import { View,TouchableOpacity,Text,StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { CustomReportTabBar } from '../components/CustomTabBar';


const Tab = createMaterialTopTabNavigator();

function ReportNavigation({navigation}:{navigation:any}) {
    return (
        <View style={{flex:1}}>
            <View style={{flex:3}}>
                <Tab.Navigator initialRouteName='WeatherReport' tabBar={props=> <CustomReportTabBar {...props}/>} screenOptions={{ tabBarStyle: { display: 'none' }, swipeEnabled:false}}>
                    <Tab.Screen name="WeatherReport" component={WeatherReportScreen} options={{ title: '기상특보' }}/>
                    <Tab.Screen name="PreReport" component={PreReportScreen} options={{ title: '예비특보' }}/>
                </Tab.Navigator>
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
                <TouchableOpacity style={styles.categoryBtnActive} onPress={()=>navigation.navigate('report')}>
                    <Icon name={'alert-circle-outline'} color={'black'} size={20} />
                    <Text style={{fontWeight:'bold', color:'black'}}>특보</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={()=>navigation.navigate('earthquake')}>
                    <Icon name={'earth'} color={'black'} size={20} />
                    <Text style={{fontWeight:'bold', color:'black'}}>지진</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    categoryBtn:{
        flex:1,justifyContent:'center', alignItems:'center'
    },
    categoryBtnActive:{
        flex:1,
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:'#b2cefa96',
        borderRadius:5,
        // padding:3
    },
});

export default ReportNavigation;