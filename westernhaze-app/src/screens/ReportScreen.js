import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getReportById } from "../services/reports";
import { colors } from "../theme/colors";

export default function ReportScreen({ route, navigation }) {
  const { reportId } = route.params || {};
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState({});
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    if (!reportId) {
      setLoading(false);
      return;
    }
    getReportById(reportId)
      .then(setReport)
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [reportId]);

  const analysis = report?.json_analysis_full || {};
  const actionPlan = analysis.action_plan || [];

  const toggleCheck = (index) => {
    setChecked((prev) => {
      const next = { ...prev, [index]: !prev[index] };
      const all = actionPlan.every((_, i) => next[i]);
      setAllDone(all);
      return next;
    });
  };

  const handleMarkComplete = () => {
    const next = {};
    actionPlan.forEach((_, i) => {
      next[i] = true;
    });
    setChecked(next);
    setAllDone(true);
    Alert.alert("Listo", "Acciones marcadas como completadas.");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }
  if (!report) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>No se encontró el reporte.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Ir al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {report.image_url ? (
        <Image
          source={{ uri: report.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}

      <Text style={styles.status}>
        ESTADO DE HOY: {analysis.status_summary || "—"}
      </Text>

      <Text style={styles.sectionTitle}>HALLAZGO PRINCIPAL</Text>
      <Text style={styles.findingTitle}>{analysis.main_finding_title || "—"}</Text>

      <Text style={styles.sectionTitle}>Por qué lo decimos</Text>
      <Text style={styles.details}>{analysis.finding_details || "—"}</Text>

      <Text style={styles.sectionTitle}>PLAN DE ACCIÓN RECOMENDADO</Text>
      {actionPlan.map((step, index) => (
        <TouchableOpacity
          key={index}
          style={styles.checkRow}
          onPress={() => toggleCheck(index)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, checked[index] && styles.checkboxChecked]}>
            {checked[index] ? (
              <Text style={styles.checkmark}>✓</Text>
            ) : null}
          </View>
          <Text style={[styles.stepText, checked[index] && styles.stepTextChecked]}>
            {index + 1}. {step}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.primaryButton, allDone && styles.primaryButtonDone]}
        onPress={handleMarkComplete}
      >
        <Text style={styles.primaryButtonText}>
          ✓ MARCAR ACCIONES COMO COMPLETADAS
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 48 },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  image: {
    width: "100%",
    height: 220,
    backgroundColor: colors.card,
  },
  status: {
    fontSize: 14,
    color: colors.cream,
    padding: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 11,
    color: colors.goldDim,
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  findingTitle: {
    fontSize: 16,
    color: colors.gold,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  details: {
    fontSize: 14,
    color: colors.cream,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.gold,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.gold,
  },
  checkmark: {
    color: colors.bg,
    fontSize: 12,
    fontWeight: "700",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.cream,
  },
  stepTextChecked: {
    textDecorationLine: "line-through",
    opacity: 0.8,
  },
  primaryButton: {
    backgroundColor: colors.gold,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonDone: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: colors.bg,
    fontSize: 14,
    fontWeight: "600",
  },
  text: { color: colors.cream, marginBottom: 16 },
  button: {
    backgroundColor: colors.gold,
    padding: 14,
    borderRadius: 8,
  },
  buttonText: { color: colors.bg, fontSize: 14, fontWeight: "600" },
});
