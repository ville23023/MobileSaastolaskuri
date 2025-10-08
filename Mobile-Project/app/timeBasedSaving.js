import { Button, StyleSheet, Text, View, TextInput } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from 'react-native-svg';
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
function DonutChart({ timeUp, goalAchieved, progress}) {
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
            stroke={timeUp && !goalAchieved ? '#E74C3C' : "#14274E"}
            fill="transparent"
            strokeWidth="30"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            // strokeLinecap="round"
            transform="rotate(-90 90 90)"
          />
      </Svg>
      <Text style={styles.percentageText}>Time elapsed{'\n'}{Math.round(progress * 100)}%</Text>
    </View>
    )
  }
export default function TimeSavingDetails({ navigation }) {
    const {goal, selectedDate, targetAmount, startDate} = useLocalSearchParams();
    const newSelectedDate = new Date(selectedDate);
    const newStartDate = new Date(startDate);
    const newTargetAmount = parseFloat(targetAmount);
    const [progress, setProgress] = useState(0);
    const [timeUp, setTimeUp] = useState(false);
    const [goalAchieved, setGoalAchieved] = useState(false); 
    const [savedAmount, setSavedAmount] = useState(0);
    const savingsPercentage = ((savedAmount / newTargetAmount) * 100).toFixed(2);
    const [input, setInput] = useState('');

  useEffect(() => {
    const now = new Date();
    const totalDuration = newSelectedDate - newStartDate;
    const elapsed = now - newStartDate;
    const progressPercentage  = Math.min(Math.max(elapsed / totalDuration, 0), 1);

    setProgress(progressPercentage);
        if (now > newSelectedDate) {
        setTimeUp(true);
      }
    if (savedAmount >= targetAmount) {
        setGoalAchieved(true);
      } else {
        setGoalAchieved(false);
      }
  }, 
  [startDate, selectedDate, savedAmount, targetAmount]);

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
          {timeUp && !goalAchieved ? (
          <Text style={{fontWeight: '400', fontSize: 18, textAlign: 'center'}}>
              Oops!{'\n'}Time's up, you didn't reach your goal
          </Text> 
          ) : goalAchieved ? (
          <Text style={{fontWeight: '400', fontSize: 18, textAlign: 'center'}}>
              Congratulations!{'\n'}You have achieved your savings goal!
          </Text> 
          ) :  null}
        </View>

        <View style={styles.timeProgressRow}>
          <DonutChart timeUp={timeUp} goalAchieved={goalAchieved} progress={progress}/>
          <View style={styles.timeProgressDetail}>
            <Text style={styles.titleText}>Started at</Text> 
            <Text style={styles.text}>{newStartDate.toLocaleDateString('fi-FI')}</Text>
            <Text style={styles.titleText}>Targer date</Text> 
            <Text style={styles.text}>{newSelectedDate.toLocaleDateString('fi-FI')}</Text>
            <Text style={styles.titleText}>Days left</Text>
            <Text style={styles.text}>{Math.max(Math.ceil((newSelectedDate - new Date()) / (1000 * 60 * 60 * 24)), 0)}</Text>
          </View>
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
    timeProgressRow: {
        flexDirection: "row",
        gap: 20,
      },
      graphWrapper: {
        alignItems: "center",
        justifyContent: "center",
      },
      percentageText: {
        position: 'absolute',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 13,
        color: '#394867',
      },
      timeProgressDetail: {
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
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