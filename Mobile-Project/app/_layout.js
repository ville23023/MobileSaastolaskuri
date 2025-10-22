import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { initDB } from "./_sqlite/initDB";

export default function RootLayout() {

    useEffect(() => {
        initDB();
    }, []);

    return(
        <Stack>
            <Stack.Screen name="UserLogin" options={{ headerShown: false }} />
            <Stack.Screen name="UserSignUp" options={{ headerShown: false }} />
            <Stack.Screen name="createTimedSaving" options={{ title: "Create timed saving plan" }} />
            <Stack.Screen name="createOwnPace" options={{ title: "Create saving plan" }} />
            <Stack.Screen name="savedAmountList" options={{ title: "Saved Amounts" }} />
            <Stack.Screen name="adminPanel" options={{ title: "Admin panel" }} />
            <Stack.Screen name="(drawers)" options={{ headerShown: false }} />
        </Stack>
    )
}
