import React, { useContext, useEffect, useState, useRef  } from "react";
import { View, Text, StyleSheet} from 'react-native';
import { useTheme } from "../hooks/useTheme";
import { LocalItem, LocationType, WeatherForcastItem } from '../types/WetherItem';
import { useWeather } from "../hooks/useWeather";

function CurrentWeatherItem({location, activeItemId, isScrollHalf ,setForcast}:{location: LocationType, activeItemId:number, isScrollHalf:boolean, setForcast:React.Dispatch<React.SetStateAction<WeatherForcastItem[]>>}){

    console.log(location.id === activeItemId);

    const { themeColor } = useTheme();
    const [ weather, setWeather]  = useState<LocalItem>();
    const { GetWeatherItem, isLoading, error } = useWeather();

    if(location.id === activeItemId){
        if(weather)
        {
            setForcast(weather.hourlyWeather);
            console.log('값: ', weather.hourlyWeather)
        }
    }

    useEffect(() => {
        const GetWeather = async() => {
            const item = await GetWeatherItem(location, location.type);

            if(item){
                setWeather(item);
            }
        }

        GetWeather();
    }, []);

    const currentT1H = weather? weather.currentWeather.filter(item => item.category === 'T1H')[0].values[0].value : 0; //기온
    const currentRN1 = weather? weather.currentWeather.filter(item => item.category === 'RN1')[0].values[0].value : 0; //1시간 강수량
    const currentREH = weather? weather.currentWeather.filter(item => item.category === 'REH')[0].values[0].value : 0; //습도
    const currentWSD = weather? weather.currentWeather.filter(item => item.category === 'WSD')[0].values[0].value : 0; //풍속

    if(isScrollHalf){
        return(
            <View style={{flex:1, width:320, justifyContent:'flex-start', alignItems:'center'}}>
                <Text style={{fontSize:20, fontWeight:'400', color:themeColor.text}}>{location.address_main} {location.address_sub}</Text>
                <Text style={{fontSize:24, fontWeight:'500', marginVertical:6, color:themeColor.text}}>{currentT1H}˚</Text>
            </View>
        )
    }

    return(
        <View style={{flex:1,width:320, }}>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize:20, fontWeight:'500', color:themeColor.text}}>{location.address_main} {location.address_sub}</Text>
                <Text style={{fontSize:60, fontWeight:'500', marginVertical:6, color:themeColor.text}}>{currentT1H}˚</Text>
                <Text style={{fontSize:15, fontWeight:'400' ,color:themeColor.text}}>최저: {weather? weather.min : ''}˚   최대: {weather? weather.max : ''}˚ </Text>
            </View>

            <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                <View style={styles.weatherBottomContent}>
                    <Text>{currentREH}%</Text>
                    <Text>습도</Text>
                </View>
                <View style={styles.weatherBottomContent}>
                    <Text>{currentRN1}mm</Text>
                    <Text>1시간 강수량</Text>
                </View>
                <View style={styles.weatherBottomContent}>
                    <Text>{currentWSD}m/s</Text>
                    <Text>풍속</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  weatherBottomContent: {
    justifyContent:'center', 
    alignItems:'center', 
    borderRightWidth:1, 
    padding:13, 
    borderRightColor:'#c5bfbfff'
  },
});

export default CurrentWeatherItem;