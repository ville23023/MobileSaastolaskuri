import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AdminPanel() { 
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        listAllUsers();
      }, []);
      
const listAllUsers = async() => {
    try{
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_URL}:3000/api/users`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
    
          const isJson = response.headers
            .get("content-type")
            ?.includes("application/json");
          const data = isJson ? await response.json() : {};
    
            if (response.ok && data.data) {
            setUsers(data.data);
          } else {
            setErrorMessage(data.error || "Invalid username or password");
          }
        } catch (err) {
          setErrorMessage("Network error. Please try again.");
        }
}
const deleteUser = async(userId) => {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${API_URL}:3000/api/user-delete/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
        if (response.ok) {
        listAllUsers();
      }else {
        setErrorMessage("Delete failed");
      }
}
return (
<View>
    <Text style={{fontSize: 24, fontWeight: "bold", padding: 10}}>User Management</Text>
    <FlatList
        data={users}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
            <View style={styles.itemStyle}>
                <Text style={{ width: 110 }}>{item.userName}</Text>
                <Text style={{ width: 150}}>{item.email}</Text>
                <Button title="Delete" onPress={() => deleteUser(item._id)} />
            </View>
        )}
    />
</View>
);
}
const styles = StyleSheet.create({
itemStyle: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    fontSize: 18,
    backgroundColor: "#E9E4DF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    width: "100%",
    color: "#000",
  },
});
