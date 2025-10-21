import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Modal, TextInput, Button  } from 'react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';

export default function SavedAmountList() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [savedAmountList, setSavedAmountList] = useState([]);
  const [savedAmount, setSavedAmount]=useState("");
  const [updateId, setUpdateId]=useState(-1);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const params = useLocalSearchParams();
  const goal = params.goal;
  const [visibility, setVisibility]=useState(false);

  useEffect(() => {
    listAmounts();
  }, [params.id]);

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
          const filterByGoal = data.filter(item => item.goal === params.id);
          setSavedAmountList(filterByGoal);
        } else {
            setErrorMessage(data.error || "List retrieval failed");
        }
      } catch (err) {
        setErrorMessage("Network error. Please try again.");
        console.log(err);
      }  
        };

    const updateAmountHandler = (id) => {
      const item = savedAmountList.find(item => item._id === id);
      if (item) {
        setUpdateId(id);
        setSavedAmount(String(item.savedAmount));
        setVisibility(true);
      }
    };
    const deleteAmount = (id) =>{
      Alert.alert(
        "Delete saved amount",
        "Are you sure you want to delete this saved amount?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {text: "Yes", onPress: async() =>{
            try{
              const token = await AsyncStorage.getItem("token");
              const response = await fetch(`${API_URL}:3000/api/delete_saved_amount/${id}`,{
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok){
              throw new Error(`Response status: ${response.status}`);
            } else {
              Alert.alert(
                "Saved amount deleted",
                "The saved amount has been deleted successfully.",
              )
            }
            let json = await response.json();
            console.log(json);
            setSavedAmountList(currentList =>{
              return currentList.filter(item => item._id !== id);
            })
            }catch (error){
            console.log("Something went wrong", error.message);
            Alert.alert(
              "Delete error",
              "Could not delete the saved amount.",
            )
          }
          }}
        ])
    }
    const updateAmount=async() =>{
      try{
        if (isNaN(parseFloat(savedAmount))) {
          Alert.alert("Please enter a valid number.");
          return;
        }
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_URL}:3000/api/update_saved_amount/${updateId}`,{
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({savedAmount: parseFloat(savedAmount), date: new Date()}),
      });
      if (!response.ok){
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json);

      await listAmounts();

    setUpdateId(-1);
    setVisibility(false);
    setSavedAmount("");
    Alert.alert(
      "Saved amount updated",
    );
  }catch (error){
      console.log("Something went wrong", error.message);
      Alert.alert(
        "Could not update the saved amount.",
      )
    }
    }

    return (
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.topSection}>
              <Text style={styles.titleText}>Saved amounts{'\n'}for goal: {goal}</Text>
          <TouchableOpacity
            style={[styles.customButton, { backgroundColor: "#E9E4DF", marginTop: 10 }]}
            activeOpacity={0.8}
            onPress={() => router.back()}
            >
            <Text style={[styles.buttonText, { color: "#000" }]}>Back</Text>
          </TouchableOpacity>
            </View>

            <View style={styles.middleSection}>
              {savedAmountList.length > 0 ? (
                <FlatList
                  data={savedAmountList}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.itemStyle} 
                      activeOpacity={0.8} 
                      onLongPress={() =>deleteAmount(item._id)}
                      onPress={() =>updateAmountHandler(item._id)}
                      >
                      <Text style={styles.userText}>{item.savedAmount}€</Text>
                      <Text style={styles.userText}>{new Date(item.date).toLocaleDateString('fi-FI')}</Text>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={styles.noItemsText}>{errorMessage || "No data found"}</Text>
              )}
      <Modal visible={visibility} animationType="slide">
        <View style={styles.formView}>
          <Text style={styles.title}>Edit saved amount</Text>
          <TextInput style={styles.inputStyle}
              onChangeText={setSavedAmount}
              value={savedAmount}
              />
          <View style={styles.okcancelStyle}>
            <View style={styles.buttonView}><Button style={styles.buttonStyle} title='UPDATE' onPress={updateAmount}/></View>
            <View style={styles.buttonView}><Button style={styles.buttonStyle} title='Cancel' onPress={()=> setVisibility(false)}/></View>
          </View>
        </View>
      </Modal>
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
    noItemsText: {
      fontSize: 16,
      color: "#D5DEE9",
      textAlign: "center",
      marginTop: 20,
    },
    // MODAL:
    title:{
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
    },
    okcancelStyle:{
      flexDirection: "row",
      justifyContent: "space-between",
      width: "60%",    
    },
    formView:{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: 20,
    },
    inputStyle:{
      width: "80%",
      height: 50,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 30,
      textAlign: "center",
      fontSize: 18,
    },
    buttonView:{
      flex: 1,
      marginHorizontal: 5,
    }
  });
