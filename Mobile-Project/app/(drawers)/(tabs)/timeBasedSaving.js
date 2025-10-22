import { ScrollView, StyleSheet, Text, View, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from 'react-native-svg';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function ProgressBar({ savingsPercentage }) {
  return (    
    <View style={styles.progressContainer}>
      <View style={[styles.progressFill, { width: `${savingsPercentage}%` }]}></View>
      <Text style={styles.progressText}>{savingsPercentage.toFixed(2)}% saved</Text>
    </View>
  );
}

function DonutChart({ timeUp, goalAchieved, progress }) {
  const radius = 70;
  const circleCircumference = 2 * Math.PI * radius;
  const strokeDashoffset = circleCircumference - circleCircumference * progress;

  return (
    <View style={styles.graphWrapper}>
      <Svg height="160" width="160" viewBox="0 0 180 180">
        <Circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="#F1F6F9"
          fill="transparent"
          strokeWidth="30"
        />
        <Circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={timeUp && !goalAchieved ? '#E74C3C' : "#83C7EC"}
          fill="transparent"
          strokeWidth="30"
          strokeDasharray={circleCircumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 90 90)"
        />
      </Svg>
      <Text style={styles.percentageText}>
        Time elapsed{'\n'}{Math.round(progress * 100)}%
      </Text>
    </View>
  );
}

export default function TimeSavingDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [token, setToken] = useState(null);
  
  const [savedAmount, setSavedAmount] = useState(0);
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [goalAchieved, setGoalAchieved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const newSelectedDate = new Date(endDate);
  const newStartDate = new Date(startDate);
  const newTargetAmount = parseFloat(targetAmount);
  const savingsPercentage = !isNaN(newTargetAmount) && newTargetAmount > 0 ? (savedAmount / newTargetAmount) * 100 : 0;

  useEffect(() => {
    const now = new Date();
    const totalDuration = newSelectedDate - newStartDate;
    const elapsed = now - newStartDate;
    const progressPercentage = Math.min(Math.max(elapsed / totalDuration, 0), 1);
    setProgress(progressPercentage);

    setTimeUp(now > newSelectedDate);
    setGoalAchieved(savedAmount >= targetAmount);
  }, [startDate, endDate, savedAmount, targetAmount]);

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

  const savingDetails = async (token, id) => {
    
    try {
      const response = await fetch(`${API_URL}/api/saving_plan_details/${id}`, {
        headers:{ 
          "Authorization": `Bearer ${token}` 
        }
      });
      if (!response.ok){
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setGoal(json.goalName);
      setTargetAmount(json.targetAmount);
      setStartDate(json.startDate);
      setEndDate(json.endDate);
    } catch (error) {
      console.log("Error fetching saving details", error.message);
    }
  };

  const inputHandler = async () => {
    const inputValue = parseFloat(input);

    if (isNaN(inputValue)) {
      setErrorMessage("Please enter a valid number.");
      return;
    }
    try {
        setErrorMessage("");
        const response = await fetch(`${API_URL}/api/create_saved_amount`, {
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
  
  const editHandler = (id, goal, targetAmount, startDate, endDate) => {
    console.log("Tiedot ", id, goal, targetAmount, startDate, endDate);
    router.push({
      pathname: "/createTimedSaving",
      params: { id, goal, targetAmount, startDate, endDate }
    });
  };

  const getSavedAmounts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/all_saved_amounts`, {
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
        <ScrollView>
      <SafeAreaView style={styles.container}>
        <Text style={styles.goalTitle}>{goal}</Text>

        <View style={styles.messageBox}>
          {timeUp && !goalAchieved ? (
            <Text style={styles.messageText}>
              Oops!{'\n'}Time’s up, you didn’t reach your goal
            </Text>
          ) : goalAchieved ? (
            <Text style={styles.messageText}>
              Congratulations!{'\n'}You’ve achieved your goal!
            </Text>
          ) : null}
        </View>

        <View style={styles.timeProgressRow}>
          <DonutChart timeUp={timeUp} goalAchieved={goalAchieved} progress={progress} />
          <View style={styles.timeProgressDetail}>
            <Text style={styles.labelText}>Started</Text>
            <Text style={styles.valueBox}>
              {newStartDate.toLocaleDateString('fi-FI')}
            </Text>
            <Text style={styles.labelText}>Target date</Text>
            <Text style={styles.valueBox}>
              {newSelectedDate.toLocaleDateString('fi-FI')}
            </Text>
            <Text style={styles.labelText}>Days left</Text>
            <Text style={styles.valueBox}>
              {Math.max(Math.ceil((newSelectedDate - new Date()) / (1000 * 60 * 60 * 24)), 0)}
            </Text>
          </View>
        </View>

        <View style={styles.savingsSummaryRow}>
          <View style={styles.savingsSummaryItem}>
            <Text style={styles.labelText}>Savings so far</Text>
            <Text style={styles.valueBox}>{savedAmount}</Text>
          </View>
          <View style={styles.savingsSummaryItem}>
            <Text style={styles.labelText}>Target amount</Text>
            <Text style={styles.valueBox}>{targetAmount}</Text>
          </View>
        </View>

        <ProgressBar savingsPercentage={savingsPercentage} />

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

          <TouchableOpacity style={styles.customButton} onPress={inputHandler}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.customButton} 
            onPress={() => editHandler(params.id, goal, targetAmount, startDate, endDate)}
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
            style={[styles.customButton, { backgroundColor: "#E9E4DF", marginTop: 10 }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>Back</Text>
          </TouchableOpacity>
        </View>
        
      </SafeAreaView>
      </ScrollView>
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
  goalTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffefdfcc",
    textAlign: "center",
    marginBottom: 10,
  },
  messageBox: {
    minHeight: 60,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  messageText: {
    textAlign: "center",
    color: "#D5DEE9",
    fontSize: 17,
    fontWeight: "500",
  },
  timeProgressRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginVertical: 10,
  },
  graphWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  percentageText: {
    position: "absolute",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
    color: "#ffefdfcc",
  },
  timeProgressDetail: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  savingsSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginVertical: 10,
  },
  savingsSummaryItem: {
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
    marginVertical: 15,
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
  bottomSection: {
    alignItems: "center",
    width: "80%",
    marginTop: 10,
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
