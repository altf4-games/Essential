import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SimpleDrawer } from '../components/SimpleDrawer';
import { Provider } from 'react-redux';
import store from './lib/store';
import { ThemeProvider } from './lib/ThemeContext';
import { Animated, View, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';

export default function RootLayout() {
  const blackFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(blackFadeAnim, { 
      toValue: 0, 
      duration: 1200, 
      useNativeDriver: true 
    }).start();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <SimpleDrawer>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen 
                name="capture" 
                options={{ 
                  presentation: 'modal',
                  title: 'New Memory',
                  headerStyle: { backgroundColor: '#1A1A1A' },
                  headerTintColor: '#fff',
                  headerShadowVisible: false,
                }} 
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </SimpleDrawer>
        </ThemeProvider>
      </Provider>
      <Animated.View 
        pointerEvents="none" 
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'black', opacity: blackFadeAnim }
        ]} 
      />
    </View>
  );
}
