import axios from 'axios';

const REST_API_KEY = '0aab3373a1dd9a994e251be9a15d28a6';

export async function ReverseGeocodingAPI(latitude:number, longitude:number) {
    
      // 1. 카카오 로컬 API URL 생성
    const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}&input_coord=WGS84`;
  

    var main = '';
    var sub = '';
    try {
        const response = await axios.get(url, {
        // 1. 헤더 설정: 인증 키를 Authorization 헤더에 포함
            headers: {
                Authorization: `KakaoAK ${REST_API_KEY}`
            }
            // 2. 파라미터 설정: URL 쿼리 파라미터로 전달할 값들
        });

        console.log(response.data.documents[0].address.region_1depth_name);

        const data = response.data;

        if (data.documents && data.documents.length > 0) {
            main = data.documents[0].address.region_1depth_name;
            sub = data.documents[0].address.region_2depth_name + ' ' + data.documents[0].address.region_3depth_name
            console.log('2: ' +  data.documents[0].address.region_2depth_name)
            console.log('3: ' +  data.documents[0].address.region_3depth_name)
        }
        
    } catch (error) {
        // 오류 처리
        console.error('API 호출 중 오류 발생:', error);
    }finally{
        return {main, sub};
    }
}

export async function GeocodingAPI(address:string) {
    
      // 1. 카카오 로컬 API URL 생성
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${address}`;
    var longitude = 0;
    var latitude = 0;
  
    try {
        const response = await axios.get(url, {
        // 1. 헤더 설정: 인증 키를 Authorization 헤더에 포함
            headers: {
                Authorization: `KakaoAK ${REST_API_KEY}`
            }
            // 2. 파라미터 설정: URL 쿼리 파라미터로 전달할 값들
        });

        const data = response.data;

        if (data.documents && data.documents.length > 0) {
          longitude = response.data.documents[0].x;
          latitude = response.data.documents[0].y;
          console.log(longitude);
          console.log(latitude);
        }

    } catch (error) {
        // 오류 처리
        console.error('API 호출 중 오류 발생:', error);

    } finally{

      return { longitude, latitude };
    }
}

export async function SearchAPI(keyword:string) {

    const SERVICEKEY = 'Zw5PZi5jkTheyqiwlrSwO%2Br8qi8nK90qqYKz2Am7m9usYgGFIEcY26pgB%2BYgEvXeSb2w4UyF0avYYkVDVd9QSA%3D%3D';
    const ENDPONINT = 'https://apis.data.go.kr/1741000/StanReginCd';
    const url = `${ENDPONINT}/getStanReginCdList?serviceKey=${SERVICEKEY}&pageNo=1&numOfRows=10&type=json&locatadd_nm=${keyword}`;

    try {
      const response = await axios.get(url);

      const data = response.data.StanReginCd[1].row;
      console.log(data);

      const locations: string[] = data.map((data:any) => data.locatadd_nm);
      console.log(locations);

      return locations;

      } catch (error: any) {
        console.log('자동완성 검색 실패:', error.response?.status, error.message);
        return '검색 실패';
      }
}