import React, { useState, createContext, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Context to control the drawer from anywhere
const DrawerContext = createContext({
  isOpen: false,
  toggleDrawer: () => {},
});

export const useDrawer = () => useContext(DrawerContext);

export function SimpleDrawer({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  // Use a simple boolean for rendering to avoid complex reanimated dependencies
  // We can add simple LayoutAnimation later if smooth transition is needed without Reanimated

  const toggleDrawer = () => setIsOpen(!isOpen);

  const DrawerItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#FFF" style={styles.drawerIcon} />
      <Text style={styles.drawerLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <DrawerContext.Provider value={{ isOpen, toggleDrawer }}>
      <View style={styles.container}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          {children}
        </View>

        {/* Backdrop (only visible when drawer is open) */}
        {isOpen && (
          <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)} />
        )}

        {/* Drawer Panel */}
        {isOpen && (
          <View style={styles.drawerPanel}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.drawerContent}>
               {/* Installed Packages / Navigation Options */}
               <DrawerItem 
                icon="home-outline" 
                label="Home" 
                onPress={() => { setIsOpen(false); router.replace('/(tabs)'); }} 
               />
               <DrawerItem 
                icon="search-outline" 
                label="Explore" 
                onPress={() => { setIsOpen(false); router.replace('/(tabs)/explore'); }} 
               />
               <DrawerItem 
                icon="settings-outline" 
                label="Settings" 
                onPress={() => { setIsOpen(false); router.replace('/(tabs)/settings'); }} 
               />
               
               <View style={styles.divider} />
               
               <DrawerItem 
                icon="camera-outline" 
                label="Capture Memory" 
                onPress={() => { setIsOpen(false); router.push('/capture'); }} 
               />
            </View>
            
            <View style={styles.drawerFooter}>
              <Text style={styles.versionText}>Essential v1.0.0</Text>
            </View>
          </View>
        )}
      </View>
    </DrawerContext.Provider>
  );
}

const windowWidth = Dimensions.get('window').width;
const drawerWidth = windowWidth * 0.75;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2,
  },
  drawerPanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: drawerWidth,
    backgroundColor: '#1f1f1f',
    zIndex: 3,
    paddingTop: 50,
    paddingHorizontal: 20,
    borderRightWidth: 1,
    borderRightColor: '#333',
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  drawerContent: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  drawerIcon: {
    marginRight: 15,
  },
  drawerLabel: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 20,
  },
  drawerFooter: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  versionText: {
    color: '#666',
    fontSize: 12,
  },
});
