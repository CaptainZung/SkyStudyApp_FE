import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, handleGuestLogin,handleLogin} from 'react-native';
import { API_URL } from '../scripts/apiConfig'; // Đảm bảo đường dẫn đúng với vị trí file apiConfig.js

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username && password) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          navigation.navigate('Home', { userName: username });
        } else {
          alert('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
        }
      } catch (error) {
        alert('Có lỗi xảy ra khi kết nối với server. Vui lòng thử lại.');
      }
    } else {
      alert('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/images/anhnen.jpg')} 
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>SkyStudy</Text>

        <TextInput
          style={styles.input}
          placeholder="Nhập tài khoản"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="gray"
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="gray"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleGuestLogin}>
          <Text style={styles.link}>Đăng nhập với tư cách là khách</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <TouchableOpacity style={styles.signUpTextContainer} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Tạo Tài Khoản Mới</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: 'yellow',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  signUpTextContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  signUpText: {
    color: 'red',
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});
