import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Por favor completa todos los campos.");
    return;
  }

  if (!email.includes("@")) {
    Alert.alert("Error", "Ingresa un email válido.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    Alert.alert("Error", "Credenciales incorrectas. Verifica tu email y contraseña.");
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Inventario</Text>
      <TextInput style={styles.input} placeholder="Email" value={email}
        onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña" value={password}
        onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f5f5f5" },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 32 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#ddd" },
  button: { backgroundColor: "#4CAF50", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { textAlign: "center", color: "#4CAF50", marginTop: 8 },
});