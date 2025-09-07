import React,{useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert,Animated,Dimensions,Modal,ScrollView,Switch } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons"; // 아이콘 라이브러리
import ThemeModal from '../components/ThemeModal';
import { useModal } from "../hooks/useModal";
import { useTheme } from "../hooks/useTheme";

const { themeColor } = useTheme();

export function WeatherReportScreen(){
    // const { themeColor, setAppTheme } = useTheme();

    return (
        <View style={[styles.containView, {backgroundColor: themeColor.mainBackground,}]}>
            <Text>기상특보</Text>
        </View>
    )
}

export function PreReportScreen(){
    // const { themeColor, setAppTheme } = useTheme();

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
    }
})