import { ScrollView, StyleSheet, View } from "react-native";
import { HomeCalendarCardView } from "@/src/components/home/home-calendar-card-view";
import { HomeGreetingView } from "@/src/components/home/home-greeting-view";
import { HomePostListView } from "@/src/components/home/home-post-list-view";
import { spacing } from "@/src/theme/tokens";

type CalendarDayItem = {
  day: number | null;
  isCurrentMonth: boolean;
  hasPost?: boolean;
};

type HomePostItem = {
  id: string;
  title: string;
  dateText: string;
  preview: string;
};

type HomeViewProps = {
  nickname: string;
  greetingDescription: string;
  monthLabel: string;
  weekdays: string[];
  days: CalendarDayItem[];
  posts: HomePostItem[];
};

export function HomeView({
  nickname,
  greetingDescription,
  monthLabel,
  weekdays,
  days,
  posts,
}: HomeViewProps) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <HomeGreetingView nickname={nickname} description={greetingDescription} />
      <HomeCalendarCardView monthLabel={monthLabel} weekdays={weekdays} days={days} />
      <HomePostListView posts={posts} />
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  bottomSpacer: {
    height: spacing.md,
  },
});
