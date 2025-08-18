import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  StatusBar,
} from "react-native";

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada
    const startAnimation = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(logoRotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          { iterations: 2 }
        ),
      ]).start();

      // Terminar após 3 segundos
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onFinish?.();
        });
      }, 3000);
    };

    startAnimation();
  }, [fadeAnim, scaleAnim, logoRotateAnim, onFinish]);

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />

      {/* Background gradiente */}
      <View style={styles.gradientBackground} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo da rádio */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ rotate: logoRotation }],
            },
          ]}
        >
          <Image
            source={require("../../assets/images/logo102kbum.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Título da rádio */}
        <Text style={styles.title}>KBUM 102.7 FM</Text>
        <Text style={styles.subtitle}>A SUA RÁDIO FAVORITA</Text>

        {/* Indicador de carregamento */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  opacity: fadeAnim,
                },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </Animated.View>

      {/* Ondas de áudio decorativas */}
      <View style={styles.wavesContainer}>
        {[...Array(5)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.wave,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    scaleY: logoRotateAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.5, 1.5, 0.5],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FF6B35",
    opacity: 0.9,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 50,
    letterSpacing: 2,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 10,
  },
  loadingProgress: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  wavesContainer: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 5,
  },
  wave: {
    width: 4,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 2,
  },
});
