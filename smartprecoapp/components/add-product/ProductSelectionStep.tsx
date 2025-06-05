import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { appColors } from "@/constants/theme";
import { ProductDto } from "@/api/model";
import { styles } from "@/styles/add-product";

interface ProductSelectionStepProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: { products: ProductDto[] } | undefined;
  isSearching: boolean;
  handleSelectProduct: (product: ProductDto) => void;
  handleCreateNewProduct: () => void;
  openBarcodeScanner: () => void;
}

interface ProductItemProps {
  item: ProductDto;
  onSelect: (product: ProductDto) => void;
}

const ProductItem = ({ item, onSelect }: ProductItemProps) => {
  return (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.productItemName}>{item.name}</Text>
      <Text style={styles.productItemCategory}>{item.category}</Text>
    </TouchableOpacity>
  );
};

const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  handleSelectProduct,
  handleCreateNewProduct,
  openBarcodeScanner,
}) => {
  const renderActionButtons = () => (
    <View style={{ marginTop: 16, marginBottom: 16 }}>
      <TouchableOpacity
        style={styles.createNewButton}
        onPress={handleCreateNewProduct}
      >
        <Text style={styles.createNewButtonText}>Criar novo produto</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={[
          styles.createNewButton,
          { backgroundColor: "#4B7BEC", marginTop: 10 },
        ]}
        onPress={openBarcodeScanner}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name="barcode-scan"
            size={18}
            color="#FFFFFF"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.createNewButtonText}>Escanear código</Text>
        </View>
      </TouchableOpacity> */}
    </View>
  );

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Selecionar ou Criar Produto</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtos existentes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color="#757575"
          style={styles.searchIcon}
        />
      </View>

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColors.primary} />
          <Text style={styles.loadingText}>Buscando produtos...</Text>
        </View>
      ) : searchQuery.length > 2 && searchResults?.products?.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            Nenhum produto encontrado para &quot;{searchQuery}&quot;
          </Text>
          {renderActionButtons()}
        </View>
      ) : searchQuery.length > 2 ? (
        <FlatList
          data={searchResults?.products || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductItem item={item} onSelect={handleSelectProduct} />
          )}
          style={styles.productsList}
          ListFooterComponent={renderActionButtons()}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          getItemLayout={(data, index) => ({
            length: 80,
            offset: 80 * index,
            index,
          })}
        />
      ) : (
        <View style={styles.initialSelectionContainer}>
          <Text style={styles.initialSelectionText}>
            Digite ao menos 3 caracteres para buscar produtos existentes
          </Text>
          {renderActionButtons()}
        </View>
      )}
    </View>
  );
};

export default ProductSelectionStep;
