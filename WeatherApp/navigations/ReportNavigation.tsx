import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/HomeScreen';
import CustomTabBar from '../components/CustomTabBar';
import { WeatherReportScreen, PreReportScreen, } from '../screens/SpecialReportScreen';
import { View,TouchableOpacity,Text,StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createMaterialTopTabNavigator();

function ReportNavigation({navigation}:{navigation:any}) {
    return (
        <View style={{flex:1}}>
            <View style={{flex:3}}>
                <Tab.Navigator initialRouteName='WeatherReport'>
                    <Tab.Screen name="WeatherReport" component={WeatherReportScreen} options={{ title: '기상특보' }}/>
                    <Tab.Screen name="PreReport" component={PreReportScreen} options={{ title: '예비특보' }}/>
                </Tab.Navigator>
            </View>
            <View style={{flex:0.3, backgroundColor:'#ecececff',flexDirection:'row'}}>
                <TouchableOpacity style={styles.categoryBtn} onPress={()=>navigation.navigate('main')}>
                    <Icon name={'sunny'} color={'black'} size={20}/>
                    <Text style={{fontWeight:'bold', color:'black'}}>예보</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={()=>navigation.navigate('main')}>
                    <Icon name={'leaf'} color={'black'} size={20} />
                    <Text style={{fontWeight:'bold',color:'black'}}>대기질</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={()=>navigation.navigate('main')}>
                    <Icon name={'play'} color={'black'} size={20} />
                    <Text style={{fontWeight:'bold', color:'black'}}>영상</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtnActive}>
                    <Icon name={'play'} color={'black'} size={20} />
                    <Text style={{fontWeight:'bold', color:'black'}}>특보</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn}>
                    <Icon name={'play'} color={'black'} size={20} />
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
        flex:1,justifyContent
        :'center', alignItems:'center', backgroundColor:'#b2cefa96',borderRadius:5,margin:3
    },
});

export default ReportNavigation;