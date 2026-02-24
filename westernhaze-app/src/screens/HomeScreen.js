import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { supabase } from "../services/supabase";
import { getLastReport, getLastTwoReports } from "../services/reports";
import { colors } from "../theme/colors";

export default function HomeScreen({ onLogout, onStartScan, navigation }) {
  const [lastReport, setLastReport] = useState(null);
  const [variation, setVariation] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const [report, lastTwo] = await Promise.all([
        getLastReport(userId),
        getLastTwoReports(userId),
      ]);
      setLastReport(report);
      if (lastTwo?.length === 2) {
        const diff = (lastTwo[0].health_score || 0) - (lastTwo[1].health_score || 0);
        setVariation(diff);
      }
    } catch (_) {
      setLastReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const analysis = lastReport?.json_analysis_full || {};
  const healthScore = lastReport?.health_score ?? null;
  const statusSummary = analysis.status_summary || "Sin datos";

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.growSpace}>Carpa Indoor 1</Text>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>HEALTH SCORE DE HOY</Text>
        <View style={styles.circle}>
          <Text style={styles.scoreValue}>
            {healthScore != null ? healthScore : "—"}
          </Text>
        </View>
        {variation != null && (
          <Text
            style={[
              styles.variation,
              variation >= 0 ? styles.variationUp : styles.variationDown,
            ]}
          >
            {variation >= 0 ? "▲" : "▼"} {Math.abs(variation)}% desde el último
            escaneo
          </Text>
        )}
      </View>

      {lastReport && (
        <TouchableOpacity
          style={styles.alertCard}
          onPress={() => navigation.navigate("Report", { reportId: lastReport.id })}
        >
          <Text style={styles.alertTitle}>ÚLTIMA ALERTA</Text>
          <Text style={styles.alertText}>[!] {statusSummary}</Text>
          <Text style={styles.alertLink}>Ver detalles</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.primaryButton} onPress={onStartScan}>
        <Text style={styles.primaryButtonText}>[+] INICIAR ESCANEO DIARIO</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={onLogout}>
        <Text style={styles.linkText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 48 },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  growSpace: {
    fontSize: 14,
    color: colors.cream,
    marginBottom: 20,
  },
  scoreCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.goldDim,
    letterSpacing: 1,
    marginBottom: 12,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.cream,
  },
  variation: {
    fontSize: 12,
    marginTop: 8,
  },
  variationUp: { color: colors.success },
  variationDown: { color: colors.error },
  alertCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 24,
  },
  alertTitle: {
    fontSize: 11,
    color: colors.goldDim,
    letterSpacing: 1,
    marginBottom: 4,
  },
  alertText: { color: colors.cream, fontSize: 14 },
  alertLink: {
    color: colors.gold,
    fontSize: 13,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: colors.gold,
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    color: colors.bg,
    fontSize: 14,
    fontWeight: "700",
  },
  link: { alignItems: "center" },
  linkText: { color: colors.gold, fontSize: 14 },
});
