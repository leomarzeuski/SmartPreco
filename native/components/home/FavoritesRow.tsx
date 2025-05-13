import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Card, Avatar } from "react-native-paper";
import { router } from "expo-router";
import { ItemType } from "@/app/(protected)/(tabs)";
import { styles } from "@/styles/home/FavoriteRow";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type FavoritesRowProps = {
  favorites: ItemType[];
  onToggleFavorite: (item: ItemType) => void;
};

export const FavoritesRow = ({
  favorites,
  onToggleFavorite,
}: FavoritesRowProps) => {
  const navigateToDetails = (item: ItemType) => {
    if (item.type === "product") {
      router.push({
        pathname: "/product-details",
        params: {
          id: item.id,
          name: item.name,
          price: item.price,
        },
      });
    } else {
      router.push({
        pathname: "/market-details",
        params: {
          id: item.id,
          name: item.name,
        },
      });
    }
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum favorito adicionado</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {favorites.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => navigateToDetails(item)}
          style={styles.favoriteItem}
        >
          <Card style={styles.card}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {item.type === "market" ? "M" : "P"}
              </Text>
            </View>

            <View style={styles.imageContainer}>
              {item.image ? (
                <Avatar.Image size={60} source={item.image} />
              ) : (
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name={item.type === "market" ? "store" : "shopping"}
                    size={36}
                    color="#777"
                  />
                </View>
              )}
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              {item.price ? (
                <Text style={styles.price}>{item.price}</Text>
              ) : (
                <Text style={styles.address} numberOfLines={1}>
                  {item.city || ""}
                </Text>
              )}
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
