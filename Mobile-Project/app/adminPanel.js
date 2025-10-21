import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

export default function AdminPanel() { 
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        listAllUsers();
    }, []);
   
    const logOut = async () =>{
      try{
          await AsyncStorage.removeItem("token");
          router.replace("/UserLogin");
      } catch(error){
          console.log("Logout error", error.message);
      }
      console.log("Logout done");
  }

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
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', onPress: async () => {
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
            } else {
                const error = data?.error || "Delete failed";
                if (error === "Cannot delete admin user") {
                  alert("Cannot delete admin user");
                } else {
                  Alert.alert(error);
                }
            }
          }}
        ],
        { cancelable: true }
      );
    };

    return (
      <ImageBackground
        source={require("../assets/background3.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.topSection}>
              <Text style={styles.titleText}>User Management</Text>
              <TouchableOpacity style={styles.customButton} onPress={logOut}>
                <Text style={styles.buttonText}>Log out</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.middleSection}>
              {users.length > 0 ? (
                <FlatList
                  data={users}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.itemStyle}>
                      <Text style={styles.userText}>{item.userName}</Text>
                      <Text style={styles.userText}>{item.email}</Text>
                      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteUser(item._id, item.userName)}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              ) : (
                <Text style={styles.noItemsText}>{errorMessage || "No users found"}</Text>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    width: "90%",
    padding: 20,
    justifyContent: "center",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffefdfcc",
  },
  middleSection: {
    flex: 1,
  },
  itemStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E9E4DF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  userText: {
    width: 120,
    fontSize: 16,
    color: "#000",
  },
  customButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#83C7EC",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7b3e3eff",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
    color: "rgba(0,0,0,0.8)",
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  noItemsText: {
    fontSize: 16,
    color: "#D5DEE9",
    textAlign: "center",
    marginTop: 20,
  },
});
