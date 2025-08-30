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

function SearchScreen({navigation}: {navigation: any}) {

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
        const search = async() => {
            const data = await SearchAPI(inputKeyWord);

            if(data !== '검색 실패'){
                setSearchLocations(data);
            }
        }

        search();
    },[inputKeyWord]);

    const searchBtn = async() => {
        const data = await SearchAPI(inputKeyWord);

        if(data !== '검색 실패'){
            setSearchLocations(data);
        }
        else{NetErrorToast(data);}
    }

    const locationList = () => {
        const listItem = (local:LocationType) => {

            return(
                <View>
                    <TouchableOpacity disabled={local.type === 1 ? true : false} onPress={() => { setTitle('삭제'); setLocation(local); modalOpen();}}> 
                        <View style={{height:70, backgroundColor:'#DBEA8D', paddingVertical:10, paddingHorizontal:20, borderRadius:10}}>
                            <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
                                <Icon name={local.type === 0 ?'location-outline' : 'navigate-outline'} color={themeColor.text} size={20} style={{marginRight:20,}}/>
                                <View style={{flex:1,}}>
                                    <Text style={{fontSize:20, fontWeight:'bold'}} >{local.address_main}</Text>
                                    <Text style={{fontSize:15, fontWeight:'400'}} >{local.address_sub}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>  
            )
        }

        return (
            <FlatList
                data={allLocations}
                renderItem={({item}) => <View style={{marginBottom:7}}>{listItem(item)}</View>}
            />
        )
    }

    const searchList = () => {
        const listItem = (item:string) => {
            const newLocation = {id: -1, latitude: 0, longitude: 0, address_main:item, address_sub:'', type: 0 };

            return(
                <View style={{marginVertical:5}}>
                    <TouchableOpacity onPress={()=>{setTitle('추가'); setLocation(newLocation); modalOpen();}}>
                        <Text style={{color:themeColor.text}}>{item}</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View style={{flex:1, backgroundColor:themeColor.bottomModal, borderRadius:20, padding:20}}>
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
            <View style={{flex:1, backgroundColor: themeColor.background, justifyContent: 'center', alignItems:'center'}}>
                <ActivityIndicator style={{alignItems:'center'}} size="small" color="#cad48eff"/>
            </View>
        )
    }

    return (
        <View style={{flex:1, backgroundColor: themeColor.background, paddingTop:10 }}>
            <View style={{flex: 0.2, alignItems:'flex-end', justifyContent:'flex-end', marginRight:25,}}>
                <TouchableOpacity style={{ alignItems: 'center', padding:5, paddingRight:0}} onPress={() => navigation.goBack()}>
                    <Icon name={'chevron-forward'} color={themeColor.text} size={20} />
                </TouchableOpacity>
            </View>
            <View style={{flex:3, padding: 25,}}>
                <View style={{flex:0.5, justifyContent:'flex-end'}}>
                    <Text style={{fontSize:33, fontWeight:'bold', color:themeColor.text}}>검색</Text>
                </View>
                <View style={{flex:2, marginTop:30, }}>
                    <View style={{marginBottom:20, flexDirection:'row', }}>
                        <View style={{flex:1, backgroundColor:themeColor.bottomModal, borderRadius:20, paddingHorizontal:20, flexDirection:'row', alignItems: 'center'}}>
                            <Icon name={'search'} color={themeColor.text} size={20} />
                            <TextInput style={{flex:1, color:themeColor.text}} value={inputKeyWord} onChangeText={(value)=>setInputKeyWord(value)} onSubmitEditing={searchBtn}></TextInput>
                        </View>
                        {inputKeyWord !== '' ? 
                            <TouchableOpacity style={{justifyContent:'center', backgroundColor:'#DBEA8D', borderRadius:18,margin:3, marginLeft:8, paddingHorizontal:8,}} onPress={searchCancle}>
                                <Text style={{textAlign:'center'}}>취소</Text>
                            </TouchableOpacity> 
                            : null}
                        
                    </View>
                    <View style={{flex:1}}>
                        { inputKeyWord === '' ? locationList() : searchList() }
                    </View>
                </View>
            </View>
            <Toast/>
            <BasicModal isVisible={isModalVisible} title={title} location={location} onClose={modalClose} onOk={title === '추가'? addLocationEvent : deleteLocationEvent}/>
        </View>
    )
}

export default SearchScreen;