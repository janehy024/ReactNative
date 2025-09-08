import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import ReportNavigation from './ReportNavigation';
import HomeScreen from '../screens/HomeScreen';
import EarthquakeScreen from '../screens/EarthquakeScreen';

const Stack = createNativeStackNavigator();

function BottomNavigation() {
    const {themeColor} = useTheme();

    return (
        <Stack.Navigator initialRouteName='main' screenOptions={{headerShown: false, }} >
            <Stack.Screen name='main' component={HomeScreen} options={{animation:'none'}} initialParams={{ naviOffset: 0 }}/>
            <Stack.Screen name='report' component={ReportNavigation} options={{animation:'none', headerShown:false}}/>
            <Stack.Screen name='earthquake' component={EarthquakeScreen} options={{animation:'none', headerShown:false}}/>
        </Stack.Navigator>
    );
}

export default BottomNavigation;