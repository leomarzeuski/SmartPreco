import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Card, Avatar } from "react-native-paper";
import { router } from "expo-router";
import { styles } from "@/styles/home/FavoriteRow";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ItemType } from "@/app/private";

type FavoritesRowProps = {
  favorites: ItemType[];
};

export const FavoritesRow = ({ favorites }: FavoritesRowProps) => {
  const navigateToDetails = (item: ItemType) => {
    if (item.type === "product") {
      router.push({
        pathname: "/private/product-details",
        params: {
          id: item.id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
        },
      });
    } else {
      router.push({
        pathname: "/private/market-details",
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
              {item.imageUrl ? (
                <Avatar.Image size={60} source={{ uri: item.imageUrl }} />
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
