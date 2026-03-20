import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("⚠️ Campos incompletos", "Por favor completa todos los campos.");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("⚠️ Error", "Ingresa un email válido.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("⚠️ Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("✅ Cuenta creada", "Tu cuenta fue creada exitosamente. ¡Bienvenido!");
    } catch (e) {
      Alert.alert("❌ Error", "No se pudo registrar. El email ya puede estar en uso.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.topSection}>
        <Text style={styles.emoji}>🆕</Text>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Regístrate para empezar</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nueva cuenta</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="ejemplo@correo.com" value={email}
          onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
          placeholderTextColor="#aaa" />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput style={styles.input} placeholder="Mínimo 6 caracteres" value={password}
          onChangeText={setPassword} secureTextEntry placeholderTextColor="#aaa" />

        {password.length > 0 && password.length < 6 && (
          <Text style={styles.passwordHint}>⚠️ La contraseña debe tener al menos 6 caracteres</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? <Text style={styles.linkBold}>Inicia sesión</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2E4057", justifyContent: "center", padding: 24 },
  topSection: { alignItems: "center", marginBottom: 32 },
  emoji: { fontSize: 60, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 15, color: "#aac4e0", marginTop: 6 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 24, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#2E4057", marginBottom: 20, textAlign: "center" },
  label: { fontWeight: "bold", marginBottom: 6, marginTop: 12, color: "#333", fontSize: 14 },
  input: { backgroundColor: "#f5f5f5", borderRadius: 10, padding: 14, fontSize: 15, color: "#333", borderWidth: 1, borderColor: "#eee" },
  passwordHint: { color: "#FF9800", fontSize: 13, marginTop: 6 },
  button: { backgroundColor: "#4CAF50", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 24 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  linkButton: { alignItems: "center", marginTop: 16 },
  linkText: { color: "#666", fontSize: 14 },
  linkBold: { color: "#4CAF50", fontWeight: "bold" },
});