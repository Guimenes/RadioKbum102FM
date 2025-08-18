import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRadioPlayer } from "../hooks/useRadioPlayer";

const { width, height } = Dimensions.get("window");

export const RadioPlayer: React.FC = () => {
  const { isPlaying, isLoading, error, togglePlayback } = useRadioPlayer();

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
        style={styles.overlay}
      >
        <View style={styles.container}>
          {/* Logo da Rádio */}
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>KBUM</Text>
              <Text style={styles.logoSubtext}>102 FM</Text>
            </View>
          </View>

          {/* Informações da Rádio */}
          <View style={styles.infoContainer}>
            <Text style={styles.stationName}>Rádio Kbum 102 FM</Text>
            <Text style={styles.nowPlaying}>
              {isPlaying ? "Ao Vivo" : "Parado"}
            </Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* Controles do Player */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={togglePlayback}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <Text style={styles.playButtonText}>
                  {isPlaying ? "⏸️" : "▶️"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Status */}
          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  isPlaying ? styles.statusDotOnline : styles.statusDotOffline,
                ]}
              />
              <Text style={styles.statusText}>
                {isPlaying ? "AO VIVO" : "OFFLINE"}
              </Text>
            </View>
          </View>

          {/* Informações adicionais */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>A melhor música está aqui!</Text>
            <Text style={styles.frequencyText}>102.0 FM</Text>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  logoSubtext: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 5,
  },
  infoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  stationName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  nowPlaying: {
    fontSize: 18,
    color: "#ccc",
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 10,
  },
  controlsContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  playButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playButtonText: {
    fontSize: 40,
    color: "#fff",
  },
  statusContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusDotOnline: {
    backgroundColor: "#00ff00",
  },
  statusDotOffline: {
    backgroundColor: "#ff0000",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  footerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 5,
  },
  frequencyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
