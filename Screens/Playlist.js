import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Alert } from 'react-native';
import { TextInput, Card, Button, Title } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../config.json';
import LocalStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'react-native-loading-spinner-overlay';

const window = Dimensions.get("window");

export default function Login({ navigation }) {
    var [name, setName] = useState(null);

    var [jwt, setJwt] = useState("veri gelmedi!");

    const dispatch = useDispatch();
    const playlistId = useSelector(state => {
        return state.playlistIdReducer;
    });

    useEffect(() => {
        LocalStorage.getItem("jwt")
            .then((getedJwt) => {
                console.log(getedJwt);
                setJwt(getedJwt);

            })

    }, [])

    const SendApi = () => {
        axios.post(`${API_URL}/playlist/create`, { playlistName: name }, {
            headers: {
                "Authorization": "Bearer " + jwt
            }
        }).then((res) => {
            console.log(res.data);
            alert("başarılı. ");

        }).catch((err) => alert(err))


    }

    return (
        <>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} >
                <Card style={{ width: (window.width / 100) * 80 }} >
                    <Card.Content>
                        <Text style={{ color: 'white' }}>ID: {playlistId}</Text>
                    </Card.Content>


                </Card>

            </View>
        </>
    );
}