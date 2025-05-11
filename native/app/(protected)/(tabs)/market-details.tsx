import {
  useFavoriteMarket,
  useGetFavoriteMarkets,
  useUnfavoriteMarket,
} from "@/api/favorite-market/favorite-market";
import { useReadMarket } from "@/api/market/market";
import { PriceDto } from "@/api/model";
import { useReadPrices } from "@/api/price/price";
import { styles } from "@/styles/market-details";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Chip, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type MarketDetailParams = {
  id: number;
  name: string;
  rating?: number;
  distance?: string;
  city?: string;
};

type ProductItem = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  priceId: string;
  uniqueId: string;
};

type RootStackParamList = {
  "market-details": MarketDetailParams;
  "product-details": {
    id: number;
    name: string;
    price: string;
    image: any;
    marketId: number;
    marketName: string;
    priceId?: string;
  };
};

export default function MarketDetailScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as MarketDetailParams;
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [isFavorite, setIsFavorite] = useState(false);
  const [categories, setCategories] = useState<string[]>(["Todos"]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const queryClient = useQueryClient();

  // Fetch market details
  const { data: marketData, isLoading: isLoadingMarket } = useReadMarket(
    params.id.toString(),
    {
      query: {
        enabled: !!params.id,
      },
    }
  );

  // Fetch prices for this market
  const { data: pricesData, isLoading: isLoadingPrices } = useReadPrices(
    { marketId: params.id.toString() },
    {
      query: {
        enabled: !!params.id,
      },
    }
  );

  // Extract unique categories and product data from prices
  useEffect(() => {
    if (pricesData?.prices && pricesData.prices.length > 0) {
      // Extract unique categories
      const uniqueCategories = new Set<string>(["Todos"]);

      // Create a map to deduplicate products (multiple prices for same product)
      const productMap = new Map<string, ProductItem>();

      // Transform prices into product items
      pricesData.prices.forEach((price: PriceDto) => {
        if (price.product.category) {
          uniqueCategories.add(price.product.category);
        }

        // Create a unique ID by combining product ID and price ID
        const uniqueId = `${price.product.id}-${price.id}`;

        // Add to map with unique ID
        productMap.set(uniqueId, {
          id: price.product.id,
          name: price.product.name,
          price: price.price,
          image: price.imageUrl || null,
          category: price.product.category || "Sem categoria",
          priceId: price.id,
          uniqueId: uniqueId,
        });
      });

      setCategories(Array.from(uniqueCategories));
      setProducts(Array.from(productMap.values()));
    }
  }, [pricesData]);

  const { data: favoriteMarkets, refetch: refetchFavorites } =
    useGetFavoriteMarkets();

  useEffect(() => {
    if (favoriteMarkets) {
      const isMarketFavorite = favoriteMarkets.some(
        (market) => market.id === params.id.toString()
      );
      setIsFavorite(isMarketFavorite);
    }
  }, [favoriteMarkets, params.id]);

  const { mutate: favoriteMarket } = useFavoriteMarket({
    mutation: {
      onSuccess: () => {
        setIsFavorite(true);
        refetchFavorites();
        queryClient.invalidateQueries({ queryKey: ["favoriteMarkets"] });
        queryClient.invalidateQueries({ queryKey: ["markets"] });
        ToastAndroid.show(
          "Mercado favoritado com sucesso!",
          ToastAndroid.SHORT
        );
      },
    },
  });

  const { mutate: unfavoriteMarket } = useUnfavoriteMarket({
    mutation: {
      onSuccess: () => {
        setIsFavorite(false);
        refetchFavorites();
        queryClient.invalidateQueries({ queryKey: ["favoriteMarkets"] });
        queryClient.invalidateQueries({ queryKey: ["markets"] });
        ToastAndroid.show(
          "Mercado removido dos favoritos!",
          ToastAndroid.SHORT
        );
      },
    },
  });

  const handleToggleFavorite = () => {
    if (isFavorite) {
      unfavoriteMarket({ marketId: params.id.toString() });
    } else {
      favoriteMarket({ marketId: params.id.toString() });
    }
  };

  // Calculate market info from API data
  const getMarketInfo = () => {
    return {
      address: marketData?.address || "Endereço não disponível",
      hours: "08:00 - 22:00", // This could come from API in the future
      phone: "(15) 3333-4444", // This could come from API in the future
      city: marketData?.city || params.city || "Cidade não disponível",
      state: marketData?.state || "Estado não disponível",
    };
  };

  // Function to format price
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const filteredProducts =
    activeCategory === "Todos"
      ? products
      : products.filter((product) => product.category === activeCategory);

  const navigateToProductDetail = (product: ProductItem) => {
    navigation.navigate("product-details", {
      id: parseInt(product.id),
      name: product.name,
      price: formatPrice(product.price),
      image: product.image ? { uri: product.image } : null,
      marketId: params.id,
      marketName: marketData?.name || params.name,
      priceId: product.priceId,
    });
  };

  const renderProduct = ({ item }: { item: ProductItem }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigateToProductDetail(item)}
    >
      <View style={styles.productImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={styles.productPlaceholder} />
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
      </View>
    </TouchableOpacity>
  );

  const marketInfo = getMarketInfo();

  const isLoading = isLoadingMarket || isLoadingPrices;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {marketData?.name || params.name}
          </Text>
          <Text style={styles.headerSubtitle}>{marketInfo.city}</Text>
        </View>
        <IconButton
          icon={isFavorite ? "star" : "star-outline"}
          size={24}
          onPress={handleToggleFavorite}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Carregando informações...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.infoSection}>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{params.rating || 0}</Text>
              <IconButton icon="star" size={16} style={styles.starIcon} />
              <Text style={styles.distance}>
                {params.distance || "Distância não disponível"}
              </Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <IconButton icon="map-marker" size={20} />
                <Text style={styles.detailText}>{marketInfo.address}</Text>
              </View>
              <View style={styles.detailItem}>
                <IconButton icon="clock" size={20} />
                <Text style={styles.detailText}>{marketInfo.hours}</Text>
              </View>
              <View style={styles.detailItem}>
                <IconButton icon="phone" size={20} />
                <Text style={styles.detailText}>{marketInfo.phone}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Produtos Disponíveis</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <Chip
                  key={category}
                  selected={activeCategory === category}
                  onPress={() => setActiveCategory(category)}
                  style={[
                    styles.categoryChip,
                    activeCategory === category && styles.activeCategoryChip,
                  ]}
                >
                  {category}
                </Chip>
              ))}
            </ScrollView>

            {filteredProducts.length > 0 ? (
              <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.uniqueId}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.productsGrid}
              />
            ) : (
              <View style={styles.noProductsContainer}>
                <Text style={styles.noProductsText}>
                  Nenhum produto encontrado para esta categoria.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
