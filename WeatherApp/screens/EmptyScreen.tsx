import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { useTheme } from "../hooks/useTheme";

const { themeColor } = useTheme();

export function AlarmScreen(){
    // const { themeColor, setAppTheme } = useTheme();

    return (
        <View style={[styles.containView, {backgroundColor: themeColor.mainBackground,}]}>
            <Text>알림</Text>
        </View>
    )
}

export function ReportScreen(){
    // const { themeColor, setAppTheme } = useTheme();

    return (
        <View style={[styles.containView, {backgroundColor: themeColor.mainBackground,}]}>
            <Text>제보</Text>
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