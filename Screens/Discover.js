import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card, Button, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';
import LocalStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config.json';
import { Linking } from 'react-native';

export default function Discover() {
	var [jwt, setJwt] = useState(null);
	var [guests, setGuests] = useState(null);

    useEffect(() => {
		LocalStorage.getItem("jwt")
		.then((getedJwt) => {
			setJwt(getedJwt);
			console.log(getedJwt);
            
            axios.get(`${API_URL}/getpublicmeetings`, {
                headers: {
                    "Authorization": "Bearer " + getedJwt
                }
            })
            .then((guestsReq) => {
                console.log("is geted. ");
                //console.log(guestsReq.data);
                setGuests(guestsReq.data);
        
            }).catch((err) => console.log(err));

		});

		if(jwt !== null){
			console.log("hi");
			
		}
	}, []);

    return (
      <ScrollView>
        {
			!guests ? <Text>Yükleniyor...</Text> : 
			
			guests.length == 0 ? <Text>Herkese açık bir meeting yok.</Text> :

			guests.map((guest) => {
                console.log("guest", guest);
                
				return(
					<Card>
						<Card.Content>
							<Title>{guest.title}</Title>
							<Paragraph>{guest.guests.length} Katılımcı</Paragraph>
						</Card.Content>
						<Card.Cover source={{ uri: guest.picture }} />
						<Card.Actions>
							{ guest.expireToken ? <Button onPress={() => { Linking.openURL("https://big-meeting.netlify.app/join-meeting/" + guest.resetToken) }} color="red" style={{ backgroundColor: 'black' }} >Meetinge Katıl!</Button> : <Button onPress={() => {  }} color="red" style={{ backgroundColor: 'black' }} >Hatalı Meetin!</Button>}
						</Card.Actions>
					</Card>
				)
			})

		}
        
      </ScrollView>
    );
  }