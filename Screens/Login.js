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
	var [email, setEmail] = useState(null);
	var [password, setPassword] = useState(null);

  var [jwt, setJwt] = useState("veri gelmedi!");

  const dispatch = useDispatch();
  const userId = useSelector(state =>{
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
		const user = {
      email,
      password
  }
    
    axios.post(`${API_URL}/login`, user)
    .then((res) => {
      console.log(res.data);

        if(res.data.error){
          Alert.alert(res.data.error);

        }else if(!res.data.error){
          console.log(res.data);
          Alert.alert("Giriş Başarılı. ");

          LocalStorage.setItem("jwt", res.data.token);
          LocalStorage.setItem("userid", res.data.user);

          console.log("loginedId", res.data.user)

          
        }
    })
	}

    return (
      <>
        {
          !jwt || jwt == "" ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} >
          <Card style={{ width: (window.width / 100)   * 80 }} >
            <Card.Content>
              <View>
                <Text>{jwt}</Text>
                <Button color="black" color="white">Giriş Yapın!</Button>
  
                <TextInput label="Email" autoCapitalize='none' autoCompleteType='email' keyboardType="email-address" value={email} onChangeText={(value) => { setEmail(value) }} />
                <Text>{"\n"}</Text>
                <TextInput label="Şifre" secureTextEntry={true} value={password} onChangeText={(value) => { setPassword(value) }} />
                <Button onPress={SendApi} color="red" style={{ backgroundColor: 'black' }} >Giriş Yap</Button>
  
                <Button color="black" color="white" onPress={() => { navigation.navigate("Register") } }>Kayıt Olun!</Button>
  
              </View>
            </Card.Content>
  
  
          </Card>
      
        </View>
        :

        <Loading visible={true} />
        
        }
      </>
    );
  }