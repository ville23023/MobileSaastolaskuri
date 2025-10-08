import { Stack } from "expo-router";

export default function RootLayout(){
    return(
    <Stack>
        <Stack.Screen name="UserLogin" options={{ headerShown: false }} />
        <Stack.Screen name="UserSignUp" options={{ headerShown: false }} />
        <Stack.Screen name="(drawers)" options={{ headerShown: false }}/>
        <Stack.Screen name="UserProfile" options={{ headerShown: false }} />
    </Stack>
    )
}