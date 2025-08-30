import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useLocation } from './useLocation'; 
import ConverterToXY from '../utils/ConvertToXY';
import {WeatherAPI} from '../utils/WeatherApi';
import { LocalItem } from '../types/WetherItem';
import {ReverseGeocodingAPI} from "../utils/GeocodingApi";

export const useWeather = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const GetWeatherItem = async (location:any, type:number) => {
        // 위도와 경도가 없으면 실행하지 않음
        if (!location.latitude || !location.longitude) return null;
        
        setIsLoading(true);

        try {
            const { x, y } = ConverterToXY(location.latitude, location.longitude);
            const {current, hourly} = await WeatherAPI(x, y);

            if(current && hourly){
                // // 최대값 구하기
                // const max = hourly.reduce((prev, curr) => {const a = prev.category});
                // // 최저값 구하기
                // const min = hourly.reduce((prev, curr) => (prev.tempValue < curr.tempValue ? prev : curr));

                const local:LocalItem = { location:location,  currentWeather: current, hourlyWeather:hourly, min:'0', max:'0'}

                return local;
            }

            return null;

        } catch (err) {

            console.log('날씨 정보 가져오기 실패:', err);
            setError('서버 연결 오류');
            return null;

        }finally{
            setIsLoading(false);
        }
    };

    return { GetWeatherItem, isLoading, error };

};