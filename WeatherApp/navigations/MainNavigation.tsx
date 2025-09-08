import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/HomeScreen';
import {CustomMainTabBar} from '../components/CustomTabBar';
import { AlarmScreen, ReportScreen } from '../screens/EmptyScreen';
import BottomNavigation from './BottomNavigation';

const Tab = createMaterialTopTabNavigator();

function MainNavigation() {
    return (
        <Tab.Navigator initialRouteName='Home' tabBar={props => <CustomMainTabBar {...props} />} screenOptions={{ tabBarStyle: { display: 'none' }, swipeEnabled:false}} >
            <Tab.Screen name="Home" component={BottomNavigation} options={{ title: '날씨' }}/>
            <Tab.Screen name="Alarm" component={AlarmScreen} options={{ title: '알림' }}/>
            <Tab.Screen name="Report" component={ReportScreen} options={{ title: '제보' }}/>
        </Tab.Navigator>
    );
}

export default MainNavigation;