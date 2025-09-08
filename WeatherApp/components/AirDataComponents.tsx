import React, { useContext, useEffect, useState, useRef, useCallback  } from "react";
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Animated, ActivityIndicator, ViewToken, ScrollView, Dimensions } from 'react-native'
import { AirItem } from "../types/WetherItem";
import { useTheme } from "../hooks/useTheme";

function AirDataComponents({air}:{air:AirItem}) {

    const { themeColor, } = useTheme();
    const {pm10Value, pm25Value, o3Value} = air;
    
    const airData = () => {

        const pm10ValueRange = () => {
            var range = ''; var color = '';
            if(pm10Value < 31) {range='좋음'; color='#a2defaff'}
            else if(pm10Value < 81) {range='보통'; color='#a2fad8ff'}
            else if(pm10Value < 151) {range='나쁨'; color='#fad1a2ff'}
            else {range='매우나쁨'; color='#faa2a2ff'}

            return {range, color};
        }

        const pm25ValueRange = () => {
            var range = ''; var color = '';
            if(pm25Value < 16) {range='좋음'; color='#a2defaff'}
            else if(pm25Value < 36) {range='보통'; color='#a2fad8ff'}
            else if(pm25Value < 76) {range='나쁨'; color='#fad1a2ff'}
            else {range='매우나쁨'; color='#faa2a2ff'}

            return {range, color};
        }

        const o3ValueRange = () => {
            var range = ''; var color = '';
            if(o3Value < 0.0301) {range='좋음'; color='#a2defaff'}
            else if(o3Value < 0.0901) {range='보통'; color='#a2fad8ff'}
            else if(o3Value < 0.1501) {range='나쁨'; color='#fad1a2ff'}
            else {range='매우나쁨'; color='#faa2a2ff'}

            return {range, color};
        }
        return(
            <View style={{marginBottom:20}}>
                <Text style={{fontSize:18, fontWeight:'bold', margin: 10, color:themeColor.text}}>대기질 정보</Text>
                    <View style={{flex:1 ,height:120, borderColor:'#35568C', borderTopWidth:2,  borderBottomWidth:0, flexDirection:'row', paddingHorizontal:17, alignItems:'center'}}>
                        <View style={{flex:1, marginHorizontal:5,}}>
                            <Text style={{color:'#8a8a8aff',textAlign:'center'}}>초미세먼지</Text>
                            <Text style={{textAlign:'center',marginVertical:4, marginBottom:10,fontWeight:'bold', color:themeColor.text}}>{pm25Value} ㎍/㎥</Text>
                            <Text style={{height:25  ,backgroundColor:pm10ValueRange().color, borderRadius:15, textAlign:'center', textAlignVertical:'center'}}>{pm10ValueRange().range}</Text>
                        </View> 
                        <View style={{flex:1, marginHorizontal:5,}}>
                            <Text style={{color:'#8a8a8aff',textAlign:'center'}}>미세먼지</Text>
                            <Text style={{textAlign:'center',marginVertical:4, marginBottom:10,fontWeight:'bold', color:themeColor.text}}>{pm10Value} ㎍/㎥</Text>
                            <Text style={{height:25  ,backgroundColor:pm25ValueRange().color, borderRadius:15, textAlign:'center', textAlignVertical:'center'}}>{pm25ValueRange().range}</Text>
                        </View> 
                        <View style={{flex:1, marginHorizontal:5,}}>
                            <Text style={{color:'#8a8a8aff',textAlign:'center'}}>오존</Text>
                            <Text style={{textAlign:'center',marginVertical:4, marginBottom:10,fontWeight:'bold', color:themeColor.text}}>{o3Value} ppm</Text>
                            <Text style={{height:25  ,backgroundColor:o3ValueRange().color, borderRadius:15, textAlign:'center', textAlignVertical:'center'}}>{o3ValueRange().range}</Text>
                        </View>    
                    </View>
            </View> 
        )
    }

    const ultravioletData = () => {

        const getDate = (count:number) => {
            const date = new Date();
            date.setDate(date.getDate() + count);
            const month = date.getMonth()+1;
            const day = date.getDate();
            
            return `${month}.${day}`;
        }
        

        return (
            <View style={{marginBottom:20}}>
                <Text style={{fontSize:18, fontWeight:'bold', margin: 10, color:themeColor.text}}>자외선지수</Text>
                <View style={{height:120, borderColor:'#35568C', borderTopWidth:2,  borderBottomWidth:0, flexDirection:'row', paddingHorizontal:17, alignItems:'center'}}>
                    <View style={{flex:1, marginHorizontal:5,}}>
                        <Text style={{color:'#8a8a8aff',textAlign:'center'}}>오늘 {getDate(0)}</Text>
                        <Text style={{textAlign:'center',marginVertical:4, marginBottom:10,fontWeight:'bold'}}></Text>
                        <Text style={{height:25  ,backgroundColor:'#e9b832ff', borderRadius:15, textAlign:'center', textAlignVertical:'center'}}>보통</Text>
                    </View> 
                    <View style={{flex:1, marginHorizontal:5,}}>
                        <Text style={{color:'#8a8a8aff',textAlign:'center'}}>내일 {getDate(1)}</Text>
                        <Text style={{textAlign:'center',marginVertical:4, marginBottom:10,fontWeight:'bold'}}></Text>
                        <Text style={{height:25  ,backgroundColor:'#e9b832ff', borderRadius:15, textAlign:'center', textAlignVertical:'center'}}>보통</Text>
                    </View> 
                    <View style={{flex:1, marginHorizontal:5,}}>
                        <Text style={{color:'#8a8a8aff',textAlign:'center'}}>모레 {getDate(2)}</Text>
                        <Text style={{textAlign:'center',marginVertical:4, marginBottom:10,fontWeight:'bold'}}></Text>
                        <Text style={{height:25  ,backgroundColor:'#e9b832ff', borderRadius:15, textAlign:'center', textAlignVertical:'center'}}>보통</Text>
                    </View>  
                </View>
            </View> 
        )
    }

    return(
        <View>
            {airData()}
            {ultravioletData()}
        </View>
    )
}

export default AirDataComponents;