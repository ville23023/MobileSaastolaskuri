import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserLogin() {

  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const router = useRouter();

  const checkInputText = async() => {
    setErrorMessage("");
    if(!userName.trim()){
      alert("Enter username!");
      return;
    }
    if(!password.trim()){
      alert("Enter password!");
      return;
    }
    try {
      const response = await fetch(`${API_URL}:3000/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await response.json() : {};

      if (response.ok && data.token) {
        await AsyncStorage.setItem("token", data.token);
        
      const decoded = JSON.parse(atob(data.token.split('.')[1]));
      if (decoded.role === 'admin') {
          router.replace("/adminPanel");
        } else {
          login();
        }
      } else {
        setErrorMessage(data.error || "Invalid username or password");
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    }
  }

  const login = () =>{
    router.replace({pathname:"/Home", params:{ userName }});
  }

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the Savings Planner!</Text>
        <Text style={styles.subtitle}>
          Use our calculator to see how long it will take to achieve your goal.
        </Text>
        <Text style={styles.subtitle}>Sign up and start planning today.</Text>

        <Text style={styles.loginHeader}>Login</Text>

        {errorMessage !== "" && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )} 

        <TextInput 
          style={styles.input} 
          placeholder="Username" 
          placeholderTextColor="#555"
          onChangeText={setUsername}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#555" 
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={checkInputText}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/UserSignUp")}>
          <Text style={styles.registerText}>No account? Register here</Text>
        </TouchableOpacity>
        
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#ECF3FB',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
    color: '#D5DEE9',
  },
  loginHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#D9CDB7',
  },
  input: {
    width: '80%',
    backgroundColor: '#DBF1FB',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    color: '#000',
  },
  button: {
    backgroundColor: '#83C7EC',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 6,
    marginBottom: 20,
  },
  buttonText: {
    fontWeight: '600',
    color: '#000',
  },
  registerText: {
    fontSize: 14,
    color: '#D1B9AA',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontWeight: '600',
  },
});
