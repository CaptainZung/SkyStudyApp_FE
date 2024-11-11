import { Camera, CameraType, FlashMode } from "expo-camera/legacy";
import { useState, useRef } from "react";
import { Button, StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";

export default function CameraScreen({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);
  const [processing, setProcessing] = useState(false); // Trạng thái xử lý ảnh

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  function toggleFlash() {
    setFlash((current) =>
      current === FlashMode.off ? FlashMode.on : FlashMode.off
    );
  }

  // Chụp ảnh và gửi ảnh đến API
  const takeAndSendPicture = async () => {
    if (cameraRef.current) {
      setProcessing(true); // Đặt trạng thái xử lý ảnh

      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      console.log("Picture taken: ", photo.uri);

      // Tạo payload gửi đến API
      const formData = new FormData();
      formData.append("file", {
        uri: photo.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      try {
        const response = await fetch("YOUR_AI_API_URL", { // Thay bằng URL API của bạn
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        const result = await response.json();
        console.log("Response from AI:", result);

        // Xử lý kết quả trả về từ AI ở đây
        alert(`Kết quả từ AI: ${JSON.stringify(result)}`);
      } catch (error) {
        console.error("Error sending photo to AI:", error);
        alert("Gửi ảnh đến AI thất bại.");
      } finally {
        setProcessing(false); // Kết thúc trạng thái xử lý
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} flashMode={flash} ref={cameraRef}>
        <TouchableOpacity style={styles.topLeftButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/images/back_icon.png')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.topCenterButton} onPress={toggleFlash}>
          <Image
            source={flash === FlashMode.off
              ? require('../assets/images/flashoff.png')
              : require('../assets/images/flashon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.topRightButton} onPress={toggleCameraType}>
          <Image source={require('../assets/images/flip.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Nút chụp ảnh */}
        <View style={styles.bottomCenterButtonContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takeAndSendPicture}
            disabled={processing} // Vô hiệu hóa khi đang xử lý ảnh
          >
            <Image source={require('../assets/images/cam.png')} style={styles.captureIcon} />
          </TouchableOpacity>
        </View>

        {/* Hiển thị thông báo đang xử lý nếu cần */}
        {processing && (
          <View style={styles.processingOverlay}>
            <Text style={styles.processingText}>Đang xử lý...</Text>
          </View>
        )}
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
    width: '100%',
    aspectRatio : 3 / 4 ,
  },
  topLeftButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  topRightButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  topCenterButton: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
  },
  bottomCenterButtonContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
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
    top: '50%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 10,
  },
  processingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
