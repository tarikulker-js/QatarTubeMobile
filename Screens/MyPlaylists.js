import React, { useState, useEffect } from 'react';
import { RefreshControl, Text, ScrollView, View } from 'react-native';
import { Card, Button, Title, Paragraph, DarkTheme } from 'react-native-paper';
import axios from 'axios';
import LocalStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config.json';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'react-native-loading-spinner-overlay';

export default function Home({ navigation }) {
	var [jwt, setJwt] = useState(null);
	const dispatch = useDispatch();
	
	var [videos, setVideos] = useState(null);
	var [isLoading, setLoading] = useState(true);

    useEffect(() => {
		LocalStorage.getItem("jwt")
		.then((getedJwt) => {
			setJwt(getedJwt);
			
			axios.post(`${API_URL}/playlist/myplaylists`, {}, {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            })
                .then((playlists) => {
                    setVideos(playlists.data.playlists);
                    setLoading(false);

                })
		});
	});

    return (
		<View>
			<Loading visible={isLoading} />

			<ScrollView refreshControl={
				<RefreshControl
				refreshing={isLoading}
				onRefresh={() => {
					setLoading(true);

					LocalStorage.getItem("jwt")
					.then((getedJwt) => {
						setJwt(getedJwt);
						//console.log(getedJwt)
						
						axios.get(`${API_URL}/get-videos`, {
							headers: {
								"Authorization": "Bearer " + getedJwt
							}
						})
						.then((videosReq) => {
							//console.log("is geted. ");
							
							//console.log(videosReq.data);
							setLoading(false);
							
							if(videosReq.data.auth == false){
								navigation.navigate("Logout");
							}else if(videosReq.data.message){
								Alert.alert(videosReq.data.message);

							}else{
								setVideos(videosReq.data);
							}

						}).catch((err) => console.log(err));

					});
            }}
          />
        }>

				{
					!videos ? <Text>Yükleniyor...</Text> : 
					
					videos.length == "0" ? videos.map((video) => {return(<View><Text>Video yok!</Text></View>)}) :
					
					videos.map((video) => {
						
						return(
							<Card key={video._id} >
								<Card.Content>
									<Title>{video.name}</Title>
									<Paragraph>{video.views.length} İzleyici</Paragraph>
								</Card.Content>
								<Card.Actions>
									<Button onPress={() => { 
										console.log(video._id); 
										dispatch({ type: "setPlaylistId", payload: video._id })
										navigation.navigate("Playlist"); 

									}} color="red" style={{ backgroundColor: 'black' }} >Playlisti görüntüle</Button>
								</Card.Actions>
							</Card>
						)
					})

				}
				
			</ScrollView>

		</View>
    );
  }
