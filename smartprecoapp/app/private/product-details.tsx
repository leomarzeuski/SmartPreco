import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ToastAndroid,
  ActivityIndicator,
  RefreshControl,
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
import { useCreateReport } from "@/api/report/report";
import {
  useFavoriteProduct,
  useGetFavoriteProducts,
  useUnfavoriteProduct,
} from "@/api/favorite-product/favorite-product";
import { useQueryClient } from "@tanstack/react-query";
import { useReadPrices } from "@/api/price/price";
import { PriceDto } from "@/api/model";
import {
  ProductImage,
  MarketList,
  ProductInfoSection,
} from "@/components/product-details";

type ProductDetailParams = {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price: string;
  imageUrl: null | any;
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
  "price-comparison": {
    productId: number;
    productName: string;
    prices: PriceDto[];
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
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: pricesData,
    isLoading: isLoadingPrices,
    refetch: refetchPrices,
  } = useReadPrices(
    { productId: params.id.toString() },
    {
      query: {
        enabled: !!params.id,
      },
    }
  );

  const [productPrices, setProductPrices] = useState<PriceDto[]>([]);
  const [marketPrice, setMarketPrice] = useState<PriceDto | null>(null);

  useEffect(() => {
    setProductPrices([]);
    setMarketPrice(null);
  }, [params.id]);

  useEffect(() => {
    if (!pricesData) return;

    const pricesArray = pricesData.records || [];

    if (!pricesArray.length) return;

    const sortedPrices = [...pricesArray].sort((a, b) => a.price - b.price);
    setProductPrices(sortedPrices);
  }, [pricesData]);

  useEffect(() => {
    if (!productPrices.length) return;

    let selectedPrice = null;

    if (params.priceId) {
      selectedPrice = productPrices.find(
        (price) => price.id === params.priceId
      );
    }

    if (!selectedPrice && params.marketId) {
      selectedPrice = productPrices.find(
        (price) => price.market?.id === params.marketId?.toString()
      );
    }

    if (!selectedPrice) {
      selectedPrice = productPrices[0];
    }

    setMarketPrice(selectedPrice);
  }, [productPrices, params.marketId, params.priceId]);

  const formatPrice = useCallback((price: number) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  }, []);

  const handleApiError = useCallback((action: string) => {
    return (error: unknown) => {
      console.error(`Erro ao ${action}:`, error);
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : `Não foi possível ${action} o produto. Tente novamente.`;

      Alert.alert("Erro", errorMessage);
    };
  }, []);

  const { data: favoriteProducts, refetch: refetchFavorites } =
    useGetFavoriteProducts();

  const isFavorite =
    favoriteProducts?.some((product) => product.id === params.id.toString()) ??
    false;

  const { mutate: favoriteProduct } = useFavoriteProduct({
    mutation: {
      onSuccess: () => {
        refetchFavorites();
        invalidateRelatedQueries();
        ToastAndroid.show(
          "Produto favoritado com sucesso!",
          ToastAndroid.SHORT
        );
      },
      onError: handleApiError("favoritar"),
    },
  });

  const { mutate: unfavoriteProduct } = useUnfavoriteProduct({
    mutation: {
      onSuccess: () => {
        refetchFavorites();
        invalidateRelatedQueries();
        ToastAndroid.show(
          "Produto removido dos favoritos!",
          ToastAndroid.SHORT
        );
      },
      onError: handleApiError("remover dos favoritos"),
    },
  });

  const invalidateRelatedQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  }, [queryClient]);

  const handleToggleFavorite = useCallback(() => {
    if (isFavorite) {
      unfavoriteProduct({ productId: params.id.toString() });
    } else {
      favoriteProduct({ productId: params.id.toString() });
    }
  }, [isFavorite, favoriteProduct, unfavoriteProduct, params.id]);

  const navigateToMarketDetail = useCallback(
    (marketId: string, marketName: string) => {
      if (!marketId) return;
      navigation.navigate("market-details", {
        id: marketId as any,
        name: marketName,
        rating: 0,
        distance: "",
      });
    },
    [navigation]
  );

  const createReportMutation = useCreateReport({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["prices"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["reports"] });

        refetchPrices();

        setReportSubmitted(true);
        ToastAndroid.show("Denúncia enviada com sucesso", ToastAndroid.SHORT);
      },
      onError: handleApiError("denunciar"),
    },
  });

  const handleReport = useCallback(
    async (reason: ReportReason, details: string) => {
      if (!marketPrice?.id) {
        Alert.alert(
          "Erro",
          "Não foi possível identificar o preço para denúncia"
        );
        return;
      }

      const reportData = {
        priceId: marketPrice.id,
        reason: `reason: ${reason}, details: ${details}`,
      };

      try {
        await createReportMutation.mutateAsync({
          data: reportData,
        });
      } catch (error) {
        handleApiError("denunciar")(error);
      }
    },
    [marketPrice?.id, createReportMutation, handleApiError]
  );

  const handleReportModalDismiss = useCallback(() => {
    setReportModalVisible(false);
    if (reportSubmitted) {
      setReportSubmitted(false);
    }
  }, [reportSubmitted]);

  const getDescription = useCallback(() => {
    return (
      params.description ||
      marketPrice?.product?.description ||
      "Informações do produto não disponíveis."
    );
  }, [params.description, marketPrice?.product?.description]);

  const getCategory = useCallback(() => {
    return params.category || marketPrice?.product?.category || "";
  }, [params.category, marketPrice?.product?.category]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.all([refetchPrices(), refetchFavorites()]).finally(() => {
      setRefreshing(false);
      ToastAndroid.show("Dados atualizados", ToastAndroid.SHORT);
    });
  }, [refetchPrices, refetchFavorites]);

  const renderContent = () => {
    if (isLoadingPrices) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Carregando informações...</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007BFF"]}
          />
        }
      >
        <View style={styles.imageContainer}>
          <ProductImage params={params} marketPrice={marketPrice} />
        </View>
        <ProductInfoSection
          marketPrice={marketPrice}
          params={params}
          getCategory={getCategory}
          formatPrice={formatPrice}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{getDescription()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponível em</Text>
          {productPrices.length > 0 ? (
            <MarketList
              productPrices={productPrices}
              formatPrice={formatPrice}
              navigateToMarketDetail={navigateToMarketDetail}
            />
          ) : (
            <Text style={styles.noDataText}>Nenhum mercado disponível</Text>
          )}
        </View>

        <View style={styles.reportSection}>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => setReportModalVisible(true)}
            disabled={reportSubmitted}
          >
            <Text style={styles.reportButtonText}>
              {reportSubmitted ? "Denúncia enviada" : "Denunciar Produto"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
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

      {renderContent()}

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
