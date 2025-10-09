import { Tabs } from 'expo-router';

export default function MyTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="Home" options={{ headerShown: false }} /> 
      <Tabs.Screen name="Create" options={{ headerShown: false }} />
      <Tabs.Screen name="Profile" options={{ headerShown: false}} />
      <Tabs.Screen name="timeBasedSaving" options={{ headerShown: false, href: null }} />
      <Tabs.Screen name="freeSaving" options={{ headerShown: false, href: null }} />
    </Tabs>
  );
}