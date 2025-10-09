import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Create(){
  const [goal, setGoal] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  // const [weekly, setWeekly] = useState("");
  const router = useRouter();

  const goalHandler = (goal) =>{
    setGoal(goal);
  }

  const targetAmountHandler = (targetAmount) =>{
    setTargetAmount(targetAmount)
  }
  
  // const weeklyAmountHandler = (weeklyAmount) =>{
  //   setWeekly(weeklyAmount)
  // }

  const createSavingGoal = () =>{
    return{
      "Goal":goal,
      "TargetAmount":targetAmount,
      // "WeeklyAmount":weekly,
    }
  }

  const checkInputText = () =>{
    if(!goal.trim()){
      alert("Please enter name of your Goal");
      return;
    }

    if(!targetAmount.trim()){
      alert("Please enter target amount!");
      return;
    }
    // if(!weekly.trim()){
    //   alert("Please enter weekly saving amount");
    //   return;
    // }
    createHandler();
  }

  const clearInputs = () =>{
    setGoal("");
    setTargetAmount("");
    // setWeekly("");
  }

  const createHandler = () =>{
    let newGoal = createSavingGoal()
    console.log(newGoal);
    clearInputs();
    router.replace({
      pathname: "/freeSaving",
      params: {
        goal: newGoal.Goal,
        targetAmount: newGoal.TargetAmount,
      }
    });
  }
    return(
        <SafeAreaView style={styles.container}>

            <View style={styles.bottomSection}>
              <Text>Own pace saving</Text>
              <View>
                  <Text>Name your goal</Text>
                  <TextInput placeholder="Your goal name here" onChangeText={goalHandler} style={styles.input}/>
              </View>

              <View>
                  <Text>Targer amount</Text>
                  <TextInput placeholder="Target amount" onChangeText={targetAmountHandler} style={styles.input}/>

                  {/* <Text>Weekly amount</Text>
                  <TextInput placeholder="Weekly amount" onChangeText={weeklyAmountHandler} style={styles.input}/> */}
              </View>

              <View>
                <TouchableOpacity style={styles.customButton} onPress={checkInputText}>
                  <Text>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  topSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  middleSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSection: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  customButton: {
    marginTop: 10,
    padding: 15,
    borderColor: "#7b3e3eff",
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: "#D9CDB7",
  },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#7b3e3eff",
    backgroundColor: "#DBF1FB",
    padding: 10,
    marginBottom: 10,
    width: 250,
    color: "#000",
  },
  text: {
    color: "#ECF3FB",
    fontSize: 16,
    marginBottom: 5,
  },
});
