import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Animated,Dimensions, Modal, StatusBar } from 'react-native';
import { useTheme } from "../hooks/useTheme";

function ThemeModal({isVisible, onModalClose}:{isVisible:boolean, onModalClose:()=>void}){
    const { themeColor, setAppTheme } = useTheme();
    const { height: SCREEN_HEIGHT } = Dimensions.get('window');
    const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));

    useEffect(() => {
        slideAnim.setValue(SCREEN_HEIGHT);

        if (isVisible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isVisible]);

    const onAppTheme = (mode: string) => {
        setAppTheme(mode);
        onModalClose();
    }

    return (
        <Modal animationType="none" transparent={true} visible={isVisible} onRequestClose={onModalClose}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={onModalClose}/>
                <Animated.View 
                    style={[
                        styles.modalView, 
                        { backgroundColor: themeColor.modalBackground },
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <TouchableOpacity onPress={() => onAppTheme('다크 모드')}>
                        <Text style={[styles.modalText, {color: themeColor.text}]}>다크 모드</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => onAppTheme('라이트 모드')}>
                        <Text style={[styles.modalText, {color: themeColor.text}]}>라이트 모드</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => onAppTheme('시스템 설정 사용')}>
                        <Text style={[styles.modalText, {color: themeColor.text}]}>시스템 설정 사용</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={onModalClose}>
                        <Text style={styles.closeText}>닫기</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalView: {
        height: '33%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        padding: 10,
    },
    closeButton: {
        width: '100%',
        marginTop: 20,
    },
    closeText: {
        fontSize: 18,
        padding: 10,
        color: '#888',
        textAlign: 'center',
    },
});

export default ThemeModal;