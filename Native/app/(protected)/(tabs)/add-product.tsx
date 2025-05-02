import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { z } from "zod";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Header } from "@/components/Header";
import { styles } from "@/styles/add-product";

const productSchema = z.object({
  name: z.string().min(1, "Nome do produto é obrigatório"),
  price: z
    .string()
    .min(1, "Preço é obrigatório")
    .refine(
      (val) => {
        return /^\d+([.,]\d+)?$/.test(val);
      },
      {
        message: "Preço deve ser um valor numérico válido",
      }
    ),
  market: z.string().min(1, "Nome do mercado é obrigatório"),
  imageUri: z.string().nullable().optional(),
  barcode: z.string().optional(),
});

type ProductData = z.infer<typeof productSchema>;

export default function AddProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [market, setMarket] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [barcode, setBarcode] = useState((params.barcode as string) || "");

  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    market?: string;
    imageUri?: string;
    barcode?: string;
  }>({});

  useEffect(() => {
    if (!barcode) return;

    async function fetchProduct() {
      try {
        const res = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );
        const json = await res.json();
        if (json.status === 1) {
          const p = json.product;
          setProductName(p.product_name || "");
          setImage(p.image_small_url || null);
        } else {
          Alert.alert("Produto não encontrado na base pública");
        }
      } catch (err) {
        console.error(err);
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
      productSchema.parse({
        name: productName,
        price,
        market,
        imageUri: image,
        barcode,
      });

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          formattedErrors[path] = err.message;
        });

        setErrors(formattedErrors);

        const firstError = error.errors[0];
        Alert.alert("Erro de Validação", firstError.message);
      } else {
        Alert.alert("Erro", "Ocorreu um erro ao validar os dados");
      }
      return false;
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const productData: ProductData = {
      name: productName,
      price,
      market,
      imageUri: image,
      barcode,
    };

    console.log("Dados validados:", productData);
    Alert.alert("Sucesso", "Produto cadastrado com sucesso!");

    setProductName("");
    setPrice("");
    setMarket("");
    setImage(null);
    setBarcode("");
  };

  const handleSelectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permissão Negada",
        "Precisamos de permissão para acessar sua galeria"
      );
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setErrors((prev) => ({ ...prev, imageUri: undefined }));
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Houve um problema ao selecionar a imagem");
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permissão Negada",
        "Precisamos de permissão para acessar sua câmera"
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
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

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Adicionar Produto</Text>

          <View style={styles.imageSection}>
            <Text style={styles.imageLabel}>Imagem de comprovação</Text>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={showImageOptions}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.productImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <IconButton icon="image-off" size={30} />
                </View>
              )}
              <TouchableOpacity
                style={styles.editButton}
                onPress={showImageOptions}
              >
                <IconButton icon="pencil" size={18} style={styles.editIcon} />
              </TouchableOpacity>
            </TouchableOpacity>
            {errors.imageUri && (
              <Text style={styles.errorText}>{errors.imageUri}</Text>
            )}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Nome do produto</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={productName}
              onChangeText={(text) => {
                setProductName(text);
                if (text.trim() && errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              placeholder="Ex: Arroz Integral 1kg"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <Text style={styles.inputLabel}>Preço</Text>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                if (text.trim() && errors.price) {
                  setErrors((prev) => ({ ...prev, price: undefined }));
                }
              }}
              placeholder="Ex: 10,90"
              keyboardType="numeric"
            />
            {errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}

            <Text style={styles.inputLabel}>Mercado</Text>
            <TextInput
              style={[styles.input, errors.market && styles.inputError]}
              value={market}
              onChangeText={(text) => {
                setMarket(text);
                if (text.trim() && errors.market) {
                  setErrors((prev) => ({ ...prev, market: undefined }));
                }
              }}
              placeholder="Ex: Supermercado ABC"
            />
            {errors.market && (
              <Text style={styles.errorText}>{errors.market}</Text>
            )}

            <View style={styles.barcodeSection}>
              <Text style={styles.inputLabel}>Código de Barras</Text>
              <View style={styles.barcodeContainer}>
                <TextInput
                  style={[
                    styles.barcodeInput,
                    errors.barcode && styles.inputError,
                  ]}
                  value={barcode}
                  onChangeText={(text) => {
                    setBarcode(text);
                    if (errors.barcode) {
                      setErrors((prev) => ({ ...prev, barcode: undefined }));
                    }
                  }}
                  placeholder="Escaneie ou digite o código de barras"
                  keyboardType="number-pad"
                />
                <TouchableOpacity
                  style={styles.scanButton}
                  onPress={openBarcodeScanner}
                >
                  <IconButton icon="barcode-scan" size={24} />
                </TouchableOpacity>
              </View>
              {errors.barcode && (
                <Text style={styles.errorText}>{errors.barcode}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
