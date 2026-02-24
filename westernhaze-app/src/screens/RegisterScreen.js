import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../services/supabase";
import { colors } from "../theme/colors";

export default function RegisterScreen({ onRegistered, onGoLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Email y contraseña son obligatorios.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      Alert.alert("Error al registrarse", error.message);
      return;
    }
    if (data?.user && !data.user.identities?.length) {
      Alert.alert("Ya existe", "Ya hay una cuenta con este email.");
      return;
    }
    Alert.alert(
      "Cuenta creada",
      "Revisa tu email para confirmar la cuenta (si la confirmación está habilitada).",
      [{ text: "OK", onPress: onRegistered }]
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.logo}>WesternHaze®</Text>
      <Text style={styles.subtitle}>Crear cuenta</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.goldDim}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña (mín. 6 caracteres)"
          placeholderTextColor={colors.goldDim}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.bg} />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={onGoLogin} disabled={loading}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.gold,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.cream,
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    color: colors.cream,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.gold,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.bg,
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    alignItems: "center",
    marginTop: 12,
  },
  linkText: {
    color: colors.gold,
    fontSize: 14,
  },
});
