import React, { useEffect, useRef, memo } from "react";
import { StyleSheet, View, Image, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useResponsiveDimensions,
  getResponsiveSize,
} from "../hooks/useResponsiveDimensions";

interface AnimatedDiscProps {
  isPlaying: boolean;
  isLoading?: boolean;
  size?: number;
}

const AnimatedDisc = memo(
  ({ isPlaying, isLoading = false, size = 150 }: AnimatedDiscProps) => {
    const rotateAnimation = useRef(new Animated.Value(0)).current;
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);
    const dimensions = useResponsiveDimensions();

    // Calcular tamanhos responsivos baseados no tamanho do disco
    const iconSize = getResponsiveSize(size * 0.12, dimensions, 12, 30);
    const loadingDotSize = getResponsiveSize(size * 0.02, dimensions, 2, 6);
    const containerPadding = getResponsiveSize(20, dimensions, 10, 30);

    useEffect(() => {
      if (isPlaying) {
        // Para qualquer animação existente
        if (animationRef.current) {
          animationRef.current.stop();
          animationRef.current = null;
        }

        // Cria uma animação infinita e contínua
        const createInfiniteRotation = () => {
          rotateAnimation.setValue(0); // Reset para início limpo
          return Animated.loop(
            Animated.timing(rotateAnimation, {
              toValue: 1,
              duration: 8000, // 8 segundos por rotação
              easing: Easing.linear, // Linear para rotação uniforme
              useNativeDriver: true,
            }),
            { iterations: -1, resetBeforeIteration: true }
          );
        };

        animationRef.current = createInfiniteRotation();
        animationRef.current.start();
      } else {
        // Para a animação quando não estiver tocando
        if (animationRef.current) {
          animationRef.current.stop();
          animationRef.current = null;
        }
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
      extrapolate: "extend", // Permite rotação contínua sem limites
    });

    return (
      <View
        style={[
          styles.container,
          {
            width: size + 40,
            height: size + 40,
            paddingHorizontal: containerPadding,
          },
        ]}
      >
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

          {/* Reflexo de luz no disco */}
          <View
            style={[
              styles.discReflection,
              {
                width: size * 0.6,
                height: size * 0.6,
                borderRadius: (size * 0.6) / 2,
                top: size * 0.1,
                left: size * 0.15,
              },
            ]}
          />

          {/* Borda externa metálica */}
          <View
            style={[
              styles.discBorder,
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
              {/* Anel interno decorativo */}
              <View
                style={[
                  styles.innerRing,
                  {
                    width: size * 0.25,
                    height: size * 0.25,
                    borderRadius: (size * 0.25) / 2,
                  },
                ]}
              />
              <View style={styles.playButtonContainer}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <View
                      style={[
                        styles.loadingDot,
                        { width: loadingDotSize, height: loadingDotSize },
                      ]}
                    />
                    <View
                      style={[
                        styles.loadingDot,
                        { width: loadingDotSize, height: loadingDotSize },
                      ]}
                    />
                    <View
                      style={[
                        styles.loadingDot,
                        { width: loadingDotSize, height: loadingDotSize },
                      ]}
                    />
                  </View>
                ) : (
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={iconSize}
                    color="#fff"
                    style={[
                      !isPlaying && { marginLeft: size * 0.01 },
                      styles.playIcon,
                    ]}
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
            {[...Array(6)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.vinylLine,
                  {
                    width: size - index * size * 0.08,
                    height: size - index * size * 0.08,
                    borderRadius: (size - index * size * 0.08) / 2,
                    borderWidth: index % 2 === 0 ? 1 : 0.5,
                    opacity: 0.6 - index * 0.05,
                  },
                ]}
              />
            ))}
          </View>

          {/* Pontos decorativos no disco */}
          <View style={styles.decorativeDots}>
            {[...Array(8)].map((_, index) => {
              const angle = (index * 360) / 8;
              const radius = size * 0.35;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              return (
                <View
                  key={index}
                  style={[
                    styles.decorativeDot,
                    {
                      left: size / 2 + x - 2,
                      top: size / 2 + y - 2,
                    },
                  ]}
                />
              );
            })}
          </View>
        </Animated.View>

        {/* Brilho do disco - removido para evitar tremulação */}
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
    marginVertical: 10,
    // Padding responsivo aplicado dinamicamente
  },
  discContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    // Removidas todas as sombras para evitar tremulação
  },
  discImage: {
    position: "absolute",
  },
  discOverlay: {
    position: "absolute",
    backgroundColor: "rgba(255, 107, 53, 0.1)",
  },
  discReflection: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 50,
  },
  discBorder: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#FF6B35",
    backgroundColor: "transparent",
  },
  centerHole: {
    position: "absolute",
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    // Removidas sombras para evitar tremulação
  },
  centerLabel: {
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFD700",
    position: "relative",
  },
  innerRing: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.5)",
    backgroundColor: "transparent",
  },
  playButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    zIndex: 10,
  },
  playIcon: {
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    // Tamanho responsivo aplicado dinamicamente
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
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "transparent",
  },
  decorativeDots: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  decorativeDot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 215, 0, 0.7)",
  },
  centerLogo: {
    width: "80%",
    height: "80%",
    tintColor: "#fff",
  },
});
