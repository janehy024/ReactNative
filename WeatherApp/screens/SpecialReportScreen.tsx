import React,{useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert,Animated,Dimensions,Modal,ScrollView,Switch } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons"; // 아이콘 라이브러리
import ThemeModal from '../components/ThemeModal';
import { useModal } from "../hooks/useModal";
import { useTheme } from "../hooks/useTheme";
import ReportApi from '../utils/ReportApi';
import { ReportItem } from '../types/ApiItem';
import { getDayString } from '../utils/ChangeData';

export function WeatherReportScreen(){
    const { themeColor, setAppTheme } = useTheme();
    const { width: SCREEN_WIDTH, } = Dimensions.get('window');
    const [reportData, setReportData] = useState<ReportItem>()
    
    useEffect(()=>{
        const getData = async() =>{
            const data = await ReportApi();
            if(data)
                setReportData(data);
        }

        getData();
    },[])

    const getDate = (dateValue:any) => {
        const dateTimeString = String(dateValue);
        const year = parseInt(dateTimeString.substring(0, 4));
        const month = parseInt(dateTimeString.substring(4, 6)) - 1; // 월은 0부터 시작하므로 1을 빼줍니다.
        const day = parseInt(dateTimeString.substring(6, 8));
        const hour = dateTimeString.substring(8, 10);
        const minute = dateTimeString.substring(10, 12);

        const dateObject = new Date(year, month, day);
        const date = getDayString(dateObject.getDay());
        

        return `${year}년 ${month+1}월 ${day}일(${date}) ${hour}:${minute}`
    }

    return (
        <View style={[styles.containView, {backgroundColor: themeColor.mainBackground,}]}>
            <ScrollView style={{flex:1, width:SCREEN_WIDTH, padding:15}}>
                <View style={{marginTop:30}}>
                    <Text style={styles.standardText}>특보 발표 기준</Text>
                    <View style={{ padding:10, height:350, backgroundColor:'gray'}}></View>
                </View>
                <View style={{marginHorizontal:10, marginVertical:15, marginBottom:50}}>
                    <Text style={[styles.mainText,{color:themeColor.text}]}>특보 발효현황</Text>
                    <View style={{margin:5}}> 
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.subText,{color:themeColor.text}]}>발표시각 : </Text>
                            <Text style={[styles.reportText,{color:themeColor.text}]}>{getDate(reportData?.tmFc)}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.subText,{color:themeColor.text}]}>발효시각 : </Text>
                            <Text style={[styles.reportText,{color:themeColor.text}]}>{getDate(reportData?.tmEf)} 이후</Text>
                        </View>
                    </View>
                    <Text style={[styles.mainText, {marginTop:10, marginBottom:5, color:themeColor.text}]}>특보 내용</Text>
                    <Text style={[styles.reportText,{color:themeColor.text}]}>{reportData?.t6}</Text>
                    <Text style={[styles.mainText, {marginTop:10, marginBottom:5,color:themeColor.text}]}>참고 사항</Text>
                    <Text style={[styles.reportText,{color:themeColor.text}]}>{reportData?.other}</Text>
                </View>
            </ScrollView>
        </View>
    )
}

export function PreReportScreen(){
    const { themeColor, setAppTheme } = useTheme();

    return (
        <View style={[styles.containView, {backgroundColor: themeColor.mainBackground,}]}>
            <Text>예비특보</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    containView:{
        flex:1, 
        alignItems:'center',
        justifyContent:'center'
    },
    mainText: {
        fontWeight:'bold',
        fontSize:17
    },
    subText: {
        fontWeight:'500',
        fontSize:15
    },
    reportText: {
        fontWeight:'400',
        fontSize:15,
        marginHorizontal:5
    },
    standardText: {
        textAlign:'right', 
        marginBottom:20,
        fontWeight:'bold',
        color:'#35568C'
    }
})