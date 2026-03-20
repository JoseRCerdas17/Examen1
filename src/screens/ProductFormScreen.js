import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../services/firebase";

export default function ProductFormScreen({ route, navigation }) {
  const existing = route.params?.product;
  const [name, setName] = useState(existing?.name || "");
  const [price, setPrice] = useState(existing?.price?.toString() || "");
  const [quantity, setQuantity] = useState(existing?.quantity?.toString() || "");
  const [category, setCategory] = useState(existing?.category || "");

  const handleSave = async () => {
    if (!name || !price || !quantity || !category) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    if (isNaN(price) || isNaN(quantity)) {
      Alert.alert("Error", "Precio y cantidad deben ser números.");
      return;
    }
    if (parseFloat(price) <= 0 || parseInt(quantity) < 0) {
      Alert.alert("Error", "Precio debe ser mayor a 0 y la cantidad no puede ser negativa.");
      return;
    }

    const data = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      userId: auth.currentUser.uid,
    };
    try {
      if (existing?.id) {
        await updateDoc(doc(db, "products", existing.id), data);
      } else {
        await addDoc(collection(db, "products"), data);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar el producto.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{existing?.id ? "Editar Producto" : "Nuevo Producto"}</Text>
      <Text style={styles.label}>Nombre del producto</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ej: Arroz" />

      <Text style={styles.label}>Categoría</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Ej: Alimentos" />

      <Text style={styles.label}>Precio</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="Ej: 1500" />

      <Text style={styles.label}>Cantidad</Text>
      <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="Ej: 10" />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{existing?.id ? "Actualizar" : "Guardar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#f5f5f5" },
  label: { fontWeight: "bold", marginBottom: 4, marginTop: 12, color: "#333" },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 12, borderWidth: 1, borderColor: "#ddd" },
  button: { backgroundColor: "#4CAF50", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 24, marginBottom: 40 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  title: {fontSize: 24, fontWeight: "bold", marginBottom: 8, color: "#333" },
  cancelButton: {padding: 14, borderRadius: 8, alignItems: "center", marginTop: 10, marginBottom: 40 },
  cancelText: { color: "#999", fontSize: 16 },
});