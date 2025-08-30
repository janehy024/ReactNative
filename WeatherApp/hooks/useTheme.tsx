// ThemeContext.ts
import { useState, createContext, useContext, ReactNode, useEffect, useCallback  } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeColorType {
    background: string;
    text: string;
    statusbar: string;
    bottomModal: string;
}

// Context가 제공할 값의 타입을 정의합니다.
interface ThemeContextType {
    themeMode: string;
    themeColor: ThemeColorType;
    setAppTheme: (mode:string) => void;
}

// createContext에 타입을 명시하고 기본값으로 null을 전달합니다.
const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemColorScheme = useColorScheme(); // 시스템 설정 감지
    const [themeMode, setThemeMode] = useState('시스템 설정 사용'); // 'light', 'dark', 'system'
    const [isDarkMode, setIsDarkMode] = useState(false);

    // themeMode와 systemColorScheme이 변경될 때마다 실제 다크모드 상태를 업데이트
    useEffect(() => {
        if (themeMode === '시스템 설정 사용') {
            setIsDarkMode(systemColorScheme === 'dark');
        } else {
            setIsDarkMode(themeMode === '다크 모드');
        }
    }, [themeMode, systemColorScheme]);

    const themeColor: ThemeColorType = {
        background: isDarkMode? '#1f2018ff' : '#EDEFE3' ,
        text: isDarkMode? 'white' : 'black',
        statusbar: isDarkMode? 'light-content' : 'dark-content',
        bottomModal: isDarkMode? 'black' : 'white',
    }

    const setAppTheme = useCallback(async(mode:string) => {
        setThemeMode(mode);

        try {
            await AsyncStorage.setItem('themeMode', mode);
            
        } catch (e) {
            throw e;
        }
    },[]);

    const value = {
        themeMode, // 현재 설정된 테마 모드
        themeColor,
        setAppTheme, // 테마 모드를 변경하는 함수
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};