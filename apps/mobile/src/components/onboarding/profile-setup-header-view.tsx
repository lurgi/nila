import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/src/theme/tokens";

type ProfileSetupHeaderViewProps = {
  title: string;
  description: string;
};

export function ProfileSetupHeaderView({
  title,
  description,
}: ProfileSetupHeaderViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: typography.family.bold,
    letterSpacing: -0.2,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
    fontFamily: typography.family.regular,
  },
});
