import { Camera, CameraType, FlashMode } from 'expo-camera/legacy';
import { useState, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { AI_API_URL } from '../scripts/apiConfig';

export default function CameraScreen({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);
  const [processing, setProcessing] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const toggleFlash = () => {
    setFlash((current) =>
      current === FlashMode.off ? FlashMode.on : FlashMode.off
    );
  };

  const takeAndSendPicture = async () => {
    if (cameraRef.current) {
      setProcessing(true);

      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true });
        console.log('Photo taken: ', photo.uri);

        const formData = new FormData();
        formData.append('file', {
          uri: photo.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });

        const response = await fetch(AI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(
            `Server error: ${response.status} - ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log('Predictions received: ', result);

        navigation.navigate('Detection', { predictions: result.results });
      } catch (error) {
        console.error('Error sending photo to server:', error);
        alert('An error occurred while connecting to the server.');
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Buttons */}
      <View style={styles.topButtonsContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/images/back_icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Flash Toggle */}
        <TouchableOpacity style={styles.topButton} onPress={toggleFlash}>
          <Image
            source={
              flash === FlashMode.off
                ? require('../assets/images/flashoff.png')
                : require('../assets/images/flashon.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Camera Flip */}
        <TouchableOpacity style={styles.topButton} onPress={toggleCameraType}>
          <Image
            source={require('../assets/images/flip.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
        />
      </View>

      {/* Capture Button */}
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={takeAndSendPicture}
          disabled={processing}
        >
          <Image
            source={require('../assets/images/cam.png')}
            style={styles.captureIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Processing Overlay */}
      {processing && (
        <View style={styles.processingOverlay}>
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E90FF', // Blue background
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 50,
    marginHorizontal: 10,
  },
  topButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 30,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    aspectRatio: 3 / 4, // Maintain a 3:4 aspect ratio
    borderRadius: 10,
    overflow: 'hidden',
  },
  bottomButtonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  processingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 18,
  },
});
