import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginMotion } from "@/src/hooks/use-login-motion";
import { LoginView } from "@/src/components/login/login-view";
import { ONBOARDING_PROFILE_SETUP_ROUTE } from "@/src/navigation/root-stack";
import { colors } from "@/src/theme/tokens";

export default function LoginScreen() {
  const router = useRouter();
  const { heroAnimatedStyle, appleButtonAnimatedStyle, googleButtonAnimatedStyle } =
    useLoginMotion();
  const handleTempNext = () => {
    // TODO: 인증 로직 연동 후 provider별 로그인 성공 시점에 이동하도록 교체
    router.push(`/${ONBOARDING_PROFILE_SETUP_ROUTE}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoginView
        onPressApple={handleTempNext}
        onPressGoogle={handleTempNext}
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
