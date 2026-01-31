import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar,
  Alert 
} from 'react-native';
import SearchBar from '../components/SearchBar';
import FloatingActionButton from '../components/FloatingActionButton';

import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter(); // Initialize router
  const [searchQuery, setSearchQuery] = useState('');

  const handleCapturePress = () => {
    router.push('/capture'); // Navigate to the capture stack screen
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Essential</Text>
        <Text style={styles.headerSubtitle}>Visual memories</Text>
      </View>
      
      <SearchBar 
        onSearch={handleSearch}
        placeholder="Search..."
      />

      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>
          {searchQuery ? 'No memories found' : 'No memories yet'}
        </Text>
        <Text style={styles.emptyStateSubtext}>
          {searchQuery ? 'Try a different search' : 'Tap + to capture your first memory'}
        </Text>
      </View>

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
    backgroundColor: '#1A1A1A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#1A1A1A',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 2,
    fontWeight: '300',
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
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    fontWeight: '300',
  },
});

export default HomeScreen;
