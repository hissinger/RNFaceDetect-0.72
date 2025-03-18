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
  const device = useCameraDevice('front');

  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

  const faceDetectionOptions: FaceDetectionOptions =
    useRef<FaceDetectionOptions>({
      performanceMode: 'accurate',
      windowWidth: screenWidth,
      windowHeight: screenHeight,
      autoScale: true,
    }).current;

  useEffect(() => {
    const requestPermissions = async () => {
      const status: CameraPermissionRequestResult =
        await Camera.requestCameraPermission();
      console.log('requestPermissions', status);
      setHasPermission(status === 'granted');
    };

    requestPermissions();
  }, []);

  if (!device || !hasPermission) {
    return (
      <View>
        <Text>Loading Camera...</Text>
      </View>
    );
  }

  function handleFacesDetection(faceArray: Face[], _frame: Frame) {
    setFaces(faceArray);
  }

  function handleUiRotation(rotation: number) {
    console.log('UI Rotation', rotation);
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        position: 'relative',
        width: screenWidth,
        height: screenHeight,
      }}>
      <FaceCamera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        faceDetectionCallback={handleFacesDetection}
        faceDetectionOptions={faceDetectionOptions}
        onUIRotationChanged={handleUiRotation}
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
