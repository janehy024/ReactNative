import React, { useEffect, useState } from "react";
import { Modal, Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { LocationType } from "../types/WetherItem";

function BasicModalComponent({isVisible, title, location, onClose, onOk}:{isVisible:boolean, title:string, location:LocationType, onClose: () => void, onOk: () => void,}) {

    return(
       <Modal animationType='fade' visible={isVisible} transparent={true} onRequestClose={() => onClose()}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={{fontWeight:'bold', textAlign:'left', marginBottom:15, fontSize:15}}>{title}</Text>
                    <Text style={{textAlign:'left', marginBottom:20}}>{location.address_main} {location.address_sub}을(를) {title}하시겠습니까?</Text>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={() => onOk()} style={styles.okBtn}>
                            <Text style={{color:'white'}}>확인</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onClose()} style={styles.cancelBtn}>
                            <Text>취소</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent:'center',
        alignContent: "center",
        textAlignVertical: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },

    modalView: {
        justifyContent:'center',
        margin: 30,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    okBtn: {
        backgroundColor: '#35568C', 
        padding:10, 
        borderRadius:10, 
        flex: 1, 
        marginRight:7, 
        alignItems:'center',
    },

    cancelBtn: {
        backgroundColor: '#d1d1d1ff', 
        padding:10, 
        borderRadius:10, 
        flex: 1, 
        marginLeft:7,
        alignItems:'center',
    }
})

const BasicModal = React.memo(BasicModalComponent);

export default BasicModal;