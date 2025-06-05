import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  Button,
  TextInput,
  Text,
  Surface,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import Logo from "@/assets/images/logo.png";
import { appColors } from "@/constants/theme";

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

export default function SignUpScreen() {
  useWarmUpBrowser();

  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const validateInputs = () => {
    if (!emailAddress.trim()) {
      Alert.alert("Atenção", "Por favor, insira seu email.");
      return false;
    }
    if (!password.trim() || password.length < 8) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 8 caracteres.");
      return false;
    }
    return true;
  };

  const onSignUpPress = async () => {
    if (!isLoaded || signUpLoading || googleLoading) return;
    if (!validateInputs()) return;

    setSignUpLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password,
        // firstName: firstName.trim() || undefined,
        // lastName: lastName.trim() || undefined,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      Alert.alert(
        "Erro no cadastro",
        "Não foi possível criar sua conta. Verifique os dados e tente novamente."
      );
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setSignUpLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || verifyLoading) return;
    if (!code.trim()) {
      Alert.alert("Atenção", "Por favor, insira o código de verificação.");
      return;
    }

    setVerifyLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        Alert.alert("Sucesso!", "Sua conta foi criada com sucesso!");
        router.replace("/private");
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível verificar seu email. Tente novamente."
        );
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      Alert.alert("Erro", "Código de verificação inválido.");
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setVerifyLoading(false);
    }
  };

  async function handleGoogleSignIn() {
    if (!isLoaded || signUpLoading || googleLoading) return;

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

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Surface style={styles.card}>
          <View style={styles.logoContainer}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.title}>Verificação</Text>
          <Text style={styles.subtitle}>
            Enviamos um código para o seu email. Por favor, insira-o abaixo para
            verificar sua conta.
          </Text>

          <TextInput
            label="Código de verificação"
            mode="outlined"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={styles.input}
            left={<TextInput.Icon icon="email-check" />}
          />

          <Button
            mode="contained"
            onPress={onVerifyPress}
            style={styles.button}
            disabled={verifyLoading}
          >
            {verifyLoading ? (
              <ActivityIndicator animating={true} color="white" />
            ) : (
              "Verificar"
            )}
          </Button>

          <Button
            mode="text"
            onPress={() => setPendingVerification(false)}
            style={styles.textButton}
            disabled={verifyLoading}
          >
            Voltar
          </Button>
        </Surface>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Surface style={styles.card}>
          <View style={styles.logoContainer}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Preencha o formulário abaixo para se cadastrar
          </Text>

          <Button
            mode="outlined"
            icon="google"
            onPress={handleGoogleSignIn}
            style={styles.googleButton}
            disabled={googleLoading || signUpLoading}
          >
            {googleLoading ? (
              <ActivityIndicator animating={true} color={appColors.primary} />
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
            label="Nome"
            mode="outlined"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Sobrenome"
            mode="outlined"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Email"
            mode="outlined"
            value={emailAddress}
            onChangeText={setEmailAddress}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Senha"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? "eye" : "eye-off"}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
          />

          <Button
            mode="contained"
            onPress={onSignUpPress}
            style={styles.button}
            disabled={signUpLoading || googleLoading}
          >
            {signUpLoading ? (
              <ActivityIndicator animating={true} color="white" />
            ) : (
              "Cadastrar"
            )}
          </Button>

          <View style={styles.footer}>
            <Text>Já tem uma conta? </Text>
            <Text
              style={styles.loginText}
              onPress={() => router.replace("/sign-in")}
            >
              Entrar
            </Text>
          </View>
        </Surface>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: appColors.surface,
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
  button: {
    marginTop: 8,
    paddingVertical: 6,
    backgroundColor: appColors.primary,
  },
  googleButton: {
    marginBottom: 16,
    paddingVertical: 6,
    borderColor: appColors.primary,
  },
  textButton: {
    marginTop: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    fontWeight: "bold",
    color: appColors.accent,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 8,
    color: appColors.text,
    opacity: 0.7,
  },
});
