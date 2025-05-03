import { Stack, Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-product"
        options={{
          title: "Add Product",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="add.circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="suport"
        options={{
          title: "Suporte",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="doubt" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="doubts-ia"
        options={{
          title: "Smart IA",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="ai" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="product-details"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="market-details"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="barcode-scanner"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
