import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useResponsiveDimensions,
  getResponsivePadding,
} from "../hooks/useResponsiveDimensions";

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  enableScrollView?: boolean;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  enableScrollView = false,
}) => {
  const dimensions = useResponsiveDimensions();
  const padding = getResponsivePadding(dimensions);
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    {
      paddingTop: Math.max(insets.top, 20),
      paddingBottom: Math.max(insets.bottom, 20),
      paddingHorizontal: padding.horizontal,
    },
  ];

  // Em telas muito pequenas ou em modo paisagem, usar ScrollView
  const shouldUseScrollView =
    enableScrollView ||
    dimensions.isSmallScreen ||
    (dimensions.isLandscape && dimensions.height < 500);

  if (shouldUseScrollView) {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={containerStyle}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
});
