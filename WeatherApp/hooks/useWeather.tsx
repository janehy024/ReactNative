import { createContext, useState, useEffect, ReactNode, useContext, } from 'react';
import { useLocation } from './useLocation'; 
import ConverterToXY from '../utils/ConvertToXY';
import {WeatherAPI} from '../utils/WeatherApi';
import { LocalItem } from '../types/WetherItem';

interface WeatherContextType {
    allWeather:LocalItem[],
    error: string,
    isLoading: boolean,
    onReset: ()=>void
}

const WeatherContext = createContext<WeatherContextType | null>(null);

export const WeatherPrvider = ({ children }:{ children: ReactNode }) => {

    const weatherSet:LocalItem = { location:{id:-1, latitude:-1, longitude:-1, address_main:'', address_sub:'', type:-1},  currentWeather: {time:'', item:{['']:''}}, hourlyWeather:[], min:'-1', max:'-1'}
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [allWeather, setAllWeather] = useState<LocalItem[]>([]);
    const { allLocations, } = useLocation();
    const [reset, setReset] = useState(false);

    useEffect(() => {
        GetAllWeather();
    },[allLocations])

    useEffect(() => {
        if(reset === false) return;

        GetAllWeather();
        setReset(false);
    },[reset])

    const GetAllWeather = async () => {
        setIsLoading(true);

        if(allLocations.length === 0){
            setAllWeather([]);
            setIsLoading(false);
            return;
        }

        const userLocationsWeather = await Promise.all(
            allLocations.map(location => GetWeatherItem(location)) // ✨ 각 location에 0을 추가 인자로 전달
        );

        if(userLocationsWeather){
            const userItem: LocalItem[] = userLocationsWeather.filter((value)=>value !== null);
            setAllWeather(userItem); // 유효한 데이터만 저장
        }

        setIsLoading(false);
    }

    const GetWeatherItem = async (location:any) => {
        // 위도와 경도가 없으면 실행하지 않음
        if (!location.latitude || !location.longitude) return null;

        try {
            const { x, y } = ConverterToXY(location.latitude, location.longitude);
            const {current, hourly} = await WeatherAPI(x, y);

            if(current && hourly){
                // // 최대값 구하기
                // const max = hourly.reduce((prev, curr) => {const a = prev.category});
                // // 최저값 구하기
                // const min = hourly.reduce((prev, curr) => (prev.tempValue < curr.tempValue ? prev : curr));

                const local:LocalItem = { location:location,  currentWeather: current, hourlyWeather:hourly, min:'0', max:'0'}
                // setWeather(local);
                setError('');
                return local;
            }

            setError('');
            return weatherSet;

        } catch (err) {

            console.log('날씨 정보 가져오기 실패:', err);
            setError('서버 연결 오류');
            return weatherSet;

        }
    };

    const onReset=()=>{
        setReset(true);
    }

    const value = { allWeather, error, isLoading, onReset};

    return (
        <WeatherContext.Provider value={value}>
            {children}
        </WeatherContext.Provider>
    );
}

export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (context === null) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};