import React, { useEffect, useState,useRef, useCallback } from "react";
import { View, Text, FlatList, ScrollView, Dimensions, StyleSheet, Button, SectionList ,TouchableOpacity} from 'react-native';
import { LocalItem, LocationType, WeatherForcastItem, CategoryForcastItem } from '../types/WetherItem';
import { useTheme } from "../hooks/useTheme";
import { useWeather } from "../hooks/useWeather";
// import { ScrollView } from "react-native/types_generated/index";

interface WeatherSection {
  title: string;
  data: CategoryForcastItem[];
}

function WeatherScrollItem({weather}:{weather:WeatherForcastItem[]}){

    if(!weather)
        return;

    const tmpOnly =  weather? weather.filter(item => item.category === 'TMP'):[];

    const [tmp, setTmp] = useState<WeatherSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const sectionListRef = useRef<SectionList<any>>(null);
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);

    useEffect(() => {
        const weatherSections = tmpOnly.reduce((acc:WeatherSection[], item) => {
            acc.push({
                title: item.date,
                data: item.values
            });

            return acc;
        }, []);

        setTmp(weatherSections);
        setIsLoading(false);
    }, [weather]);
    
    if(isLoading){
        return(<View><Text>로딩중</Text></View>)
    }

    const handleScrollToDate = (sectionIndex:any) => {
        setActiveSectionIndex(sectionIndex);
        if (sectionListRef.current) {
            sectionListRef.current.scrollToLocation({
            sectionIndex: sectionIndex,
            itemIndex: 0, // 해당 섹션의 첫 번째 아이템으로 이동
            animated: true,
            });
        }
    };

    const onViewableItemsChanged = ({ viewableItems }) => {
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

    const sectionData = (item:CategoryForcastItem) => {
        return (
            <View style={{width:50,  margin:5, padding:10, alignItems:'center', justifyContent:'center'}}>
                    <Text>{item.time/100}시</Text>
                    <Text>{item.value}˚</Text>
            </View>
        )
    }

    return(
        <View style={{flex:1, backgroundColor:'white', borderTopLeftRadius:15, borderTopRightRadius:15,padding:10}}>
            <View style={{}}>
                <Text style={{fontSize:18, fontWeight:'bold', margin: 10}}>시간별 예보</Text>
                <View style={{height:60, alignItems:'flex-end', flexDirection:'row'}}>
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
                                <Text style={styles.buttonText}>{section.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <View style={{height:100, backgroundColor:'#DBEA8D', padding: 10, borderRadius:10, justifyContent:'center'}}>
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
                    />
                </View>
            </View>
            <View style={{height:600, backgroundColor:'#cad48eff', borderRadius:10}}>
                    
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
        borderRadius: 5,
        height:50,
        backgroundColor: '#ccc',
    },
    activeButton: {
        backgroundColor: '#cad48eff',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});
export default WeatherScrollItem;