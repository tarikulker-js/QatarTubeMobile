import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LocalStorage from '@react-native-async-storage/async-storage';

export default function Logout(){

    useEffect(() => {
        //console.log("editing... ");

        LocalStorage.setItem("jwt", "");
        LocalStorage.setItem("myid", "");
        
    });

    return(
        <View>
            <Text>Lütfen bekleyiniz... </Text>
        
        </View>
    )
}