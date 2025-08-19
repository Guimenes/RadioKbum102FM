import { PixelRatio, Platform } from "react-native";

// Função para escalar dimensões baseada na densidade da tela
export const normalize = (size: number): number => {
  const scale = PixelRatio.get();
  const newSize = size * scale;

  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Função para calcular espaçamento baseado no tamanho da tela
export const getSpacing = (
  baseSpacing: number,
  screenWidth: number
): number => {
  if (screenWidth < 350) {
    return baseSpacing * 0.8;
  } else if (screenWidth > 600) {
    return baseSpacing * 1.2;
  }
  return baseSpacing;
};

// Função para calcular tamanho de fonte responsivo
export const getResponsiveFontSize = (
  baseFontSize: number,
  screenWidth: number,
  fontScale: number = 1
): number => {
  const scaleFactor = screenWidth / 375; // iPhone X como base
  let fontSize = baseFontSize * scaleFactor;

  // Aplicar fontScale do sistema
  fontSize *= fontScale;

  // Limitar o tamanho mínimo e máximo
  const minSize = baseFontSize * 0.8;
  const maxSize = baseFontSize * 1.4;

  return Math.max(minSize, Math.min(maxSize, fontSize));
};

// Breakpoints para diferentes tamanhos de dispositivos
export const deviceTypes = {
  isSmallPhone: (width: number) => width < 360,
  isPhone: (width: number) => width >= 360 && width < 768,
  isTablet: (width: number) => width >= 768 && width < 1024,
  isLargeTablet: (width: number) => width >= 1024,
};

// Função para obter configurações específicas por tipo de dispositivo
export const getDeviceConfig = (width: number, height: number) => {
  const isLandscape = width > height;

  if (deviceTypes.isSmallPhone(width)) {
    return {
      type: "smallPhone",
      logoSize: isLandscape ? 120 : 180,
      discSize: isLandscape ? 100 : 140,
      padding: { horizontal: 15, vertical: 10 },
      cardMaxWidth: width - 30,
      fontSize: {
        title: 18,
        subtitle: 14,
        body: 12,
      },
    };
  }

  if (deviceTypes.isPhone(width)) {
    return {
      type: "phone",
      logoSize: isLandscape ? 150 : 220,
      discSize: isLandscape ? 120 : 180,
      padding: { horizontal: 20, vertical: 15 },
      cardMaxWidth: Math.min(400, width - 40),
      fontSize: {
        title: 22,
        subtitle: 16,
        body: 14,
      },
    };
  }

  if (deviceTypes.isTablet(width)) {
    return {
      type: "tablet",
      logoSize: isLandscape ? 180 : 280,
      discSize: isLandscape ? 150 : 220,
      padding: { horizontal: 40, vertical: 20 },
      cardMaxWidth: Math.min(500, width - 80),
      fontSize: {
        title: 26,
        subtitle: 20,
        body: 16,
      },
    };
  }

  // Large tablets
  return {
    type: "largeTablet",
    logoSize: isLandscape ? 200 : 320,
    discSize: isLandscape ? 170 : 250,
    padding: { horizontal: 60, vertical: 30 },
    cardMaxWidth: Math.min(600, width - 120),
    fontSize: {
      title: 30,
      subtitle: 24,
      body: 18,
    },
  };
};
