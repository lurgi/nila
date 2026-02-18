import { useEffect, useRef } from "react";
import {
  Animated,
  Keyboard,
  type KeyboardEvent,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileSetupHeaderView } from "@/src/components/onboarding/profile-setup-header-view";
import { ProfileSetupNameInputView } from "@/src/components/onboarding/profile-setup-name-input-view";
import { ProfileSetupSubmitButtonView } from "@/src/components/onboarding/profile-setup-submit-button-view";
import { colors, spacing } from "@/src/theme/tokens";

type ProfileSetupInputState = "default" | "focused" | "error";

type ProfileSetupViewProps = {
  title: string;
  description: string;
  value?: string;
  placeholder?: string;
  countText?: string;
  inputMaxLength?: number;
  inputState?: ProfileSetupInputState;
  errorMessage?: string;
  submitLabel: string;
  submitDisabled?: boolean;
  onChangeValue?: (text: string) => void;
  onSubmitPress?: () => void;
};

export function ProfileSetupView({
  title,
  description,
  value,
  placeholder,
  countText,
  inputMaxLength,
  inputState = "default",
  errorMessage,
  submitLabel,
  submitDisabled,
  onChangeValue,
  onSubmitPress,
}: ProfileSetupViewProps) {
  const insets = useSafeAreaInsets();
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const handleKeyboardShow = (event: KeyboardEvent) => {
      const keyboardHeight = Math.max(0, event.endCoordinates.height - insets.bottom);
      Animated.timing(keyboardOffset, {
        toValue: keyboardHeight,
        duration: event.duration ?? 220,
        useNativeDriver: true,
      }).start();
    };

    const handleKeyboardHide = (event: KeyboardEvent) => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: event.duration ?? 200,
        useNativeDriver: true,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSub = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [insets.bottom, keyboardOffset]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ProfileSetupHeaderView title={title} description={description} />
        <ProfileSetupNameInputView
          value={value}
          placeholder={placeholder}
          countText={countText}
          maxLength={inputMaxLength}
          state={inputState}
          errorMessage={errorMessage}
          onChangeText={onChangeValue}
        />
      </View>

      <Animated.View
        style={[
          styles.submitSection,
          { bottom: insets.bottom + spacing.lg },
          { transform: [{ translateY: Animated.multiply(keyboardOffset, -1) }] },
        ]}
      >
        <ProfileSetupSubmitButtonView
          label={submitLabel}
          disabled={submitDisabled}
          onPress={onSubmitPress}
        />
      </Animated.View>
    </View>
  );
}

const SUBMIT_BUTTON_HEIGHT = 54;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignSelf: "center",
    width: "100%",
    maxWidth: 520,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.lg,
    paddingBottom: SUBMIT_BUTTON_HEIGHT + spacing.lg * 2,
    gap: spacing.xl,
  },
  submitSection: {
    position: "absolute",
    left: 0,
    right: 0,
  },
});
