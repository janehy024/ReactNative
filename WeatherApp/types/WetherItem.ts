export interface TimeItem{
    time: string,
    item: {[key: string]: string}
}

export interface WeatherForcastItem{
    date: string,
    values: TimeItem[]
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
    // min: string,
    // max: string,
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