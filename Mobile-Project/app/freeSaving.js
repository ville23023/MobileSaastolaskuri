import { Button, StyleSheet, Text, View, TextInput } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from "expo-router";

function ProgressBar({ savingsPercentage }) {
    return (     
        <View style={styles.grayBackground}>
          <View style={[styles.greenFill, { width: `${savingsPercentage}%` }]}></View>
          <Text style={styles.percentageSaved}>{savingsPercentage}% saved</Text>
        </View>
    );
  }

export default function FreeSaving({ navigation }) {
    const {goal, targetAmount} = useLocalSearchParams();
    const [savedAmount, setSavedAmount] = useState(0);
    const savingsPercentage = ((savedAmount / targetAmount) * 100).toFixed(2);
    const [goalAchieved, setGoalAchieved] = useState(false); 
    const [input, setInput] = useState('');

useEffect(() => {
    if (savedAmount >= targetAmount) {
        setGoalAchieved(true);
    } else {
        setGoalAchieved(false);
      }
    }, [savedAmount, targetAmount]);

const inputHandler=()=>{
    const inputValue = parseFloat(input);
    if (!isNaN(inputValue)) {
        setSavedAmount(prev => prev + inputValue)
        setInput('');
  }}
  return (
    <SafeAreaView style={styles.container}>

      <View>
        <Text style={{fontWeight: '600', fontSize: 20,}}>{goal}</Text>
      </View>
        
      <View style={styles.goalAchieved}>
        {goalAchieved ? (
          <Text style={{fontWeight: '400', fontSize: 18, textAlign: 'center'}}>
            Congratulations!{'\n'}You have achieved your savings goal!
          </Text> 
          ) :  null}
      </View>

      <View style={styles.savingsSummaryRow}>
        <View style={styles.savingsSummaryItem}>
          <Text style={styles.titleText}>Savings so far</Text> 
          <Text style={styles.text}>{savedAmount}</Text>
        </View>
        <View style={styles.savingsSummaryItem}>
          <Text style={styles.titleText}>Target amount</Text>
          <Text style={styles.text}>{targetAmount}</Text>
        </View>
      </View>

      <ProgressBar savingsPercentage = {savingsPercentage} />

      <View style={styles.savedAmount}>
        <Text style={styles.titleText}>Enter saved amount:</Text>
        <TextInput style={styles.text}
          value={input}
          onChangeText={setInput}/>
        <Button title='Save' onPress={inputHandler}/>
      </View>
    </SafeAreaView>
        
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 30,
    },
    goalAchieved: {
        width: '80%',
    },
    savingsSummaryRow: {
        flexDirection: "row",
        gap: 20,
        justifyContent: 'center',
      },
      savingsSummaryItem: {
        gap: 10,
        width: '30%',
      },
      titleText: {  
        textAlign: 'center',
        fontWeight: '400', 
        fontSize: 16,
      },
      text: { 
        textAlign: 'center',
        backgroundColor: '#e5e5e5',
        padding: 8, 
        borderRadius: 4,
        fontSize: 16,
        fontWeight: '450',
      },
      grayBackground: {
        height: 40,
        width: '65%',
        backgroundColor: '#e5e5e5',
        overflow: 'hidden',
        position: 'relative',
        justifyContent: "center",
      },
      greenFill: {
        height: '100%',
        backgroundColor: '#2ecc71',
        position: 'absolute',
      },
      percentageSaved: {
        fontSize: 16,
        textAlign: 'center',
      },
      savedAmount: {
        gap: 10,
      },
  });