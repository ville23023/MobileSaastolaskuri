import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Create() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../../assets/background2.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topSection}>
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => router.push("/createOwnPace")}
          >
            <Text style={styles.buttonText}>Save at my own pace</Text>
          </TouchableOpacity>

          <Text style={styles.sectionHeader}>Or create timed saving plan.</Text>

          <TouchableOpacity
            style={styles.customButton}
            onPress={() => router.push("/createTimedSaving")}
          >
            <Text style={styles.buttonText}>Timed saving plan!</Text>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  middleSection: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  bottomSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  customButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#83C7EC",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7b3e3eff",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
    color: "rgba(0, 0, 0, 0.8)",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffefdfcc",
    marginVertical: 10,
    textAlign: "center",
  },
});
