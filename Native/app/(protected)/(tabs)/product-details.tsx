import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "react-native-paper";
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { styles } from "@/styles/product-details";
import ReportModal from "@/components/ReportModal";

type ProductDetailParams = {
  id: number;
  name: string;
  price: string;
  image: null | any;
  marketId?: number;
  marketName?: string;
};

type RootStackParamList = {
  "market-details": {
    id: number;
    name: string;
    rating: number;
    distance: string;
  };
};

type ReportReason =
  | "Preço incorreto"
  | "Imagem inadequada"
  | "Descrição enganosa"
  | "Produto inexistente"
  | "Conteúdo abusivo"
  | "Outro";

export default function ProductDetailScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as ProductDetailParams;
  const [isFavorite, setIsFavorite] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const associatedMarket = {
    id: params.marketId || 1,
    name: params.marketName || "Mercado Associado",
    price: params.price,
    distance: "2.5 km",
    rating: 4.5,
  };

  const mockDetails = {
    description:
      "Este é um produto de alta qualidade que oferece excelente custo-benefício.",
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const navigateToMarketDetail = () => {
    navigation.navigate("market-details", {
      id: associatedMarket.id,
      name: associatedMarket.name,
      rating: associatedMarket.rating,
      distance: associatedMarket.distance,
    });
  };

  const handleReport = (reason: ReportReason, details: string) => {
    // Aqui você implementaria a lógica para enviar o relatório ao backend
    console.log("Denúncia:", {
      productId: params.id,
      productName: params.name,
      reason,
      details,
    });
    // Exemplo de API call:
    // api.reports.create({
    //   productId: params.id,
    //   reason,
    //   details,
    //   reportedAt: new Date()
    // });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Detalhes do Produto</Text>
        <IconButton
          icon={isFavorite ? "star" : "star-outline"}
          size={24}
          onPress={toggleFavorite}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          {params.image ? (
            <Image source={params.image} style={styles.productImage} />
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.productName}>{params.name}</Text>
          <Text style={styles.productPrice}>{params.price}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{mockDetails.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponível em</Text>
          <TouchableOpacity
            style={styles.marketItem}
            onPress={navigateToMarketDetail}
          >
            <View style={styles.marketInfo}>
              <Text style={styles.marketName}>{associatedMarket.name}</Text>
              <Text style={styles.marketDetail}>
                {associatedMarket.distance} • {associatedMarket.rating} ★
              </Text>
            </View>
            <View style={styles.marketPriceContainer}>
              <Text style={styles.marketPrice}>{associatedMarket.price}</Text>
              <IconButton
                icon="chevron-right"
                size={20}
                style={styles.marketArrow}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.compareSection}>
          <TouchableOpacity
            style={styles.compareButton}
            onPress={() => console.log("Comparar preços")}
          >
            <Text style={styles.compareButtonText}>Comparar Preços</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reportSection}>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => setReportModalVisible(true)}
          >
            <Text style={styles.reportButtonText}>Denunciar Produto</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ReportModal
        visible={reportModalVisible}
        onDismiss={() => setReportModalVisible(false)}
        onSubmit={handleReport}
        productName={params.name}
      />
    </SafeAreaView>
  );
}
