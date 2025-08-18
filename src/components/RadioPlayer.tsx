import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRadioPlayer } from "../hooks/useRadioPlayer";
import AnimatedDisc from "./AnimatedDisc";

const { width } = Dimensions.get("window");

export const RadioPlayer: React.FC = () => {
  const {
    isPlaying,
    isLoading,
    error,
    volume,
    isMuted,
    togglePlayback,
    changeVolume,
    toggleMute,
  } = useRadioPlayer();

  const openSocialMedia = (url: string) => {
    Linking.openURL(url);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return "volume-mute";
    } else if (volume < 0.5) {
      return "volume-low";
    } else {
      return "volume-high";
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/fundo.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Logo da Rádio */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/logo102kbum.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Player Card */}
        <View style={styles.playerCard}>
          <Text style={styles.stationName}>KBUM 102.7 FM</Text>

          {/* Disco Animado */}
          <TouchableOpacity onPress={togglePlayback} disabled={isLoading}>
            <AnimatedDisc
              isPlaying={isPlaying}
              isLoading={isLoading}
              size={200}
            />
          </TouchableOpacity>

          {/* Controle de Volume */}
          <View style={styles.volumeContainer}>
            <TouchableOpacity onPress={toggleMute}>
              <Ionicons
                name={getVolumeIcon()}
                size={24}
                color={isMuted ? "#FF6B35" : "#FF6B35"}
              />
            </TouchableOpacity>
            <Slider
              style={styles.volumeSlider}
              minimumValue={0}
              maximumValue={1}
              value={isMuted ? 0 : volume}
              onValueChange={changeVolume}
              minimumTrackTintColor="#FF6B35"
              maximumTrackTintColor="#FF6B35"
            />
          </View>

          <Text style={styles.tapToListen}>Toque para ouvir</Text>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {/* Redes Sociais */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openSocialMedia("https://facebook.com")}
          >
            <Ionicons name="logo-facebook" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openSocialMedia("https://instagram.com")}
          >
            <Ionicons name="logo-instagram" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openSocialMedia("https://youtube.com")}
          >
            <Ionicons name="logo-youtube" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    marginTop: -50,
    marginBottom: -50,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 95,
    paddingBottom: 20,
    position: "relative",
    zIndex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 300,
  },
  playerCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 30,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    marginHorizontal: 20,
    width: width - 0,
    maxWidth: 350,
  },
  stationName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  volumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 20,
    width: "100%",
  },
  volumeSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: 15,
  },
  volumeTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    marginHorizontal: 15,
    position: "relative",
  },
  volumeProgress: {
    width: "60%",
    height: "100%",
    backgroundColor: "#FF6B35",
    borderRadius: 2,
  },
  tapToListen: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 10,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 80,
    paddingBottom: 0,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
