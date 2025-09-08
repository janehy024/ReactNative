import React, { useEffect} from "react";
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, Linking, Image} from 'react-native';
import { useTheme } from "../hooks/useTheme";
import { LocalItem, WeatherForcastItem} from '../types/WetherItem';
import { useWeather } from "../hooks/useWeather";
import Ionicons from "react-native-vector-icons/Ionicons"; // 아이콘 라이브러리

function CurrentWeatherItem({isScrollHalf, weather, currentIndex, setForcast }:{isScrollHalf:boolean, weather: LocalItem, currentIndex:number, setForcast:(forcast: LocalItem)=>void}){

    const { themeColor } = useTheme();
    const { isLoading } = useWeather();
    const { width: SCREEN_WIDTH, } = Dimensions.get('window');

    useEffect(() => {
        if(weather.location.id!==currentIndex) return;

        setForcast(weather);

    }, [currentIndex]);

    const location = weather.location;

    const currentT1H = weather.location.id !== -1 ? weather.currentWeather.item['T1H'] : 0
    const currentRN1 = weather.location.id !== -1? weather.currentWeather.item['RN1'] : 0
    const currentREH = weather.location.id !== -1? weather.currentWeather.item['REH'] : 0
    const currentWSD = weather.location.id !== -1? weather.currentWeather.item['WSD'] : 0

    if(isLoading){
        return(
            <View style={{flex:1, width:SCREEN_WIDTH, justifyContent: 'center', alignItems:'center'}}>
                <ActivityIndicator style={{alignItems:'center'}} size="small" color="white"/>
            </View>
        )
    }

    if(isScrollHalf){
        return(
            <View style={{flex:1, width:SCREEN_WIDTH, justifyContent:'flex-start', alignItems:'center', }}>
                 <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <Ionicons name={weather.location.type === 1 ? 'home-outline' : 'location-outline'} size={18} color={'white'} />
                    <Text style={{fontSize:16, fontWeight:'400', color:'#ffffff',marginLeft:10}}>{location.address_main} {location.address_sub}</Text>
                </View>
                <Text style={{fontSize:30, fontWeight:'500', marginVertical:6, color:'#ffffff'}}>{currentT1H}˚</Text>
            </View>
        )
    }

    return(
        <View style={{flex:1,width:SCREEN_WIDTH,}}>
            <View style={{flex:1.5, justifyContent:'center', alignItems:'center'}}>
                <View style={{flex:0.5, flexDirection:'row', marginHorizontal:20,}}>
                    <Text style={{flex:1}}></Text>
                    <TouchableOpacity onPress={()=>{Linking.openURL('https://www.weather.go.kr/wgis-nuri/html/map.html');}}>
                        <Text style={{color:'white', backgroundColor:'#a9bbd8ff', height:23, width:80, textAlign:'center', textAlignVertical:'center', borderRadius:10}}>날씨지도</Text>
                    </TouchableOpacity>
                </View>
                {/* <View></View>/ */}
                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <Ionicons name={weather.location.type === 1 ? 'home-outline' : 'location-outline'}  size={18} color={'white'} />
                    <Text style={{fontSize:18, fontWeight:'500', color:'#ffffff', marginLeft:10}}>{location.address_main} {location.address_sub}</Text>
                </View>
                <Text style={{fontSize:90, fontWeight:'400', marginVertical:0, color:'#ffffff'}}>{currentT1H}˚</Text>
                <Text style={{fontSize:15, fontWeight:'400' ,color:'#ffffff'}}>최저: {weather? weather.weekWeather[0].values[1].item['TMN'] : ''}˚   최대: {weather? weather.weekWeather[0].values[0].item['TMX'] : ''}˚ </Text>
            </View>

            <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                <View style={styles.weatherBottomContent}>
                    <Image source={require('../assets/reh_img.png')} style={{height:20, width:20, tintColor:'white'}}/>
                    <View style={{flexDirection:'row', marginTop:3}}>
                        <Text style={styles.minValueText}>{currentREH}</Text>
                        <Text style={styles.minText}>%</Text>
                    </View>
                    <Text style={styles.minText}>습도</Text>
                </View>
                <View style={styles.weatherBottomContent}>
                    <Image source={require('../assets/rn1_img.png')} style={{height:20, width:20, tintColor:'white'}}/>
                    <View style={{flexDirection:'row', marginTop:3}}>
                        <Text style={styles.minValueText}>{currentRN1}</Text>
                        <Text style={styles.minText}>mm</Text>
                    </View>
                    <Text style={styles.minText}>1시간 강수량</Text>
                </View>
                <View style={[styles.weatherBottomContent, {borderRightWidth:0}]}>
                    <Image source={require('../assets/wsd_img.png')} style={{height:20, width:20, tintColor:'white'}}/>
                     <View style={{flexDirection:'row', marginTop:3}}>
                        <Text style={styles.minValueText}>{currentWSD}</Text>
                        <Text style={styles.minText}>m/s</Text>
                    </View>
                    <Text style={styles.minText}>풍속</Text>
                </View>
            </View>
            <View style={{flex:0.3}}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    weatherBottomContent: {
        justifyContent:'center', 
        alignItems:'center', 
        borderRightWidth:0.3, 
        padding:13, 
        borderRightColor:'#c7c4c4ff'
    },
  indicatorContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    minText: {
        marginTop:3,
        color:'#ffffff' 
    },
    minValueText: {
        marginTop:3,
        marginRight:1,
        color:'#ffffff',
        fontWeight:'bold',
        fontSize:16
    }
});

const CurrentWeather = React.memo(CurrentWeatherItem);

export default CurrentWeather;