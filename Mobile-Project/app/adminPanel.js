import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = process.env.EXPO_PUBLIC_API_URL;
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export default function AdminPanel() { 
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

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
            setErrorMessage(data.error || "Failed to fetch users");
          }
        } catch (err) {
          setErrorMessage("Network error. Please try again.");
        }
}
const deleteUser = async(userId, userName) => {
  Alert.alert(
    `Delete: ${userName}`,
    "Are you sure you want to delete this user?",
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Delete', onPress: async () => {

    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${API_URL}:3000/api/user-delete/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await response.json() : {};

        if (response.ok) {
        listAllUsers();
      }else {
        const error = data?.error || "Delete failed";
        if (error === "Cannot delete admin user") {
          alert("Cannot delete admin user");
        } else {
          Alert.alert(error);
        }
      }
},
},
],
{cancelable: true});
};
return (
<View>
  <View style={styles.titleStyle}>
    <Text style={{fontSize: 24, fontWeight: "bold"}}>User Management</Text>
    <Button title="Log out" onPress={() => router.replace("/UserLogin")}/>
  </View>
    <FlatList
        data={users}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
            <View style={styles.itemStyle}>
                <Text style={{ width: 110 }}>{item.userName}</Text>
                <Text style={{ width: 150}}>{item.email}</Text>
                <Button title="Delete" onPress={() => deleteUser(item._id, item.userName)} />
            </View>
        )}
    />
</View>
);
}
const styles = StyleSheet.create({
  titleStyle: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    gap: 80,
    },
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
