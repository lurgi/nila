import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

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
          <Pressable
            style={styles.appleButton}
            onPress={onPressApple}
            accessibilityRole="button"
            accessibilityLabel="Apple로 계속하기"
          >
            <Ionicons name="logo-apple" size={18} color={colors.appleButtonText} />
            <Text style={styles.appleButtonText}>Apple로 계속하기</Text>
          </Pressable>

          <Pressable
            style={styles.googleButton}
            onPress={onPressGoogle}
            accessibilityRole="button"
            accessibilityLabel="Google로 계속하기"
          >
            <AntDesign name="google" size={16} color="#ea4335" />
            <Text style={styles.googleButtonText}>Google로 계속하기</Text>
          </Pressable>
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
  appleButton: {
    height: 54,
    borderRadius: radius.full,
    backgroundColor: colors.appleButton,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  appleButtonText: {
    color: colors.appleButtonText,
    fontSize: typography.button,
    fontWeight: "600",
  },
  googleButton: {
    height: 54,
    borderRadius: radius.full,
    backgroundColor: colors.googleButton,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  googleButtonText: {
    color: colors.googleButtonText,
    fontSize: typography.button,
    fontWeight: "600",
  },
});
