import React, { useContext, useEffect, useState, useRef, useCallback  } from "react";
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Animated, ActivityIndicator, ViewToken, ScrollView, Dimensions, Image } from 'react-native';
import { useTheme } from "../hooks/useTheme";
import { useLocation } from "../hooks/useLocation";
import Toast from "react-native-toast-message";
import { NetErrorToast } from "../components/ErrorToast";
import Icon from "react-native-vector-icons/Ionicons";
import { LocalItem, WeatherForcastItem} from '../types/WetherItem';
import CurrentWeatherItem from "../components/CurrentWeatherItem";
import WeatherScrollItem from "../components/WeatherScrollItem";
import { useWeather } from "../hooks/useWeather";

function HomeScreen({route, navigation}:{route :any, navigation:any}) {

    const { naviOffset } = route.params;
    const { themeMode } = useTheme();
    const { loading:locationLoading, error:locationError } = useLocation();
    const [forcast, setForcast] = useState<WeatherForcastItem[]>([]);
    const [week, setWeek] = useState<WeatherForcastItem[]>([]);
    const [air, setAir] = useState({pm10Value:-1, pm25Value:-1, o3Value: -1});

    const [isScrollHalf, setScrollHalf] = useState(false);
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [isScrollBtn, setScrollBtn] = useState(false);
    const [offset, setOffset] = useState(0); // 현재 페이지 인덱스
    const [currentIndex, setCurrentIndex] = useState(-1); // 현재 페이지 인덱스

    const currenHeight = isScrollHalf ? 130 : 580;
    const { width: SCREEN_WIDTH,} = Dimensions.get('window');
    const scrollX = useRef(new Animated.Value(0)).current;
    const { allWeather, error:weatherError} = useWeather();
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if(naviOffset === 0) return;

        setScrollHalf(true);
        setOffset(naviOffset);
    },[naviOffset])

    useEffect(() => {
        if(locationError !== '')
            NetErrorToast(locationError);
        else if(weatherError !== '')
            NetErrorToast(weatherError);
        else
            return;

    },[locationError, weatherError]);

    const scrollForcast = useCallback((forcast: LocalItem) => {
        setForcast(forcast.hourlyWeather);
        setWeek(forcast.weekWeather);
        setAir(forcast.air);
    },[]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [allWeather]);

    useEffect(()=>{
        if(currentIndex === -1) return;

        handleScrollToIndex(currentIndex);
    },[isScrollHalf])

    const onScrollViewScroll = async(event:any) => {
        const scrollOffset = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

        const scrollableHeight = contentHeight - scrollViewHeight;

        // 스크롤 가능한 공간이 0보다 클 때만 계산
        if (scrollableHeight > 0) {
            const scrollPercent = (scrollOffset / scrollableHeight) * 100;
            setScrollPercentage(scrollPercent)

            if(isScrollHalf){
                if(scrollPercent == 0){
                    setScrollHalf(false);
                    setOffset(0);
                }
            }
            else{
                if(scrollPercent > 15){
                    setScrollHalf(true);
                    if(!isScrollBtn)
                        setOffset(40);
                }
            }
        }
    };

    const handleScroll = (event:any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;// 현재 스크롤 위치를 가져옵니다 (가로 스크롤이므로 x축)
        const currentIndex = Math.round(scrollPosition / SCREEN_WIDTH);// 아이템의 너비로 나누어 현재 페이지 인덱스를 계산합니다.
        setCurrentIndex(currentIndex);
    };

    const handleScrollToIndex = (index: number) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index: index,
                animated: false,
                viewOffset: 0, // 뷰의 맨 위로 스크롤
                viewPosition: 0 // 뷰포트의 시작점에 위치 (0 = 맨 위)
            });
        }
    };
    // 스크롤 위치를 감지하여 현재 페이지 인덱스를 업데이트
    const onFlastListScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const currentWeatherList = () =>{
        return(
            <View style={{height:currenHeight, justifyContent:'center', alignItems:'center'}}>
                <FlatList 
                    ref={flatListRef}
                    data={allWeather}
                    renderItem={({item}) => <CurrentWeatherItem isScrollHalf={isScrollHalf} weather={item} currentIndex={currentIndex} setForcast={scrollForcast}/>}
                    horizontal={true}
                    onScroll={onFlastListScroll}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScroll}
                />
                <View style={[styles.indicatorContainer, isScrollHalf && {bottom:15}]}>
                    {allWeather.map((_, index) => {
                        return (
                            <View
                            key={index}
                            style={ [styles.dot, (index === currentIndex) && styles.activeDot]}
                            />
                        );
                    })}
                </View>
            </View>
        )
    }

    if(locationLoading){
        return(
            <ImageBackground source={themeMode === '다크 모드' ? require('../assets/dark_background.jpg') : require('../assets/basic_background.jpg')} style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
                <ActivityIndicator style={{alignItems:'center'}} size='large' color="#fcfcfcff"/>
            </ImageBackground>
        )
    }

    return (
        <ImageBackground source={ themeMode === '다크 모드' ? require('../assets/dark_background.jpg') : require('../assets/basic_background.jpg')} resizeMode="cover" style={styles.backgroundImage} >
            <View style={{flex:3, marginTop:15, marginBottom:0, }}>
                {isScrollHalf? currentWeatherList(): null}
               <ScrollView style={{flex:1, borderTopLeftRadius:15, borderTopRightRadius:15, paddingTop:10}} showsVerticalScrollIndicator={false} onScroll={onScrollViewScroll} contentOffset={{x:0, y:offset}} onMomentumScrollEnd={()=>setScrollBtn(false)}>
                    {!isScrollHalf?  currentWeatherList(): <View style={{height:160}}></View>}
                    <View style={{flex:1}}>
                        <WeatherScrollItem weather={forcast} week={week} air={air}/>
                    </View>
                </ScrollView>
            </View>
            <Toast/>
            <View style={{flex:0.3, backgroundColor:'#f3f3f3ff',flexDirection:'row'}}>
                <TouchableOpacity style={ isScrollHalf && scrollPercentage < 65 ? styles.categoryBtnActive :styles.categoryBtn} onPress={()=>{setOffset(130); setScrollBtn(true); setScrollHalf(true);}}>
                    <Image source={require('../assets/forcast_btn_icon.png')} style={{height:30, width:30}}/>
                    <Text style={{color:'black',fontSize:11}}>예보</Text>
                </TouchableOpacity>
                <TouchableOpacity style={scrollPercentage >=65 && scrollPercentage < 95 ? styles.categoryBtnActive : styles.categoryBtn} onPress={()=>{setOffset(1220); setScrollBtn(true);}}>
                    <Image source={require('../assets/air_btn_icon.png')} style={{height:30, width:30}}/>
                    <Text style={{fontSize:11,color:'black'}}>대기질</Text>
                </TouchableOpacity>
                <TouchableOpacity style={scrollPercentage >=95 ? styles.categoryBtnActive : styles.categoryBtn} onPress={()=>{setOffset(1600); setScrollBtn(true);}}>
                    <Image source={require('../assets/video_btn_icon.png')} style={{height:30, width:30}}/>
                    <Text style={{fontSize:11, color:'black'}}>영상</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={()=>navigation.navigate('report')}>
                    <Image source={require('../assets/report_btn_icon.png')} style={{height:30, width:30}}/>
                    <Text style={{fontSize:11, color:'black'}}>특보</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={()=>navigation.navigate('earthquake')}>
                    <Image source={require('../assets/earthquake_btn_icon.png')} style={{height:30, width:30}}/>
                    <Text style={{fontSize:11, color:'black'}}>지진</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    indicatorContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 70,
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor:'#fcfcfcff'
    },
    activeDot:{
        width: 22,
        backgroundColor:'#92b4ebff'

    },
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
        padding:3
    },
    backgroundImage: {
        flex: 1,
  },
});

export default HomeScreen;