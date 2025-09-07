import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SettingScreen from '../screens/SettingScreen';
import SearchScreen from '../screens/SearchScreen';
import MainNavigation from './MainNavigation';
import { View,TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"; // 아이콘 라이브러리
import { useTheme } from '../hooks/useTheme';
const Stack = createNativeStackNavigator();

function StackNavigation() {
    const {themeColor} = useTheme();

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='main' screenOptions={{headerShown: true, }} >
                <Stack.Screen name='main' component={MainNavigation} options={{headerShown:false}}/>
                <Stack.Screen name='setting' component={SettingScreen} options={{animation:'slide_from_right'}}/>
                <Stack.Screen name='search' component={SearchScreen} 
                                options={({navigation})=>({animation: 'slide_from_right', title:'검색', headerTintColor:'white',
                                        headerBackVisible: false, headerTitleAlign:'center', headerStyle:{backgroundColor:themeColor.tabBarColor},
                                        headerRight:()=><TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="close" size={23} color={'white'}/></TouchableOpacity>})}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default StackNavigation;