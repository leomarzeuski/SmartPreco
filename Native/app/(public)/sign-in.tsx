import React, { useState } from "react";
import { View, Alert, StyleSheet, Image } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import {
  Button,
  TextInput,
  Text,
  Surface,
  IconButton,
  ActivityIndicator,
  Divider,
  useTheme,
} from "react-native-paper";
import { appColors } from "@/constants/theme";
import Logo from "@/assets/images/logo.png";

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!isLoaded || loading) return;

    if (!email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      await setActive({ session: result.createdSessionId });
      Alert.alert("Sucesso!", "Login realizado com sucesso!");
    } catch (err) {
      Alert.alert("Erro", "Verifique suas credenciais e tente novamente.");
      console.error("Erro no login:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!isLoaded || loading) return;

    setLoading(true);

    // try {
    //   await signIn.authenticateWithRedirect({
    //     // strategy: "oauth_google",
    //     // redirectUrl: "/",
    //   });
    // } catch (err) {
    //   Alert.alert("Erro", "Não foi possível realizar o login com Google.");
    //   console.error("Erro no login com Google:", err);
    // } finally {
    //   setLoading(false);
    // }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Surface style={styles.card}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.subtitle}>Acesse sua conta</Text>

        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
          style={styles.input}
        />

        <TextInput
          label="Senha"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? "eye" : "eye-off"}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSignIn}
          style={styles.loginButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator animating={true} color="white" />
          ) : (
            "Entrar"
          )}
        </Button>

        <View style={styles.dividerContainer}>
          <Divider style={styles.divider} />
          <Text style={styles.dividerText}>ou</Text>
          <Divider style={styles.divider} />
        </View>

        <Button
          mode="outlined"
          icon="google"
          onPress={handleGoogleSignIn}
          style={styles.googleButton}
          textColor={appColors.accent}
          disabled={loading}
        >
          Continuar com Google
        </Button>

        <View style={styles.footer}>
          <Text>Não tem uma conta? </Text>
          <Text style={styles.signUpText}>Registre-se</Text>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: appColors.background,
  },
  card: {
    padding: 24,
    width: "100%",
    borderRadius: 0,
    elevation: 4,
    backgroundColor: appColors.surface,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: appColors.text,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    opacity: 0.7,
    textAlign: "center",
    color: appColors.text,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    paddingVertical: 6,
    backgroundColor: appColors.primary,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    backgroundColor: appColors.disabled,
  },
  dividerText: {
    marginHorizontal: 8,
    opacity: 0.7,
    color: appColors.text,
  },
  googleButton: {
    marginBottom: 16,
    borderColor: appColors.placeholder,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signUpText: {
    fontWeight: "bold",
    color: appColors.accent,
  },
});
