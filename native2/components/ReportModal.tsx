import { styles } from "@/styles/report-modal";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { IconButton, RadioButton } from "react-native-paper";

type ReportReason =
  | "Preço incorreto"
  | "Imagem inadequada"
  | "Descrição enganosa"
  | "Produto inexistente"
  | "Conteúdo abusivo"
  | "Outro";

interface ReportModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (reason: ReportReason, details: string) => void;
  productName: string;
  isSubmitting?: boolean;
  isSubmitted?: boolean;
}

const ReportModal = ({
  visible,
  onDismiss,
  onSubmit,
  productName,
  isSubmitting = false,
  isSubmitted = false,
}: ReportModalProps) => {
  const [reason, setReason] = useState<ReportReason>("Preço incorreto");
  const [details, setDetails] = useState("");
  const [internalSubmitted, setInternalSubmitted] = useState(false);

  const submitted = isSubmitted || internalSubmitted;

  useEffect(() => {
    if (!visible) {
      setInternalSubmitted(false);
    }
  }, [visible]);

  const reasons: ReportReason[] = [
    "Preço incorreto",
    "Imagem inadequada",
    "Descrição enganosa",
    "Produto inexistente",
    "Conteúdo abusivo",
    "Outro",
  ];

  const resetAndClose = () => {
    setReason("Preço incorreto");
    setDetails("");
    onDismiss();
  };

  const handleSubmit = () => {
    onSubmit(reason, details);
    setInternalSubmitted(true);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={resetAndClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {submitted ? "Denúncia Enviada" : "Denunciar Produto"}
            </Text>
            <IconButton icon="close" size={24} onPress={resetAndClose} />
          </View>

          {!submitted ? (
            <ScrollView style={styles.modalContent}>
              <Text style={styles.productName}>Produto: {productName}</Text>

              <Text style={styles.sectionTitle}>Motivo da denúncia:</Text>
              <RadioButton.Group
                onValueChange={(value) => setReason(value as ReportReason)}
                value={reason}
              >
                {reasons.map((item) => (
                  <View key={item} style={styles.radioItem}>
                    <RadioButton value={item} />
                    <Text>{item}</Text>
                  </View>
                ))}
              </RadioButton.Group>

              <Text style={styles.sectionTitle}>Detalhes adicionais:</Text>
              <TextInput
                style={styles.detailsInput}
                placeholder="Descreva o problema com mais detalhes"
                multiline
                numberOfLines={4}
                value={details}
                onChangeText={setDetails}
              />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (isSubmitting || !reason) && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting || !reason}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Enviar Denúncia</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <View style={styles.successContainer}>
              <IconButton icon="check-circle" size={50} />
              <Text style={styles.successText}>
                Sua denúncia foi enviada com sucesso!
              </Text>
              <Text style={styles.successSubtext}>
                Nossa equipe irá analisar as informações fornecidas.
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={resetAndClose}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ReportModal;
