import axios from 'axios';
// import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
// import RNFS from 'react-native-fs';

function WeatherVideoApi() {

    const SERVICEKEY = 'Zw5PZi5jkTheyqiwlrSwO%2Br8qi8nK90qqYKz2Am7m9usYgGFIEcY26pgB%2BYgEvXeSb2w4UyF0avYYkVDVd9QSA%3D%3D';
    const ENDPONINT = '	https://apis.data.go.kr/1360000/SatlitImgInfoService';

//  pageNo=1&numOfRows=10&dataType=json&sat=G2&data=rgbt&area=ko&time=20250907
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

    // const createVideoFromImages = async (imageUrls:[]) => {
    //     // 1. 임시 디렉토리 생성
    //     const tempDir = `${RNFS.DocumentDirectoryPath}/temp_images`;
    //     await RNFS.mkdir(tempDir);

    //     // 2. 모든 이미지를 순차적으로 다운로드
    //     // 파일명을 'frame_001.png', 'frame_002.png' 형태로 저장합니다.
    //     // 이렇게 순차적인 파일명은 FFmpeg에서 동영상으로 만들기 쉽습니다.
    //     for (let i = 0; i < imageUrls.length; i++) {
    //         const filename = `frame_${String(i + 1).padStart(3, '0')}.png`;
    //         const path = `${tempDir}/${filename}`;
            
    //         try {
    //             await RNFS.downloadFile({
    //                 fromUrl: imageUrls[i],
    //                 toFile: path,
    //             }).promise;
    //             } catch (error) {
    //             console.error(`이미지 다운로드 실패: ${imageUrls[i]}`);
    //             return null;
    //         }
    //     }

    //     // 3. FFmpeg 명령어 구성
    //     const videoOutputPath = `${RNFS.DocumentDirectoryPath}/satellite_video.mp4`;
    //     const ffmpegCommand = `-framerate 15 -i ${tempDir}/frame_%03d.png -c:v libx264 -pix_fmt yuv420p ${videoOutputPath}`;
        
    //     console.log(`FFmpeg 명령어: ${ffmpegCommand}`);

    //     // 4. FFmpeg 명령어 실행
    //     try {
    //         const session = await FFmpegKit.execute(ffmpegCommand);
    //         const returnCode = await session.getReturnCode();

    //         if (ReturnCode.isSuccess(returnCode)) {
    //         console.log('✅ 동영상 생성 성공!');
    //         return videoOutputPath;
    //         } else {
    //         const output = await session.getOutput();
    //         console.error('❌ 동영상 생성 실패:', output);
    //         return null;
    //         }
    //     } catch (error) {
    //         console.error('FFmpeg 실행 중 오류 발생:', error);
    //         return null;
    //     }
    // };

    // const video = async() => {
    //     const images = await getImages();
    //     if(images)
    //         createVideoFromImages(images);
    // }

    // video();
    return getImages();
}

export default WeatherVideoApi;