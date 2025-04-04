import { Redirect, Slot, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function PublicLayout() {
  const { isSignedIn } = useAuth();

  console.log({ isSignedIn });

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return <Slot />;
}
