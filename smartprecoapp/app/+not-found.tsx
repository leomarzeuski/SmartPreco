import { Link, Stack } from "expo-router";
import { StyleSheet, Image, View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";
import { appColors } from "@/constants/theme";
import Logo from "@/assets/images/logo.png";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Página não encontrada" }} />
      <View style={styles.container}>
        <Surface style={styles.card}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />

          <Text style={styles.title}>Oops!</Text>
          <Text style={styles.subtitle}>Esta página não existe.</Text>

          <Link href="/" asChild>
            <Button mode="contained" style={styles.button} icon="home">
              Voltar ao início
            </Button>
          </Link>
        </Surface>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: appColors.background,
  },
  card: {
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: appColors.surface,
    elevation: 4,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    opacity: 0.7,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: appColors.text,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    opacity: 0.7,
    color: appColors.text,
  },
  button: {
    backgroundColor: appColors.primary,
    paddingHorizontal: 16,
  },
});
