import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("⚠️ Campos incompletos", "Por favor completa todos los campos.");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("⚠️ Error", "Ingresa un email válido.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      Alert.alert("❌ Error", "Credenciales incorrectas. Verifica tu email y contraseña.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.topSection}>
        <Text style={styles.emoji}>📦</Text>
        <Text style={styles.title}>Inventario App</Text>
        <Text style={styles.subtitle}>Gestiona tu inventario fácilmente</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Iniciar sesión</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="ejemplo@correo.com" value={email}
          onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
          placeholderTextColor="#aaa" />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput style={styles.input} placeholder="••••••••" value={password}
          onChangeText={setPassword} secureTextEntry placeholderTextColor="#aaa" />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>¿No tienes cuenta? <Text style={styles.linkBold}>Regístrate</Text></Text>
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
  button: { backgroundColor: "#4CAF50", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 24 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  linkButton: { alignItems: "center", marginTop: 16 },
  linkText: { color: "#666", fontSize: 14 },
  linkBold: { color: "#4CAF50", fontWeight: "bold" },
});