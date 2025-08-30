import axios from 'axios';
import { HourlyWeatherItem, CurrentyWeatherItem, WeatherForcastItem,CategoryForcastItem  } from '../types/WetherItem';
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

            // 1단계: 날짜(baseDate)와 카테고리(category)별로 데이터를 그룹화
            const groupedData = data.reduce((acc, item) => {
                const { baseDate, category, baseTime, obsrValue } = item;

                // 날짜별 그룹 생성
                if (!acc[baseDate]) {
                    acc[baseDate] = {};
                }
                // 카테고리별 그룹 생성
                if (!acc[baseDate][category]) {
                    acc[baseDate][category] = [];
                }

                // CategoryForcastItem 객체를 만들어서 추가
                acc[baseDate][category].push({
                    time: Number(baseTime),
                    value: obsrValue,
                });
                return acc;
            }, {});

            // 2단계: 그룹화된 데이터를 최종 배열로 변환
            const finalResult: WeatherForcastItem[] = [];

            Object.entries(groupedData).forEach(([date, categories]) => {
                Object.entries(categories).forEach(([category, values]) => {
                    finalResult.push({
                        date: date,
                        category: category,
                        values: values as CategoryForcastItem[],
                    });
                });
            });
            console.log('current finalResult: ', finalResult);

            return finalResult;

            // console.log('response: ',data);

            // const temperature = data.find(item => (item.category === 'T1H'));

            // if(temperature){
            //     const cur: weatherItem = {type:0, time: Number(temperature.baseTime), tempValue: temperature.obsrValue}

            //     console.log('cur: ',cur.tempValue);

            //     return cur;
            // }

            // return weatherData;
            // console.log('weatherData: ',weatherData);

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

            const groupedData = data.reduce((acc, item) => {
                const { fcstDate, category, fcstTime, fcstValue } = item;

                // 날짜별 그룹 생성
                if (!acc[fcstDate]) {
                    acc[fcstDate] = {};
                }
                // 카테고리별 그룹 생성
                if (!acc[fcstDate][category]) {
                    acc[fcstDate][category] = [];
                }

                // CategoryForcastItem 객체를 만들어서 추가
                acc[fcstDate][category].push({
                    time: Number(fcstTime),
                    value: fcstValue,
                });
                return acc;
            }, {});

            // 2단계: 그룹화된 데이터를 WeatherForcatItem 배열로 변환
            const finalResult: WeatherForcastItem[] = [];

            Object.entries(groupedData).forEach(([date, categories]) => {
                Object.entries(categories).forEach(([category, values]) => {
                    finalResult.push({
                        date: date,
                        category: category,
                        values: values as CategoryForcastItem[],
                    });
                });
            });
            console.log('hourly finalResult: ', finalResult);

            // const temperatures = data.filter(item => (item.category === 'TMP' && !((item.fcstTime / 100 * 60) < currentMinute && (item.fcstDate === baseDate))));
            // const hourly:weatherItem[] = temperatures.map((item) =>
            //     ({ type: 1, time: item.fcstTime, tempValue: item.fcstValue})
            //     // (console.log(index + '번 temperatures: '+item.category + ' ,' + item.fcstValue + ' ,' + item.fcstTime))
            // )
            // console.log('hourly: ',hourly);

            return finalResult;

        } catch (e) {
            console.error(e);
        }
    }

    const dayWeather = async() =>{
        const hourly = await hourlyWeather();
        const current = await currentWeather();        

        // if(current && hourly){
        //     const value: weatherItem[] = [current, ...hourly];
        //     return value;
        // }

        // else
            return {current, hourly};
    }

    return dayWeather();
}

export function DayWeather() {

}