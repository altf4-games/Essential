import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTheme } from '../lib/ThemeContext';

export default function ExploreScreen() {
  const theme = useTheme();
  const memories = useSelector(state => state.memories.memories);
  
  // Gather all unique tags
  const allTags = [...new Set(memories.flatMap(m => m.tags))];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.header, { color: theme.text }]}>Explore</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="images" size={28} color={theme.accent} />
          <Text style={[styles.statNumber, { color: theme.text }]}>{memories.length}</Text>
          <Text style={[styles.statLabel, { color: theme.subtitle }]}>Memories</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="pricetags" size={28} color={theme.accent} />
          <Text style={[styles.statNumber, { color: theme.text }]}>{allTags.length}</Text>
          <Text style={[styles.statLabel, { color: theme.subtitle }]}>Tags</Text>
        </View>
      </View>

      {/* Recent memories */}
      <Text style={[styles.sectionTitle, { color: theme.subtitle }]}>RECENT</Text>
      {memories.length > 0 ? (
        <FlatList
          data={memories.slice(0, 5)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.recentItem, { borderBottomColor: theme.border }]}>
              <Ionicons name="image-outline" size={20} color={theme.subtitle} />
              <View style={styles.recentContent}>
                <Text style={[styles.recentSummary, { color: theme.text }]} numberOfLines={1}>
                  {item.summary || 'No summary'}
                </Text>
                <Text style={[styles.recentDate, { color: theme.subtitle }]}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="compass-outline" size={48} color={theme.border} />
          <Text style={[styles.emptyText, { color: theme.subtitle }]}>
            Capture some memories to see them here
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 32, fontWeight: '300', marginTop: 20, marginBottom: 24 },
  statsRow: { flexDirection: 'row', marginBottom: 30 },
  statCard: {
    flex: 1, alignItems: 'center', padding: 20,
    borderRadius: 16, borderWidth: 1, marginRight: 12,
  },
  statNumber: { fontSize: 28, fontWeight: '600', marginTop: 8 },
  statLabel: { fontSize: 12, marginTop: 4, letterSpacing: 0.5 },
  sectionTitle: { fontSize: 12, letterSpacing: 1, fontWeight: '600', marginBottom: 12 },
  recentItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1,
  },
  recentContent: { marginLeft: 12, flex: 1 },
  recentSummary: { fontSize: 15, fontWeight: '400' },
  recentDate: { fontSize: 11, marginTop: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, marginTop: 12, textAlign: 'center' },
});
