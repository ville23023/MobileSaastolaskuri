import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function SavingsAmountList() {
    const [savedAmount, setSavedAmount] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const params = useLocalSearchParams();
    const goal = params.goal;

  useEffect(() => {
    const listAmounts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}:3000/api/all_saved_amounts`, {
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

        if (response.ok) {
          const filterWithGoal = data.filter(item => item.goal === params.id);
          setSavedAmount(filterWithGoal);
        } else {
            setErrorMessage(data.error || "List retrieval failed");
        }
      } catch (err) {
        setErrorMessage("Network error. Please try again.");
        console.log(err);
      }  
        };

        listAmounts();
    }, [params.id]);
    return (
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.topSection}>
              <Text style={styles.titleText}>Saved Amounts {goal}</Text>
            </View>

            <View style={styles.middleSection}>
              {savedAmount.length > 0 ? (
                <FlatList
                  data={savedAmount}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.itemStyle}>
                      <Text style={styles.userText}>{item.savedAmount}€</Text>
                      <Text style={styles.userText}>{new Date(item.date).toLocaleDateString('fi-FI')}</Text>
                    </View>
                  )}
                />
              ) : (
                <Text style={styles.noItemsText}>{errorMessage || "No data found"}</Text>
              )}
            </View>
          </View>
        </View>
    )
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
