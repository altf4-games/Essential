import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated'; // Removed as requested

export default function RootLayout() {
  return (
    <>
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
    </>
  );
}
