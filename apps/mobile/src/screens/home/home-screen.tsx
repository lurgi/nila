import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeView } from "@/src/components/home/home-view";
import { colors, spacing } from "@/src/theme/tokens";

const DUMMY_WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const DUMMY_CALENDAR_DAYS = [
  { day: 26, isCurrentMonth: false },
  { day: 27, isCurrentMonth: false },
  { day: 28, isCurrentMonth: false },
  { day: 29, isCurrentMonth: false },
  { day: 30, isCurrentMonth: false },
  { day: 31, isCurrentMonth: false },
  { day: 1, isCurrentMonth: true, hasPost: true },
  { day: 2, isCurrentMonth: true },
  { day: 3, isCurrentMonth: true },
  { day: 4, isCurrentMonth: true },
  { day: 5, isCurrentMonth: true, hasPost: true },
  { day: 6, isCurrentMonth: true },
  { day: 7, isCurrentMonth: true },
  { day: 8, isCurrentMonth: true },
  { day: 9, isCurrentMonth: true },
  { day: 10, isCurrentMonth: true },
  { day: 11, isCurrentMonth: true },
  { day: 12, isCurrentMonth: true },
  { day: 13, isCurrentMonth: true, hasPost: true },
  { day: 14, isCurrentMonth: true },
  { day: 15, isCurrentMonth: true },
  { day: 16, isCurrentMonth: true },
  { day: 17, isCurrentMonth: true },
  { day: 18, isCurrentMonth: true },
  { day: 19, isCurrentMonth: true },
  { day: 20, isCurrentMonth: true, hasPost: true },
  { day: 21, isCurrentMonth: true },
  { day: 22, isCurrentMonth: true },
  { day: 23, isCurrentMonth: true },
  { day: 24, isCurrentMonth: true },
  { day: 25, isCurrentMonth: true },
  { day: 26, isCurrentMonth: true },
  { day: 27, isCurrentMonth: true },
  { day: 28, isCurrentMonth: true, hasPost: true },
  { day: 1, isCurrentMonth: false },
  { day: 2, isCurrentMonth: false },
  { day: 3, isCurrentMonth: false },
  { day: 4, isCurrentMonth: false },
  { day: 5, isCurrentMonth: false },
  { day: 6, isCurrentMonth: false },
  { day: 7, isCurrentMonth: false },
  { day: 8, isCurrentMonth: false },
];

const DUMMY_POSTS = [
  {
    id: "1",
    title: "오늘 아침의 기록",
    dateText: "2026.02.18",
    preview: "햇빛이 따뜻해서 산책하면서 떠오른 생각을 짧게 적어봤다.",
  },
  {
    id: "2",
    title: "친구와의 대화 메모",
    dateText: "2026.02.16",
    preview: "오랜만에 나눈 대화에서 배운 점들이 꽤 많았다. 다음에는 더 자세히 써야지.",
  },
  {
    id: "3",
    title: "이번 주 목표",
    dateText: "2026.02.14",
    preview: "작게라도 매일 한 줄 기록하기. 부담 없이 꾸준하게.",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeView
        nickname="Nila"
        greetingDescription="오늘도 작은 마음을 글로 남겨봐요!"
        monthLabel="2026년 2월"
        weekdays={DUMMY_WEEKDAYS}
        days={DUMMY_CALENDAR_DAYS}
        posts={DUMMY_POSTS}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
});
