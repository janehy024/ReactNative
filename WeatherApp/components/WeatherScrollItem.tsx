import React, { useEffect, useState,useRef, useCallback } from "react";
import { View, Text, FlatList, ScrollView, Dimensions, StyleSheet, Image, SectionList ,TouchableOpacity, ViewToken} from 'react-native';
import { LocalItem, LocationType, TimeItem, WeatherForcastItem } from '../types/WetherItem';
import { useTheme } from "../hooks/useTheme";
import { useWeather } from "../hooks/useWeather";

interface WeatherSection {
  title: string;
  data: TimeItem[]
}

function WeatherScrollItem({weather, week}:{weather:WeatherForcastItem[],week:WeatherForcastItem[]}){

    if(!weather)
        return;

    const transformToSections = (items: WeatherForcastItem[]): WeatherSection[] => {
        return items.map(item => ({
            title: item.date,
            data: item.values
        }));
    };

    const finalSections = transformToSections(weather);

    const [tmp, setTmp] = useState<WeatherSection[]>([]);

    const sectionListRef = useRef<SectionList<any>>(null);
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [isBtnActive, setIsBtnActive] = useState(false);
    const { themeColor, themeMode } = useTheme();
    const {weatherVideoItem} = useWeather();
    // const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // // 컴포넌트가 마운트될 때 애니메이션을 시작하고, 언마운트될 때 정리합니다.
    // useEffect(() => {
    //     Image.prefetch(weatherVideoItem[currentImageIndex]);

    //     const interval = setInterval(() => {
    //     // 이미지 인덱스를 1씩 증가시키고, 마지막 이미지에 도달하면 다시 처음으로 돌아갑니다.
    //         setCurrentImageIndex((prevIndex) => (prevIndex + 1) % weatherVideoItem.length);
    //     }, 5000); // 100ms마다 이미지 변경 (1초에 10장)

    //     // 컴포넌트가 사라질 때 타이머를 정리하여 메모리 누수를 방지합니다.
    //     return () => clearInterval(interval);
    // }, [currentImageIndex]);

    useEffect(() => {
        setTmp(finalSections);
    }, [weather]);


    const handleScrollToDate = (sectionIndex:any) => {
        setIsBtnActive(true);
        setActiveSectionIndex(sectionIndex);

        if (sectionListRef.current) {
            sectionListRef.current.scrollToLocation({
            sectionIndex: sectionIndex,
            itemIndex: 0, // 해당 섹션의 첫 번째 아이템으로 이동
            animated: true,
            });
        }
    };

    const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if(isBtnActive)
            return;

        if (viewableItems.length > 0) {
            const firstVisibleSection = viewableItems[0].section;
            const index = tmp.findIndex(
                (section) => section.title === firstVisibleSection.title
            );

            if (index !== -1 && index !== activeSectionIndex) {
                setActiveSectionIndex(index);
            }
        }
    };

    const WeekListItem = (item: WeatherForcastItem, index:number) => {
        const dayNumber = new Date().getDay();

        const getDayString = (dayNumber: number) => {
            switch(dayNumber){
                case 0: return '일'; break;
                case 1: return '월'; break;
                case 2: return '화'; break;
                case 3: return '수'; break;
                case 4: return '목'; break;
                case 5: return '금'; break;
                case 6: return '토'; break;
            }
        }

        return (
            <View key={index} style={{height:70, flexDirection:'row', marginHorizontal:5, marginTop:0, alignItems:'center',borderBottomWidth:0.5, borderColor:'#ccc'}}>
                <View style={{flex:1, alignContent:'center'}}>
                    <Text style={{textAlign:'center', fontSize:18, fontWeight:'500', color:themeColor.text}}>{getDayString(dayNumber+index)}</Text>
                    <Text style={{textAlign:'center', color:themeColor.text}}>{Number(item.date.substring(4, 6))}.{Number(item.date.substring(6, 8))}</Text>
                </View>
                <Text style={{flex:1, textAlign:'center', color:themeColor.text}}>{item.values[1].item['SKY']}</Text>
                <Text style={{flex:1, textAlign:'center', color:themeColor.text}}>{item.values[1].item['POP']}%</Text>
                <Text style={{flex:1, textAlign:'center', color:themeColor.text}}>{item.values[0].item['SKY']}</Text>
                <Text style={{flex:1, textAlign:'center', color:themeColor.text}}>{item.values[0].item['POP']}%</Text>
                <Text style={{flex:1, textAlign:'center', color:themeColor.text}}>{item.values[1].item['TMN']}˚</Text>
                <Text style={{flex:1, textAlign:'center', color:themeColor.text}}>{item.values[0].item['TMX']}˚</Text>
            </View>
        )
    }

    const sectionData = (item:TimeItem) => {
        return (
            <View style={{width:50, margin:5, alignItems:'center', justifyContent:'center',}}>
                <Text style={{paddingVertical:13, textAlign:'center', color:themeColor.text}}>{Number(item.time)/100}시</Text>
                <Text style={{paddingVertical:13, textAlign:'center', color:themeColor.text}}>{item.item['SKY']}</Text>{/*하늘*/}
                <Text style={{paddingVertical:13, textAlign:'center', color:themeColor.text}}>{item.item['TMP']}˚</Text>{/*기온*/}
                <Text style={{paddingVertical:13, textAlign:'center', color:themeColor.text}}>{item.item['POP']}%</Text>{/*강수확률*/}
                <Text style={{paddingVertical:13, textAlign:'center', color:themeColor.text}}>{item.item['PCP']==='강수없음'? '-' : item.item['PCP']}</Text>{/*강수량*/}
                <Text style={{paddingVertical:13, textAlign:'center', color:themeColor.text}}>{item.item['REH']}%</Text>{/*습도*/}
            </View>
        )
    }

    const weatherDate = (data: WeatherSection, isActive:boolean) => {
        const month = data.title.substring(4, 6); 
        const day = data.title.substring(6, 8);

        const values = week.find((item)=>item.date === data.title);

        if(isActive){
            return(
                <View style={{flex:1, justifyContent:'center'}}>
                    <Text style={{ flex:1, textAlign:'center', fontWeight:'bold', color:'white'}}>{month} / {day}</Text>
                    <View style={{flex:3, backgroundColor:themeColor.modalBackground, width:150, borderRightWidth:1, borderLeftWidth:1, borderColor:'#35568C', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{flex:1,textAlign:'center', color:'#007AFF'}}>{values? values.values[1].item['TMN'] : '0'}</Text>
                        <Text style={{flex:1,textAlign:'center', color:'red'}}>{values? values.values[0].item['TMX'] : '0'}</Text>
                    </View>
                </View>
            )
        }

        return(
            <Text style={{fontWeight:'500',textAlign:'center', color:themeColor.text}}>{month} / {day}</Text>
        )
    }

    return(
        <View style={{flex:1, backgroundColor:themeColor.modalBackground, borderTopLeftRadius:15, borderTopRightRadius:15,padding:10}}>
            <View style={{marginBottom:20}}>
                <Text style={{fontSize:18, fontWeight:'bold', margin: 10, color:themeColor.text}}>시간별 예보</Text>
                <View style={{height:100,  flexDirection:'row'}}>
                    <ScrollView horizontal={true} style={{}} showsHorizontalScrollIndicator={false}>
                        {tmp.map((section, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.button,
                                    activeSectionIndex === index && styles.activeButton, // 활성화된 버튼에 스타일 적용
                                    activeSectionIndex !== index &&{backgroundColor:themeColor.forcastDayBtnColor}
                                ]}
                                onPress={() => handleScrollToDate(index)}
                            >
                                {weatherDate(section, activeSectionIndex === index)}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <View style={{height:290, padding: 10, flexDirection:'row', borderRadius:3, borderBottomLeftRadius:5, borderBottomRightRadius:5}}>
                    <View style={{width:60, alignItems:'flex-start', borderColor:'#ccc', borderRightWidth:0.5}}>
                        <Text style={{paddingVertical:13, fontWeight:'bold', color:themeColor.text}}>시간</Text>
                        <Text style={{paddingVertical:13}}></Text>
                        <Text style={{paddingVertical:13, fontWeight:'bold', color:themeColor.text}}>기온</Text>{/*기온*/}
                        <Text style={{paddingVertical:13, fontWeight:'bold', color:themeColor.text}}>강수확률</Text>{/*강수확률*/}
                        <Text style={{paddingVertical:13, fontWeight:'bold', color:themeColor.text}}>강수량</Text>{/*강수량*/}
                        <Text style={{paddingVertical:13, fontWeight:'bold', color:themeColor.text}}>습도</Text>{/*습도*/}
                    </View>
                    <SectionList 
                        ref={sectionListRef} 
                        sections={tmp} 
                        renderItem={({item}) => sectionData(item)}
                        keyExtractor={(item, index) => `${item.time}-${index}`}
                        horizontal={true}
                        nestedScrollEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={{
                        itemVisiblePercentThreshold: 50, // 아이템이 50% 이상 보일 때 이벤트를 발생
                        }}
                        onMomentumScrollEnd={()=>setIsBtnActive(false)}
                    />
                </View>
            </View>
            <View style={{marginBottom:20}}>
                <Text style={{fontSize:18, fontWeight:'bold', margin: 10, color:themeColor.text}}>일별예보</Text>
                <View style={{flex:1, flexDirection:'row', borderColor:'#35568C', borderTopWidth:2,}}>
                    <Text style={{flex: 1, textAlign:'center', paddingVertical:13, fontWeight:'bold', color:themeColor.text}}></Text>
                    <Text style={{flex: 2, textAlign:'center',paddingVertical:13, fontWeight:'bold', color:themeColor.text}}>오전</Text>
                    <Text style={{flex: 2, textAlign:'center',paddingVertical:13, fontWeight:'bold', color:themeColor.text}}>오후</Text>{/*기온*/}
                    <Text style={{flex: 1, textAlign:'center',paddingVertical:13, fontWeight:'bold', color:themeColor.text}}>최저</Text>{/*강수확률*/}
                    <Text style={{flex: 1, textAlign:'center',paddingVertical:13, fontWeight:'bold', color:themeColor.text}}>최고</Text>{/*강수량*/}
                </View>
                <View style={{height:500, borderColor:'#35568C', borderTopWidth:2}}>
                    {week.map((item,index)=>WeekListItem(item, index))}
                </View>
            </View>
            <View style={{marginBottom:20}}>
                <Text style={{fontSize:18, fontWeight:'bold', margin: 10, color:themeColor.text}}>대기질 정보</Text>
                <View style={{flex:1 ,height:120, borderColor:'#35568C', borderTopWidth:2,  borderBottomWidth:0, flexDirection:'row', paddingHorizontal:17, alignItems:'center'}}>
                    <View style={{flex:1, marginHorizontal:5,}}>
                        <Text style={{color:'#8a8a8aff',textAlign:'center'}}>초미세먼지</Text>
                        <Text style={{textAlign:'center',marginVertical:4, marginBottom:10,fontWeight:'bold'}}>㎍/㎥</Text>
                        <Text style={{height:25  ,backgroundColor:'#69bfe7ff', borderRadius:15, textAlign:'center', textAlignVertical:'center'}}>보통</Text>
                    </View> 
                    <View style={{flex:1, marginHorizontal:5,}}>
                        <Text style={{color:'#8a8a8aff',textAlign:'center'}}>미세먼지</Text>
                        <Text style={{textAlign:'center',marginVertical:4, marginBottom:10,fontWeight:'bold'}}>㎍/㎥</Text>
                        <Text style={{height:25  ,backgroundColor:'#69bfe7ff', borderRadius:15, textAlign:'center', textAlignVertical:'center'}}>보통</Text>
                    </View> 
                    <View style={{flex:1, marginHorizontal:5,}}>
                        <Text style={{color:'#8a8a8aff',textAlign:'center'}}>오존</Text>
                        <Text style={{textAlign:'center',marginVertical:4, marginBottom:10,fontWeight:'bold'}}>ppm</Text>
                        <Text style={{height:25  ,backgroundColor:'#69bfe7ff', borderRadius:15, textAlign:'center', textAlignVertical:'center'}}>보통</Text>
                    </View>    
                </View>
            </View> 
            <View style={{marginBottom:20}}>
                <Text style={{fontSize:18, fontWeight:'bold', margin: 10, color:themeColor.text}}>자외선지수</Text>
                <View style={{height:120, borderColor:'#35568C', borderTopWidth:2,  borderBottomWidth:0, flexDirection:'row', paddingHorizontal:17, alignItems:'center'}}>
                    <View style={{flex:1, marginHorizontal:5,}}>
                        <Text style={{color:'#8a8a8aff',textAlign:'center'}}>오늘</Text>
                        <Text style={{textAlign:'center',marginVertical:4, marginBottom:10,fontWeight:'bold'}}></Text>
                        <Text style={{height:25  ,backgroundColor:'#e9b832ff', borderRadius:15, textAlign:'center', textAlignVertical:'center'}}>보통</Text>
                    </View> 
                    <View style={{flex:1, marginHorizontal:5,}}>
                        <Text style={{color:'#8a8a8aff',textAlign:'center'}}>내일</Text>
                        <Text style={{textAlign:'center',marginVertical:4, marginBottom:10,fontWeight:'bold'}}></Text>
                        <Text style={{height:25  ,backgroundColor:'#e9b832ff', borderRadius:15, textAlign:'center', textAlignVertical:'center'}}>보통</Text>
                    </View> 
                    <View style={{flex:1, marginHorizontal:5,}}>
                        <Text style={{color:'#8a8a8aff',textAlign:'center'}}>모레</Text>
                        <Text style={{textAlign:'center',marginVertical:4, marginBottom:10,fontWeight:'bold'}}></Text>
                        <Text style={{height:25  ,backgroundColor:'#e9b832ff', borderRadius:15, textAlign:'center', textAlignVertical:'center'}}>보통</Text>
                    </View>  
                </View>
            </View> 
            <View>
                <Text style={{fontSize:18, fontWeight:'bold', margin: 10, color:themeColor.text}}>영상</Text>
                <View style={{height:370, borderColor:'#35568C', borderTopWidth:2,  borderBottomWidth:0, padding:10}}>
                    <Image source={{uri:weatherVideoItem[0]}} style={{width:320, height:328}}/>
                </View>
            </View> 
        </View>
    )
}

const styles = StyleSheet.create({
    dayWeatherContent: {
        backgroundColor:'#c5bfbfff', 
        marginHorizontal:10, 
        padding:10, 
        height: 70
    },
    button: {
        padding: 10,
        justifyContent:'center',
        borderTopLeftRadius:7,
        borderTopRightRadius:7,
        width:80,
        height:100,
        backgroundColor: '#d8d8d8ff',
        margin:0.5
    },
    activeButton: {
        backgroundColor: '#35568C',
        justifyContent:'flex-start',
        width:150,
        paddingTop:7,
        padding:0

    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});
export default WeatherScrollItem;