import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

type HomePostItemCardViewProps = {
  title: string;
  dateText: string;
  preview: string;
};

export function HomePostItemCardView({
  title,
  dateText,
  preview,
}: HomePostItemCardViewProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.date}>{dateText}</Text>
      </View>
      <Text style={styles.preview} numberOfLines={2}>
        {preview}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.body,
    fontFamily: typography.family.semibold,
  },
  date: {
    color: colors.textSecondary,
    fontSize: typography.helper,
    fontFamily: typography.family.regular,
  },
  preview: {
    color: colors.textSecondary,
    fontSize: typography.label,
    lineHeight: 20,
    fontFamily: typography.family.regular,
  },
});
