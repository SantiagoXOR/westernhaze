import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "../services/supabase";
import { analyzeScan } from "../services/api";
import { colors } from "../theme/colors";

const MESSAGES = [
  "Analizando biomasa foliar...",
  "Segmentando anomalías...",
  "Cruzando datos con base clínica...",
];

export default function ProcessingScreen({ route, navigation }) {
  const { imageUrl } = route.params || {};
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => (s + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!imageUrl) {
      navigation.replace("Home");
      return;
    }
    let cancelled = false;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId || cancelled) return;
      try {
        const result = await analyzeScan({
          userId,
          imageUrl,
          growthStage: null,
        });
        if (cancelled) return;
        navigation.replace("Report", { reportId: result.report_id });
      } catch (e) {
        if (cancelled) return;
        const msg =
          e.message ||
          "No se pudo completar el análisis. Comprueba tu conexión y que el backend esté en marcha.";
        Alert.alert("Error en el análisis", msg, [
          { text: "Entendido", onPress: () => navigation.goBack() },
        ]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [imageUrl, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>WesternHaze®</Text>
      <View style={styles.spinnerWrap}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
      <Text style={styles.message}>{MESSAGES[step]}</Text>
      <Text style={styles.slogan}>Cultivo de precisión, sin el esfuerzo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.gold,
    marginBottom: 32,
  },
  spinnerWrap: {
    marginBottom: 24,
  },
  message: {
    color: colors.cream,
    fontSize: 14,
    marginBottom: 8,
  },
  slogan: {
    color: colors.goldDim,
    fontSize: 12,
    fontStyle: "italic",
  },
});
