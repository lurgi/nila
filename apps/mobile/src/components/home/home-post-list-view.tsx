import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/src/theme/tokens";
import { HomePostItemCardView } from "@/src/components/home/home-post-item-card-view";

type PostItem = {
  id: string;
  title: string;
  dateText: string;
  preview: string;
};

type HomePostListViewProps = {
  posts: PostItem[];
};

export function HomePostListView({ posts }: HomePostListViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>내가 쓴 글</Text>
      <View style={styles.list}>
        {posts.map((post) => (
          <HomePostItemCardView
            key={post.id}
            title={post.title}
            dateText={post.dateText}
            preview={post.preview}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.button,
    fontFamily: typography.family.semibold,
  },
  list: {
    gap: spacing.sm,
  },
});
