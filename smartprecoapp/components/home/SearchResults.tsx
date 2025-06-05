import { ItemType } from "@/app/private";
import { styles } from "@/styles/home/SearchResults";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { Card, IconButton } from "react-native-paper";

type SearchResultsProps = {
  results: ItemType[];
  onToggleFavorite: (item: ItemType) => void;
};

export const SearchResults = ({
  results,
  onToggleFavorite,
}: SearchResultsProps) => {
  const navigateToDetails = (item: ItemType) => {
    if (item.type === "product") {
      router.push({
        pathname: "/private/product-details",
        params: {
          id: item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          description: item.description,
          imageUrl: item.imageUrl,
        },
      });
    } else {
      router.push({
        pathname: "/private/market-details",
        params: {
          id: item.id,
          name: item.name,
          city: item.city,
          imageUrl: item.imageUrl,
        },
      });
    }
  };

  const renderResultItem = ({ item }: { item: ItemType }) => (
    <Card style={styles.resultCard} onPress={() => navigateToDetails(item)}>
      <View style={styles.typeBadge}>
        <Text style={styles.typeBadgeText}>
          {item.type === "market" ? "M" : "P"}
        </Text>
      </View>

      <View style={styles.resultContent}>
        <View style={styles.resultImageContainer}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.resultImage} />
          ) : (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={item.type === "market" ? "store" : "shopping"}
                size={30}
                color="#777"
              />
            </View>
          )}
        </View>

        <View style={styles.resultInfo}>
          <Text style={styles.resultName}>{item.name}</Text>

          {item.category && (
            <Text style={styles.resultCategory}>{item.category}</Text>
          )}

          {item.description && (
            <Text style={styles.resultDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          {item.type === "market" && item.city && (
            <Text style={styles.resultLocation}>{item.city}</Text>
          )}

          {item.price && <Text style={styles.resultPrice}>{item.price}</Text>}
        </View>

        <IconButton
          icon={item.isFavorite ? "star" : "star-outline"}
          size={24}
          onPress={() => onToggleFavorite(item)}
          style={styles.favoriteButton}
          iconColor={item.isFavorite ? "#FFD700" : "#999"}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsTitle}>Resultados</Text>
      {results.length === 0 ? (
        <View style={styles.emptyResults}>
          <Text style={styles.emptyResultsText}>
            Nenhum resultado encontrado
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.resultsList}
        />
      )}
    </View>
  );
};
