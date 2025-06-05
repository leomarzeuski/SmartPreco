import React from "react";
import { View, Image } from "react-native";
import { PriceDto } from "@/api/model";
import { styles } from "@/styles/product-details";

type ProductImageProps = {
  params: {
    imageUrl: null | any;
  };
  marketPrice: PriceDto | null;
};

export const ProductImage = ({ params, marketPrice }: ProductImageProps) => {
  if (params.imageUrl) {
    return (
      <Image source={{ uri: params.imageUrl }} style={styles.productImage} />
    );
  }

  if (marketPrice?.imageUrl) {
    return (
      <Image
        source={{ uri: marketPrice.imageUrl }}
        style={styles.productImage}
      />
    );
  }

  return <View style={styles.placeholderImage} />;
};
