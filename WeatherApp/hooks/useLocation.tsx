import React, { createContext, useContext, useState, useEffect,ReactNode } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { GeocodingAPI } from '../utils/GeocodingApi';
import { LocationType } from '../types/WetherItem';
import {ReverseGeocodingAPI} from "../utils/GeocodingApi";

interface LocationContextType {
    allLocations: LocationType[],
    addLocation: (address:string) => void,
    deleteLocation: (location:LocationType) => void,
    error: string,
    loading: boolean
}

const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider = ({ children }:{ children: ReactNode }) => {
    const [currentLocation, setCurrentLocation] = useState<LocationType>(); //현재 위치
    const [userLocations, setUserLocations] = useState<LocationType[]>([]); //사용자 추가 위치
    const [allLocations, setAllLocations] = useState<LocationType[]>([]); //사용자 추가 위치

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        setIsLoading(true);
    
        const updatedWeathers = [];
        if (currentLocation) {
            updatedWeathers.push(currentLocation);
        }
        updatedWeathers.push(...userLocations);
        setAllLocations(updatedWeathers);
        
        setIsLoading(false);

    },[currentLocation, userLocations]);

    useEffect(() => {
        setIsLoading(true);

        const watchId = Geolocation.watchPosition(
            (position) => {
                const getLocation = async() => {
                    console.log('position');
                    const { latitude, longitude } = position.coords;
                    const {main, sub} = await ReverseGeocodingAPI(latitude, longitude);
                    setCurrentLocation({id:0, latitude: latitude, longitude: longitude, address_main:main, address_sub:sub, type:1 })

                    setError('');
                }

                getLocation();
            },
            (err) => {
                setError(err.message);
            },
            {
                enableHighAccuracy: true,
            }
        );

        // 컴포넌트가 언마운트될 때 감시 중단
        return () => {
            Geolocation.clearWatch(watchId);
        };
        
    }, []);

    const addLocation = async(address:string) => {

        const { longitude, latitude } = await GeocodingAPI(address);
        const {main, sub} = await ReverseGeocodingAPI(latitude, longitude);

        const count = userLocations.length+1;
        console.log(count);

        const newLocation:LocationType = {id:count, latitude: latitude, longitude: longitude, address_main:main, address_sub:sub, type: 0 };
        setUserLocations((prevLocations) => [...prevLocations, newLocation]);
    };

    const deleteLocation = async(location:LocationType) => {

        const target = userLocations.filter((loc) => loc !== location);
        setUserLocations(target);
    };

    const value = { allLocations, addLocation, deleteLocation, error, loading: isLoading };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (context === null) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};