import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useUser, useClerk } from "@clerk/clerk-expo";

export default function UserInfoScreen() {
  const { user } = useUser();
  const clerk = useClerk();

  async function handleLogout() {
    try {
      await clerk.signOut();
      Alert.alert("Logout realizado", "Você foi desconectado com sucesso!");
    } catch (error) {
      Alert.alert("Erro no logout", "Não foi possível fazer logout.");
      console.error("Erro no logout:", error);
    }
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Button title="Logout" onPress={handleLogout} />

          <View style={styles.userBox}>
            <Text style={styles.title}>Informações do Usuário</Text>
            <Text>ID: {user.id}</Text>
            <Text>
              Email:{" "}
              {user.primaryEmailAddress?.emailAddress || "Não disponível"}
            </Text>
            <Text>
              Nome: {user.firstName} {user.lastName}
            </Text>
          </View>
        </>
      ) : (
        <Text>Nenhum usuário logado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  userBox: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },
});
