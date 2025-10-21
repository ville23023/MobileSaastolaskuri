import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from "expo-router";
import React, { useState } from 'react';

export default function UserSignUp() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  const validateForm = async() => {

    if (!username.trim()) {
      setErrorMessage("Username is required.");
      return;
    } else if (!(username.length >= 5 && username.length <= 12)) {
      setErrorMessage("The username must be 5 to 12 characters long.");
      return;
    } 
    if (!email.trim()) {
      setErrorMessage("Email is required.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Email is invalid.");
      return;
    } 
    
    if (!password.trim()) {
      setErrorMessage("Password is required.");
      return; 
    } else if (!(password.length >= 8)) {
      setErrorMessage("The password must be at least 8 characters long.");
      return;
    } 
    if (!confirmPassword.trim()) {
      setErrorMessage("Confirm password.");
      return; 
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return; 
    }
    try {
      const response = await fetch(`${API_URL}:3000/api/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: username, email, password }),
      });

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await response.json() : {};

      if (response.ok) {
        router.push("/UserLogin")
      } else {
        setErrorMessage(data.error || "Signup failed");
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    }  
  }

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>
          Sign up to start planning your savings goals today.
        </Text>

        <Text style={styles.loginHeader}>Sign Up</Text>

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
          placeholder="Email"
          placeholderTextColor="#555" 
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#555" 
          secureTextEntry 
          onChangeText={setPassword}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Confirm Password" 
          placeholderTextColor="#555" 
          secureTextEntry 
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={validateForm}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/UserLogin")}>
          <Text style={styles.registerText}>Already have an account? Log in here</Text>
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
    fontSize: 16,
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
    fontSize: 16,
    color: '#D1B9AA',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontWeight: '600',
  },
});
