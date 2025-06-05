import React from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "@/styles/add-product";

interface ProductDetailsStepProps {
  productName: string;
  setProductName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  isCreatingNewProduct: boolean;
  image: string | null;
  imageUrl?: string | null;
  showImageOptions: () => void;
  errors: {
    name?: string;
    description?: string;
    category?: string;
    imageUri?: string;
  };
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
}

const ProductDetailsStep: React.FC<ProductDetailsStepProps> = ({
  productName,
  setProductName,
  description,
  setDescription,
  category,
  setCategory,
  isCreatingNewProduct,
  image,
  imageUrl,
  showImageOptions,
  errors,
  focusedField,
  setFocusedField,
}) => {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>
        {isCreatingNewProduct
          ? "Preencha os detalhes do produto"
          : "Detalhes do Produto"}
      </Text>

      <View style={styles.imageSection}>
        <Text style={styles.imageLabel}>Foto do Produto</Text>
        <TouchableOpacity
          style={[
            styles.imageContainer,
            !isCreatingNewProduct && styles.disabledInput,
          ]}
          onPress={isCreatingNewProduct ? showImageOptions : undefined}
          activeOpacity={isCreatingNewProduct ? 0.8 : 1}
        >
          {image || imageUrl ? (
            <Image
              source={{ uri: image || imageUrl || "" }}
              style={styles.image}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={40}
                color="#9E9E9E"
                style={styles.placeholderIcon}
              />
              <Text style={styles.placeholderText}>
                {isCreatingNewProduct
                  ? "Toque para adicionar uma foto do produto"
                  : "Produto já cadastrado - foto não editável"}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {(image || imageUrl) && isCreatingNewProduct && (
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
            !isCreatingNewProduct && styles.disabledInput,
          ]}
          value={productName}
          onChangeText={setProductName}
          placeholder="Ex: Arroz Integral Tipo 1"
          onFocus={() => setFocusedField("name")}
          onBlur={() => setFocusedField(null)}
          editable={isCreatingNewProduct}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Descrição</Text>
        <TextInput
          style={[
            styles.textArea,
            focusedField === "description" && styles.inputFocused,
            errors.description && styles.inputError,
            !isCreatingNewProduct && styles.disabledInput,
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descreva detalhes como marca, tamanho, tipo, etc."
          multiline
          numberOfLines={4}
          onFocus={() => setFocusedField("description")}
          onBlur={() => setFocusedField(null)}
          editable={isCreatingNewProduct}
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
            !isCreatingNewProduct && styles.disabledInput,
          ]}
          value={category}
          onChangeText={setCategory}
          placeholder="Ex: Alimentos, Bebidas, Limpeza"
          onFocus={() => setFocusedField("category")}
          onBlur={() => setFocusedField(null)}
          editable={isCreatingNewProduct}
        />
        {errors.category && (
          <Text style={styles.errorText}>{errors.category}</Text>
        )}
      </View>
    </View>
  );
};

export default ProductDetailsStep;
