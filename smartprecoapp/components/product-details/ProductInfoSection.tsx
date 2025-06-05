import React from "react";
import { View, Text } from "react-native";
import { PriceDto } from "@/api/model";
import { styles } from "@/styles/product-details";

type ProductInfoSectionProps = {
  marketPrice: PriceDto | null;
  params: {
    name: string;
    price: string;
  };
  getCategory: () => string;
  formatPrice: (price: number) => string;
};

export const ProductInfoSection = ({
  marketPrice,
  params,
  getCategory,
  formatPrice,
}: ProductInfoSectionProps) => (
  <View style={styles.infoSection}>
    <Text style={styles.productName}>
      {marketPrice?.product?.name || params.name}
    </Text>
    <Text style={styles.productPrice}>
      {marketPrice ? formatPrice(marketPrice.price) : params.price}
    </Text>
    {getCategory() && (
      <Text style={styles.productCategory}>Categoria: {getCategory()}</Text>
    )}
  </View>
);
