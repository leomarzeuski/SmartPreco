import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PriceDto } from "@/api/model";
import { styles } from "@/styles/product-details";

type MarketListProps = {
  productPrices: PriceDto[];
  formatPrice: (price: number) => string;
  navigateToMarketDetail: (marketId: string, marketName: string) => void;
};

export const MarketList = ({
  productPrices,
  formatPrice,
  navigateToMarketDetail,
}: MarketListProps) => {
  if (productPrices.length === 0) {
    return (
      <Text style={styles.noDataText}>
        Nenhum mercado encontrado para este produto.
      </Text>
    );
  }

  return (
    <>
      {productPrices.map((price) => (
        <TouchableOpacity
          key={price.id}
          style={styles.marketItem}
          onPress={() =>
            navigateToMarketDetail(price.market.id, price.market.name)
          }
        >
          <View style={styles.marketInfo}>
            <View style={styles.marketNameContainer}>
              <Text style={styles.marketName}>{price.market.name}</Text>
              {!price.moderated && (
                <View style={styles.unmoderatedBadge}>
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={16}
                    color="#e74c3c"
                  />
                  <Text style={styles.unmoderatedText}>Não moderado</Text>
                </View>
              )}
            </View>
            <Text style={styles.marketDetail}>~ 2.5 km • 4.5 ★</Text>
          </View>
          <View style={styles.marketPriceContainer}>
            <Text
              style={[
                styles.marketPrice,
                !price.moderated && styles.unmoderatedPrice,
              ]}
            >
              {formatPrice(price.price)}
            </Text>
            <IconButton
              icon="chevron-right"
              size={20}
              style={styles.marketArrow}
            />
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};
