import React, { useContext, useEffect, useState, useRef  } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Animated, ActivityIndicator, ViewToken, ScrollView, Dimensions } from 'react-native';
import { useTheme } from "../hooks/useTheme";
import { useLocation } from "../hooks/useLocation";
import Toast from "react-native-toast-message";
import { NetErrorToast } from "../components/ErrorToast";
import Icon from "react-native-vector-icons/Ionicons";
import { LocalItem, LocationType, WeatherForcastItem } from '../types/WetherItem';
import { useWeather } from "../hooks/useWeather";
import CurrentWeatherItem from "../components/CurrentWeatherItem";
import WeatherScrollItem from "../components/WeatherScrollItem";

function HomeScreen({navigation}: {navigation: any}) {

    const { themeColor } = useTheme();
    const { allLocations, loading:locationLoading, error:locationError } = useLocation();
    const [forcast, setForcast] = useState<WeatherForcastItem[]>([]); // 현재 페이지 인덱스

    const [currentIndex, setCurrentIndex] = useState(0); // 현재 페이지 인덱스
    const scrollX = useRef(new Animated.Value(0)).current;
    const { height, width } = Dimensions.get('window');
    const [isScrollHalf, setScrollHalf] = useState(false);
    const [offset, setoffset] = useState(0); // 현재 페이지 인덱스

    useEffect(() => {
        if(locationError === '')
            return;

        NetErrorToast(locationError);
        
    },[locationError]);

  // 스크롤 위치를 감지하여 현재 페이지 인덱스를 업데이트
    const onFlastListScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const onScrollViewScroll = (event:any) => {
        const scrollOffset = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

        const scrollableHeight = contentHeight - scrollViewHeight;

        // 스크롤 가능한 공간이 0보다 클 때만 계산
        if (scrollableHeight > 0) {
            const scrollPercentage = (scrollOffset / scrollableHeight) * 100;

            if(isScrollHalf){
                if(scrollPercentage == 0){
                    setScrollHalf(false);
                    setoffset(0);
                }
            }
            else{
                if(scrollPercentage > 60){
                    setScrollHalf(true);
                    setoffset(40);
                }
            }
        }
    };

    if(locationLoading){
        return(
            <View style={{flex:1, backgroundColor: themeColor.background, justifyContent: 'center', alignItems:'center'}}>
                <ActivityIndicator style={{alignItems:'center'}} size="small" color="#cad48eff"/>
            </View>
        )
    }

    const handleScroll = (event:any) => {
        
        const scrollPosition = event.nativeEvent.contentOffset.x;// 현재 스크롤 위치를 가져옵니다 (가로 스크롤이므로 x축)
        const currentIndex = Math.round(scrollPosition / width);// 아이템의 너비로 나누어 현재 페이지 인덱스를 계산합니다.
        
        setCurrentIndex(currentIndex);
    };

    const currentWeatherScreen = () => {
        const currenHeight = isScrollHalf ? 130 : 270;

        return(
            <View style={{height:currenHeight, justifyContent:'center', alignItems:'center'}}>
                <FlatList 
                    data={allLocations}
                    renderItem={({item}) => <CurrentWeatherItem location={item} activeItemId={currentIndex} isScrollHalf={isScrollHalf} setForcast={setForcast}/>}
                    horizontal={true}
                    onScroll={onFlastListScroll}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScroll}
                />
                <View style={styles.indicatorContainer}>
                    {allLocations.map((_, index) => {
                        return (
                            <View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: index === currentIndex ? '#cad48eff' : 'gray',
                                },
                            ]}
                            />
                        );
                    })}
                </View>
            </View>
        )
    }

    return (
        <View style={{flex:1, backgroundColor: themeColor.background, paddingTop: 10, }}>
            <View style={{flex: 0.2, marginHorizontal:25,flexDirection:'row'}}>
                <View style={{flex:1, alignItems:'flex-start', justifyContent:'flex-end',}}>
                    <TouchableOpacity style={{ alignItems: 'center', padding:5, paddingLeft:0}} onPress={() => navigation.navigate('search')}>
                        <Icon name={'search'} color={themeColor.text} size={20} />
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, alignItems:'flex-end', justifyContent:'flex-end',}}>
                    <TouchableOpacity style={{ alignItems: 'center', padding:5, paddingRight:0 }} onPress={() => navigation.navigate('setting')}>
                        <Icon name={'ellipsis-vertical'} color={themeColor.text} size={20} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flex:3, margin: 20, marginTop:15,  }}>
                {isScrollHalf? currentWeatherScreen(): null}
               <ScrollView style={{flex:1, }} showsVerticalScrollIndicator={false} onScroll={onScrollViewScroll} contentOffset={{x:0, y:offset}}>
                    {!isScrollHalf? currentWeatherScreen(): <View style={{height:160}}></View>}
                    <View style={{height:700}}>
                        <WeatherScrollItem weather={forcast}/>
                    </View>
                </ScrollView>
            </View>
            <Toast/>
        </View>
    )
}

const styles = StyleSheet.create({
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
});

export default HomeScreen;