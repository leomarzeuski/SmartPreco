import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Linking,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { styles } from "@/styles/suport";

const helpTopics = [
  {
    id: 1,
    title: "Como adicionar um produto?",
    content:
      "Para adicionar um produto, vá até a aba 'Adicionar Produto' e preencha o formulário com os detalhes do produto. Você pode escanear o código de barras ou inserir manualmente as informações.",
  },
  {
    id: 2,
    title: "Como comparar preços?",
    content:
      "Na tela de detalhes do produto, toque no botão 'Comparar Preços' para ver o produto em diferentes mercados e comparar os valores.",
  },
  {
    id: 3,
    title: "Como favoritar produtos?",
    content:
      "Na tela de detalhes do produto, toque no ícone de estrela no canto superior direito para adicionar ou remover o produto dos favoritos.",
  },
  {
    id: 4,
    title: "Definições da conta",
    content:
      "Você pode gerenciar sua conta nas configurações do aplicativo. Toque no ícone de perfil na tela inicial e depois em 'Configurações'.",
  },
];

export default function SupportScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);

  const sendEmail = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }

    const subject = "Suporte - Aplicativo de Comparação de Preços";
    const body = `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`;
    const mailTo = "suporte@seuapp.com";

    const url = `mailto:${mailTo}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            "Erro",
            "Não foi possível abrir o aplicativo de email. Por favor, envie sua mensagem para suporte@seuapp.com"
          );
        }
      })
      .catch((error) => {
        console.error("Erro ao abrir link:", error);
        Alert.alert(
          "Erro",
          "Ocorreu um erro ao tentar enviar o email. Por favor, tente novamente mais tarde."
        );
      })
      .finally(() => {
        setName("");
        setEmail("");
        setMessage("");
        Alert.alert(
          "Sucesso",
          "Sua mensagem foi enviada! Entraremos em contato em breve."
        );
      });
  };

  const toggleTopic = (id: number) => {
    if (expandedTopic === id) {
      setExpandedTopic(null);
    } else {
      setExpandedTopic(id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Suporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>

            {helpTopics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={styles.topicItem}
                onPress={() => toggleTopic(topic.id)}
              >
                <View style={styles.topicHeader}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <IconButton
                    icon={
                      expandedTopic === topic.id ? "chevron-up" : "chevron-down"
                    }
                    size={20}
                    style={styles.topicIcon}
                  />
                </View>
                {expandedTopic === topic.id && (
                  <Text style={styles.topicContent}>{topic.content}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Entre em Contato</Text>
            <Text style={styles.sectionSubtitle}>
              Não encontrou o que procurava? Envie-nos uma mensagem.
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu.email@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Mensagem</Text>
              <TextInput
                style={styles.textArea}
                value={message}
                onChangeText={setMessage}
                placeholder="Descreva sua dúvida ou problema..."
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={sendEmail}>
              <Text style={styles.submitButtonText}>Enviar Mensagem</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.contactInfoTitle}>Informações de Contato</Text>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL("mailto:smartpreco@gmail.com")}
            >
              <IconButton icon="email" size={20} style={styles.contactIcon} />
              <Text style={styles.contactText}>smartpreco@gmail.com</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL("tel:+55159123-1234")}
            >
              <IconButton icon="phone" size={20} style={styles.contactIcon} />
              <Text style={styles.contactText}>(15) 9123-1234</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL("https://www.teste.com")}
            >
              <IconButton icon="web" size={20} style={styles.contactIcon} />
              <Text style={styles.contactText}>www.teste.com</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
