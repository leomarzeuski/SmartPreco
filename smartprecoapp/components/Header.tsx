import { View, StyleSheet } from "react-native";
import { Avatar, Text, IconButton } from "react-native-paper";
import defaultProfile from "@/assets/images/userPhotoDefault.png";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { appColors } from "@/constants/theme";

export const Header: React.FC = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const profileImage = user?.imageUrl ? { uri: user.imageUrl } : defaultProfile;

  const firstName = user?.firstName || "Usuário";

  const handleSignOut = async () => {
    try {
      await signOut();

      await WebBrowser.coolDownAsync();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Avatar.Image size={48} source={profileImage} />
        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>Olá,</Text>
          <Text style={styles.headline}>{firstName}</Text>
        </View>
        <IconButton
          icon="logout"
          size={28}
          onPress={handleSignOut}
          iconColor={appColors.primary}
          style={styles.logoutButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.surface,
    paddingHorizontal: 32,
    paddingVertical: 16,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  textContainer: {
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 16,
    color: appColors.text,
  },
  headline: {
    fontWeight: "bold",
    color: appColors.text,
    fontSize: 16,
  },
  logoutButton: {
    marginLeft: "auto",
  },
});
