import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, View } from "react-native";
import { SocialLoginButton } from "@/src/components/common/social-login-button";
import { colors, radius, spacing } from "@/src/theme/tokens";

type LoginViewProps = {
  onPressApple?: () => void;
  onPressGoogle?: () => void;
};

export function LoginView({ onPressApple, onPressGoogle }: LoginViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <Image
          source={require("../../../assets/images/nila-login.webp")}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.buttonGroup}>
          <SocialLoginButton
            variant="apple"
            label="Apple로 계속하기"
            onPress={onPressApple}
            icon={
              <Ionicons name="logo-apple" size={18} color={colors.appleButtonText} />
            }
          />
          <SocialLoginButton
            variant="google"
            label="Google로 계속하기"
            onPress={onPressGoogle}
            icon={<AntDesign name="google" size={16} color="#ea4335" />}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  heroSection: {
    flex: 1,
    minHeight: 320,
    marginBottom: spacing.lg,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
  },
  bottomSection: {
    paddingBottom: spacing.sm,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
});
