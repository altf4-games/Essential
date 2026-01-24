import { useState } from "react";
import { BottomNavigation, Text } from "react-native-paper";
import HomeScreen from "../screens/HomeScreen";

const HomeRoute = () => <HomeScreen />;

const RecentsRoute = () => <Text style={{ color: '#FFFFFF', backgroundColor: '#1A1A1A', flex: 1, textAlign: 'center', paddingTop: 100 }}>Recents</Text>;

const NotificationsRoute = () => <Text style={{ color: '#FFFFFF', backgroundColor: '#1A1A1A', flex: 1, textAlign: 'center', paddingTop: 100 }}>Notifications</Text>;

const BottomNavbar = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home",
    },
    { key: "recents", title: "Recents", focusedIcon: "history" },
    {
      key: "notifications",
      title: "Notifications",
      focusedIcon: "bell",
      unfocusedIcon: "bell-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    recents: RecentsRoute,
    notifications: NotificationsRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ backgroundColor: '#1A1A1A' }}
      activeColor="#FFFFFF"
      inactiveColor="#666666"
    />
  );
};

export default BottomNavbar;
