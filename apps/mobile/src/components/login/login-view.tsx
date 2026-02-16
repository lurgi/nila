import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import type { AnimatedStyle } from "react-native-reanimated";
import type { ImageStyle, ViewStyle } from "react-native";
import { SocialLoginButton } from "@/src/components/common/social-login-button";
import { colors, radius, spacing } from "@/src/theme/tokens";

type LoginViewProps = {
  onPressApple?: () => void;
  onPressGoogle?: () => void;
  heroAnimatedStyle?: AnimatedStyle<ImageStyle>;
  appleButtonAnimatedStyle?: AnimatedStyle<ViewStyle>;
  googleButtonAnimatedStyle?: AnimatedStyle<ViewStyle>;
};

export function LoginView({
  onPressApple,
  onPressGoogle,
  heroAnimatedStyle,
  appleButtonAnimatedStyle,
  googleButtonAnimatedStyle,
}: LoginViewProps) {
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.heroSection, heroAnimatedStyle]}>
        <Image
          source={require("../../../assets/images/nila-login.webp")}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </Animated.View>

      <View style={styles.bottomSection}>
        <View style={styles.buttonGroup}>
          <Animated.View style={appleButtonAnimatedStyle}>
            <SocialLoginButton
              variant="apple"
              label="Apple로 계속하기"
              onPress={onPressApple}
              icon={
                <Ionicons
                  name="logo-apple"
                  size={18}
                  color={colors.appleButtonText}
                />
              }
            />
          </Animated.View>
          <Animated.View style={googleButtonAnimatedStyle}>
            <SocialLoginButton
              variant="google"
              label="Google로 계속하기"
              onPress={onPressGoogle}
              icon={<AntDesign name="google" size={16} color="#ea4335" />}
            />
          </Animated.View>
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
