import React from "react";
import { View, Text, Image } from "react-native";
import { Card, IconButton } from "react-native-paper";
import { router } from "expo-router";
import { styles } from "@/styles/home/ProductsCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ItemType } from "@/app/private";
import { useReadPrices } from "@/api/price/price";

type ProductCardProps = {
  product: ItemType;
  onToggleFavorite: (item: ItemType) => void;
};

export const ProductCard = ({
  product,
  onToggleFavorite,
}: ProductCardProps) => {
  const { data: productPricesData } = useReadPrices(
    { productId: product.id },
    {
      query: {
        enabled: product.type === "product",
      },
    }
  );

  const hasUnmoderatedPrices =
    product.moderated ||
    productPricesData?.records?.some((price) => !price.moderated) ||
    false;

  const navigateToProductDetails = () => {
    router.push({
      pathname: "/private/product-details",
      params: {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        imageUrl: product.imageUrl,
        moderated: hasUnmoderatedPrices as any,
      },
    });
  };

  return (
    <Card style={styles.productCard} onPress={navigateToProductDetails}>
      <View style={styles.typeBadge}>
        <Text style={styles.typeBadgeText}>
          {product.type === "market" ? "M" : "P"}
        </Text>
      </View>

      {hasUnmoderatedPrices && (
        <View style={styles.warningBadge}>
          <MaterialCommunityIcons name="alert-circle" size={16} color="#fff" />
        </View>
      )}

      <View style={styles.productContent}>
        <View style={styles.productImageContainer}>
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.productImage}
            />
          ) : (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={product.type === "market" ? "store" : "shopping"}
                size={30}
                color="#777"
              />
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          {product.category && (
            <Text style={styles.productCategory}>{product.category}</Text>
          )}
          {product.description && (
            <Text style={styles.productDescription} numberOfLines={2}>
              {product.description}
            </Text>
          )}
          {product.type === "market" && product.city && (
            <Text style={styles.productLocation}>{product.city}</Text>
          )}
          {product.price && (
            <Text style={styles.productPrice}>{product.price}</Text>
          )}
        </View>

        <IconButton
          icon={product.isFavorite ? "star" : "star-outline"}
          size={24}
          onPress={() => onToggleFavorite(product)}
          style={styles.favoriteButton}
          iconColor={product.isFavorite ? "#FFD700" : "#999"}
        />
      </View>
    </Card>
  );
};
