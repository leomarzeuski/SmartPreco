import { ClerkProvider } from "@clerk/clerk-expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";

const CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

import { NotificationsManager } from "@/components/NotificationManager";
import theme from "@/constants/theme";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { tokenCache } from "@/utils/secureToken";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={new QueryClient()}>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <PaperProvider theme={theme}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <NotificationProvider>
              <NotificationsManager />
              <Slot />
            </NotificationProvider>
          </ThemeProvider>
        </PaperProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
