import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function Layout() {
  return (
    <>
    <StatusBar backgroundColor="#1c1429" />
    
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    </>
  );
}
