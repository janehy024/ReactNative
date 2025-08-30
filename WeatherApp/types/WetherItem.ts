export interface WeatherForcastItem{
    // [x: string]: any
    date: string,
    category: string,
    values: CategoryForcastItem[]
}

export interface CategoryForcastItem{
    time:number,
    value: string
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
    currentWeather: WeatherForcastItem[],
    hourlyWeather: WeatherForcastItem[],
    min: string,
    max: string,
}

export interface HourlyWeatherItem {
    baseDate: string,
    baseTime: string,
    category: string,
    fcstDate: string,
    fcstTime: number,
    fcstValue: string,
    nx: number,
    ny: number,
}

export interface CurrentyWeatherItem {
    baseDate: string,
    baseTime: string,
    category: string,
    nx: number,
    ny: number,
    obsrValue: string,
}