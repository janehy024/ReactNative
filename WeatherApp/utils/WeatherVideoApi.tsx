import axios from 'axios';
// import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
// import RNFS from 'react-native-fs';

function WeatherVideoApi() {

    const SERVICEKEY = 'Zw5PZi5jkTheyqiwlrSwO%2Br8qi8nK90qqYKz2Am7m9usYgGFIEcY26pgB%2BYgEvXeSb2w4UyF0avYYkVDVd9QSA%3D%3D';
    const ENDPONINT = 'https://apis.data.go.kr/1360000/SatlitImgInfoService';

    const now = new Date();
    const baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');

    const getImages = async() => {
        try {
            const url = `${ENDPONINT}/getInsightSatlit?serviceKey=${SERVICEKEY}&pageNo=1&numOfRows=10&dataType=json&sat=G2&data=rgbt&area=ko&time=${baseDate}`;
            const response = await axios.get(url);
            const data = response.data.response.body.items.item;
            
            // 1. satImgC-file 키의 문자열 값을 가져옵니다.
            const imageUrlsString = data[0]['satImgC-file'];

            // 2. 쉼표(,)를 기준으로 문자열을 분리하여 URL 배열을 만듭니다.
            const imageUrls = imageUrlsString.split(',');
            const images = imageUrls.map((item:any) => item.replace(/[\[\]\s']/g, ''));
            
            return images;

        } catch (e) {
            console.error(e);
        }
    }

    return getImages();
}

export default WeatherVideoApi;