import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const [savingsList, setSavingsList] = useState([
    "Trip to Canary Island",
    "New Car",
    "New Computer",
  ]);

  const pressHandler = () => {
    console.log("item pressed");
  };

  return (
    <ImageBackground
      source={require("../../../assets/background3.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.welcomeText}>Welcome "Username"!</Text>
        </View>

        <View style={styles.middleSection}>
          <Text style={styles.sectionHeader}>Your current saving plans!</Text>

          {savingsList.length > 0 ? (
            <FlatList
              data={savingsList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item) => (
                <TouchableOpacity activeOpacity={0.8} onPress={pressHandler}>
                  <View>
                    <Text style={styles.itemStyle}>
                      {item.index + 1}) {item.item}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noItemsText}>
              No savings created! Go make one!
            </Text>
          )}
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.customButton}
            onPress={() => router.push("/Create")}
          >
            <Text style={styles.buttonText}>Create new savings goal</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  middleSection: {
    flex: 2,
    width: "90%",
    alignItems: "center",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  itemStyle: {
    fontSize: 18,
    backgroundColor: "#E9E4DF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    width: "100%",
    color: "#000",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffefdfcc",
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffefdfcc",
    marginBottom: 10,
  },
  noItemsText: {
    fontSize: 14,
    color: "#D5DEE9",
    marginTop: 10,
    textAlign: "center",
  },
});
