import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Linking,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRadioPlayer } from "../hooks/useRadioPlayer";
import {
  useResponsiveDimensions,
  getResponsiveSize,
  getResponsivePadding,
} from "../hooks/useResponsiveDimensions";
import {
  getDeviceConfig,
  getResponsiveFontSize,
} from "../utils/responsiveUtils";
import AnimatedDisc from "./AnimatedDisc";

// Componente da bolinha piscante
const BlinkingDot: React.FC = () => {
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );

    blinkAnimation.start();

    return () => {
      blinkAnimation.stop();
    };
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.blinkingDot,
        {
          opacity: opacityAnim,
        },
      ]}
    />
  );
};

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

  const dimensions = useResponsiveDimensions();
  const padding = getResponsivePadding(dimensions);

  // Usar configuração de dispositivo mais avançada
  const deviceConfig = getDeviceConfig(dimensions.width, dimensions.height);

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

  // Tamanhos responsivos baseados na configuração do dispositivo
  const logoSize = 280; // Mantém tamanho fixo mais adequado
  const discSize = deviceConfig.discSize;
  const playerCardWidth = deviceConfig.cardMaxWidth;
  const socialButtonSize = getResponsiveSize(50, dimensions, 40, 70);

  // Tamanhos de fonte responsivos
  const fontSize = {
    stationName: getResponsiveFontSize(
      deviceConfig.fontSize.title,
      dimensions.width,
      dimensions.fontScale
    ),
    liveText: getResponsiveFontSize(
      deviceConfig.fontSize.subtitle,
      dimensions.width,
      dimensions.fontScale
    ),
    tapToListen: getResponsiveFontSize(
      deviceConfig.fontSize.subtitle,
      dimensions.width,
      dimensions.fontScale
    ),
    error: getResponsiveFontSize(
      deviceConfig.fontSize.body,
      dimensions.width,
      dimensions.fontScale
    ),
  };

  return (
    <ImageBackground
      source={require("../../assets/images/fundo.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View
        style={[
          styles.container,
          { paddingHorizontal: padding.horizontal },
          dimensions.isLandscape && styles.landscapeContainer,
        ]}
      >
        {/* Logo da Rádio */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/logo102kbum.png")}
            style={[
              styles.logo,
              { width: logoSize, height: logoSize },
              dimensions.isLandscape && {
                width: logoSize * 0.8,
                height: logoSize * 0.8,
              },
            ]}
            resizeMode="contain"
          />
        </View>

        {/* Player Card */}
        <View
          style={[
            styles.playerCard,
            { width: playerCardWidth },
            dimensions.isLandscape && styles.landscapePlayerCard,
          ]}
        >
          <Text
            style={[styles.stationName, { fontSize: fontSize.stationName }]}
          >
            KBUM 102.7 FM
          </Text>

          {/* Disco Animado */}
          <TouchableOpacity
            onPress={togglePlayback}
            disabled={isLoading}
            activeOpacity={1}
            style={styles.discTouchable}
          >
            <AnimatedDisc
              isPlaying={isPlaying}
              isLoading={isLoading}
              size={discSize}
            />
          </TouchableOpacity>

          {/* Controle de Volume */}
          <View style={styles.volumeContainer}>
            <TouchableOpacity onPress={toggleMute}>
              <Ionicons
                name={getVolumeIcon()}
                size={getResponsiveSize(24, dimensions, 20, 28)}
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
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#FF6B35"
            />
          </View>

          <View style={styles.statusContainer}>
            {isPlaying ? (
              <View style={styles.liveStatusContainer}>
                <BlinkingDot />
                <Text
                  style={[styles.liveText, { fontSize: fontSize.liveText }]}
                >
                  Ao vivo
                </Text>
              </View>
            ) : (
              <Text
                style={[styles.tapToListen, { fontSize: fontSize.tapToListen }]}
              >
                Toque para ouvir
              </Text>
            )}
          </View>

          {error && (
            <Text style={[styles.errorText, { fontSize: fontSize.error }]}>
              {error}
            </Text>
          )}

          {/* Redes Sociais dentro do Player */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[
                styles.socialButton,
                styles.facebookButton,
                {
                  width: socialButtonSize * 0.8,
                  height: socialButtonSize * 0.8,
                  borderRadius: (socialButtonSize * 0.8) / 2,
                },
              ]}
              onPress={() =>
                openSocialMedia("https://www.facebook.com/radiokbum102")
              }
            >
              <Ionicons
                name="logo-facebook"
                size={getResponsiveSize(20, dimensions, 16, 24)}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialButton,
                styles.instagramButton,
                {
                  width: socialButtonSize * 0.8,
                  height: socialButtonSize * 0.8,
                  borderRadius: (socialButtonSize * 0.8) / 2,
                },
              ]}
              onPress={() =>
                openSocialMedia("https://www.instagram.com/radiokbum102")
              }
            >
              <Ionicons
                name="logo-instagram"
                size={getResponsiveSize(20, dimensions, 16, 24)}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialButton,
                styles.youtubeButton,
                {
                  width: socialButtonSize * 0.8,
                  height: socialButtonSize * 0.8,
                  borderRadius: (socialButtonSize * 0.8) / 2,
                },
              ]}
              onPress={() =>
                openSocialMedia("https://www.youtube.com/@radiokbum102")
              }
            >
              <Ionicons
                name="logo-youtube"
                size={getResponsiveSize(20, dimensions, 16, 24)}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialButton,
                styles.whatsappButton,
                {
                  width: socialButtonSize * 0.8,
                  height: socialButtonSize * 0.8,
                  borderRadius: (socialButtonSize * 0.8) / 2,
                },
              ]}
              onPress={() => openSocialMedia("https://wa.me/5511999999999")}
            >
              <Ionicons
                name="logo-whatsapp"
                size={getResponsiveSize(20, dimensions, 16, 24)}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Rádio KBUM 102.7 FM • 2025</Text>
          <Text style={styles.footerSubText}>Todos os direitos reservados</Text>
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
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 80,
    position: "relative",
    zIndex: 1,
  },
  landscapeContainer: {
    paddingTop: 30,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    // Tamanho dinâmico aplicado via props
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
    alignSelf: "center",
    // Largura dinâmica aplicada via props
  },
  landscapePlayerCard: {
    marginBottom: 10,
    padding: 8,
  },
  stationName: {
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    // Tamanho da fonte dinâmico aplicado via props
  },
  discTouchable: {
    borderRadius: 100,
    overflow: "hidden",
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
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    // Tamanho da fonte dinâmico aplicado via props
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    minHeight: 30,
  },
  liveStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  liveText: {
    color: "#22c55e",
    fontWeight: "600",
    textAlign: "center",
    // Tamanho da fonte dinâmico aplicado via props
  },
  blinkingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 10,
    // Tamanho da fonte dinâmico aplicado via props
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginTop: 15,
    paddingHorizontal: 10,
    flexWrap: "wrap",
  },
  landscapeSocialContainer: {
    gap: 12,
    marginTop: 10,
  },
  socialButton: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  facebookButton: {
    backgroundColor: "#1877f2",
  },
  instagramButton: {
    backgroundColor: "#E4405F",
  },
  youtubeButton: {
    backgroundColor: "#FF0000",
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  // Estilos do footer
  footerContainer: {
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 40,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  footerSubText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
});
