import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);
  const [qr, setQR] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [camera, setCamera] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setQR(data);
    alert(`Código QR escaneado: ${data}`);
  };

  const takePicture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      setPhoto(photo.uri);
      setCamera(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se otorgó el acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      {scanned && qr === null && <Button title={'Escanear código QR'} onPress={() => setScanned(false)} />}
      {scanned && qr !== null && !camera && (
        <View style={styles.qrContainer}>
          <Text>Texto escaneado: {qr}</Text>
          <Button title={'Escanear texto'} onPress={() => setCamera(true)} />
        </View>
      )}
      {camera && (
        <Camera style={styles.camera} ref={(ref) => { cameraRef = ref; }}>
          <View style={styles.buttonContainer}>
            <Button title={'Tomar foto'} onPress={takePicture} />
          </View>
        </Camera>
      )}
      {photo && (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.photo} />
        </View>
      )}
      {!scanned && qr === null && <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    marginTop: 20,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'flex-end',
  },
  photoContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});
