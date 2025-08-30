import axios from 'axios';
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useModal } from "../hooks/useModal";
import { useTheme } from "../hooks/useTheme";
import Icon from "react-native-vector-icons/Ionicons";

function SettingScreen() {

    const { isModalVisible, modalOpen, modalClose } = useModal();
    const { themeMode, themeColor, setAppTheme } = useTheme();

    const navigation = useNavigation();

    const BottomModal = () => {
    
        const onAppTheme = (mode:string) => {
            setAppTheme(mode);
            modalClose();
        }
    
        return (
            <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => {modalClose()}}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, {backgroundColor:themeColor.bottomModal}]}>
    
                        <TouchableOpacity onPress={() => { onAppTheme('다크 모드') }}>
                            <Text style={[styles.modalText, {color:themeColor.text}]}>다크 모드</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { onAppTheme('라이트 모드') }}>
                            <Text style={[styles.modalText, {color:themeColor.text}]}>라이트 모드</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { onAppTheme('시스템 설정 사용') }}>
                            <Text style={[styles.modalText, {color:themeColor.text}]}>시스템 설정 사용</Text>
                        </TouchableOpacity>
    
                        {/* 모달 닫기 버튼 */}
                        <TouchableOpacity style={{width:'100%'}} onPress={() => modalClose()}>
                            <Text style={styles.closeText}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    return(
        <View style={{flex:1, backgroundColor: themeColor.background, paddingTop:10 }}>
            <View style={{flex: 0.2, alignItems:'flex-start', justifyContent:'flex-end', marginLeft:25,}}>
                <TouchableOpacity style={{ alignItems: 'center', padding:5, paddingLeft:0}} onPress={() => navigation.goBack()}>
                    <Icon name={'chevron-back'} color={themeColor.text} size={20} />
                </TouchableOpacity>
            </View>
            <View style={{flex:3, padding: 25,}}>
                <View style={{flex:0.5, justifyContent:'flex-end'}}>
                    <Text style={{fontSize:33, fontWeight:'bold', color:themeColor.text}}>설정</Text>
                </View>
                <View style={{flex:2, marginTop:30, }}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 20, flex:1, color:themeColor.text}}>화면 모드</Text>
                        <TouchableOpacity onPress={() => modalOpen()}>
                            <Text style={{backgroundColor:'#DBEA8D', borderRadius:20, width:150, textAlign:'center', paddingVertical:7, fontSize:15 }}>{themeMode}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <BottomModal/>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end', // ✨ 아래에 배치
        alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0)', // 어두운 반투명 배경
    },
    modalView: {
        width: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        padding: 10,
    },
    closeText: {
        fontSize: 18,
        padding: 10,
        color:'#888',
        textAlign:'center',
        marginTop:10
        
    },
});

export default SettingScreen;