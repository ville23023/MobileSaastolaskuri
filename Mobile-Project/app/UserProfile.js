import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Tämä simuloisi MongoDB:stä haettua käyttäjätietoa
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // myöhemmin tähän esim:
        // const response = await fetch("https://your-api.com/api/user/123");
        // const data = await response.json();
        const data = {
          name: "Käyttäjä",
          email: "Käyttäjä@sposti.com",
        };
        setUser(data);
      } catch (error) {
        console.error("Käyttäjätietojen haku epäonnistui:", error);
        alert("Virhe käyttäjätietojen haussa");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const saveProfile = async () => {
    if (!user?.name.trim() || !user?.email.trim() || !user?.goal.trim()) {
      alert("Täytä kaikki kentät!");
      return;
    }

    try {
      console.log("Tallennetaan profiili:", user);
      // myöhemmin tähän:
      // await fetch("https://your-api.com/api/user/update", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(user),
      // });
      alert("Profiili tallennettu!");
    } catch (error) {
      console.error("Tallennus epäonnistui:", error);
      alert("Virhe tallennuksessa");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: "rgba(0,0,0,0.8)" }]}>
        <ActivityIndicator size="large" color="#7d6ef1" />
        <Text style={{ color: "#ffefdfcc", marginTop: 10 }}>Ladataan profiilia...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Profiili</Text>
        <Text style={styles.subtitle}>Hallinnoi tietojasi:</Text>

        <TextInput
          style={styles.input}
          value={user?.name}
          onChangeText={(text) => setUser({ ...user, name: text })}
          placeholder="Nimi"
          placeholderTextColor="#555"
        />
        <TextInput
          style={styles.input}
          value={user?.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
          placeholder="Sähköposti"
          placeholderTextColor="#555"
        />

        <TouchableOpacity style={styles.button} onPress={saveProfile}>
          <Text style={styles.buttonText}>Tallenna</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/TÄYTÄ TÄHÄN ROUTE (HOMEPAGE)")}>
          <Text style={styles.registerText}>← Takaisin kotiin</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#ffefdfcc",
  },
  subtitle: {
    fontSize: 14,
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
    backgroundColor: "#7d6ef1",
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
    fontSize: 14,
    color: "#ffefdfcc",
  },
});
