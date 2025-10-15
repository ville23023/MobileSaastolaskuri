import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateTimedSaving() {
  const [goal, setGoal] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [token, setToken] = useState(null);
  const router = useRouter();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) setToken(storedToken);
      } catch (error) {
        console.log("Fetching token error", error);
      }
    };
    getToken();
  }, []);

  const dateChangeHandler = (event, selectedDate) => {
    setOpen(false);
    if (event.type === "set" && selectedDate) {
      if (mode === "start") setStartDate(selectedDate);
      else if (mode === "end") setEndDate(selectedDate);
    }
    setMode("");
  };

  const showMode = (whichDate) => {
    setMode(whichDate);
    setOpen(true);
  };

  const createSavingGoal = () => ({
    goalName: goal,
    targetAmount,
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  });

  const checkInputText = () => {
    if (!goal.trim()) {
      alert("Please enter name of your goal");
      return;
    }
    if (!targetAmount.trim()) {
      alert("Please enter target amount!");
      return;
    }
    createHandler();
  };

  const clearInputs = () => {
    setGoal("");
    setTargetAmount("");
  };

  const createHandler = async () => {
    if (!token) {
      alert("Token not found! Please login again");
      return;
    }
    try {
      const newGoal = createSavingGoal();
      const response = await fetch(`${API_URL}:3000/api/create_saving_goal`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGoal),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create goal");
      }
      await response.json();
      clearInputs();
      router.replace("/Home");
    } catch (error) {
      console.log("Error creating goal", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background2.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.formWrapper}>
          <Text style={styles.headerText}>Timed Saving Plan</Text>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Name your goal</Text>
            <TextInput
              placeholder="Your goal name here"
              placeholderTextColor="rgba(0,0,0,0.4)"
              onChangeText={setGoal}
              value={goal}
              style={styles.input}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Target amount</Text>
            <TextInput
              placeholder="Target amount"
              placeholderTextColor="rgba(0,0,0,0.4)"
              onChangeText={setTargetAmount}
              value={targetAmount}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.customButton} onPress={() => showMode("start")} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Choose start date</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>{startDate.toLocaleDateString("fi-FI")}</Text>

          <TouchableOpacity style={styles.customButton} onPress={() => showMode("end")} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Choose end date</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>{endDate.toLocaleDateString("fi-FI")}</Text>

          {open && (
            <DateTimePicker
              value={mode === "start" ? startDate : endDate}
              mode="date"
              display="spinner"
              locale="fi-FI"
              onChange={dateChangeHandler}
            />
          )}

          <TouchableOpacity style={styles.customButton} onPress={checkInputText} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.customButton, { backgroundColor: "#E9E4DF", marginTop: 10 }]}
            activeOpacity={0.8}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  formWrapper: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffefdfcc",
    marginBottom: 25,
    textAlign: "center",
  },
  inputSection: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    color: "#ffefdfcc",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#E9E4DF",
    color: "#000",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#7b3e3eff",
  },
  customButton: {
    backgroundColor: "#83C7EC",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    borderColor: "#7b3e3eff",
    borderWidth: 2,
    alignItems: "center",
    marginTop: 10,
    width: "80%",
  },
  buttonText: {
    fontWeight: "600",
    color: "rgba(0, 0, 0, 0.8)",
  },
  dateText: {
    color: "#ffefdfcc",
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
  },
});
