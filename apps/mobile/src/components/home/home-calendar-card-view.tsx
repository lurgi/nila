import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

type CalendarDayItem = {
  day: number | null;
  isCurrentMonth: boolean;
  hasPost?: boolean;
};

type HomeCalendarCardViewProps = {
  monthLabel: string;
  weekdays: string[];
  days: CalendarDayItem[];
};

export function HomeCalendarCardView({
  monthLabel,
  weekdays,
  days,
}: HomeCalendarCardViewProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.monthLabel}>{monthLabel}</Text>

      <View style={styles.weekdayRow}>
        {weekdays.map((weekday) => (
          <Text key={weekday} style={styles.weekdayText}>
            {weekday}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((item, index) => (
          <View key={`day-${index}`} style={styles.dayCell}>
            {item.day ? (
              <>
                <Text
                  style={[
                    styles.dayText,
                    !item.isCurrentMonth && styles.dayTextMuted,
                  ]}
                >
                  {item.day}
                </Text>
                {item.hasPost ? <View style={styles.dot} /> : null}
              </>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
  },
  monthLabel: {
    color: colors.textPrimary,
    fontSize: typography.button,
    fontFamily: typography.family.semibold,
  },
  weekdayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekdayText: {
    width: `${100 / 7}%`,
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: typography.helper,
    fontFamily: typography.family.regular,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: spacing.sm,
  },
  dayCell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 34,
    gap: 4,
  },
  dayText: {
    color: colors.textPrimary,
    fontSize: typography.label,
    fontFamily: typography.family.regular,
  },
  dayTextMuted: {
    color: colors.textSecondary,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.appleButton,
  },
});
