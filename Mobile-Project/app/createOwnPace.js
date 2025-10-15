import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Create() {
  const [goal, setGoal] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const router = useRouter();

  const goalHandler = (goal) => setGoal(goal);
  const targetAmountHandler = (amount) => setTargetAmount(amount);

  const createSavingGoal = () => ({
    Goal: goal,
    TargetAmount: targetAmount,
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

  const createHandler = () => {
    const newGoal = createSavingGoal();
    clearInputs();
    router.replace({
      pathname: "/freeSaving",
      params: {
        goal: newGoal.Goal,
        targetAmount: newGoal.TargetAmount,
      },
    });
  };

  return (
    <ImageBackground
      source={require("../assets/background4.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.formWrapper}>
          <Text style={styles.headerText}>Create a New Saving Goal</Text>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Name your goal</Text>
            <TextInput
              placeholder="Your goal name here"
              placeholderTextColor="rgba(0,0,0,0.4)"
              onChangeText={goalHandler}
              value={goal}
              style={styles.input}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Target amount</Text>
            <TextInput
              placeholder="Target amount"
              placeholderTextColor="rgba(0,0,0,0.4)"
              onChangeText={targetAmountHandler}
              value={targetAmount}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

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
});
