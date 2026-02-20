import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SimpleDrawer } from '../components/SimpleDrawer';
import { Provider } from 'react-redux';
import store from './lib/store';
import { ThemeProvider } from './lib/ThemeContext';

export default function RootLayout() {
  return (
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
  );
}
