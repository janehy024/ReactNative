export interface TimeItem{
    time: string,
    item: {[key: string]: string}
}

export interface WeatherForcastItem{
    date: string,
    values: TimeItem[]
}

export interface AirItem{
    pm10Value:number,
    pm25Value:number,
    o3Value: number
}

export interface LocationType {
    id:number,
    latitude: number,
    longitude: number,
    address_main: string,
    address_sub: string,
    type: number,
}


export interface LocalItem {
    location: LocationType,
    currentWeather: TimeItem,
    hourlyWeather: WeatherForcastItem[],
    weekWeather: WeatherForcastItem[],
    air: AirItem,
}