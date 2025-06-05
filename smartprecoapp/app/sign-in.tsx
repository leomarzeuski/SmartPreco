import Logo from "@/assets/images/logo.png";
import { appColors } from "@/constants/theme";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Platform, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Divider,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";

import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "web") {
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }
  }, []);
};
export default function LoginScreen() {
  useWarmUpBrowser();

  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignIn() {
    if (!isLoaded || loginLoading || googleLoading) return;

    if (!email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    setLoginLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      await setActive({ session: result.createdSessionId });
      router.replace("/private");
    } catch (err) {
      Alert.alert("Erro", "Verifique suas credenciais e tente novamente.");
      console.error("Erro no login:", err);
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!isLoaded || loginLoading || googleLoading) return;

    setGoogleLoading(true);

    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/private", { scheme: "smartpreco" }),
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível realizar o login com Google.");
      console.error("Erro no login com Google:", err);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Surface style={styles.card}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.subtitle}>Acesse sua conta</Text>

        <Button
          mode="outlined"
          icon="google"
          onPress={handleGoogleSignIn}
          style={styles.googleButton}
          textColor={appColors.accent}
          disabled={googleLoading || loginLoading}
        >
          {googleLoading ? (
            <ActivityIndicator animating={true} color={appColors.accent} />
          ) : (
            "Continuar com Google"
          )}
        </Button>

        <View style={styles.dividerContainer}>
          <Divider style={styles.divider} />
          <Text style={styles.dividerText}>ou</Text>
          <Divider style={styles.divider} />
        </View>

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
          disabled={loginLoading || googleLoading}
        >
          {loginLoading ? (
            <ActivityIndicator animating={true} color="white" />
          ) : (
            "Entrar"
          )}
        </Button>

        <View style={styles.footer}>
          <Text>Não tem uma conta? </Text>
          <Text
            style={styles.signUpText}
            onPress={() => router.replace("/sign-up")}
          >
            Registre-se
          </Text>
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
