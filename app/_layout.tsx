import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { initializeTrackPlayer } from "../src/services/trackPlayerSetup";

export default function RootLayout() {
  useEffect(() => {
    // Inicializar o TrackPlayer uma única vez quando a aplicação inicia
    initializeTrackPlayer();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
