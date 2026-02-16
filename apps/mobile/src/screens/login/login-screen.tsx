import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginView } from "@/src/components/login/login-view";
import { colors } from "@/src/theme/tokens";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <LoginView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
