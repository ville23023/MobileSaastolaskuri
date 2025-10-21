import { Button, StyleSheet, Text, View, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function ProgressBar({ savingsPercentage }) {
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressFill, { width: `${savingsPercentage}%` }]} />
      <Text style={styles.progressText}>{savingsPercentage.toFixed(2)}% saved</Text>
    </View>
  );
}

export default function FreeSaving() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [goal, setGoal] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [token, setToken] = useState(null);

  const [savedAmount, setSavedAmount] = useState(0);
  const [input, setInput] = useState('');
  const [goalAchieved, setGoalAchieved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const savingsPercentage =
    !isNaN(targetAmount) && targetAmount > 0
      ? (savedAmount / targetAmount) * 100
      : 0;

  useEffect(() => {
    setGoalAchieved(savedAmount >= targetAmount);
  }, [savedAmount, targetAmount]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken){
          setToken(storedToken);
        }
      } catch (error) {
        console.log("Fetching token error", error);
      }
    };
    getToken();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (token){
        getSavedAmounts(token, params.id);
      }
    }, [token])
  );

  useEffect(() => {
      const fetchDetails = async () => {
        if (!token || !params.id) {
          return;
        }
        await savingDetails(token, params.id);
        await getSavedAmounts(token, params.id);
      };
    fetchDetails();
  }, [params.id, token]);
  
  const editHandler = (id, goal, targetAmount) => {
    console.log("Tiedot ", id, goal, targetAmount);
    router.push({
      pathname: "/createOwnPace",
      params: { id, goal, targetAmount }
    });
  };

  const savingDetails = async (token, id) =>{
    try{
      const response = await fetch(`${API_URL}:3000/api/saving_plan_details/${id}`,{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      if (!response.ok){
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setGoal(json.goalName);
      setTargetAmount(json.targetAmount);
    } catch (error){
      console.log("Error fething saving details", error.message);
    }
  }

  const inputHandler = async () => {
    const inputValue = parseFloat(input);

    if (isNaN(inputValue)) {
      setErrorMessage("Please enter a valid number.");
      return;
    }
    try {
        setErrorMessage("");
        const response = await fetch(`${API_URL}:3000/api/create_saved_amount`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            goal: params.id, 
            savedAmount: inputValue,
            date: new Date().toISOString(),
          }),
        });
  
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson ? await response.json() : {};

        if (response.ok) {
          setSavedAmount((prev) => prev + inputValue);
          setInput("");
        } else {
            setErrorMessage(data.error || "Adding the amount failed");
        }
      } catch (err) {
        setErrorMessage("Network error. Please try again.");
        console.log(err);
      }  
  };

  const getSavedAmounts = async () => {
    try {
      const response = await fetch(`${API_URL}:3000/api/all_saved_amounts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
      }
        const data = await response.json();
        const filterWithGoal = data.filter(item => item.goal === params.id);
        const totalSaved = filterWithGoal.reduce((sum, item) => sum + item.savedAmount, 0);
        setSavedAmount(totalSaved);
      } catch (error) {
        console.log("Error fetching saved amounts", error.message);
      }
  };

  return (
    <ImageBackground
      source={require("../../../assets/background3.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.goalTitle}>{goal}</Text>
        </View>

        {goalAchieved && (
          <View style={styles.messageBox}>
            <Text style={styles.congratsText}>
              Congratulations!{'\n'}You’ve achieved your savings goal!
            </Text>
          </View>
        )}

        <View style={styles.middleSection}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.labelText}>Savings so far</Text>
              <Text style={styles.valueBox}>{savedAmount}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.labelText}>Target amount</Text>
              <Text style={styles.valueBox}>{targetAmount}</Text>
            </View>
          </View>

          <ProgressBar savingsPercentage={savingsPercentage} />
        </View>

        <View style={styles.bottomSection}>
            {errorMessage !== "" && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )} 
          <Text style={styles.labelText}>Enter saved amount:</Text>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            keyboardType="numeric"
          />
          <TouchableOpacity activeOpacity={0.8} style={styles.customButton} onPress={inputHandler}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.customButton} 
            onPress={() => editHandler(params.id, goal, targetAmount)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.customButton} 
            onPress={() => router.push({pathname: "/savedAmountList", params:{id: params.id, goal: goal}})}
          >
            <Text style={styles.buttonText}>List</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.customButton, { backgroundColor: "#E9E4DF", marginTop: 10 }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  topSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  goalTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffefdfcc",
    textAlign: "center",
  },
  messageBox: {
    backgroundColor: "rgba(255, 239, 223, 0.2)",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  congratsText: {
    fontSize: 18,
    textAlign: "center",
    color: "#D5DEE9",
  },
  middleSection: {
    width: "90%",
    alignItems: "center",
    marginVertical: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: "center",
    width: "40%",
  },
  labelText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffefdfcc",
    textAlign: "center",
    marginBottom: 5,
  },
  valueBox: {
    backgroundColor: "#E9E4DF",
    color: "#000",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    fontSize: 16,
    textAlign: "center",
    minWidth: 60,
  },
  progressContainer: {
    height: 40,
    width: "80%",
    backgroundColor: "#E9E4DF",
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#83C7EC",
    position: "absolute",
    left: 0,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: "#000",
  },
  bottomSection: {
    alignItems: "center",
    width: "80%",
  },
  input: {
    backgroundColor: "#E9E4DF",
    color: "#000",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    textAlign: "center",
    width: "100%",
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontWeight: '600',
  },
});
