// SettingScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

export default function SettingScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleSaveChanges = () => {
    // Here you can add functionality to save changes, e.g., API call
    Alert.alert('Changes Saved', `Username: ${username}\nEmail: ${email}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        value={username} 
        onChangeText={setUsername} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        keyboardType="email-address" 
        value={email} 
        onChangeText={setEmail} 
      />
      <Button title="Save Changes" onPress={handleSaveChanges} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});
