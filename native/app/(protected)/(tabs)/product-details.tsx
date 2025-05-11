import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "react-native-paper";
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { styles } from "@/styles/product-details";
import ReportModal from "@/components/ReportModal";
import { AxiosError } from "axios";
import { createReport, useCreateReport } from "@/api/report/report";
import {
  useFavoriteProduct,
  useGetFavoriteProducts,
  useUnfavoriteProduct,
} from "@/api/favorite-product/favorite-product";
import { useQueryClient } from "@tanstack/react-query";
import { useReadPrices } from "@/api/price/price";
import { PriceDto } from "@/api/model";

type ProductDetailParams = {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price: string;
  image: null | any;
  marketId?: number;
  marketName?: string;
  priceId?: string;
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
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const queryClient = useQueryClient();

  // Get product prices filtered by productId
  const { data: pricesData, isLoading: isLoadingPrices } = useReadPrices(
    { productId: params.id.toString() },
    {
      query: {
        enabled: !!params.id,
      },
    }
  );

  // Extract price information
  const [productPrices, setProductPrices] = useState<PriceDto[]>([]);
  const [marketPrice, setMarketPrice] = useState<PriceDto | null>(null);

  useEffect(() => {
    if (pricesData?.prices) {
      // Sort prices by price amount (ascending)
      const sortedPrices = [...pricesData.prices].sort(
        (a, b) => a.price - b.price
      );
      setProductPrices(sortedPrices);

      // If we have a specific marketId, find that price
      if (params.marketId) {
        const specificMarketPrice = sortedPrices.find(
          (price) => price.market.id === params.marketId?.toString()
        );
        setMarketPrice(specificMarketPrice || null);
      } else if (sortedPrices.length > 0) {
        // Otherwise use the first (lowest) price
        setMarketPrice(sortedPrices[0]);
      }
    }
  }, [pricesData, params.marketId]);

  const { data: favoriteProducts, refetch: refetchFavorites } =
    useGetFavoriteProducts();

  useEffect(() => {
    if (favoriteProducts) {
      const isProductFavorite = favoriteProducts.some(
        (product) => product.id === params.id.toString()
      );
      setIsFavorite(isProductFavorite);
    }
  }, [favoriteProducts, params.id]);

  const { mutate: favoriteProduct } = useFavoriteProduct({
    mutation: {
      onSuccess: () => {
        setIsFavorite(true);
        refetchFavorites();
        queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        ToastAndroid.show(
          "Produto favoritado com sucesso!",
          ToastAndroid.SHORT
        );
      },
    },
  });

  const { mutate: unfavoriteProduct } = useUnfavoriteProduct({
    mutation: {
      onSuccess: () => {
        setIsFavorite(false);
        refetchFavorites();
        queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        ToastAndroid.show(
          "Produto removido dos favoritos!",
          ToastAndroid.SHORT
        );
      },
    },
  });

  // Function to format price
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      unfavoriteProduct({ productId: params.id.toString() });
    } else {
      favoriteProduct({ productId: params.id.toString() });
    }
  };

  const navigateToMarketDetail = (marketId: string, marketName: string) => {
    navigation.navigate("market-details", {
      id: parseInt(marketId),
      name: marketName,
      rating: 4.5, // Default rating if not available from API
      distance: "2.5 km", // Default distance if not available from API
    });
  };

  const createReportMutation = useCreateReport();

  const handleReport = async (reason: ReportReason, details: string) => {
    if (!marketPrice?.id) {
      Alert.alert("Erro", "Não foi possível identificar o preço para denúncia");
      return;
    }

    const reportData = {
      priceId: marketPrice.id,
      reason: reason,
    };

    try {
      await createReportMutation.mutateAsync({
        data: reportData,
      });

      setReportSubmitted(true);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Erro na chamada da API:", axiosError);
      Alert.alert(
        "Erro",
        "Não foi possível enviar a denúncia. Tente novamente mais tarde.",
        [{ text: "OK" }]
      );
    }
  };

  const handleReportModalDismiss = () => {
    setReportModalVisible(false);
    if (reportSubmitted) {
      setReportSubmitted(false);
    }
  };

  // Get product description - either from params or from the first price's product
  const getDescription = () => {
    if (params.description) {
      return params.description;
    } else if (marketPrice?.product?.description) {
      return marketPrice.product.description;
    }
    return "Informações do produto não disponíveis.";
  };

  // Get product category - either from params or from the first price's product
  const getCategory = () => {
    if (params.category) {
      return params.category;
    } else if (marketPrice?.product?.category) {
      return marketPrice.product.category;
    }
    return "";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Detalhes do Produto</Text>
          <Text style={styles.headerSubtitle}>
            {marketPrice?.market?.name || params.marketName || ""}
          </Text>
        </View>
        <IconButton
          icon={isFavorite ? "star" : "star-outline"}
          size={24}
          onPress={handleToggleFavorite}
        />
      </View>

      {isLoadingPrices ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Carregando informações...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.imageContainer}>
            {params.image ? (
              <Image source={params.image} style={styles.productImage} />
            ) : marketPrice?.imageUrl ? (
              <Image
                source={{ uri: marketPrice.imageUrl }}
                style={styles.productImage}
              />
            ) : (
              <View style={styles.placeholderImage} />
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.productName}>
              {marketPrice?.product?.name || params.name}
            </Text>
            <Text style={styles.productPrice}>
              {marketPrice ? formatPrice(marketPrice.price) : params.price}
            </Text>
            {getCategory() && (
              <Text style={styles.productCategory}>
                Categoria: {getCategory()}
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{getDescription()}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disponível em</Text>
            {productPrices.length > 0 ? (
              productPrices.map((price) => (
                <TouchableOpacity
                  key={price.id}
                  style={styles.marketItem}
                  onPress={() =>
                    navigateToMarketDetail(price.market.id, price.market.name)
                  }
                >
                  <View style={styles.marketInfo}>
                    <Text style={styles.marketName}>{price.market.name}</Text>
                    <Text style={styles.marketDetail}>~ 2.5 km • 4.5 ★</Text>
                  </View>
                  <View style={styles.marketPriceContainer}>
                    <Text style={styles.marketPrice}>
                      {formatPrice(price.price)}
                    </Text>
                    <IconButton
                      icon="chevron-right"
                      size={20}
                      style={styles.marketArrow}
                    />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDataText}>
                Nenhum mercado encontrado para este produto.
              </Text>
            )}
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
              <Text style={styles.reportButtonText}>
                {reportSubmitted ? "Denúncia enviada" : "Denunciar Produto"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <ReportModal
        visible={reportModalVisible}
        onDismiss={handleReportModalDismiss}
        onSubmit={handleReport}
        productName={params.name}
        isSubmitted={reportSubmitted}
      />
    </SafeAreaView>
  );
}
