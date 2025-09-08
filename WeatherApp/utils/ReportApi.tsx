import axios from 'axios';

function ReportApi() {

    const SERVICEKEY = 'Zw5PZi5jkTheyqiwlrSwO%2Br8qi8nK90qqYKz2Am7m9usYgGFIEcY26pgB%2BYgEvXeSb2w4UyF0avYYkVDVd9QSA%3D%3D';
    const ENDPONINT = 'https://apis.data.go.kr/1360000/WthrWrnInfoService';

    const getImages = async() => {        
        try {
            const url = `${ENDPONINT}/getPwnStatus?serviceKey=${SERVICEKEY}&pageNo=1&numOfRows=10&dataType=JSON`;
            const response = await axios.get(url);
            const data = response.data.response.body.items.item[0];

            console.log('report data: ', data);
            return data;

        } catch (e) {
            console.error(e);
            return '';
        }
    }

    return getImages();
}

export default ReportApi;