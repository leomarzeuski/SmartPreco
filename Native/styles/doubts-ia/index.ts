import { appColors } from "@/constants/theme";
import { StyleSheet } from "react-native";

 export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    titleContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: appColors.text,
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 4,
    },
    subtitle: {
      fontSize: 14,
      color: "#666",
      flex: 1,
    },
    chatContainer: {
      flex: 1,
    },
    messagesList: {
      padding: 16,
      paddingBottom: 32,
    },
    messageBubble: {
      padding: 12,
      borderRadius: 16,
      marginVertical: 8,
      maxWidth: "80%",
      minWidth: 100,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 1,
    },
    userBubble: {
      backgroundColor: appColors.primary,
      alignSelf: "flex-end",
      borderBottomRightRadius: 4,
    },
    aiBubble: {
      backgroundColor: "#f0f0f0",
      alignSelf: "flex-start",
      borderBottomLeftRadius: 4,
    },
    messageText: {
      fontSize: 16,
    },
    userText: {
      color: "#fff",
    },
    aiText: {
      color: "#333",
    },
    timestamp: {
      fontSize: 10,
      color: "#888",
      alignSelf: "flex-end",
      marginTop: 4,
    },
    suggestionBubble: {
      backgroundColor: "#E8F4FF",
      padding: 10,
      borderRadius: 20,
      marginVertical: 4,
      marginRight: 8,
      alignSelf: "flex-start",
      maxWidth: "80%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 1,
      borderWidth: 1,
      borderColor: "#D1E7FF",
    },
    suggestionText: {
      fontSize: 14,
      color: "#0066CC",
    },
    inputContainer: {
      flexDirection: "row",
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: "#eee",
      backgroundColor: "#fff",
    },
    input: {
      flex: 1,
      minHeight: 40,
      maxHeight: 120,
      backgroundColor: "#f5f5f5",
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 16,
    },
    sendButton: {
      justifyContent: "center",
      alignItems: "center",
    },
  });