import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";

import { NotificationsManager } from "@/components/NotificationManager";
import { theme } from "@/constants/theme";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { tokenCache } from "@/utils/secureToken";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";

const CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

function ProtectedStack() {
  const { isSignedIn } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={isSignedIn as boolean}>
        <Stack.Screen name="private" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

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
              <ProtectedStack />
            </NotificationProvider>
          </ThemeProvider>
        </PaperProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
