import Toast from 'react-native-toast-message';

export const NetErrorToast = (error: string) => {
    return Toast.show({type: 'error', text1: error, position: 'bottom'});
}