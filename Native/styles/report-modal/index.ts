import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "90%",
      backgroundColor: "white",
      borderRadius: 10,
      overflow: "hidden",
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    modalContent: {
      padding: 15,
    },
    productName: {
      fontSize: 16,
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 10,
      marginTop: 15,
    },
    radioItem: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 5,
    },
    detailsInput: {
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 5,
      padding: 10,
      marginVertical: 10,
      height: 100,
      textAlignVertical: "top",
    },
    submitButton: {
      backgroundColor: "#2e8b57",
      paddingVertical: 12,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 20,
    },
    submitButtonText: {
      color: "white",
      fontWeight: "500",
    },
    successContainer: {
      padding: 20,
      alignItems: "center",
    },
    successText: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 10,
      textAlign: "center",
    },
    successSubtext: {
      fontSize: 14,
      color: "#666",
      textAlign: "center",
      marginBottom: 20,
    },
    closeButton: {
      backgroundColor: "#2e8b57",
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 5,
    },
    closeButtonText: {
      color: "white",
      fontWeight: "500",
    },
  });
  