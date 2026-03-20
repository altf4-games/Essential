import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from "react-native";
import SearchBar from "../components/SearchBar";
import FloatingActionButton from "../components/FloatingActionButton";
import { useRouter } from "expo-router";
import { useDrawer } from "../components/SimpleDrawer";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../app/lib/ThemeContext";
import { setMemories } from "../app/lib/store";
import { getAllMemories, initMemoryTable } from "../services/memorySqlite";

const HomeScreen = () => {
  const router = useRouter();
  const { toggleDrawer } = useDrawer();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemory, setSelectedMemory] = useState(null);
  const dispatch = useDispatch();
  const theme = useTheme();

  // Redux: read global memories
  const memories = useSelector((state) => state.memories.memories);

  useEffect(() => {
    let mounted = true;

    async function hydrateMemories() {
      try {
        await initMemoryTable();
        const sqliteMemories = await getAllMemories();
        if (mounted) {
          dispatch(setMemories(sqliteMemories));
        }
      } catch {
        // Keep Redux state as fallback if SQL hydration fails.
      }
    }

    hydrateMemories();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  // Filter memories based on search
  const filteredMemories = searchQuery
    ? memories.filter(
        (m) =>
          m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.tags.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      )
    : memories;

  const handleCapturePress = () => {
    router.push("/capture");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const renderMemoryItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setSelectedMemory(item)}
      style={[
        styles.memoryCard,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.memoryImage} />
      ) : (
        <View style={styles.memoryIcon}>
          <Ionicons name="image" size={28} color={theme.accent} />
        </View>
      )}
      <View style={styles.memoryContent}>
        <Text
          style={[styles.memorySummary, { color: theme.text }]}
          numberOfLines={2}
        >
          {item.summary || "No summary added yet"}
        </Text>
        {item.reminderAt ? (
          <Text
            style={[styles.memoryReminder, { color: theme.accent }]}
            numberOfLines={1}
          >
            Reminder: {new Date(item.reminderAt).toLocaleString()}
          </Text>
        ) : null}
        {item.reminderNote ? (
          <Text
            style={[styles.memoryReminderNote, { color: theme.subtitle }]}
            numberOfLines={1}
          >
            {item.reminderNote}
          </Text>
        ) : null}
        <View style={styles.memoryMeta}>
          {item.tags.slice(0, 3).map((tag) => (
            <View
              key={tag}
              style={[styles.memoryTag, { backgroundColor: theme.bg }]}
            >
              <Text style={[styles.memoryTagText, { color: theme.subtitle }]}>
                {tag}
              </Text>
            </View>
          ))}
          <Text style={[styles.memoryDate, { color: theme.subtitle }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.bg}
      />

      <View style={[styles.header, { backgroundColor: theme.bg }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
            <Ionicons name="menu" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Essential
          </Text>
        </View>
        <Text style={[styles.headerSubtitle, { color: theme.subtitle }]}>
          {memories.length > 0
            ? `${memories.length} memor${memories.length === 1 ? "y" : "ies"}`
            : "Visual memories"}
        </Text>
      </View>

      <SearchBar onSearch={handleSearch} placeholder="Search memories..." />

      {filteredMemories.length > 0 ? (
        <FlatList
          data={filteredMemories}
          keyExtractor={(item) => item.id}
          renderItem={renderMemoryItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: theme.text }]}>
            {searchQuery ? "No memories found" : "No memories yet"}
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.subtitle }]}>
            {searchQuery
              ? "Try a different search"
              : "Tap + to capture your first memory"}
          </Text>
        </View>
      )}

      <FloatingActionButton onPress={handleCapturePress} icon="camera-plus" />

      <Modal
        visible={!!selectedMemory}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMemory(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedMemory(null)}
            >
              <Ionicons name="close" size={22} color={theme.text} />
            </TouchableOpacity>

            {selectedMemory?.imageUri ? (
              <Image
                source={{ uri: selectedMemory.imageUri }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.modalImagePlaceholder}>
                <Ionicons
                  name="image-outline"
                  size={40}
                  color={theme.subtitle}
                />
              </View>
            )}

            <Text style={[styles.modalLabel, { color: theme.subtitle }]}>
              SUMMARY
            </Text>
            <Text style={[styles.modalSummary, { color: theme.text }]}>
              {selectedMemory?.summary || "No summary added yet"}
            </Text>

            {selectedMemory?.reminderAt ? (
              <>
                <Text style={[styles.modalLabel, { color: theme.subtitle }]}>
                  REMINDER
                </Text>
                <Text style={[styles.modalReminder, { color: theme.accent }]}>
                  {new Date(selectedMemory.reminderAt).toLocaleString()}
                </Text>
              </>
            ) : null}

            {selectedMemory?.reminderNote ? (
              <Text style={[styles.modalNote, { color: theme.subtitle }]}>
                {selectedMemory.reminderNote}
              </Text>
            ) : null}
          </View>
        </View>
      </Modal>
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "300",
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
    fontWeight: "300",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  memoryCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  memoryImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 14,
  },
  memoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  memoryContent: {
    flex: 1,
  },
  memorySummary: {
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 8,
  },
  memoryReminder: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "500",
  },
  memoryReminderNote: {
    fontSize: 12,
    marginBottom: 8,
  },
  memoryMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
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
    marginLeft: "auto",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "300",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "300",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 2,
    marginBottom: 6,
  },
  modalImage: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalImagePlaceholder: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalLabel: {
    fontSize: 12,
    letterSpacing: 0.8,
    fontWeight: "600",
    marginBottom: 6,
  },
  modalSummary: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  modalReminder: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  modalNote: {
    fontSize: 13,
  },
});

export default HomeScreen;
