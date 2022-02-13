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
import { videogIdReducer, darkThemeReducer, playlistIdReducer } from './reducers/reducer';

import { DrawerContent } from './components/DrawerContent';

//Screens
import HomeScreen from './Screens/Home';
import DiscoverScreen from './Screens/Discover';
import MeetingScreen from './Screens/Video';
import CreateMeetingScreen from './Screens/CreateMeeting';
import LogoutScreen from './Screens/Logout';

import LoginScreen from './Screens/Login';

import { Router } from './Router';

export default function App() {
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

  const store = createStore(combineReducers({ videogIdReducer, darkThemeReducer, playlistIdReducer }));

  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();
  

  return (
    <>
        <Provider store={store}>
          <Router />
        </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
