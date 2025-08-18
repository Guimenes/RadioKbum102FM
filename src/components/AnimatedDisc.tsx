import React, { useEffect, useRef, memo } from "react";
import { StyleSheet, View, Image, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AnimatedDiscProps {
  isPlaying: boolean;
  isLoading?: boolean;
  size?: number;
}

const AnimatedDisc = memo(
  ({ isPlaying, isLoading = false, size = 150 }: AnimatedDiscProps) => {
    const rotateAnimation = useRef(new Animated.Value(0)).current;
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
      // Para qualquer animação existente
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }

      if (isPlaying) {
        // Cria uma animação infinita e contínua
        const createInfiniteRotation = () => {
          return Animated.loop(
            Animated.timing(rotateAnimation, {
              toValue: 1,
              duration: 3000, // 3 segundos por rotação (um pouco mais rápido)
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            { iterations: -1 }
          );
        };

        // Reseta o valor para 0 e inicia nova animação
        rotateAnimation.setValue(0);
        animationRef.current = createInfiniteRotation();
        animationRef.current.start();
      }

      return () => {
        if (animationRef.current) {
          animationRef.current.stop();
          animationRef.current = null;
        }
      };
    }, [isPlaying, rotateAnimation]);

    const rotation = rotateAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
      extrapolate: "clamp", // Melhora a performance
    });

    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Animated.View
          style={[
            styles.discContainer,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              transform: [{ rotate: rotation }],
            },
          ]}
          shouldRasterizeIOS={true}
          renderToHardwareTextureAndroid={true}
        >
          {/* Imagem do disco de fundo */}
          <Image
            source={require("../../assets/images/bgFundoPlyer.jpg")}
            style={[
              styles.discImage,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
            resizeMode="cover"
          />

          {/* Overlay circular laranja para dar o efeito de disco */}
          <View
            style={[
              styles.discOverlay,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
              },
            ]}
          />

          {/* Centro do disco com botão play/pause */}
          <View
            style={[
              styles.centerHole,
              {
                width: size * 0.35,
                height: size * 0.35,
                borderRadius: (size * 0.35) / 2,
                top: (size - size * 0.35) / 2,
                left: (size - size * 0.35) / 2,
              },
            ]}
          >
            <View
              style={[
                styles.centerLabel,
                {
                  width: size * 0.3,
                  height: size * 0.3,
                  borderRadius: (size * 0.3) / 2,
                },
              ]}
            >
              <View style={styles.playButtonContainer}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <View
                      style={[
                        styles.loadingDot,
                        { width: size * 0.02, height: size * 0.02 },
                      ]}
                    />
                    <View
                      style={[
                        styles.loadingDot,
                        { width: size * 0.02, height: size * 0.02 },
                      ]}
                    />
                    <View
                      style={[
                        styles.loadingDot,
                        { width: size * 0.02, height: size * 0.02 },
                      ]}
                    />
                  </View>
                ) : (
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={size * 0.12}
                    color="#fff"
                    style={!isPlaying && { marginLeft: size * 0.01 }}
                  />
                )}
              </View>
            </View>
          </View>

          {/* Linhas do disco para dar efeito de vinil */}
          <View
            style={[
              styles.vinylLines,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          >
            {[...Array(3)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.vinylLine,
                  {
                    width: size - index * size * 0.15,
                    height: size - index * size * 0.15,
                    borderRadius: (size - index * size * 0.15) / 2,
                    borderWidth: 1,
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Brilho do disco */}
        {isPlaying && (
          <Animated.View
            style={[
              styles.discGlow,
              {
                width: size + 10,
                height: size + 10,
                borderRadius: (size + 10) / 2,
                transform: [{ rotate: rotation }],
              },
            ]}
          />
        )}
      </View>
    );
  }
);

AnimatedDisc.displayName = "AnimatedDisc";

export default AnimatedDisc;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  discContainer: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    position: "relative",
  },
  discImage: {
    position: "absolute",
  },
  discOverlay: {
    position: "absolute",
    backgroundColor: "rgba(255, 107, 53, 0.1)",
  },
  centerHole: {
    position: "absolute",
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8,
  },
  centerLabel: {
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  kbumContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  loadingDot: {
    backgroundColor: "#fff",
    borderRadius: 2,
    opacity: 0.8,
  },
  kbumText: {
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  vinylLines: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  vinylLine: {
    position: "absolute",
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "transparent",
  },
  centerLogo: {
    width: "80%",
    height: "80%",
    tintColor: "#fff",
  },
  discGlow: {
    position: "absolute",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "rgba(255, 107, 53, 0.5)",
    shadowColor: "#FF6B35",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 20,
  },
});
