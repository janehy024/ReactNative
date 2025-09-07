import React,{useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert,Animated,Dimensions,Modal,ScrollView,Switch } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"; // 아이콘 라이브러리
import ThemeModal from '../components/ThemeModal';
import { useModal } from "../hooks/useModal";
import { useLocation } from "../hooks/useLocation";
import { useTheme } from '../hooks/useTheme';

// 설정 모달 컴포넌트
function SettingModal({ visible, onClose, navigation }:{ visible:boolean, onClose:()=>void, navigation:any }) {

    const { width: SCREEN_WIDTH } = Dimensions.get('window');
    const { themeColor, themeMode } = useTheme();

    const [notifications, setNotifications] = useState(true);
    const [slideAnim] = useState(new Animated.Value(SCREEN_WIDTH));
    const { isModalVisible, modalOpen, modalClose } = useModal();

    const {allLocations} = useLocation();

    const currentLocation = allLocations.find((item)=>item.type === 1);
    const addLocation = allLocations.filter((item)=>item.type !== 1);

    useEffect(() => {
        slideAnim.setValue(SCREEN_WIDTH);

        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
        Animated.timing(slideAnim, {
            toValue: SCREEN_WIDTH,
            duration: 300,
            useNativeDriver: true,
        }).start();
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent={true} animationType="none" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={onClose}/>
                <Animated.View 
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateX: slideAnim }], backgroundColor:themeColor.madalButtonColor }
                    ]}
                    >
                    <View style={[styles.modalHeader, {backgroundColor:themeColor.modalBackground, borderColor:themeColor.modalBorderColor}]}>
                        <Text style={[styles.modalTitle,{color:themeColor.text}]}>더보기</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={23} color={themeColor.modalIconColor} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <View style={styles.settingSection}>
                            <Text style={[styles.sectionTitle,{color:themeColor.text}]}>위치</Text>
                            
                            <TouchableOpacity style={[styles.settingItem, {backgroundColor:themeColor.modalBackground}]} onPress={()=>{navigation.navigate('search'); onClose();}}>
                                <Ionicons name="add" size={20} color="#007AFF" />
                                <Text style={[styles.settingLabel, {marginLeft:20, color:themeColor.text}]}>위치 추가</Text>
                            </TouchableOpacity>
                            
                            <View style={[styles.settingItem, {justifyContent:'flex-start', backgroundColor:themeColor.modalBackground}]}>
                                <Ionicons name="home-outline" size={20} color={themeColor.modalIconColor} />
                                <Text style={[styles.locationText,{marginLeft:20, color:themeColor.modalIconColor}]}>{currentLocation ? currentLocation.address_main+' '+currentLocation.address_sub  : ''}</Text>
                            </View>

                            {addLocation.map((item,index)=>(
                                <View key={index} style={[styles.settingItem, {justifyContent:'flex-start', backgroundColor:themeColor.modalBackground}]}>
                                    <Ionicons name="location-outline" size={20} color={themeColor.modalIconColor} />
                                    <Text style={[styles.locationText,{marginLeft:20, color:themeColor.modalIconColor}]}>{item ? item.address_main+' '+item.address_sub  : ''}</Text>
                                </View>))}
                        </View>

                        <View style={styles.settingSection}>
                            <Text style={[styles.sectionTitle,{color:themeColor.text}]}>설정</Text>
                            
                            <TouchableOpacity style={[styles.settingItem, , {backgroundColor:themeColor.modalBackground}]} onPress={()=>{modalOpen();}}>
                                <Text style={[styles.settingLabel,{color:themeColor.text}]}>테마 모드</Text>
                                <View style={styles.themeInfo}>
                                  <Text style={[styles.locationText,,{color:themeColor.modalIconColor}]}>{themeMode}</Text>
                                  <Ionicons name="chevron-forward" size={24} color={themeColor.modalIconColor} />
                                </View>
                            </TouchableOpacity>

                            <View style={[styles.settingItem, , {backgroundColor:themeColor.modalBackground}]}>
                                <Text style={[styles.settingLabel,{color:themeColor.text}]}>날씨 알림</Text>
                                <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: '#767577', true: '#007AFF' }}
                                thumbColor={notifications ? '#fff' : '#f4f3f4'}
                                />
                            </View>
                        </View>
                        {/* <View style={styles.settingSection}>
                            <Text style={styles.sectionTitle}>정보</Text>
                            
                            <TouchableOpacity style={styles.settingItem}>
                                <Text style={styles.settingLabel}>개인정보 처리방침</Text>
                                <Ionicons name="chevron-forward" size={24} color="#666" />
                            </TouchableOpacity>
                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>앱 버전</Text>
                                <Text style={styles.versionText}>1.0.0</Text>
                            </View>
                        </View> */}
                    </ScrollView>
                </Animated.View>
            </View>
            <ThemeModal isVisible={isModalVisible} onModalClose={modalClose}/>
        </Modal>
    );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  settingSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#666',
    marginRight: 8,
  },
  versionText: {
    color: '#666',
    fontSize: 14,
  },
});

export default SettingModal;