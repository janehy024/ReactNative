import { TimeItem } from "../types/WetherItem";

export const SkyIcon = (item:TimeItem) =>{
    const time = Number(item.time);
    const sky = Number(item.item['SKY']);
    const pty = Number(item.item['PTY']);

    if(pty === 0){
        if(time >= 1900){
            if(sky === 1) return require('../assets/video_btn_icon.png');
            else if(sky === 3) return require('../assets/video_btn_icon.png');
            else return require('../assets/video_btn_icon.png');
        }

        else{
            if(sky === 1) return require('../assets/video_btn_icon.png');
            else if(sky === 3) return require('../assets/video_btn_icon.png');
            else return require('../assets/video_btn_icon.png');
        }
    }
    else if(pty === 1) return require('../assets/video_btn_icon.png')
    else if(pty === 2) return require('../assets/video_btn_icon.png')
    else if(pty === 3) return require('../assets/video_btn_icon.png')
    else return require('../assets/video_btn_icon.png')
}

export const getDayString = (dayNumber: number) => {
    switch(dayNumber){
        case 0: return '일'; break;
        case 1: return '월'; break;
        case 2: return '화'; break;
        case 3: return '수'; break;
        case 4: return '목'; break;
        case 5: return '금'; break;
        case 6: return '토'; break;
    }
}