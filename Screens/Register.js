import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Alert } from 'react-native';
import { TextInput, Card, Button, Title } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../config.json';
import LocalStorage from '@react-native-async-storage/async-storage';

const window = Dimensions.get("window");

export default function Register({ navigation }) {

	var [fullname, setFullname] = useState(null);
	var [email, setEmail] = useState(null);
	var [username, setUsername] = useState(null);
	var [password, setPassword] = useState(null);

  var [jwt, setJwt] = useState("veri gelmedi!");

  useEffect(() => {
    LocalStorage.getItem("jwt")
    .then((getedJwt) => {
      console.log(getedJwt);
      setJwt(getedJwt);

    })
  }, [])
	
	const SendApi = () => {
		const user = {
      name: fullname,
      email,
      username,
      password
  }
    
    axios.post(`${API_URL}/register`, user)
    .then((res) => {
      console.log(res.data);

        if(res.data.error){
          Alert.alert(res.data.error);

        }else if(!res.data.error){
          console.log(res.data);
          Alert.alert("Kayıt Başarılı. ");

          navigation.navigate("Login")
        }
    })
	}

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }} >
        <Card style={{ width: (window.width / 100)   * 80 }} >
          <Card.Content>
            <View>
              <Text>{jwt}</Text>
              <Button color="black" color="white">Kayıt Olun!</Button>
              
              <TextInput label="Tam İsim" value={fullname} onChangeText={(value) => { setFullname(value) }} />
              <Text>{"\n"}</Text>

              <TextInput label="Email" keyboardType="email-address" value={email} onChangeText={(value) => { setEmail(value) }} />
              <Text>{"\n"}</Text>              
              
              <TextInput label="Kullanıcı Adı" value={username} onChangeText={(value) => { setUsername(value) }} />
              <Text>{"\n"}</Text>
              <TextInput label="Şifre" secureTextEntry={true} value={password} onChangeText={(value) => { setPassword(value) }} />
              <Text>{"\n"}</Text>
              <Button onPress={SendApi} color="red" style={{ backgroundColor: 'black' }} >Kayıt ol</Button>
            </View>
          </Card.Content>

        </Card>
		
      </View>
    );
  }
