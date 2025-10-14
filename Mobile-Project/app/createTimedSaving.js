import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateTimedSaving(){
  const [goal, setGoal] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  // const [weekly, setWeekly] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState("");
  const [token, setToken] = useState(null);
  const router = useRouter();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(()=>{
    const getToken = async () =>{
      let storedToken = null;
      try{
        storedToken = await AsyncStorage.getItem("token");
      }catch (error){
        console.log("Fetching token error", error);
      }
      if(storedToken !== null){
        setToken(storedToken);
      }
    }
    getToken()
  },[])

  const dateChangeHandler = (event, selectedDate) =>{
    setOpen(false);
    if (event.type === 'set' && selectedDate) {
      if (mode === "start") {
        setStartDate(selectedDate);
      } else if (mode === "end") {
        setEndDate(selectedDate);
      }
    }
    setTimeout(() => setOpen(false), 0);
    setMode("");
  }

  const showMode = (whichDate) =>{
    setMode(whichDate);
    setOpen(true);
  }

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
      "goalName":goal,
      "targetAmount":targetAmount,
      //"WeeklyAmount":weekly,
      "endDate":endDate.toISOString().split("T")[0],
      "startDate":startDate.toISOString().split("T")[0],
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

  const createHandler = async () =>{

    if(!token){
      alert("Token not found! Please login again");
      return;
    }
    try{
    let newGoal = createSavingGoal()
    console.log(newGoal);
    let response = await fetch(`${API_URL}:3000/api/create_saving_goal`,{
      method:"POST",
      headers:{
        "Content-type":"application/json",
        "Authorization":`Bearer ${token}`,
      },
      body:JSON.stringify(newGoal)
    });
    if(!response.ok){
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create goal");
    }
    let json = await response.json();
    console.log(json);
    clearInputs();
    router.replace("/Home");

    }catch(error){
      console.log("Error creating goal",error.message);
    }
  }

    return(
        <SafeAreaView style={styles.container}>

            <View style={styles.bottomSection}>
              <Text>Timed saving plan</Text>
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

              <TouchableOpacity title="Choose your start date" style={styles.customButton} onPress={()=>showMode("start")}>
                <Text>Choose your start date</Text>
              </TouchableOpacity>
              <Text>{startDate.toLocaleDateString('fi-FI')}</Text>

              <TouchableOpacity title="Choose your end date" style={styles.customButton} onPress={()=>showMode("end")}>
                <Text>Choose your end date</Text>
              </TouchableOpacity>
              <Text>{endDate.toLocaleDateString('fi-FI')}</Text>
                {
                  open && (
                    <DateTimePicker
                      value={mode === 'start' ? startDate : endDate}
                      mode="date"
                      display="spinner"
                      locale="fi-FI"
                      onChange={dateChangeHandler}
                    />
                  )}

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
    borderColor: "#83C7EC",
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: "#D9CDB7",
  },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#D1B9AA",
    backgroundColor: "#DBF1FB",
    padding: 10,
    marginBottom: 10,
    color: "#000",
    width: 250,
  },
  text: {
    color: "#ECF3FB",
    fontSize: 16,
    marginBottom: 5,
  },
});
