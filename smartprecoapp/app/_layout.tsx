import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { theme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={new QueryClient()}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <PaperProvider theme={theme}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <ClerkLoaded>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="sign-in" />
                <Stack.Screen name="sign-up" />
              </Stack>
            </ClerkLoaded>
          </ThemeProvider>
        </PaperProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
