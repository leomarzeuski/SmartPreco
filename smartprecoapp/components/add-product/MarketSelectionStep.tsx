import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { appColors } from "@/constants/theme";
import { MarketDto } from "@/api/model";
import { styles } from "@/styles/add-product";

interface MarketSelectionStepProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: { markets: MarketDto[] } | undefined;
  isSearching: boolean;
  handleSelectMarket: (market: MarketDto | null) => void;
  handleCreateNewMarket: () => void;
  isCreatingMarket: boolean;
  market: MarketDto | null;
  marketName: string;
  address: string;
  city: string;
  state: string;
  setMarketName: (name: string) => void;
  setAddress: (address: string) => void;
  setCity: (city: string) => void;
  setState: (state: string) => void;
  errors: {
    marketName?: string;
    address?: string;
    city?: string;
    state?: string;
  };
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  selectedProduct: any;
  handleChangeProduct: () => void;
  marketImage?: string | null;
  showMarketImageOptions?: () => void;
}

interface MarketItemProps {
  item: MarketDto;
  onSelect: (market: MarketDto) => void;
}

const MarketItem = ({ item, onSelect }: MarketItemProps) => (
  <TouchableOpacity
    style={styles.marketItem}
    onPress={() => onSelect(item)}
    activeOpacity={0.7}
  >
    <Text style={styles.marketItemName}>{item.name}</Text>
    <Text style={styles.marketItemAddress}>{item.address}</Text>
    <Text style={styles.marketItemLocation}>
      {item.city}, {item.state}
    </Text>
  </TouchableOpacity>
);

const SelectedProduct = ({
  product,
  onChangeProduct,
}: {
  product: any;
  onChangeProduct: () => void;
}) => (
  <View style={styles.selectedProductContainer}>
    <Text style={styles.selectedProductTitle}>Produto Selecionado</Text>
    <View style={styles.selectedProduct}>
      {(product.imageUrl || product.image_url) && (
        <Image
          source={{ uri: product.imageUrl || product.image_url }}
          style={styles.selectedProductImage}
        />
      )}
      <View style={styles.selectedProductInfo}>
        <Text style={styles.selectedProductName}>{product.name}</Text>
        <Text style={styles.selectedProductCategory}>{product.category}</Text>
      </View>
      <TouchableOpacity
        style={styles.changeProductButton}
        onPress={onChangeProduct}
      >
        <Text style={styles.changeProductButtonText}>Alterar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const MarketForm = ({
  marketName,
  address,
  city,
  state,
  setMarketName,
  setAddress,
  setCity,
  setState,
  errors,
  focusedField,
  setFocusedField,
  marketImage,
  showMarketImageOptions,
}: {
  marketName: string;
  address: string;
  city: string;
  state: string;
  setMarketName: (name: string) => void;
  setAddress: (address: string) => void;
  setCity: (city: string) => void;
  setState: (state: string) => void;
  errors: {
    marketName?: string;
    address?: string;
    city?: string;
    state?: string;
  };
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  marketImage?: string | null;
  showMarketImageOptions?: () => void;
}) => (
  <>
    <View style={styles.formGroup}>
      <Text style={styles.inputLabel}>Nome do Mercado</Text>
      <TextInput
        style={[
          styles.input,
          focusedField === "marketName" && styles.inputFocused,
          errors.marketName && styles.inputError,
        ]}
        value={marketName}
        onChangeText={setMarketName}
        placeholder="Ex: Supermercado Bom Preço"
        onFocus={() => setFocusedField("marketName")}
        onBlur={() => setFocusedField(null)}
      />
      {errors.marketName && (
        <Text style={styles.errorText}>{errors.marketName}</Text>
      )}
    </View>

    <View style={styles.formGroup}>
      <Text style={styles.inputLabel}>Endereço</Text>
      <TextInput
        style={[
          styles.input,
          focusedField === "address" && styles.inputFocused,
          errors.address && styles.inputError,
        ]}
        value={address}
        onChangeText={setAddress}
        placeholder="Ex: Av. Paulista, 1000"
        onFocus={() => setFocusedField("address")}
        onBlur={() => setFocusedField(null)}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
    </View>

    <View style={styles.rowContainer}>
      <View style={[styles.formGroup, { flex: 2, marginRight: 10 }]}>
        <Text style={styles.inputLabel}>Cidade</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === "city" && styles.inputFocused,
            errors.city && styles.inputError,
          ]}
          value={city}
          onChangeText={setCity}
          placeholder="Ex: São Paulo"
          onFocus={() => setFocusedField("city")}
          onBlur={() => setFocusedField(null)}
        />
        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
      </View>

      <View style={[styles.formGroup, { flex: 1 }]}>
        <Text style={styles.inputLabel}>Estado</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === "state" && styles.inputFocused,
            errors.state && styles.inputError,
          ]}
          value={state}
          onChangeText={setState}
          placeholder="Ex: SP"
          maxLength={2}
          autoCapitalize="characters"
          onFocus={() => setFocusedField("state")}
          onBlur={() => setFocusedField(null)}
        />
        {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
      </View>
    </View>

    {showMarketImageOptions && (
      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Imagem do Mercado (Opcional)</Text>
        <TouchableOpacity
          style={styles.scannerButton}
          onPress={showMarketImageOptions}
          activeOpacity={0.7}
        >
          <View style={styles.scannerButtonContent}>
            {marketImage ? (
              <>
                <Image
                  source={{ uri: marketImage }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    marginRight: 10,
                  }}
                />
                <Text style={styles.createNewButtonText}>Alterar Imagem</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons
                  name="camera-plus"
                  size={24}
                  color={appColors.primary}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.createNewButtonText}>Adicionar Imagem</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    )}
  </>
);

const SelectedMarket = ({
  market,
  onChangeMarket,
}: {
  market: MarketDto;
  onChangeMarket: () => void;
}) => (
  <View style={styles.selectedMarketContainer}>
    <Text style={styles.selectedMarketTitle}>Mercado Selecionado</Text>
    <View style={styles.selectedMarket}>
      {market.imageUrl && (
        <Image
          source={{ uri: market.imageUrl }}
          style={styles.selectedMarketImage}
        />
      )}
      <View style={styles.selectedMarketInfo}>
        <Text style={styles.selectedMarketName}>{market.name}</Text>
        <Text style={styles.selectedMarketAddress}>{market.address}</Text>
        <Text style={styles.selectedMarketLocation}>
          {market.city}, {market.state}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.changeMarketButton}
        onPress={onChangeMarket}
      >
        <Text style={styles.changeMarketButtonText}>Alterar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const MarketSearch = ({
  searchQuery,
  setSearchQuery,
  isSearching,
  searchResults,
  handleCreateNewMarket,
  handleSelectMarket,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  searchResults: { markets: MarketDto[] } | undefined;
  handleCreateNewMarket: () => void;
  handleSelectMarket: (market: MarketDto | null) => void;
}) => {
  const renderSearchInput = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar mercados existentes..."
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
  );

  const renderCreateNewButton = () => (
    <TouchableOpacity
      style={styles.createNewButton}
      onPress={handleCreateNewMarket}
    >
      <Text style={styles.createNewButtonText}>Cadastrar novo mercado</Text>
    </TouchableOpacity>
  );

  if (isSearching) {
    return (
      <>
        {renderSearchInput()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColors.primary} />
          <Text style={styles.loadingText}>Buscando mercados...</Text>
        </View>
      </>
    );
  }

  if (searchQuery.length > 2 && searchResults?.markets?.length === 0) {
    return (
      <>
        {renderSearchInput()}
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            Nenhum mercado encontrado para {searchQuery}
          </Text>
          {renderCreateNewButton()}
        </View>
      </>
    );
  }

  if (searchQuery.length > 2) {
    return (
      <>
        {renderSearchInput()}
        <FlatList
          data={searchResults?.markets || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MarketItem item={item} onSelect={handleSelectMarket} />
          )}
          style={styles.marketsScrollView}
          ListFooterComponent={renderCreateNewButton()}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          getItemLayout={(data, index) => ({
            length: 90,
            offset: 90 * index,
            index,
          })}
        />
      </>
    );
  }

  return (
    <>
      {renderSearchInput()}
      <View style={styles.initialSelectionContainer}>
        <Text style={styles.initialSelectionText}>
          Digite ao menos 3 caracteres para buscar mercados existentes
        </Text>
        {renderCreateNewButton()}
      </View>
    </>
  );
};

const MarketSelectionStep: React.FC<MarketSelectionStepProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  handleSelectMarket,
  handleCreateNewMarket,
  isCreatingMarket,
  market,
  marketName,
  address,
  city,
  state,
  setMarketName,
  setAddress,
  setCity,
  setState,
  errors,
  focusedField,
  setFocusedField,
  selectedProduct,
  handleChangeProduct,
  marketImage,
  showMarketImageOptions,
}) => {
  if (isCreatingMarket) {
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Cadastrar Novo Mercado</Text>

        <MarketForm
          marketName={marketName}
          address={address}
          city={city}
          state={state}
          setMarketName={setMarketName}
          setAddress={setAddress}
          setCity={setCity}
          setState={setState}
          errors={errors}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
          marketImage={marketImage}
          showMarketImageOptions={showMarketImageOptions}
        />

        {selectedProduct && (
          <SelectedProduct
            product={selectedProduct}
            onChangeProduct={handleChangeProduct}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Selecionar ou Criar Mercado</Text>

      {market ? (
        <View>
          <SelectedMarket
            market={market}
            onChangeMarket={() => handleSelectMarket(null)}
          />

          {selectedProduct && (
            <SelectedProduct
              product={selectedProduct}
              onChangeProduct={handleChangeProduct}
            />
          )}
        </View>
      ) : (
        <>
          <MarketSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearching={isSearching}
            searchResults={searchResults}
            handleCreateNewMarket={handleCreateNewMarket}
            handleSelectMarket={handleSelectMarket}
          />

          {selectedProduct && (
            <SelectedProduct
              product={selectedProduct}
              onChangeProduct={handleChangeProduct}
            />
          )}
        </>
      )}
    </View>
  );
};

export default MarketSelectionStep;
