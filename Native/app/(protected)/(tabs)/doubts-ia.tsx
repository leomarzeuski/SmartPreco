import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "react-native-paper";
import { Header } from "@/components/Header";
import { appColors } from "@/constants/theme";
import { TypingIndicator } from "@/components/doubts-ia/TypingIndicator";
import { sendMessageToChatGPT } from "@/services/ChatGpt";
import { styles } from "@/styles/doubts-ia";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  status?: "sending" | "sent" | "error";
  type?: "text" | "suggestion" | "product-info" | "price-comparison";
};

export default function DoubtsIAScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Como posso ajudar com suas dúvidas sobre preços e produtos?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
    {
      id: "2",
      text: "Como encontrar o menor preço?",
      sender: "ai",
      timestamp: new Date(),
      type: "suggestion",
    },
    {
      id: "3",
      text: "Como adicionar um novo produto?",
      sender: "ai",
      timestamp: new Date(),
      type: "suggestion",
    },
    {
      id: "4",
      text: "Qual mercado mais barato perto de mim?",
      sender: "ai",
      timestamp: new Date(),
      type: "suggestion",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async (customText?: string) => {
    const messageText = customText || input;
    if (messageText.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendToChatGPT(messageText);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "sent" } : msg
        )
      );

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "error" } : msg
        )
      );

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Desculpe, houve um erro ao processar sua mensagem. Tente novamente mais tarde.",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const sendToChatGPT = async (text: string): Promise<string> => {
    try {
      return await sendMessageToChatGPT(text);
    } catch (error) {
      console.error("Erro ao enviar mensagem para ChatGPT:", error);
      Alert.alert(
        "Erro de Conexão",
        "Não foi possível conectar ao serviço de IA. Verifique sua conexão e tente novamente."
      );

      const fallbackResponses = [
        "Entendi sua dúvida. Você pode verificar os preços comparando diferentes mercados na tela principal do app.",
        "Para encontrar o melhor preço, use a função de comparação na página de detalhes do produto.",
        "O SmartPreço ajuda você a economizar comparando valores em diferentes estabelecimentos próximos à sua localização.",
        "Você pode cadastrar novos produtos usando o scanner de código de barras ou manualmente.",
        "Os preços são atualizados pelos usuários do app, criando uma comunidade colaborativa de economia.",
      ];
      return fallbackResponses[
        Math.floor(Math.random() * fallbackResponses.length)
      ];
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInput(suggestion);
    handleSend(suggestion);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.sender === "ai" && item.type === "suggestion") {
      return (
        <TouchableOpacity
          style={styles.suggestionBubble}
          onPress={() => handleSuggestionPress(item.text)}
        >
          <Text style={styles.suggestionText}>{item.text}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View
        style={[
          styles.messageBubble,
          item.sender === "user" ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.sender === "user" ? styles.userText : styles.aiText,
          ]}
        >
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Assistente IA</Text>
        <View style={styles.titleRow}>
          <Text style={styles.subtitle}>
            Tire suas dúvidas sobre produtos e preços
          </Text>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Limpar Conversa",
                "Deseja realmente limpar toda a conversa?",
                [
                  {
                    text: "Cancelar",
                    style: "cancel",
                  },
                  {
                    text: "Limpar",
                    onPress: () => {
                      setMessages([
                        {
                          id: "1",
                          text: "Olá! Como posso ajudar com suas dúvidas sobre preços e produtos?",
                          sender: "ai",
                          timestamp: new Date(),
                          type: "text",
                        },
                        {
                          id: "2",
                          text: "Como encontrar o menor preço?",
                          sender: "ai",
                          timestamp: new Date(),
                          type: "suggestion",
                        },
                        {
                          id: "3",
                          text: "Como adicionar um novo produto?",
                          sender: "ai",
                          timestamp: new Date(),
                          type: "suggestion",
                        },
                        {
                          id: "4",
                          text: "Qual mercado mais barato perto de mim?",
                          sender: "ai",
                          timestamp: new Date(),
                          type: "suggestion",
                        },
                      ]);
                    },
                    style: "destructive",
                  },
                ]
              );
            }}
          >
            <IconButton icon="broom" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={loading ? <TypingIndicator /> : null}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Digite sua dúvida..."
            multiline
          />
          {loading ? (
            <ActivityIndicator
              size="small"
              color={appColors.primary}
              style={styles.sendButton}
            />
          ) : (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleSend()}
              disabled={input.trim() === ""}
            >
              <IconButton icon="send" size={24} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
