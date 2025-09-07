import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Keyboard, ActivityIndicator } from 'react-native';
import { useTheme } from "../hooks/useTheme";
import { SearchAPI } from "../utils/GeocodingApi";
import BasicModal from "../components/LocationModal";
import { useModal } from "../hooks/useModal";
import { LocalItem, LocationType } from "../types/WetherItem";
import Toast from "react-native-toast-message";
import { NetErrorToast } from "../components/ErrorToast";
import Icon from "react-native-vector-icons/Ionicons";
import { useLocation } from "../hooks/useLocation";

function SearchScreen() {

    const { allLocations, loading:locationLoading, error:locationError, addLocation, deleteLocation } = useLocation();
    const { themeColor } = useTheme();

    const [searchLocations, setSearchLocations] = useState<string[]>([]);
    const [inputKeyWord, setInputKeyWord] = useState('');

    const {isModalVisible, modalOpen, modalClose}=useModal();
    const [title, setTitle] = useState('');

    const [location, setLocation] = useState<LocationType>({id: -1, latitude: 0, longitude: 0, address_main:'', address_sub:'', type: 0 });

    useEffect(() => {
        if(locationError === '')
            return;

        NetErrorToast(locationError);
    },[locationError]);

    useEffect(() => {
        if(inputKeyWord === '')
            return;

        const search = async() => {
            const data = await SearchAPI(inputKeyWord);

            if(data !== '검색 실패'){
                setSearchLocations(data);
            }
        }

        search();
    },[inputKeyWord]);

    const searchBtn = async() => {

        if(inputKeyWord === ''){
            setSearchLocations([]);
            return;
        }
            
        const data = await SearchAPI(inputKeyWord);

        if(data !== '검색 실패'){
            setSearchLocations(data);
        }
        else{NetErrorToast(data);}
    }

    const searchList = () => {
        const listItem = (item:string) => {
            const newLocation = {id: -1, latitude: 0, longitude: 0, address_main:item, address_sub:'', type: 0 };

            return(
                <View style={{}}>
                    <TouchableOpacity onPress={()=>{setTitle('추가'); setLocation(newLocation); modalOpen();}} style={{paddingVertical:13,}}>
                        <Text style={{color:themeColor.text}}>{item}</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View style={{flex:1, paddingHorizontal:5}}>
                <FlatList 
                    data={searchLocations}
                    renderItem={({item}) => listItem(item)}
                />
            </View>
        )
    }

    const searchCancle = () => {
        setInputKeyWord(''); setSearchLocations([]); Keyboard.dismiss();
    }

    const addLocationEvent = () => {
        addLocation(location.address_main);
        modalClose();
        searchCancle();
    }

    const deleteLocationEvent = () => {
        deleteLocation(location);
        modalClose();
    }

    if(locationLoading){
        return(
            <View style={{flex:1, backgroundColor: themeColor.mainBackground, justifyContent: 'center', alignItems:'center'}}>
                <ActivityIndicator style={{alignItems:'center'}} size="small" color="#cad48eff"/>
            </View>
        )
    }

    return (
        <View style={{flex:1, backgroundColor: themeColor.mainBackground,}}>
            <View style={{flex:1, padding: 15}}>
                <View style={{marginBottom:10, flexDirection:'row', }}>
                    <View style={[styles.searchBar,{backgroundColor:themeColor.searchBarColor}]}>
                        <Icon name={'search'} color={themeColor.text} size={20} />
                        <TextInput style={{flex:1, color:themeColor.text}} value={inputKeyWord} onChangeText={(value)=>setInputKeyWord(value)} onSubmitEditing={searchBtn}></TextInput>
                    </View>
                    {inputKeyWord !== '' ? 
                        <TouchableOpacity style={{justifyContent:'center', backgroundColor:'#2e3341ff', borderRadius:10, marginRight:3, marginLeft:5, paddingHorizontal:8,}} onPress={searchCancle}>
                            <Text style={{textAlign:'center', color:'white'}}>취소</Text>
                        </TouchableOpacity> 
                        : null}
                </View>
                <View style={{flex:1}}>
                    {searchList()}
                </View>
            </View>
            <Toast/>
            <BasicModal isVisible={isModalVisible} title={title} location={location} onClose={modalClose} onOk={title === '추가'? addLocationEvent : deleteLocationEvent}/>
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        flex:1,
        borderRadius:3, 
        paddingHorizontal:20, 
        flexDirection:'row', 
        alignItems: 'center'
    },
});

export default SearchScreen;