import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../lib/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { clearAll } from '../lib/store';

export default function SettingsScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const memoryCount = useSelector(state => state.memories.memories.length);

  const SettingItem = ({ icon, title, type, value, onValueChange, subtitle }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.card }]}>
          <Ionicons name={icon} size={22} color={theme.text} />
        </View>
        <View>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: theme.subtitle }]}>{subtitle}</Text>}
        </View>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.border, true: theme.accent }}
          thumbColor={value ? '#FFF' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={theme.subtitle} />
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>  
      <Text style={[styles.header, { color: theme.text }]}>Settings</Text>
      
      {/* Context API: Theme Toggle */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.subtitle }]}>Appearance</Text>
        <SettingItem 
          icon="moon" 
          title="Dark Mode" 
          subtitle="Uses Context API"
          type="switch" 
          value={theme.isDark} 
          onValueChange={theme.toggleTheme} 
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.subtitle }]}>Preferences</Text>
        <SettingItem 
          icon="notifications" 
          title="Notifications" 
          type="switch" 
          value={true} 
          onValueChange={() => {}} 
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.subtitle }]}>Privacy</Text>
        <SettingItem 
          icon="location" 
          title="Location Services" 
          subtitle="Allow app to access location"
          type="switch" 
          value={false} 
          onValueChange={() => {}} 
        />
        <SettingItem 
          icon="lock-closed" 
          title="Privacy Policy" 
          type="link" 
        />
      </View>

      {/* Redux: Memory management */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.subtitle }]}>Data</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.card }]}>
              <Ionicons name="images" size={22} color={theme.text} />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Stored Memories</Text>
              <Text style={[styles.settingSubtitle, { color: theme.subtitle }]}>{memoryCount} memor{memoryCount === 1 ? 'y' : 'ies'} saved</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => dispatch(clearAll())}>
          <Text style={styles.clearAll}>Clear All Memories</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.subtitle }]}>Account</Text>
        <TouchableOpacity>
          <Text style={styles.signOut}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '300',
    marginBottom: 30,
    marginTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  clearAll: {
    color: '#FF8800',
    fontSize: 16,
    fontWeight: '500',
  },
  signOut: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '500',
  },
});
