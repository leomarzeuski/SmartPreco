import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ToastAndroid,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { z } from "zod";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Header } from "@/components/Header";
import { styles } from "@/styles/add-product";
import { useCreateProduct } from "@/api/product/product";
import { useQueryClient } from "@tanstack/react-query";
import { ProductCreateDto } from "@/api/model";
import { productSchema } from "@/utils/validation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { appColors } from "@/constants/theme";

export default function AddProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [market, setMarket] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [barcode, setBarcode] = useState((params.barcode as string) || "");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    market?: string;
    imageUri?: string;
    barcode?: string;
    description?: string;
    category?: string;
  }>({});

  const { mutate: createProduct, isPending: isCreatingProduct } =
    useCreateProduct({
      mutation: {
        onSuccess: () => {
          ToastAndroid.show(
            "Produto cadastrado com sucesso!",
            ToastAndroid.SHORT
          );
          queryClient.invalidateQueries({ queryKey: ["products"] });
          queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
          queryClient.invalidateQueries({ queryKey: ["readProducts"] });
          queryClient.invalidateQueries({ queryKey: ["getFavoriteProducts"] });
          resetForm();
          router.back();
        },
        onError: (error) => {
          console.error("Erro ao cadastrar produto:", error);
          ToastAndroid.show(
            "Erro ao cadastrar produto. Tente novamente.",
            ToastAndroid.SHORT
          );
        },
      },
    });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const resetForm = () => {
    setProductName("");
    setPrice(0);
    setMarket("");
    setImage(null);
    setImageBlob(null);
    setBarcode("");
    setDescription("");
    setCategory("");
    setErrors({});
  };

  useEffect(() => {
    if (!barcode) return;

    async function fetchProduct() {
      try {
        console.log("Buscando produto com código:", barcode);
        const res = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );
        const json = await res.json();
        console.log("Resposta da API:", json.status);
        if (json.status === 1) {
          const p = json.product;
          setProductName(p.product_name || "");
          setImage(p.image_small_url || null);

          if (p.product_name) {
            ToastAndroid.show(
              "Informações do produto carregadas!",
              ToastAndroid.SHORT
            );
          }
        } else {
          Alert.alert(
            "Produto não encontrado",
            "Este código de barras não foi encontrado na base de dados pública."
          );
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        Alert.alert("Erro ao buscar dados do produto");
      }
    }

    fetchProduct();
  }, [barcode]);

  useEffect(() => {
    if (params.barcode) {
      setBarcode(params.barcode as string);

      if (params.barcodeType) {
        Alert.alert(
          "Código Escaneado",
          `Código de barras ${params.barcode} do tipo ${params.barcodeType} detectado.`
        );
      }
    }
  }, [params]);

  const validateForm = (): boolean => {
    try {
      const formData = {
        name: productName,
        description,
        category,
      };

      console.log("Validando formulário:", formData);
      productSchema.parse(formData);
      console.log("Validação bem-sucedida");

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          formattedErrors[path] = err.message;
        });

        console.log("Erros de validação:", formattedErrors);
        setErrors(formattedErrors);

        const firstError = error.errors[0];
        Alert.alert("Erro de Validação", firstError.message);
      } else {
        console.error("Erro desconhecido:", error);
        Alert.alert("Erro", "Ocorreu um erro ao validar os dados");
      }
      return false;
    }
  };

  const handlePriceChange = (text: string) => {
    const numbers = text.replace(/\D/g, "");

    if (!numbers) {
      setPrice(0);
      return;
    }

    setPrice(Number(numbers));

    if (errors.price) {
      setErrors((prev) => ({ ...prev, price: undefined }));
    }
  };

  const formatPrice = (price: number): string => {
    if (price === 0) return "";

    const priceStr = price.toString().padStart(3, "0");

    const reais = priceStr.slice(0, priceStr.length - 2) || "0";
    const centavos = priceStr.slice(priceStr.length - 2);

    const formattedReais = parseInt(reais).toLocaleString("pt-BR");

    return `${formattedReais},${centavos}`;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const productData: ProductCreateDto = {
        name: productName,
        description,
        category,
        // price: price / 100,
        // market: market,
        // barcode: barcode,
      };

      console.log("Enviando dados do produto:", productData);
      createProduct({ data: productData });
    } catch (error) {
      console.error("Erro ao preparar dados:", error);
      ToastAndroid.show(
        "Erro ao preparar dados do produto. Tente novamente.",
        ToastAndroid.SHORT
      );
    }
  };

  const handleSelectImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permissão Negada",
          "Precisamos de permissão para acessar sua galeria"
        );
        return;
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3] as [number, number],
        quality: 0.8,
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setImage(selectedUri);

        try {
          const response = await fetch(selectedUri);
          const blob = await response.blob();
          setImageBlob(blob);
        } catch (blobError) {
          console.error("Erro ao converter imagem:", blobError);
        }

        setErrors((prev) => ({ ...prev, imageUri: undefined }));
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Houve um problema ao selecionar a imagem");
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permissão Negada",
          "Precisamos de permissão para acessar sua câmera"
        );
        return;
      }

      const options: ImagePicker.ImagePickerOptions = {
        allowsEditing: true,
        aspect: [4, 3] as [number, number],
        quality: 0.8,
      };

      const result = await ImagePicker.launchCameraAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        setImage(photoUri);

        try {
          const response = await fetch(photoUri);
          const blob = await response.blob();
          setImageBlob(blob);
        } catch (blobError) {
          console.error("Erro ao converter imagem:", blobError);
        }

        setErrors((prev) => ({ ...prev, imageUri: undefined }));
      }
    } catch (error) {
      console.error("Erro ao capturar foto:", error);
      Alert.alert("Erro", "Houve um problema ao capturar a foto");
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Selecionar Imagem",
      "Escolha uma opção",
      [
        {
          text: "Câmera",
          onPress: handleTakePhoto,
        },
        {
          text: "Galeria",
          onPress: handleSelectImage,
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const openBarcodeScanner = () => {
    router.push("/barcode-scanner");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Adicionar Produto</Text>

          <View style={styles.imageSection}>
            <Text style={styles.imageLabel}>Foto do Produto</Text>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={showImageOptions}
              activeOpacity={0.8}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialCommunityIcons
                    name="camera-plus-outline"
                    size={40}
                    color="#9E9E9E"
                    style={styles.placeholderIcon}
                  />
                  <Text style={styles.placeholderText}>
                    Toque para adicionar uma foto do produto
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {image && (
              <Text style={styles.imageInfo}>
                Toque na imagem para alterar a foto
              </Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Nome do Produto</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "name" && styles.inputFocused,
                errors.name && styles.inputError,
              ]}
              value={productName}
              onChangeText={setProductName}
              placeholder="Ex: Arroz Integral Tipo 1"
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Preço (R$)</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceCurrency}>R$</Text>
              <TextInput
                style={styles.priceInput}
                value={formatPrice(price)}
                onChangeText={handlePriceChange}
                placeholder="0,00"
                keyboardType="numeric"
                onFocus={() => setFocusedField("price")}
                onBlur={() => setFocusedField(null)}
              />
            </View>
            {errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Mercado</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "market" && styles.inputFocused,
                errors.market && styles.inputError,
              ]}
              value={market}
              onChangeText={setMarket}
              placeholder="Ex: Supermercado Bom Preço"
              onFocus={() => setFocusedField("market")}
              onBlur={() => setFocusedField(null)}
            />
            {errors.market && (
              <Text style={styles.errorText}>{errors.market}</Text>
            )}
          </View>

          <View style={styles.barcodeSection}>
            <Text style={styles.inputLabel}>Código de Barras</Text>
            <View style={styles.barcodeContainer}>
              <TextInput
                style={[
                  styles.barcodeInput,
                  focusedField === "barcode" && styles.inputFocused,
                  errors.barcode && styles.inputError,
                ]}
                value={barcode}
                onChangeText={setBarcode}
                placeholder="Digite ou escaneie o código"
                keyboardType="numeric"
                onFocus={() => setFocusedField("barcode")}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity
                style={styles.scanButton}
                onPress={openBarcodeScanner}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="barcode-scan"
                  size={24}
                  color={appColors.primary}
                />
              </TouchableOpacity>
            </View>
            {errors.barcode && (
              <Text style={styles.errorText}>{errors.barcode}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
              style={[
                styles.textArea,
                focusedField === "description" && styles.inputFocused,
                errors.description && styles.inputError,
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva detalhes como marca, tamanho, tipo, etc."
              multiline
              numberOfLines={4}
              onFocus={() => setFocusedField("description")}
              onBlur={() => setFocusedField(null)}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Categoria</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "category" && styles.inputFocused,
                errors.category && styles.inputError,
              ]}
              value={category}
              onChangeText={setCategory}
              placeholder="Ex: Alimentos, Bebidas, Limpeza"
              onFocus={() => setFocusedField("category")}
              onBlur={() => setFocusedField(null)}
            />
            {errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
          </View>

          <View style={styles.saveButtonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, isCreatingProduct && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={isCreatingProduct}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {isCreatingProduct ? "Salvando..." : "Cadastrar Produto"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
