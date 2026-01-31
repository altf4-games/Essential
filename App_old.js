import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import BottomNavbar from "./components/BottomNavbar";
import {
  SafeAreaProvider,
} from "react-native-safe-area-context";
export default function App() {
  return (
    <SafeAreaProvider>
      <BottomNavbar />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0000",
    alignItems: "center",
    justifyContent: "center",
  },
});
