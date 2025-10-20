import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MyTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="Home" options={{
        headerShown: false,
        tabBarIcon:({ color }) => <FontAwesome size={24} name="home" color={color} />
        }}/> 
      <Tabs.Screen name="Create" options={{
        headerShown: false,
        tabBarIcon:({ color }) => <Ionicons name="create" size={24} color={color} />
        }} />
      <Tabs.Screen name="Profile" options={{ 
        headerShown: false,
        tabBarIcon:({ color }) => <Ionicons name="settings" size={24} color={color} />
        }} />
      <Tabs.Screen name="timeBasedSaving" options={{ headerShown: false, href: null }} />
      <Tabs.Screen name="freeSaving" options={{ headerShown: false, href: null }} />
    </Tabs>
  );
}