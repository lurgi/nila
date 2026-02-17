import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileSetupView } from "@/src/components/onboarding/profile-setup-view";
import { colors, spacing } from "@/src/theme/tokens";

export default function ProfileSetupScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ProfileSetupView
        title="닉네임을 설정해주세요"
        description="친구들이 나를 찾을 수 있는 이름이에요"
        value=""
        placeholder="닉네임을 입력하세요"
        countText="0/20"
        inputState="default"
        submitLabel="완료"
        submitDisabled
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
});
