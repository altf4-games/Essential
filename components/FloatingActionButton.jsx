import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FloatingActionButton = ({ 
  onPress, 
  icon = 'camera-plus', 
  label = 'Capture' 
}) => {
  const [pressed, setPressed] = useState(false);
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    if (onPress) {
      onPress();
    }
  };

  return (
    <Animated.View style={[
      styles.container,
      { transform: [{ scale: scaleValue }] }
    ]}>
      <TouchableOpacity
        style={styles.button}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <MaterialCommunityIcons name={icon} size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    backgroundColor: '#666666',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FloatingActionButton;
