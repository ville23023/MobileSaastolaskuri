import { Stack } from "expo-router";

export default function RootLayout(){
    return(
    <Stack>
        <Stack.Screen name="UserLogin" options={{ headerShown: false }} />
        <Stack.Screen name="UserSignUp" options={{ headerShown: false }} />
        <Stack.Screen name="createTimedSaving" options={{ title: "Luo ajastettu suunnitelma" }} />
        <Stack.Screen name="createOwnPace" options={{ title: "Luo ajaton suunnitelma" }} />
        <Stack.Screen name="savedAmountList" options={{ title: "Saved Amounts" }} />
        <Stack.Screen name="(drawers)" options={{ headerShown: false }} />
    </Stack>
    )
}