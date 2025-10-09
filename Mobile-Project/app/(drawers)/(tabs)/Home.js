import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router"


export default function Home(){
  const router = useRouter();
  const [savingsList, setSavingsList] = useState(["Trip to Canary Island", "New Car", "New Computer"]);

  const pressHandler = () =>{
    console.log("item pressed");
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.topSection}>
        <Text > Welcome Username here!</Text>
      </View>

      <View style={styles.middleSection}>
        <Text > Your current saving plans!</Text>
        {savingsList.length > 0 ? (
          <FlatList 
          data={savingsList}
          keyExtractor={(item, index)=>index.toString()}
          renderItem={(item)=>
            <TouchableOpacity activeOpacity={0.8} onPress={pressHandler}>
              <View >
                <Text style={styles.itemStyle}> {item.index + 1}) {item.item} </Text>
              </View>
            </TouchableOpacity>
          }
          />
        ) : (
          <Text> No savings created! Go make one! </Text>
        )}
      </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity activeOpacity={0.8} style={styles.customButton} onPress={() => router.push("/Create")}>
              <Text>Create new savings goal</Text>
          </TouchableOpacity>
        </View>

      <StatusBar style="auto"/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
  },
  topSection:{
    flex:1,
  },
  middleSection:{
    flex:2,
  },
  bottomSection:{
    flex:1,
  },
  customButton:{
    marginTop:10,
    padding:15,
    borderBlockColor:"#7b3e3eff",
    borderRadius:8,
    borderWidth:2,
  },
  itemStyle:{
    fontSize:18,
    borderWidth:2,
    padding:5,
    borderRadius:8,
    margin:5,
  }

})
