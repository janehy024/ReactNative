import React, { useEffect, } from "react";
import { View, PermissionsAndroid, Platform, SafeAreaView, StatusBar  } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import StackNavigation from "../navigations/StackNavigation";
import { useTheme } from "../hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from 'react-native-splash-screen';

function InitScreen() {
  const { themeColor, setAppTheme } = useTheme();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse');
    } 
    else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("위치 정보 권한이 허용되었습니다.");

        } else {
          console.log("위치 정보 권한이 거부되었습니다.");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const setTheme = async () => {
    const theme = await AsyncStorage.getItem('themeMode');

    if(theme){
      setAppTheme(theme);
    }
  }

  useEffect(() => {

    requestLocationPermission();
    setTheme();
    SplashScreen.hide();

  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor:themeColor.background}}>
      <StatusBar barStyle={themeColor.statusbar as 'light-content' | 'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        <View style={{flex:1, marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,}}>
          <StackNavigation/>
        </View>
    </SafeAreaView>
   
  );
}

export default InitScreen;
