import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import MainScreen from '../screens/MainScreen';
import SettingScreen from '../screens/SettingScreen';
import SearchScreen from '../screens/SearchScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

function StackNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='home' screenOptions={{headerShown: false, }} >
                <Stack.Screen name='home' component={HomeScreen}/>
                <Stack.Screen name='setting' component={SettingScreen} options={{animation:'slide_from_right'}}/>
                <Stack.Screen name='search' component={SearchScreen} options={{animation: 'slide_from_left'}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default StackNavigation;