import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RadioPlayer } from "../src/components/RadioPlayer";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RadioPlayer />
    </SafeAreaProvider>
  );
}
