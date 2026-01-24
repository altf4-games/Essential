import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (text) => {
    setSearchText(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <View style={[
      styles.container,
      isFocused && styles.containerFocused
    ]}>
      <MaterialCommunityIcons 
        name="magnify" 
        size={20} 
        color={isFocused ? '#999999' : '#666666'} 
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#666666"
        value={searchText}
        onChangeText={handleTextChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {searchText.length > 0 && (
        <MaterialCommunityIcons 
          name="close-circle" 
          size={20} 
          color="#666666" 
          style={styles.clearIcon}
          onPress={() => handleTextChange('')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#333333',
  },
  containerFocused: {
    borderColor: '#999999',
    backgroundColor: '#2A2A2A',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  clearIcon: {
    marginLeft: 8,
  },
});

export default SearchBar;
