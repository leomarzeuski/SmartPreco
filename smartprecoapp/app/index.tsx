import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    console.log("Auth state:", { isSignedIn, isLoaded });
  }, [isSignedIn, isLoaded]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={isSignedIn ? "/private" : "/sign-in"} />;
}
