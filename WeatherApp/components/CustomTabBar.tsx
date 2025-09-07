import React,{useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons"; // 아이콘 라이브러리
import { useWeather } from '../hooks/useWeather';
import { useModal } from "../hooks/useModal";
import SettingModal from '../components/SettingModal';
import { useTheme } from '../hooks/useTheme';


function CustomTabBar({ state, descriptors, navigation }:{ state:any, descriptors:any, navigation :any}) {
    const { isModalVisible, modalOpen, modalClose } = useModal();
    const {onReset} = useWeather();
    const { themeColor, themeMode } = useTheme();

    return (
        <View style={[styles.tabBarContainer, {backgroundColor:themeColor.tabBarColor}]}>
            <View style={styles.tabsContainer}>
                {state.routes.map((route:any, index:any) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        onPress={onPress}
                        style={[styles.tabButton, isFocused && styles.activeTabButton]}
                    >
                    <Text style={styles.tabText}>
                        {label}
                    </Text>
                    </TouchableOpacity>
                );
                })}
            </View>
            
            {/* 오른쪽 설정 버튼 */}
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity 
                    style={styles.settingsButton}
                    onPress={onReset}>
                    <Icon name="refresh" size={24} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.settingsButton}
                    onPress={modalOpen}>
                    <Icon name="menu" size={24} color="#ffffff" />
                </TouchableOpacity>
            </View>
            <SettingModal visible={isModalVisible} onClose={modalClose} navigation={navigation}/>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarContainer: {
        flexDirection: 'row',
        backgroundColor: '#EDEFE3',
        paddingHorizontal: 16,
        height:60,
        elevation: 6,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowColor:'black',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        zIndex: 1000,
    },
    tabsContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginRight: 8,
    },
    activeTabButton: {
        borderBottomColor:'white',
        borderBottomWidth:4,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    settingsButton: {
        padding: 8,
        paddingHorizontal: 10,
    },
});

export default CustomTabBar;