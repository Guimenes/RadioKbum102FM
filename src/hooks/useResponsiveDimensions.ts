import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

interface ResponsiveDimensions {
  width: number;
  height: number;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  scale: number;
  fontScale: number;
}

export const useResponsiveDimensions = (): ResponsiveDimensions => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height, scale, fontScale } = Dimensions.get("window");
    return { width, height, scale, fontScale };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        scale: window.scale,
        fontScale: window.fontScale,
      });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height, scale, fontScale } = dimensions;

  // Breakpoints baseados em largura
  const isSmallScreen = width < 380;
  const isMediumScreen = width >= 380 && width < 768;
  const isLargeScreen = width >= 768;

  // Orientação
  const isPortrait = height > width;
  const isLandscape = width > height;

  return {
    width,
    height,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isPortrait,
    isLandscape,
    scale,
    fontScale,
  };
};

// Função utilitária para calcular tamanhos responsivos
export const getResponsiveSize = (
  size: number,
  dimensions: ResponsiveDimensions,
  minSize?: number,
  maxSize?: number
): number => {
  const { width, scale } = dimensions;
  const baseWidth = 375; // iPhone X como referência
  const scaleFactor = width / baseWidth;

  let responsiveSize = size * scaleFactor;

  // Aplicar limites mínimos e máximos se fornecidos
  if (minSize && responsiveSize < minSize) {
    responsiveSize = minSize;
  }
  if (maxSize && responsiveSize > maxSize) {
    responsiveSize = maxSize;
  }

  // Ajustar para densidade de pixels
  return (responsiveSize / scale) * scale;
};

// Função para calcular padding responsivo
export const getResponsivePadding = (
  dimensions: ResponsiveDimensions
): { horizontal: number; vertical: number } => {
  const { width, isSmallScreen, isMediumScreen } = dimensions;

  if (isSmallScreen) {
    return { horizontal: 15, vertical: 10 };
  } else if (isMediumScreen) {
    return { horizontal: 20, vertical: 15 };
  } else {
    return { horizontal: Math.min(40, width * 0.08), vertical: 20 };
  }
};
