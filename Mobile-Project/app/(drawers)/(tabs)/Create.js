import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Create() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../../assets/background3.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.contentBox}>
          <Text style={styles.headerText}>Choose your saving plan</Text>

          <TouchableOpacity
            style={styles.customButton}
            activeOpacity={0.85}
            onPress={() => router.push("/createOwnPace")}
          >
            <Text style={styles.buttonText}>Save at my own pace</Text>
          </TouchableOpacity>

          <Text style={styles.dividerText}>or</Text>

          <TouchableOpacity
            style={[styles.customButton, { backgroundColor: "#E9E4DF" }]}
            activeOpacity={0.85}
            onPress={() => router.push("/createTimedSaving")}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>
              Timed saving plan
            </Text>
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
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  contentBox: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 30,
    width: "90%",
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffefdfcc",
    marginBottom: 25,
    textAlign: "center",
  },
  customButton: {
    backgroundColor: "#83C7EC",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7b3e3eff",
    alignItems: "center",
    marginVertical: 10,
    width: "80%",
  },
  buttonText: {
    fontWeight: "600",
    color: "rgba(0, 0, 0, 0.8)",
  },
  dividerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffefdfcc",
    marginVertical: 15,
  },
});
