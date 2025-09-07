import axios from 'axios';
import { WeatherForcastItem,TimeItem  } from '../types/WetherItem';
import { Alert } from 'react-native';

export function WeatherAPI (dx: number, dy: number) {

    // Alert.alert(`API dx: ${dx}, dy: ${dy}`);

    const SERVICEKEY = 'Zw5PZi5jkTheyqiwlrSwO%2Br8qi8nK90qqYKz2Am7m9usYgGFIEcY26pgB%2BYgEvXeSb2w4UyF0avYYkVDVd9QSA%3D%3D';
    const ENDPONINT = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const getBaseDateTime = () => {
        const baseTimesInMinutes = [2*60+10, 5*60+10, 8*60+10, 11*60+10, 14*60+10, 17*60+10, 20*60+10, 23*60+10];
        const currentMinute = hours * 60 + minutes;
        // console.log('hours: '+hours);
        // console.log('currentMinuteOfDay: '+currentMinute);

        let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
        let baseTime = '2300'; // 기본값은 전날 23시

        if (currentMinute < baseTimesInMinutes[0]) {
            const yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);
            baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
        }
        else{
            for (const time of baseTimesInMinutes) {
                if (currentMinute >= time) {
                    baseTime = `${Math.floor(time / 60)}00`.padStart(4, '0');
                }
            }
        }

        return { baseDate, baseTime, currentMinute };
    }

    function getCurrentBaseDateTime() {        
        let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
        let baseHour = hours;

        // 현재 시각이 10분 이전이면 1시간 전의 데이터를 사용
        if (minutes < 10) {
            baseHour = (hours - 1 + 24) % 24;
        }

        // 만약 계산된 시간이 전날이라면 base_date를 전날로 설정
        if (baseHour > hours) {
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
        }

        const baseTime = `${baseHour.toString().padStart(2, '0')}00`;

        return { baseDate, baseTime };
    }

    const currentWeather = async() => {
        try{

            const {baseDate, baseTime} = getCurrentBaseDateTime();
            console.log(`baseDate: ${baseDate}, baseTime: ${baseTime}`);

            const url = `${ENDPONINT}/getUltraSrtNcst?serviceKey=${SERVICEKEY}&pageNo=1&numOfRows=200&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${dx}&ny=${dy}`;
            
            const response = await axios.get(url);
            const data = response.data.response.body.items.item;

            console.log('data',data);

            const transformToTimeItem = (data: any[]): TimeItem => {
                if (data.length === 0) {
                    return { time: '', item: {} };
                }

                // 1. time 값 추출 (모든 항목의 baseTime은 동일)
                const timeValue = data[0].baseTime;
                
                // 2. item 객체에 모든 카테고리/값 쌍을 담습니다.
                const itemObject = {};
                data.forEach(item => {
                    itemObject[item.category] = item.obsrValue; // 동적 키를 사용하여 값을 추가
                });

                // 3. 최종 TimeItem 객체 반환
                return {
                    time: timeValue,
                    item: itemObject,
                };
            };
            const finalData = transformToTimeItem(data);

            console.log('current finalData',finalData);

            return finalData;

        }catch(err){

        }
    }

    const hourlyWeather = async() => {
        try {
            const {baseDate, baseTime, currentMinute} = getBaseDateTime();

            // console.log(`baseDate: ${baseDate}, baseTime: ${baseTime}, currentMinute: ${currentMinute}`);

            const url = `${ENDPONINT}/getVilageFcst?serviceKey=${SERVICEKEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${dx}&ny=${dy}`;
            const response = await axios.get(url);
            const data = response.data.response.body.items.item;

            const transformForecastData = (data: any[]): WeatherForcastItem[] => {
                // A temporary object to group data first by date, then by time.
                const groupedByDate = {};

                data.forEach(item => {
                    const { fcstDate, fcstTime, category, fcstValue } = item;

                    // Create a new date group if it doesn't exist.
                    if (!groupedByDate[fcstDate]) {
                    groupedByDate[fcstDate] = {};
                    }

                    // Create a new time group within the date group if it doesn't exist.
                    if (!groupedByDate[fcstDate][fcstTime]) {
                    groupedByDate[fcstDate][fcstTime] = {};
                    }

                    // Add the category and value to the appropriate time group.
                    groupedByDate[fcstDate][fcstTime][category] = fcstValue;
                });

                // Convert the grouped object into the final array of WeatherForcastItem.
                const finalData: WeatherForcastItem[] = Object.keys(groupedByDate).map(dateKey => {
                    const timeValues: TimeItem[] = Object.keys(groupedByDate[dateKey]).map(timeKey => {
                    return {
                        time: timeKey,
                        item: groupedByDate[dateKey][timeKey],
                    };
                    });

                    return {
                    date: dateKey,
                    values: timeValues,
                    };
                });

                return finalData;
                };

            const finalData = transformForecastData(data);

            console.log('hourly finalData',finalData);

            return finalData;

        } catch (e) {
            console.error(e);
        }
    }

    const dayWeather = async() =>{
        const hourly = await hourlyWeather();
        const current = await currentWeather();        

        return {current, hourly};
    }

    return dayWeather();
}

export function DayWeather() {

}