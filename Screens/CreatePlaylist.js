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
    const userId = useSelector(state => {
        return state;
    });

    useEffect(() => {
        LocalStorage.getItem("jwt")
            .then((getedJwt) => {
                console.log(getedJwt);
                setJwt(getedJwt);

            })

    }, [])

    const SendApi = () => {
        navigation.navigate("MyPlaylists");

        axios.post(`${API_URL}/playlist/create`, { playlistName: name }, {
            headers: {
                "Authorization": "Bearer " + jwt
            }
        }).then((res) => {
            console.log(res.data);

        }).catch((err) => alert(err))
        

    }

    return (
        <>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} >
                <Card style={{ width: (window.width / 100) * 80 }} >
                    <Card.Content>
                        <View>
                            <Button color="black" color="white">Playlist oluşturun!</Button>

                            <TextInput label="Name" autoCapitalize='none' autoCompleteType='tel' keyboardType="default" value={name} onChangeText={(value) => { setName(value) }} />
                            <Button onPress={SendApi} color="red" style={{ backgroundColor: 'black' }} >Oluştur</Button>

                        </View>
                    </Card.Content>


                </Card>

            </View>
        </>
    );
}