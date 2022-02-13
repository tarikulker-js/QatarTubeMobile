import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import LocalStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { useSelector } from 'react-redux';
import { meetingIdReducer, darkThemeReducer } from './reducers/reducer';

import { DrawerContent } from './components/DrawerContent';

import { API_URL } from './config.json';

//Screens
import HomeScreen from './Screens/Home';
import TrendsScreen from './Screens/Trends';
import DiscoverScreen from './Screens/Discover';
import VideoScreen from './Screens/Video';
import CreateVideoScreen from './Screens/CreateMeeting';
import CreatePlaylistScreen from './Screens/CreatePlaylist';
import MyPlaylistsScreen from './Screens/MyPlaylists';
import PlaylistScreen from './Screens/Playlist';
import LogoutScreen from './Screens/Logout';

import LoginScreen from './Screens/Login';
import RegisterScreen from './Screens/Register';

export function Router(){
    var [jwt, setJwt] = useState(null);
    
    useEffect(() => {
        setInterval(() => {
            LocalStorage.getItem("jwt")
            .then((getedJwt) => {
            setJwt(getedJwt);
            //console.log(getedJwt)
            });

        }, 1000)
    })

    const Stack = createNativeStackNavigator();
    const Drawer = createDrawerNavigator();

    const darkTheme = useSelector((action = "setTheme") =>{
		return action.darkThemeReducer;
	});

    const linking = {
        prefixes: ['https://ulker-social.netlify.app', 'ulkersocial://']
    }

    return(
        <PaperProvider  theme={ darkTheme == true ? PaperDarkTheme : PaperDefaultTheme } >
            <NavigationContainer linking={linking} theme={ darkTheme == true ? DarkTheme : DefaultTheme } >
                {
                    !jwt || jwt == "" ?
                    <Stack.Navigator>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        

                    </Stack.Navigator>
                    :
                    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} >
                    <Drawer.Screen name="Home" component={HomeScreen} options={{ title: "Ana Ekran" }} />
                    <Drawer.Screen name="Trends" component={TrendsScreen} options={{ title: "Trend Videolar" }} />
                    <Drawer.Screen name="CreateMeeting" component={CreateVideoScreen} options={{ title: "Video Oluştur" }} />
                    <Drawer.Screen name="CreatePlaylist" component={CreatePlaylistScreen} options={{ title: "Playlist Oluştur" }} />
                    <Drawer.Screen name="Playlist" component={PlaylistScreen} options={{ title: "Playlist" }} />
                    <Drawer.Screen name="MyPlaylists" component={MyPlaylistsScreen} options={{ title: "Playlistlerim" }} />
                    
                    
                    <Drawer.Screen name="Logout" component={LogoutScreen} options={{ title: "Çıkış Yapın" }} />
                    
                    <Drawer.Screen name="Video" component={VideoScreen} options={{ title: "Video İzleyin" }} />
                    
                    </Drawer.Navigator>
                }
                </NavigationContainer>

            </PaperProvider>
    )
}