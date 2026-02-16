import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginMotion } from "@/src/hooks/use-login-motion";
import { LoginView } from "@/src/components/login/login-view";
import { colors } from "@/src/theme/tokens";

export default function LoginScreen() {
  const { heroAnimatedStyle, appleButtonAnimatedStyle, googleButtonAnimatedStyle } =
    useLoginMotion();

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoginView
        heroAnimatedStyle={heroAnimatedStyle}
        appleButtonAnimatedStyle={appleButtonAnimatedStyle}
        googleButtonAnimatedStyle={googleButtonAnimatedStyle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
