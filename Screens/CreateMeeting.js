import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Alert, ScrollView } from 'react-native';
import { TextInput, Card, Button, Title } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../config.json';
import LocalStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import SelectInput from 'react-native-select-input-ios';

const window = Dimensions.get("window");

export default function Login({ navigation }) {
    var [meetingName, setMeetingName] = useState();
    var [meetingDesc, setMeetingDesc] = useState();
    var [meetingLocation, setMeetingLocation] = useState();
    var [meetingCountry, setMeetingCountry] = useState();
    var [meetingCity, setMeetingCity] = useState();
    var [meetingDistrict, setMeetingDistrict] = useState();
    var [meetingVillage, setMeetingVillage] = useState();
    var [meetingFullLocation, setMeetingFullLocation] = useState();
    var [meetingPublic, setMeetingPublic] = useState("false");

    var [jwt, setJwt] = useState("veri gelmedi!");

    const dispatch = useDispatch();
	const meetingId = useSelector(state =>{
		return state;
	});

    const publicOptions = [
        { value: "false", label: 'Gizli bir meeting.' },
        { value: "true", label: 'Herkese açık bir meeting.' }
    ];

    useEffect(() => {
        LocalStorage.getItem("jwt")
            .then((getedJwt) => {
                console.log(getedJwt);
                setJwt(getedJwt);

            })
    }, [])

    const SendApi = () => {
        const Meeting = {
            title: meetingName,
            body: meetingDesc,
            location: meetingLocation,
            country: meetingCountry,
            city: meetingCity,
            district: meetingDistrict,
            village: meetingVillage,
            public: meetingPublic

        }

        axios.post(`${API_URL}/createmeetings`, Meeting, {
            headers: {
                Authorization: "Bearer " + jwt,
            }
        })
        .then((meeting) => {
            console.log("meeting", meeting.data);
            console.log(meeting.data.message, typeof meeting.data.message);

            if (meeting.data.successfuly === true || meeting.data.successfully === true) {
                setMeetingName("");
                setMeetingDesc("");
                setMeetingLocation("");
                setMeetingCountry("");
                setMeetingCity("");
                setMeetingDistrict("");
                setMeetingVillage("");
                setMeetingFullLocation("");
                setMeetingPublic("false");
                
                dispatch({ type: "setMeetingId", payload: meeting.data.meeting._id })
				navigation.navigate("Meeting"); 
                Alert.alert(meeting.data.message, "Yönlendirildiniz. Hemen arkadaşlarını davet et ve buluşmaya hazırlan!");

                //alert(meeting.data.meeting._id);

            } else if (meeting.data.successfuly === false || meeting.data.successfully === false) {
                Alert.alert(meeting.data.message);


            } else {
                
            }

        })
        .catch((err) => {
            console.log("error", err);
        });

    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} >
            <ScrollView>
                <Card style={{ width: (window.width / 100) * 80 }} >
                    <Card.Content>
                        <View>
                            <Button color="black">Yeni Meeting Oluşturun!</Button>

                            <TextInput label="Meeting Başlığı" value={meetingName} onChangeText={(value) => { setMeetingName(value) }} />
                            <Text>{"\n"}</Text>
                            <TextInput label="Meeting Açıklaması" value={meetingDesc} onChangeText={(value) => { setMeetingDesc(value) }} />
                            <Text>{"\n"}</Text>
                            <TextInput label="Meeting Lokasyonu" value={meetingLocation} onChangeText={(value) => { setMeetingLocation(value) }} />
                            <Text>{"\n"}</Text>
                            <TextInput label="Meeting Ülkesi" value={meetingCountry} onChangeText={(value) => { setMeetingCountry(value) }} />
                            <Text>{"\n"}</Text>
                            <TextInput label="Meeting Şehiri" value={meetingCity} onChangeText={(value) => { setMeetingCity(value) }} />
                            <Text>{"\n"}</Text>
                            <TextInput label="Meeting İlçesi/Bölgesi" value={meetingDistrict} onChangeText={(value) => { setMeetingDistrict(value) }} />
                            <Text>{"\n"}</Text>
                            <TextInput label="Meeting Mahallesi/Köyü" value={meetingVillage} onChangeText={(value) => { setMeetingVillage(value) }} />
                            <Text>{"\n"}</Text>
                            
                            <SelectInput 
                                mode="dropdown"
                                value={meetingPublic}
                                onSubmitEditing={(value) => setMeetingPublic(value)} 
                                options={publicOptions} 
                                style={{
                                    padding:20,
                                    backgroundColor:'#d9d9d9',
                                    shadowColor: "#000000",
                                    shadowOpacity: 0.8,
                                    shadowRadius: 2,
                                    shadowOffset: {
                                        height: 1.5,
                                        width: 1.5
                                    }
                                }}
                            />
                            <Text>{"\n"}</Text>
                            
                            <Button onPress={SendApi} color="red" style={{ backgroundColor: 'black' }} >Meeting'i Oluştur</Button>
                        </View>
                    </Card.Content>

                </Card>

                <Text>{"\n"}</Text><Text>{"\n"}</Text><Text>{"\n"}</Text><Text>{"\n"}</Text><Text>{"\n"}</Text><Text>{"\n"}</Text><Text>{"\n"}</Text><Text>{"\n"}</Text>

            </ScrollView>
        </View>
    );
}