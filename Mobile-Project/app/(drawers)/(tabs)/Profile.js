import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { getAvatar } from "../../_sqlite/profilePicture";

const avatars = [
  require("../../../assets/avatars/avatar0.png"),
  require("../../../assets/avatars/avatar1.png"),
  require("../../../assets/avatars/avatar2.png"),
  require("../../../assets/avatars/avatar3.png"),
];

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [avatar, setAvatar] = useState(0);
  const router = useRouter();
  const isFocused = useIsFocused();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // token
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken) {
        Alert.alert("Login required", "Log in first", [
          { text: "OK", onPress: () => router.replace("/UserLogin") }
        ]);
        return;
      }
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  // avatar päivittyy kun sivu avautuu TAI kun siihen palataan
  useEffect(() => {
    if (isFocused) {
      (async () => {
        const current = await getAvatar();
        setAvatar(current);
      })();
    }
  }, [isFocused]);

  // fetch user from API
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        if (response.status === 401) {
          await AsyncStorage.removeItem("token");
          Alert.alert("Session expired", "Please log in again", [
            { text: "OK", onPress: () => router.replace("/UserLogin") }
          ]);
          return;
        }

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.log("User fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const saveProfile = async () => {
    if (!token || !user) return;

    try {
      const response = await fetch(`${API_URL}/api/user/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userName: user.userName,
          email: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      Alert.alert("Success", "Profile updated");
    } catch (err) {
      console.log("Save profile error:", err.message);
      Alert.alert("Error", "Profile could not be updated");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: "rgba(0,0,0,0.8)" }]}>
        <ActivityIndicator size="large" color="#83C7EC" />
        <Text style={{ color: "#ffefdfcc", marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>Failed to load user data</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>

        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your information:</Text>

        <TouchableOpacity onPress={() => router.push("/_profile/AvatarSelection")}>
          <Image
            source={avatars[avatar]}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20 }}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={user.userName || ""}
          onChangeText={(text) => setUser({ ...user, userName: text })}
        />
        <TextInput
          style={styles.input}
          value={user.email || ""}
          onChangeText={(text) => setUser({ ...user, email: text })}
        />

        <TouchableOpacity style={styles.button} onPress={saveProfile}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/Home")}>
          <Text style={styles.registerText}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#ffefdfcc",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "rgba(255, 255, 255, 0.8)",
  },
  input: {
    width: "80%",
    backgroundColor: "#e6e6e6",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#83C7EC",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 6,
    marginBottom: 20,
  },
  buttonText: {
    fontWeight: "600",
    color: "rgba(0, 0, 0, 0.8)",
  },
  registerText: {
    fontSize: 16,
    color: "#ffefdfcc",
  },
});
