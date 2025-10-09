import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Create(){

  const router = useRouter();

    return(
        <SafeAreaView style={styles.container}>
          <View style={styles.topSection}>
            <TouchableOpacity style={styles.customButton} onPress={() =>router.push("/createOwnPace")}>
              <Text>Save at my own pace</Text>
            </TouchableOpacity>

            <Text> Or create timed saving plan.</Text>

            <TouchableOpacity style={styles.customButton} onPress={() =>router.push("/createTimedSaving")}>
              <Text>Timed saving plan!</Text>
            </TouchableOpacity>
          </View>
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
    alignItems:"center",
    justifyContent:"center"
  },
  middleSection:{
    alignItems:"center",
    justifyContent:"center"
  },
  bottomSection:{
    flex:1,
    alignItems:"center",
  },
  customButton:{
    marginTop:10,
    padding:15,
    borderBlockColor:"#7b3e3eff",
    borderRadius:8,
    borderWidth:2,
  },
  input:{
    borderWidth:2,
    borderRadius:8,
    borderBlockColor:"#7b3e3eff",
  }
})