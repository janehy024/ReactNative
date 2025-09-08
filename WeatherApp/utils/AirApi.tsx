import axios from 'axios';
import { AirItem } from '../types/WetherItem';

function AirApi(main:string) {

    const SERVICEKEY = 'Zw5PZi5jkTheyqiwlrSwO%2Br8qi8nK90qqYKz2Am7m9usYgGFIEcY26pgB%2BYgEvXeSb2w4UyF0avYYkVDVd9QSA%3D%3D';
    const ENDPONINT = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc';
    const sidoName = main.substring(0, 2);

    const getImages = async() => {
        var airData = {pm10Value:-1, pm25Value:-1, o3Value: -1};
        
        try {
            const url = `${ENDPONINT}/getCtprvnRltmMesureDnsty?serviceKey=${SERVICEKEY}&returnType=json&numOfRows=100&pageNo=1&sidoName=${sidoName}&ver=1.0`;
            const response = await axios.get(url);
            const data = response.data.response.body.items;

            const {pm10Value, pm25Value, o3Value} = data[0];

            airData = {pm10Value, pm25Value, o3Value};

        } catch (e) {
            console.error(e);
        }

        return airData;
    }

    return getImages();
}

export default AirApi;