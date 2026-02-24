import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { colors } from "../theme/colors";
import { uploadPlantPhoto } from "../services/uploadService";
import { supabase } from "../services/supabase";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const OVERLAY_SIZE = SCREEN_WIDTH * 0.85;

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  async function handleTakePhoto() {
    if (!cameraRef.current || !permission?.granted) return;
    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      if (result?.uri) setPhoto(result);
    } catch (e) {
      Alert.alert("Error", "No se pudo tomar la foto.");
    }
  }

  function handleCancelPreview() {
    setPhoto(null);
  }

  async function handleConfirm() {
    if (!photo?.uri) return;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      Alert.alert("Error", "Sesión inválida. Vuelve a iniciar sesión.");
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadPlantPhoto(photo.uri, userId);
      setPhoto(null);
      navigation.navigate("Processing", { imageUrl: url });
    } catch (e) {
      Alert.alert(
        "Error al subir",
        e.message || "No se pudo subir la imagen. Revisa la conexión."
      );
    } finally {
      setUploading(false);
    }
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.gold} />
        <Text style={styles.text}>Comprobando permisos...</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Se necesita acceso a la cámara.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.preview} resizeMode="contain" />
        <Text style={styles.previewLabel}>¿Usar esta foto?</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleCancelPreview}
            disabled={uploading}
          >
            <Text style={styles.buttonTextSecondary}>Repetir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirm}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={styles.buttonText}>Confirmar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} />
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.overlayFrame}>
          <Text style={styles.overlayLabel}>Encaja la punta principal aquí</Text>
          <View style={styles.overlayCross} />
        </View>
      </View>
      <Text style={styles.hint}>
        * Asegúrate de encender luces blancas si usas LEDs de colores.
      </Text>
      <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
        <View style={styles.captureInner} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelLink} onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayFrame: {
    width: OVERLAY_SIZE,
    height: OVERLAY_SIZE * 0.75,
    borderWidth: 2,
    borderColor: colors.gold,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  overlayLabel: {
    color: colors.cream,
    fontSize: 14,
    marginBottom: 8,
  },
  overlayCross: {
    width: 24,
    height: 24,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: colors.gold,
    transform: [{ rotate: "-45deg" }],
  },
  hint: {
    color: colors.goldDim,
    fontSize: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  captureButton: {
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.cream,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.cream,
    borderWidth: 3,
    borderColor: colors.bg,
  },
  cancelLink: {
    alignSelf: "center",
    marginBottom: 24,
  },
  linkText: {
    color: colors.gold,
    fontSize: 14,
  },
  text: {
    color: colors.cream,
    marginBottom: 16,
  },
  preview: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.card,
  },
  previewLabel: {
    color: colors.cream,
    fontSize: 16,
    textAlign: "center",
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingBottom: 24,
  },
  button: {
    backgroundColor: colors.gold,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: colors.bg,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: colors.cream,
    fontSize: 16,
  },
});
