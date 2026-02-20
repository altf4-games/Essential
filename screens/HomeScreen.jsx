import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar,
  TouchableOpacity,
  FlatList
} from 'react-native';
import SearchBar from '../components/SearchBar';
import FloatingActionButton from '../components/FloatingActionButton';
import { useRouter } from 'expo-router';
import { useDrawer } from '../components/SimpleDrawer';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTheme } from '../app/lib/ThemeContext';

const HomeScreen = () => {
  const router = useRouter();
  const { toggleDrawer } = useDrawer();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  
  // Redux: read global memories
  const memories = useSelector(state => state.memories.memories);
  
  // Filter memories based on search
  const filteredMemories = searchQuery
    ? memories.filter(m => 
        m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : memories;

  const handleCapturePress = () => {
    router.push('/capture');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const renderMemoryItem = ({ item }) => (
    <View style={[styles.memoryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.memoryIcon}>
        <Ionicons name="image" size={28} color={theme.accent} />
      </View>
      <View style={styles.memoryContent}>
        <Text style={[styles.memorySummary, { color: theme.text }]} numberOfLines={2}>
          {item.summary || 'No summary'}
        </Text>
        <View style={styles.memoryMeta}>
          {item.tags.slice(0, 3).map(tag => (
            <View key={tag} style={[styles.memoryTag, { backgroundColor: theme.bg }]}>
              <Text style={[styles.memoryTagText, { color: theme.subtitle }]}>{tag}</Text>
            </View>
          ))}
          <Text style={[styles.memoryDate, { color: theme.subtitle }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />
      
      <View style={[styles.header, { backgroundColor: theme.bg }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
            <Ionicons name="menu" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Essential</Text>
        </View>
        <Text style={[styles.headerSubtitle, { color: theme.subtitle }]}>
          {memories.length > 0 ? `${memories.length} memor${memories.length === 1 ? 'y' : 'ies'}` : 'Visual memories'}
        </Text>
      </View>
      
      <SearchBar 
        onSearch={handleSearch}
        placeholder="Search memories..."
      />

      {filteredMemories.length > 0 ? (
        <FlatList
          data={filteredMemories}
          keyExtractor={item => item.id}
          renderItem={renderMemoryItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: theme.text }]}>
            {searchQuery ? 'No memories found' : 'No memories yet'}
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.subtitle }]}>
            {searchQuery ? 'Try a different search' : 'Tap + to capture your first memory'}
          </Text>
        </View>
      )}

      <FloatingActionButton
        onPress={handleCapturePress}
        icon="camera-plus"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    marginTop: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  menuButton: {
    padding: 5,
    marginRight: 15,
    marginLeft: -5,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: '300',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  memoryCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  memoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  memoryContent: {
    flex: 1,
  },
  memorySummary: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 8,
  },
  memoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  memoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  memoryTagText: {
    fontSize: 11,
  },
  memoryDate: {
    fontSize: 11,
    marginLeft: 'auto',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '300',
  },
});

export default HomeScreen;
