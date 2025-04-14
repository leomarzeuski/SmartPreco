import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Searchbar, Card, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { styles } from "@/styles/home";

type ItemType = {
  id: number;
  name: string;
  price: string;
  image: null;
};

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ItemType[]>([]);

  const favoriteProducts = [
    { id: 1, name: "Produto 1", price: "R$ 10,00", image: null },
    { id: 2, name: "Produto 2", price: "R$ 20,00", image: null },
    { id: 3, name: "Produto 3", price: "R$ 30,00", image: null },
    { id: 4, name: "Produto 4", price: "R$ 40,00", image: null },
  ];

  const favoriteMarkets = [
    { id: 1, name: "Mercado 1", price: "", image: null },
    { id: 2, name: "Mercado 2", price: "", image: null },
    { id: 3, name: "Mercado 3", price: "", image: null },
    { id: 4, name: "Mercado 4", price: "", image: null },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const mockResults = [
      { id: 1, name: "Nome do Produto 1", price: "R$ 19,90", image: null },
      { id: 2, name: "Nome do Produto 2", price: "R$ 24,50", image: null },
      { id: 3, name: "Nome do Produto 3", price: "R$ 9,99", image: null },
    ];

    setSearchResults(mockResults);
  };

  const renderFavoriteItem = ({ item }: { item: ItemType }) => (
    <TouchableOpacity style={styles.favoriteItem}>
      <View style={styles.favoriteImageContainer}>
        {item.image ? (
          <Image source={item.image} style={styles.favoriteImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }: { item: ItemType }) => (
    <Card style={styles.resultCard}>
      <View style={styles.resultContent}>
        <View style={styles.resultImageContainer}>
          {item.image ? (
            <Image source={item.image} style={styles.resultImage} />
          ) : (
            <View style={styles.resultPlaceholderImage} />
          )}
        </View>

        <View style={styles.resultInfo}>
          <Text style={styles.resultName}>{item.name}</Text>
          <Text style={styles.resultPrice}>{item.price}</Text>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => console.log(`Ver detalhes do produto ${item.id}`)}
          >
            <Text style={styles.detailsButtonText}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>

        <IconButton
          icon="star-outline"
          size={24}
          onPress={() => console.log(`Favoritar produto ${item.id}`)}
          style={styles.favoriteButton}
        />
      </View>
    </Card>
  );

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
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Resultados</Text>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.resultsList}
          />
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Produtos favoritos</Text>
            <FlatList
              data={favoriteProducts}
              renderItem={renderFavoriteItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favoritesList}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mercados favoritos</Text>
            <FlatList
              data={favoriteMarkets}
              renderItem={renderFavoriteItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favoritesList}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
