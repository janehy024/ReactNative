import React, { useEffect, useState,useRef, useCallback } from "react";
import { View, Text, FlatList, ScrollView, Dimensions, StyleSheet, Button, SectionList ,TouchableOpacity, ViewToken} from 'react-native';
import { LocalItem, LocationType, TimeItem, WeatherForcastItem } from '../types/WetherItem';
import { useTheme } from "../hooks/useTheme";
import { useWeather } from "../hooks/useWeather";
// import { ScrollView } from "react-native/types_generated/index";

interface WeatherSection {
  title: string;
  data: TimeItem[]
}

function WeatherScrollItem({weather}:{weather:WeatherForcastItem[]}){

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

    const sectionData = (item:TimeItem) => {

        return (
            <View style={{width:50, margin:5, alignItems:'center', justifyContent:'center'}}>
                <Text style={{flex:1, textAlign:'center'}}>{Number(item.time)/100}시</Text>
                <Text style={{flex:1, textAlign:'center'}}>{item.item['TMP']}˚</Text>{/*기온*/}
                <Text style={{flex:1, textAlign:'center'}}>{item.item['POP']}%</Text>{/*강수확률*/}
                <Text style={{flex:1, textAlign:'center'}}>{item.item['PCP']==='강수없음'? '-' : item.item['PCP']}</Text>{/*강수량*/}
                <Text style={{flex:1, textAlign:'center'}}>{item.item['REH']}%</Text>{/*습도*/}
            </View>
        )
    }

    const weatherDate = (data: WeatherSection, isActive:boolean) => {

        const month = data.title.substring(4, 6); 
        const day = data.title.substring(6, 8);

        if(isActive){
            return(
                <View style={{flex:1, justifyContent:'center'}}>
                    <Text style={{ flex:1, textAlign:'center', fontWeight:'bold'}}>{month} / {day}</Text>
                    <View style={{flex:2, backgroundColor:'white', width:120, borderRightWidth:1.5, borderLeftWidth:1.5, borderColor:'#DBEA8D', flexDirection:'row', alignItems:'center'}}>
                        <Text style={{flex:1,textAlign:'center', color:'blue'}}>최저</Text>
                        <Text style={{flex:1,textAlign:'center', color:'red'}}>최고</Text>
                    </View>
                    
                </View>
            )
        }

        return(
            <Text style={{fontWeight:'400'}}>{month} / {day}</Text>
        )
    }

    return(
        <View style={{flex:1, backgroundColor:'white', borderTopLeftRadius:15, borderTopRightRadius:15,padding:10}}>
            <View style={{marginBottom:20}}>
                <Text style={{fontSize:18, fontWeight:'bold', margin: 10}}>시간별 예보</Text>
                <View style={{height:90,  flexDirection:'row',}}>
                    <ScrollView horizontal={true} style={{}} showsHorizontalScrollIndicator={false}>
                        {tmp.map((section, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.button,
                                    activeSectionIndex === index && styles.activeButton, // 활성화된 버튼에 스타일 적용
                                ]}
                                onPress={() => handleScrollToDate(index)}
                            >
                                {weatherDate(section, activeSectionIndex === index)}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <View style={{height:250, borderColor:'#DBEA8D', borderTopWidth:2,   padding: 10, flexDirection:'row'}}>
                    <View style={{margin:5, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{flex:1, textAlign:'center', fontWeight:'bold'}}>시간</Text>
                        <Text style={{flex:1, textAlign:'center', fontWeight:'bold'}}>기온</Text>{/*기온*/}
                        <Text style={{flex:1, textAlign:'center', fontWeight:'bold'}}>강수확률</Text>{/*강수확률*/}
                        <Text style={{flex:1, textAlign:'center', fontWeight:'bold'}}>강수량</Text>{/*강수량*/}
                        <Text style={{flex:1, textAlign:'center', fontWeight:'bold'}}>습도</Text>{/*습도*/}
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
                <Text style={{fontSize:18, fontWeight:'bold', margin: 10,}}>일별예보</Text>
                <View style={{height:300, borderColor:'#DBEA8D', borderTopWidth:2,  borderBottomWidth:0}}>
                        
                </View>
            </View>
            <View style={{marginBottom:20}}>
                <Text style={{fontSize:18, fontWeight:'bold', margin: 10}}>대기질 정보</Text>
                <View style={{height:100, borderColor:'#DBEA8D', borderTopWidth:2,  borderBottomWidth:0,}}>
                        
                </View>
            </View> 
            <View style={{marginBottom:20}}>
                <Text style={{fontSize:18, fontWeight:'bold', margin: 10}}>자외선 정보</Text>
                <View style={{height:100, borderColor:'#DBEA8D', borderTopWidth:2,  borderBottomWidth:0,}}>
                        
                </View>
            </View> 
            <View>
                <Text style={{fontSize:18, fontWeight:'bold', margin: 10}}>영상</Text>
                <View style={{height:350, borderColor:'#DBEA8D', borderTopWidth:2,  borderBottomWidth:0,}}>
                        
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
        height:80,
        backgroundColor: '#ccc',
        margin:0.5
    },
    activeButton: {
        backgroundColor: '#DBEA8D',
        justifyContent:'flex-start',
        width:120,
        paddingTop:7,
        padding:0

    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});
export default WeatherScrollItem;