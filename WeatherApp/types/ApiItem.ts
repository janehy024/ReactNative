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

export interface ReportItem{
    other:string,
    t6:string,
    t7: string,
    tmEf: string,
    tmFc: number,
    tmSeq: number
}