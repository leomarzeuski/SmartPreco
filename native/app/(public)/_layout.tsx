import React from "react";
import { Redirect, Slot } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function PublicLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return <Slot />;
}
