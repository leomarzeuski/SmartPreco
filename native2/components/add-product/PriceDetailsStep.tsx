import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { appColors } from "@/constants/theme";
import { styles } from "@/styles/add-product";
import { ProductDto, MarketDto } from "@/api/model";

interface PriceDetailsStepProps {
  productInfo: ProductDto | null;
  marketInfo: MarketDto | null;
  price: number;
  handlePriceChange: (text: string) => void;
  formatPrice: (price: number) => string;
  receiptImage: string | null;
  showReceiptImageOptions: () => void;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  errors: {
    price?: string;
    receiptImage?: string;
  };
}

const PriceDetailsStep: React.FC<PriceDetailsStepProps> = ({
  productInfo,
  marketInfo,
  price,
  handlePriceChange,
  formatPrice,
  receiptImage,
  showReceiptImageOptions,
  focusedField,
  setFocusedField,
  errors,
}) => {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Informações de Preço</Text>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo do Cadastro</Text>

        <View style={styles.summaryProductSection}>
          {(productInfo?.imageUrl || productInfo?.image_url) && (
            <Image
              source={{ uri: productInfo.imageUrl || productInfo.image_url }}
              style={styles.summaryProductImage}
            />
          )}
          <View style={styles.summaryProductInfo}>
            <View style={styles.summarySection}>
              <Text style={styles.summaryLabel}>Produto:</Text>
              <Text style={styles.summaryValue}>
                {productInfo?.name || "N/A"}
              </Text>
            </View>

            <View style={styles.summarySection}>
              <Text style={styles.summaryLabel}>Descrição:</Text>
              <Text style={styles.summaryValue}>
                {productInfo?.description || "N/A"}
              </Text>
            </View>

            <View style={styles.summarySection}>
              <Text style={styles.summaryLabel}>Categoria:</Text>
              <Text style={styles.summaryValue}>
                {productInfo?.category || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryMarketSection}>
          {marketInfo?.imageUrl && (
            <Image
              source={{ uri: marketInfo.imageUrl }}
              style={styles.summaryMarketImage}
            />
          )}
          <View style={styles.summaryMarketInfo}>
            <View style={styles.summarySection}>
              <Text style={styles.summaryLabel}>Mercado:</Text>
              <Text style={styles.summaryValue}>
                {marketInfo?.name || "N/A"}
              </Text>
            </View>

            <View style={styles.summarySection}>
              <Text style={styles.summaryLabel}>Endereço:</Text>
              <Text style={styles.summaryValue}>
                {marketInfo?.address || "N/A"}
              </Text>
            </View>

            <View style={styles.summarySection}>
              <Text style={styles.summaryLabel}>Localização:</Text>
              <Text style={styles.summaryValue}>
                {marketInfo ? `${marketInfo.city}, ${marketInfo.state}` : "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Preço (R$)</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.priceCurrency}>R$</Text>
          <TextInput
            style={styles.priceInput}
            value={formatPrice(price)}
            onChangeText={handlePriceChange}
            placeholder="0,00"
            keyboardType="numeric"
            onFocus={() => setFocusedField("price")}
            onBlur={() => setFocusedField(null)}
          />
        </View>
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Comprovante de Preço</Text>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={showReceiptImageOptions}
          activeOpacity={0.8}
        >
          {receiptImage ? (
            <Image source={{ uri: receiptImage }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons
                name="file-image-plus-outline"
                size={40}
                color="#9E9E9E"
                style={styles.placeholderIcon}
              />
              <Text style={styles.placeholderText}>
                Toque para adicionar uma foto do comprovante (opcional)
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {receiptImage && (
          <Text style={styles.imageInfo}>
            Toque na imagem para alterar a foto
          </Text>
        )}
        {errors.receiptImage && (
          <Text style={styles.errorText}>{errors.receiptImage}</Text>
        )}
      </View>
    </View>
  );
};

export default PriceDetailsStep;
