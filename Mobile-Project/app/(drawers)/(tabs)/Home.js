import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const router = useRouter();
  const [savingsList, setSavingsList] = useState([]);
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState("");
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const params = useLocalSearchParams();

  useEffect(() =>{
    const getTokenAndFetchList = async() =>{
      let storedToken = null;
      try{
        storedToken = await AsyncStorage.getItem("token");
      }catch (error){
        console.log("Fething token error", error);
      }
      if (storedToken !== null){
        setToken(storedToken);
        getList(storedToken)
      }
    }
    getTokenAndFetchList()
  }, [])

  useEffect(() =>{
    if(params.userName){
      setUserName(params.userName);
    }
  },[params])

  const pressHandler = (id, startDate, endDate) => {
    console.log(startDate, endDate);
    if (!startDate || !endDate){
      router.push({pathname:"/freeSaving", params:{ id }})
      return;
    }
    router.push({pathname:"/timeBasedSaving", params:{ id }})
  };

  const getList = async (token) =>{

    if (!token){
      alert("Token not found! Please login again");
      return;
    }
    try{
      let response = await fetch(`${API_URL}:3000/api/all_saving_plans`,{
        headers:{
          "Authorization":`Bearer ${token}`,
        }
      });
      if(!response.ok){
        throw new Error(`Response status: ${response.status}`);
      }
      let json = await response.json();
      setSavingsList(json);
    }catch (error){
      console.log("Error fetchin list", error.message);
    }
  }

  const deletePlan = (id) =>{
    Alert.alert(
      "Delete plan",
      "Are you sure you want to delete this plan?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {text: "Yes", onPress: async() =>{
          try{
            const response = await fetch(`${API_URL}:3000/api/delete_saving_plan/${id}`,{
              method: "DELETE",
              headers: {
                "Authorization": `Bearer ${token}`,
              },
          });
          if (!response.ok){
            throw new Error(`Response status: ${response.status}`);
          } else {
            Alert.alert(
              "Plan deleted",
              "Plan deleted successfully",
            )
          }
          let json = await response.json();
          console.log(json);
          setSavingsList(currentList =>{
            return currentList.filter(goal => goal._id !== id);
          })
          }catch (error){
          console.log("Something went wrong", error.message);
          Alert.alert(
            "Delete error",
            "Plan could not be deleted",
          )
        }
        }}
      ])
  }

  return (
    <ImageBackground
      source={require("../../../assets/background3.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.topSection}>
            <Text style={styles.welcomeText}>Welcome {userName}</Text>
          </View>

          <View style={styles.middleSection}>
            <Text style={styles.sectionHeader}>Your current saving plans!</Text>

            {savingsList.length > 0 ? (
              <FlatList
                data={savingsList}
                keyExtractor={(item) => item._id.toString()}
                renderItem={(item) => (
                  <TouchableOpacity activeOpacity={0.8} onLongPress={() =>deletePlan(item.item._id)} onPress={() =>pressHandler(item.item._id, item.item.startDate, item.item.endDate)}>
                    <View>
                      <Text style={styles.itemStyle}>
                        {item.index + 1}) {item.item.goalName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noItemsText}>
                No savings created! Go make one!
              </Text>
            )}
          </View>

          <View style={styles.bottomSection}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.customButton}
              onPress={() => router.push("/Create")}
            >
              <Text style={styles.buttonText}>Create new savings goal</Text>
            </TouchableOpacity>
          </View>

          <StatusBar style="auto" />
        </SafeAreaView>
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
    overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  middleSection: {
    flex: 2,
    width: "90%",
    alignItems: "center",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  customButton: {
    backgroundColor: "#83C7EC",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
    borderColor: "#7b3e3eff",
    borderWidth: 2,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
    color: "rgba(0, 0, 0, 0.8)",
  },
  itemStyle: {
    fontSize: 18,
    backgroundColor: "#E9E4DF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    width: "100%",
    color: "#000",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffefdfcc",
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffefdfcc",
    marginBottom: 10,
  },
  noItemsText: {
    fontSize: 14,
    color: "#D5DEE9",
    marginTop: 10,
    textAlign: "center",
  },
});
