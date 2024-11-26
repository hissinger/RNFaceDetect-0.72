import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {
  Camera,
  useCameraDevice,
  Frame,
  CameraPermissionRequestResult,
} from 'react-native-vision-camera';
import {
  Face,
  Camera as FaceCamera,
  FaceDetectionOptions,
} from 'react-native-vision-camera-face-detector';

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [faces, setFaces] = useState<Face[]>([]);
  const device = useCameraDevice('front'); // 전면 카메라 사용

  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: 'fast',
    classificationMode: 'all',
    windowWidth: screenWidth,
    windowHeight: screenHeight,
  }).current;

  useEffect(() => {
    // 카메라 권한 요청
    const requestPermissions = async () => {
      console.log('requestPermissions');
      const status: CameraPermissionRequestResult =
        await Camera.requestCameraPermission();

      console.log('requestPermissions', status);
      setHasPermission(status === 'granted');
    };

    requestPermissions();
  }, []);

  if (!device || !hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Loading Camera...</Text>
      </View>
    );
  }

  function handleFacesDetection(faces: Face[], frame: Frame) {
    console.log('faces', faces);
    setFaces(faces);
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        position: 'relative',
      }}>
      <FaceCamera
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        device={device}
        isActive={true}
        faceDetectionCallback={handleFacesDetection}
        faceDetectionOptions={faceDetectionOptions}
      />

      {faces.map((face, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            top: face.bounds.y,
            left: face.bounds.x,
            width: face.bounds.width,
            height: face.bounds.height,
            borderColor: 'red',
            borderWidth: 2,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
