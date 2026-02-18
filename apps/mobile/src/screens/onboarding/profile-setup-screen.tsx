import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileSetupView } from "@/src/components/onboarding/profile-setup-view";
import { useHandleForm } from "@/src/hooks/use-handle-form";
import { colors, spacing } from "@/src/theme/tokens";

export default function ProfileSetupScreen() {
  const {
    value,
    countText,
    inputMaxLength,
    errorMessage,
    inputState,
    isSubmitDisabled,
    onChangeValue,
    onSubmit,
  } = useHandleForm();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ProfileSetupView
        title="사용자 이름을 설정해주세요"
        description="친구들이 나를 찾을 수 있는 이름이에요"
        value={value}
        placeholder="사용자 이름을 입력하세요"
        countText={countText}
        inputMaxLength={inputMaxLength}
        inputState={inputState}
        errorMessage={errorMessage}
        submitLabel="완료"
        submitDisabled={isSubmitDisabled}
        onChangeValue={onChangeValue}
        onSubmitPress={onSubmit}
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
  },
});
