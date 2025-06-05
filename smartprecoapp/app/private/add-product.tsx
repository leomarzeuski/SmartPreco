import { useCreateMarket, useReadMarkets } from "@/api/market/market";
import {
  MarketCreateDto,
  MarketDto,
  ProductCreateDto,
  ProductDto,
  PriceCreateDto,
} from "@/api/model";
import { useCreatePrice } from "@/api/price/price";
import {
  useCreateProduct,
  useReadProduct,
  useReadProducts,
} from "@/api/product/product";
import { useUploadControllerUploadImage } from "@/api/upload/upload";
import { Header } from "@/components/Header";
import { Stepper } from "@/components/Stepper";
import MarketSelectionStep from "@/components/add-product/MarketSelectionStep";
import PriceDetailsStep from "@/components/add-product/PriceDetailsStep";
import ProductDetailsStep from "@/components/add-product/ProductDetailsStep";
import ProductSelectionStep from "@/components/add-product/ProductSelectionStep";
import { styles } from "@/styles/add-product";
import { productSchema } from "@/utils/validation";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const STEPS = [
  { id: "product-selection", title: "Produto" },
  { id: "product-details", title: "Detalhes" },
  { id: "market-selection", title: "Mercado" },
  { id: "price-details", title: "Preço" },
];

export default function AddProductScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(
    null
  );
  const [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [marketSearchQuery, setMarketSearchQuery] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<MarketDto | null>(null);
  const [isCreatingMarket, setIsCreatingMarket] = useState(false);
  const [marketName, setMarketName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [marketImage, setMarketImage] = useState<string | null>(null);
  const [marketImageUrl, setMarketImageUrl] = useState<string | null>(null);

  const [price, setPrice] = useState<number>(0);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptImageUrl, setReceiptImageUrl] = useState<string | null>(null);

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: productSearchResults, isLoading: isSearchingProducts } =
    useReadProducts(
      productSearchQuery ? { search: productSearchQuery } : undefined,
      { query: { enabled: productSearchQuery.length > 2 } }
    );

  const { data: marketSearchResults, isLoading: isSearchingMarkets } =
    useReadMarkets(
      marketSearchQuery ? { search: marketSearchQuery } : undefined,
      { query: { enabled: marketSearchQuery.length > 2 } }
    );

  const { data: productDetails } = useReadProduct(selectedProduct?.id || "", {
    query: { enabled: !!selectedProduct?.id },
  });

  const { mutate: uploadImage, isPending: isUploadingImage } =
    useUploadControllerUploadImage();

  const { mutate: createProduct, isPending: isCreatingProduct } =
    useCreateProduct({
      mutation: {
        onSuccess: (data) => {
          setSelectedProduct(data);
          ToastAndroid.show("Produto cadastrado!", ToastAndroid.SHORT);
          queryClient.invalidateQueries({ queryKey: ["products"] });
          nextStep();
        },
        onError: () => {
          ToastAndroid.show("Erro ao cadastrar produto", ToastAndroid.SHORT);
        },
      },
    });

  const { mutate: createMarket, isPending: isCreatingMarketMutation } =
    useCreateMarket({
      mutation: {
        onSuccess: (data) => {
          setSelectedMarket(data);
          ToastAndroid.show("Mercado cadastrado!", ToastAndroid.SHORT);
          queryClient.invalidateQueries({ queryKey: ["markets"] });
          nextStep();
        },
        onError: () => {
          ToastAndroid.show("Erro ao cadastrar mercado", ToastAndroid.SHORT);
        },
      },
    });

  const { mutate: createPrice, isPending: isCreatingPrice } = useCreatePrice({
    mutation: {
      onSuccess: () => {
        ToastAndroid.show("Preço cadastrado com sucesso!", ToastAndroid.SHORT);
        queryClient.invalidateQueries({ queryKey: ["prices"] });
        resetForm();
        router.back();
      },
      onError: () => {
        ToastAndroid.show("Erro ao cadastrar preço", ToastAndroid.SHORT);
      },
    },
  });

  useEffect(() => {
    if (productDetails) {
      setProductName(productDetails.name || "");
      setDescription(productDetails.description || "");
      setCategory(productDetails.category || "");
    }
  }, [productDetails]);

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedProduct(null);
    setIsCreatingNewProduct(false);
    setProductSearchQuery("");
    setProductName("");
    setDescription("");
    setCategory("");
    setImage(null);
    setImageUrl(null);
    setMarketSearchQuery("");
    setSelectedMarket(null);
    setIsCreatingMarket(false);
    setMarketName("");
    setAddress("");
    setCity("");
    setState("");
    setMarketImage(null);
    setMarketImageUrl(null);
    setPrice(0);
    setReceiptImage(null);
    setReceiptImageUrl(null);
    setErrors({});
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);

      if (currentStep + 1 === 3) {
        setReceiptImage(null);
        setReceiptImageUrl(null);
      }

      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const uploadImageAsync = (
    uri: string,
    imageType: "product" | "market" | "receipt" = "product"
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const uniqueName = `${imageType}_${timestamp}_${randomId}.jpg`;

      const fileObject = {
        uri: uri,
        type: "image/jpeg",
        name: uniqueName,
      } as any;

      uploadImage(
        { data: { file: fileObject } },
        {
          onSuccess: (result) => resolve(result.imageUrl),
          onError: reject,
        }
      );
    });
  };

  const validateProductForm = (): boolean => {
    try {
      productSchema.parse({ name: productName, description, category });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          formattedErrors[err.path[0] as string] = err.message;
        });
        setErrors(formattedErrors);
        Alert.alert("Erro de Validação", error.errors[0].message);
      }
      return false;
    }
  };

  const validateMarketForm = (): boolean => {
    if (selectedMarket && !isCreatingMarket) return true;

    const newErrors: Record<string, string> = {};
    if (!marketName.trim()) newErrors.marketName = "Nome obrigatório";
    if (!address.trim()) newErrors.address = "Endereço obrigatório";
    if (!city.trim()) newErrors.city = "Cidade obrigatória";
    if (!state.trim()) newErrors.state = "Estado obrigatório";
    else if (state.trim().length !== 2)
      newErrors.state = "Estado deve ter 2 caracteres";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios");
      return false;
    }
    return true;
  };

  const validatePriceForm = (): boolean => {
    if (price <= 0) {
      Alert.alert("Erro", "Informe um preço válido");
      return false;
    }
    return true;
  };

  const selectImage = async (
    imageType: "product" | "market" | "receipt" = "product"
  ) => {
    try {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert("Permissão Negada", "Precisamos acessar sua galeria");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3] as [number, number],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        const uri = result.assets[0].uri;

        if (imageType === "receipt") {
          setReceiptImage(uri);
        } else if (imageType === "market") {
          setMarketImage(uri);
        } else {
          setImage(uri);
        }

        try {
          const uploadedUrl = await uploadImageAsync(uri, imageType);

          if (imageType === "receipt") {
            setReceiptImageUrl(uploadedUrl);
          } else if (imageType === "market") {
            setMarketImageUrl(uploadedUrl);
          } else {
            setImageUrl(uploadedUrl);
          }

          ToastAndroid.show(
            "Imagem carregada com sucesso!",
            ToastAndroid.SHORT
          );
        } catch (error) {
          if (imageType === "receipt") {
            setReceiptImage(null);
          } else if (imageType === "market") {
            setMarketImage(null);
          } else {
            setImage(null);
          }
          ToastAndroid.show("Erro no upload da imagem", ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Problema ao selecionar imagem");
    }
  };

  const takePhoto = async (
    imageType: "product" | "market" | "receipt" = "product"
  ) => {
    try {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        Alert.alert("Permissão Negada", "Precisamos acessar sua câmera");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3] as [number, number],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        const uri = result.assets[0].uri;

        if (imageType === "receipt") {
          setReceiptImage(uri);
        } else if (imageType === "market") {
          setMarketImage(uri);
        } else {
          setImage(uri);
        }

        try {
          const uploadedUrl = await uploadImageAsync(uri, imageType);

          if (imageType === "receipt") {
            setReceiptImageUrl(uploadedUrl);
          } else if (imageType === "market") {
            setMarketImageUrl(uploadedUrl);
          } else {
            setImageUrl(uploadedUrl);
          }

          ToastAndroid.show("Foto carregada com sucesso!", ToastAndroid.SHORT);
        } catch (error) {
          if (imageType === "receipt") {
            setReceiptImage(null);
          } else if (imageType === "market") {
            setMarketImage(null);
          } else {
            setImage(null);
          }
          ToastAndroid.show("Erro no upload da foto", ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Problema ao capturar foto");
    }
  };

  const showImageOptions = (
    imageType: "product" | "market" | "receipt" = "product"
  ) => {
    Alert.alert("Selecionar Imagem", "Escolha uma opção", [
      { text: "Câmera", onPress: () => takePhoto(imageType) },
      { text: "Galeria", onPress: () => selectImage(imageType) },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const handleSelectProduct = (product: ProductDto) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setDescription(product.description);
    setCategory(product.category);
    setProductSearchQuery("");
    setIsCreatingNewProduct(false);

    if (product.imageUrl || product.image_url) {
      const productImageUrl = product.imageUrl || product.image_url;
      setImage(null);
      setImageUrl(productImageUrl || null);
    } else {
      setImage(null);
      setImageUrl(null);
    }
    nextStep();
  };

  const handleCreateNewProduct = () => {
    setIsCreatingNewProduct(true);
    setSelectedProduct(null);
    setProductName("");
    setDescription("");
    setCategory("");
    setImage(null);
    setImageUrl(null);
    nextStep();
  };

  const handleSaveProduct = async () => {
    if (!validateProductForm()) return;

    if (isCreatingNewProduct) {
      const productData: ProductCreateDto = {
        name: productName,
        description,
        category,
      };

      if (imageUrl) {
        productData.imageUrl = imageUrl;
      }

      createProduct({ data: productData });
    } else {
      nextStep();
    }
  };

  const handleSelectMarket = (market: MarketDto | null) => {
    setSelectedMarket(market);
    if (market) {
      setMarketName(market.name);
      setAddress(market.address);
      setCity(market.city);
      setState(market.state);
      setMarketSearchQuery("");
      setIsCreatingMarket(false);
      setMarketImage(null);
      setMarketImageUrl(null);
    }
  };

  const handleCreateNewMarket = () => {
    setIsCreatingMarket(true);
    setSelectedMarket(null);
    setMarketName("");
    setAddress("");
    setCity("");
    setState("");
    setMarketImage(null);
    setMarketImageUrl(null);
  };

  const handleSaveMarket = () => {
    if (!validateMarketForm()) return;

    if (isCreatingMarket) {
      const marketData: MarketCreateDto = {
        name: marketName,
        address,
        city,
        state,
      };

      if (marketImageUrl) {
        marketData.imageUrl = marketImageUrl;
      }

      createMarket({ data: marketData });
    } else {
      nextStep();
    }
  };

  const handleSavePriceDetails = async () => {
    if (!validatePriceForm()) return;
    if (!selectedProduct || !selectedMarket) {
      ToastAndroid.show(
        "Produto e mercado são obrigatórios",
        ToastAndroid.SHORT
      );
      return;
    }

    const priceData: PriceCreateDto = {
      productId: selectedProduct.id,
      marketId: selectedMarket.id,
      price: price / 100,
      imageUrl: "",
    };

    if (receiptImageUrl) {
      priceData.imageUrl = receiptImageUrl;
    }

    createPrice({ data: priceData });
  };

  const handlePriceChange = (text: string) => {
    const numbers = text.replace(/\D/g, "");
    setPrice(numbers ? Number(numbers) : 0);
  };

  const formatPrice = (price: number): string => {
    if (price === 0) return "";
    const priceStr = price.toString().padStart(3, "0");
    const reais = priceStr.slice(0, priceStr.length - 2) || "0";
    const centavos = priceStr.slice(priceStr.length - 2);
    return `${parseInt(reais).toLocaleString("pt-BR")},${centavos}`;
  };

  const handleChangeProduct = () => {
    setCurrentStep(0);
    setSelectedProduct(null);
    setIsCreatingNewProduct(false);
    setProductSearchQuery("");
    setImage(null);
    setImageUrl(null);
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProductSelectionStep
            searchQuery={productSearchQuery}
            setSearchQuery={setProductSearchQuery}
            searchResults={
              productSearchResults
                ? { products: productSearchResults.records }
                : undefined
            }
            isSearching={isSearchingProducts}
            handleSelectProduct={handleSelectProduct}
            handleCreateNewProduct={handleCreateNewProduct}
            openBarcodeScanner={() => router.push("/private/barcode-scanner")}
          />
        );
      case 1:
        return (
          <ProductDetailsStep
            productName={productName}
            setProductName={setProductName}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            isCreatingNewProduct={isCreatingNewProduct}
            image={image}
            imageUrl={imageUrl}
            showImageOptions={() => showImageOptions("product")}
            errors={errors}
            focusedField={focusedField}
            setFocusedField={setFocusedField}
          />
        );
      case 2:
        return (
          <MarketSelectionStep
            searchQuery={marketSearchQuery}
            setSearchQuery={setMarketSearchQuery}
            searchResults={
              marketSearchResults
                ? { markets: marketSearchResults.records }
                : undefined
            }
            isSearching={isSearchingMarkets}
            handleSelectMarket={handleSelectMarket}
            handleCreateNewMarket={handleCreateNewMarket}
            isCreatingMarket={isCreatingMarket}
            market={selectedMarket}
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
            selectedProduct={selectedProduct}
            handleChangeProduct={handleChangeProduct}
            marketImage={marketImage}
            showMarketImageOptions={() => showImageOptions("market")}
          />
        );
      case 3:
        return (
          <PriceDetailsStep
            productInfo={selectedProduct}
            marketInfo={selectedMarket}
            price={price}
            handlePriceChange={handlePriceChange}
            formatPrice={formatPrice}
            receiptImage={receiptImage}
            showReceiptImageOptions={() => showImageOptions("receipt")}
            focusedField={focusedField}
            setFocusedField={setFocusedField}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  const getStepAction = () => {
    switch (currentStep) {
      case 0:
        return selectedProduct ? nextStep : handleCreateNewProduct;
      case 1:
        return handleSaveProduct;
      case 2:
        return handleSaveMarket;
      case 3:
        return handleSavePriceDetails;
      default:
        return () => {};
    }
  };

  const isLoading =
    isCreatingProduct ||
    isCreatingMarketMutation ||
    isSearchingProducts ||
    isSearchingMarkets ||
    isUploadingImage ||
    isCreatingPrice;

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Stepper steps={STEPS} currentStep={currentStep} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View style={styles.content}>
          {renderStepContent()}

          <View style={styles.buttonsContainer}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={prevStep}
                disabled={isLoading}
              >
                <Text style={styles.backButtonText}>Voltar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.nextButton, isLoading && { opacity: 0.7 }]}
              onPress={getStepAction()}
              disabled={isLoading}
            >
              <Text style={styles.nextButtonText}>
                {isLoading
                  ? "Carregando..."
                  : currentStep === STEPS.length - 1
                  ? "Finalizar"
                  : "Avançar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
