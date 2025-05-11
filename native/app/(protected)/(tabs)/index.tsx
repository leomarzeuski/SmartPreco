import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Header } from "@/components/Header";
import { SearchResults } from "@/components/home/SearchResults";
import { styles } from "@/styles/home";
import { FavoritesRow } from "@/components/home/FavoritesRow";
import { ProductCard } from "@/components/home/ProductsCard";
import { useReadProducts } from "@/api/product/product";
import { useReadMarkets } from "@/api/market/market";
import { useGetFavoriteMarkets } from "@/api/favorite-market/favorite-market";
import { useGetFavoriteProducts } from "@/api/favorite-product/favorite-product";
import {
  useFavoriteMarket,
  useUnfavoriteMarket,
} from "@/api/favorite-market/favorite-market";
import {
  useFavoriteProduct,
  useUnfavoriteProduct,
} from "@/api/favorite-product/favorite-product";
import { useQueryClient } from "@tanstack/react-query";

export type ItemType = {
  id: string;
  name: string;
  price: string;
  image: null;
  type: "product" | "market";
  category?: string;
  state?: string;
  city?: string;
  address?: string;
  isFavorite?: boolean;
};

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ItemType[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [localProducts, setLocalProducts] = useState<ItemType[]>([]);
  const [localMarkets, setLocalMarkets] = useState<ItemType[]>([]);

  const queryClient = useQueryClient();

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useReadProducts();
  const {
    data: marketsData,
    isLoading: isLoadingMarkets,
    refetch: refetchMarkets,
  } = useReadMarkets();
  const { data: favoriteProductsData, refetch: refetchFavoriteProducts } =
    useGetFavoriteProducts();
  const { data: favoriteMarketsData, refetch: refetchFavoriteMarkets } =
    useGetFavoriteMarkets();

  useFocusEffect(
    useCallback(() => {
      refetchProducts();
      refetchMarkets();
      refetchFavoriteProducts();
      refetchFavoriteMarkets();
    }, [
      refetchProducts,
      refetchMarkets,
      refetchFavoriteProducts,
      refetchFavoriteMarkets,
    ])
  );

  const { mutate: favoriteMarket } = useFavoriteMarket({
    mutation: {
      onSuccess: (_: void, variables: { marketId: string }) => {
        setLocalMarkets((prevMarkets) =>
          prevMarkets.map((market) =>
            market.id === variables.marketId
              ? { ...market, isFavorite: true }
              : market
          )
        );
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
      onSuccess: (_: void, variables: { marketId: string }) => {
        setLocalMarkets((prevMarkets) =>
          prevMarkets.map((market) =>
            market.id === variables.marketId
              ? { ...market, isFavorite: false }
              : market
          )
        );
        queryClient.invalidateQueries({ queryKey: ["favoriteMarkets"] });
        queryClient.invalidateQueries({ queryKey: ["markets"] });
        ToastAndroid.show(
          "Mercado removido dos favoritos!",
          ToastAndroid.SHORT
        );
      },
    },
  });

  const { mutate: favoriteProduct } = useFavoriteProduct({
    mutation: {
      onSuccess: (_: void, variables: { productId: string }) => {
        setLocalProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === variables.productId
              ? { ...product, isFavorite: true }
              : product
          )
        );
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
      onSuccess: (_: void, variables: { productId: string }) => {
        setLocalProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === variables.productId
              ? { ...product, isFavorite: false }
              : product
          )
        );
        queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        ToastAndroid.show(
          "Produto removido dos favoritos!",
          ToastAndroid.SHORT
        );
      },
    },
  });

  const isLoading = isLoadingProducts || isLoadingMarkets;

  useEffect(() => {
    if (productsData?.products) {
      const products = productsData.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: "R$ 0,00",
        category: product.category,
        image: null,
        type: "product" as const,
        isFavorite:
          favoriteProductsData?.some(
            (fp: { id: string }) => fp.id === product.id
          ) || false,
      }));
      setLocalProducts(products);
    }
  }, [productsData, favoriteProductsData]);

  useEffect(() => {
    if (marketsData?.markets) {
      const markets = marketsData.markets.map((market) => ({
        id: market.id,
        name: market.name,
        state: market.state,
        city: market.city,
        address: market.address,
        price: "",
        image: null,
        type: "market" as const,
        isFavorite:
          favoriteMarketsData?.some(
            (fm: { id: string }) => fm.id === market.id
          ) || false,
      }));
      setLocalMarkets(markets);
    }
  }, [marketsData, favoriteMarketsData]);

  const favorites: ItemType[] = [
    ...localMarkets.filter((market) => market.isFavorite),
    ...localProducts.filter((product) => product.isFavorite),
  ].slice(0, 5);

  const handleToggleFavorite = (item: ItemType) => {
    if (item.type === "market") {
      if (item.isFavorite) {
        unfavoriteMarket({ marketId: item.id });
      } else {
        favoriteMarket({ marketId: item.id });
      }
    } else {
      if (item.isFavorite) {
        unfavoriteProduct({ productId: item.id });
      } else {
        favoriteProduct({ productId: item.id });
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const filteredProducts = localProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );

    const filteredMarkets = localMarkets.filter((market) =>
      market.name.toLowerCase().includes(query.toLowerCase())
    );

    const combinedResults = [...filteredProducts, ...filteredMarkets];
    setSearchResults(combinedResults);
  };

  const handleLoadMore = () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      setIsLoadingMore(false);
    }, 1000);
  };

  const renderListHeader = () => (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favoritos</Text>
        <FavoritesRow
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Produtos recentes</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Procurar produto ou mercado..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#333"
          inputStyle={styles.searchInput}
        />
      </View>

      {isSearching ? (
        <SearchResults
          results={searchResults}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        <FlatList
          data={localProducts}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={styles.productList}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaView>
  );
}
