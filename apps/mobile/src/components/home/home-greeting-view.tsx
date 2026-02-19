import { StyleSheet, Text, View } from "react-native";
import { spacing, typography, colors } from "@/src/theme/tokens";

type HomeGreetingViewProps = {
  nickname: string;
  description: string;
};

export function HomeGreetingView({ nickname, description }: HomeGreetingViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>좋은 아침이에요, {nickname}.</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    lineHeight: 36,
    fontFamily: typography.family.semibold,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
    fontFamily: typography.family.regular,
  },
});
