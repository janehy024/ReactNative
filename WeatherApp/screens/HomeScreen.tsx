import React, { useContext, useEffect, useState, useRef, useCallback  } from "react";
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Animated, ActivityIndicator, ViewToken, ScrollView, Dimensions } from 'react-native';
import { useTheme } from "../hooks/useTheme";
import { useLocation } from "../hooks/useLocation";
import Toast from "react-native-toast-message";
import { NetErrorToast } from "../components/ErrorToast";
import Icon from "react-native-vector-icons/Ionicons";
import { LocalItem, WeatherForcastItem} from '../types/WetherItem';
import CurrentWeatherItem from "../components/CurrentWeatherItem";
import WeatherScrollItem from "../components/WeatherScrollItem";
import { useWeather } from "../hooks/useWeather";

function HomeScreen({navigation}:{navigation:any}) {

    const { themeColor } = useTheme();
    const { loading:locationLoading, error:locationError } = useLocation();
    const [forcast, setForcast] = useState<WeatherForcastItem[]>([]);

    const [isScrollHalf, setScrollHalf] = useState(false);
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [isScrollBtn, setScrollBtn] = useState(false);
    const [offset, setOffset] = useState(0); // 현재 페이지 인덱스
    const [currentIndex, setCurrentIndex] = useState(-1); // 현재 페이지 인덱스

    const currenHeight = isScrollHalf ? 130 : 350;
    const { width: SCREEN_WIDTH,} = Dimensions.get('window');
    const scrollX = useRef(new Animated.Value(0)).current;
    const { allWeather, error:weatherError} = useWeather();
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if(locationError !== '')
            NetErrorToast(locationError);
        else if(weatherError !== '')
            NetErrorToast(weatherError);
        else
            return;

    },[locationError, weatherError]);

    const scrollForcast = useCallback((forcast: WeatherForcastItem[]) => {
        setForcast(forcast);
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
                <View style={styles.indicatorContainer}>
                    {allWeather.map((_, index) => {
                        return (
                            <View
                            key={index}
                            style={ [styles.dot, (index === currentIndex) && styles.activeDot ]}
                            />
                        );
                    })}
                </View>
            </View>
        )
    }

    if(locationLoading){
        return(
            <ImageBackground source={require('../assets/basic_background.jpg')} style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
                <ActivityIndicator style={{alignItems:'center'}} size='large' color="#fcfcfcff"/>
            </ImageBackground>
        )
    }

    return (
        <ImageBackground source={require('../assets/basic_background.jpg')} resizeMode="cover" style={styles.backgroundImage} >
            <View style={{flex:3, marginTop:15, marginBottom:0, }}>
                {isScrollHalf? currentWeatherList(): null}
               <ScrollView style={{flex:1, borderTopLeftRadius:15, borderTopRightRadius:15, paddingTop:10}} showsVerticalScrollIndicator={false} onScroll={onScrollViewScroll} contentOffset={{x:0, y:offset}} onMomentumScrollEnd={()=>setScrollBtn(false)}>
                    {!isScrollHalf?  currentWeatherList(): <View style={{height:160}}></View>}
                    <View style={{flex:1}}>
                        <WeatherScrollItem weather={forcast}/>
                    </View>
                </ScrollView>
            </View>
            <Toast/>
            <View style={{flex:0.3, backgroundColor:'#ecececff',flexDirection:'row'}}>
                <TouchableOpacity style={ isScrollHalf && scrollPercentage < 65 ? styles.categoryBtnActive :styles.categoryBtn} onPress={()=>{setOffset(130); setScrollBtn(true);}}>
                    <Icon name={'sunny'} color={'black'} size={20}/>
                    <Text style={{fontWeight:'bold', color:'black'}}>예보</Text>
                </TouchableOpacity>
                <TouchableOpacity style={scrollPercentage >=65 && scrollPercentage < 95 ? styles.categoryBtnActive : styles.categoryBtn} onPress={()=>{setOffset(930); setScrollBtn(true);}}>
                    <Icon name={'leaf'} color={'black'} size={20} />
                    <Text style={{fontWeight:'bold',color:'black'}}>대기질</Text>
                </TouchableOpacity>
                <TouchableOpacity style={scrollPercentage >=95 ? styles.categoryBtnActive : styles.categoryBtn} onPress={()=>{setOffset(1500); setScrollBtn(true);}}>
                    <Icon name={'play'} color={'black'} size={20} />
                    <Text style={{fontWeight:'bold', color:'black'}}>영상</Text>
                </TouchableOpacity>
                <TouchableOpacity style={scrollPercentage >=95 ? styles.categoryBtnActive : styles.categoryBtn} onPress={()=>navigation.navigate('report')}>
                    <Icon name={'play'} color={'black'} size={20} />
                    <Text style={{fontWeight:'bold', color:'black'}}>특보</Text>
                </TouchableOpacity>
                <TouchableOpacity style={scrollPercentage >=95 ? styles.categoryBtnActive : styles.categoryBtn} onPress={()=>navigation.navigate('earthquake')}>
                    <Icon name={'play'} color={'black'} size={20} />
                    <Text style={{fontWeight:'bold', color:'black'}}>지진</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
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
        flex:1,justifyContent:'center', alignItems:'center'
    },
    categoryBtnActive:{
        flex:1,justifyContent
        :'center', alignItems:'center', backgroundColor:'#b2cefa96',borderRadius:5,margin:3
    },
    backgroundImage: {
        flex: 1,
  },
});

export default HomeScreen;