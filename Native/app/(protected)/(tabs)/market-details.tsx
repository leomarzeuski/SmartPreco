import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton, Chip } from "react-native-paper";
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { styles } from "@/styles/market-details";

type MarketDetailParams = {
  id: number;
  name: string;
  rating: number;
  distance: string;
};

type ProductItem = {
  id: number;
  name: string;
  price: string;
  image: null | any;
  category: string;
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
  };
};

export default function MarketDetailScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as MarketDetailParams;
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  const marketInfo = {
    address: "Av. Principal, 123 - Centro",
    hours: "08:00 - 22:00",
    phone: "(15) 3333-4444",
  };

  const categories = [
    "Todos",
    "Laticínios",
    "Padaria",
    "Carnes",
    "Bebidas",
    "Limpeza",
  ];

  const products: ProductItem[] = [
    {
      id: 1,
      name: "Leite Integral 1L",
      price: "R$ 4,99",
      image: null,
      category: "Laticínios",
    },
    {
      id: 2,
      name: "Pão Francês 1kg",
      price: "R$ 8,90",
      image: null,
      category: "Padaria",
    },
    {
      id: 3,
      name: "Queijo Mussarela 500g",
      price: "R$ 19,90",
      image: null,
      category: "Laticínios",
    },
    {
      id: 4,
      name: "Carne Moída 500g",
      price: "R$ 21,50",
      image: null,
      category: "Carnes",
    },
    {
      id: 5,
      name: "Refrigerante 2L",
      price: "R$ 9,49",
      image: null,
      category: "Bebidas",
    },
    {
      id: 6,
      name: "Detergente 500ml",
      price: "R$ 3,50",
      image: null,
      category: "Limpeza",
    },
  ];

  const filteredProducts =
    activeCategory === "Todos"
      ? products
      : products.filter((product) => product.category === activeCategory);

  const navigateToProductDetail = (product: ProductItem) => {
    navigation.navigate("product-details", {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      marketId: params.id,
      marketName: params.name,
    });
  };

  const renderProduct = ({ item }: { item: ProductItem }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigateToProductDetail(item)}
    >
      <View style={styles.productImageContainer}>
        {item.image ? (
          <Image source={item.image} style={styles.productImage} />
        ) : (
          <View style={styles.productPlaceholder} />
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>{params.name}</Text>
        <IconButton
          icon="map-marker"
          size={24}
          onPress={() => console.log("Abrir mapa")}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.infoSection}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{params.rating}</Text>
            <IconButton icon="star" size={16} style={styles.starIcon} />
            <Text style={styles.distance}>{params.distance}</Text>
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

          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
