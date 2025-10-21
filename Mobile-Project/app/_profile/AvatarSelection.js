import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { setAvatar } from "../_sqlite/profilePicture";
import { useRouter } from "expo-router";

const avatars = [
  require("../../assets/avatars/avatar0.png"),
  require("../../assets/avatars/avatar1.png"),
  require("../../assets/avatars/avatar2.png"),
  require("../../assets/avatars/avatar3.png"),
];

export default function AvatarSelection() {
  const router = useRouter();

  const handleSelect = async (id) => {
    await setAvatar(id);
    router.back();
  };

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={3}
        data={avatars}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleSelect(index)} style={styles.item}>
            <Image source={item} style={styles.avatar} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center"
  },
  item: { margin: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50 }
});
