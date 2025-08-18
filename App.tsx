import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";
import { RadioPlayer } from "./src/components/RadioPlayer";

export default function App() {
  useEffect(() => {
    // Registrar o serviço de background para o TrackPlayer
    TrackPlayer.registerPlaybackService(() =>
      require("./src/services/trackPlayerService")
    );
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RadioPlayer />
    </SafeAreaProvider>
  );
}
