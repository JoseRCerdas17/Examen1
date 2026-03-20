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
      Alert.alert("⚠️ Campos incompletos", "Todos los campos son obligatorios.");
      return;
    }
    if (isNaN(price) || isNaN(quantity)) {
      Alert.alert("⚠️ Error", "Precio y cantidad deben ser números.");
      return;
    }
    if (parseFloat(price) <= 0 || parseInt(quantity) < 0) {
      Alert.alert("⚠️ Error", "Precio debe ser mayor a 0 y cantidad no puede ser negativa.");
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
        Alert.alert("✅ Actualizado", `El producto "${name}" fue actualizado correctamente.`, [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } else {
        await addDoc(collection(db, "products"), data);
        Alert.alert("✅ Guardado", `El producto "${name}" fue agregado al inventario.`, [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (e) {
      Alert.alert("❌ Error", "No se pudo guardar el producto. Intenta de nuevo.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{existing?.id ? "Editar Producto" : "Nuevo Producto"}</Text>
      <Text style={styles.label}>Nombre del producto</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ej: Arroz" />

        <Text style={styles.label}>Categoría</Text>
        <TextInput style={styles.input} value={category} onChangeText={setCategory}
          placeholder="Ej: Alimentos" placeholderTextColor="#aaa" />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Precio (₡)</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice}
              keyboardType="numeric" placeholder="Ej: 1500" placeholderTextColor="#aaa" />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Cantidad</Text>
            <TextInput style={styles.input} value={quantity} onChangeText={setQuantity}
              keyboardType="numeric" placeholder="Ej: 10" placeholderTextColor="#aaa" />
          </View>
        </View>

        {quantity && parseInt(quantity) <= 5 && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>⚠️ Stock bajo — considera agregar más unidades</Text>
          </View>
        )}

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
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { backgroundColor: "#2E4057", padding: 24, paddingTop: 40, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#aac4e0", marginTop: 4 },
  form: { padding: 20 },
  label: { fontWeight: "bold", marginBottom: 6, marginTop: 14, color: "#333", fontSize: 14 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 14, borderWidth: 1, borderColor: "#ddd", fontSize: 15, color: "#333" },
  row: { flexDirection: "row", gap: 12 },
  halfField: { flex: 1 },
  warningBox: { backgroundColor: "#FFF3E0", borderRadius: 8, padding: 10, marginTop: 12, borderLeftWidth: 4, borderLeftColor: "#FF9800" },
  warningText: { color: "#E65100", fontSize: 13 },
  button: { backgroundColor: "#4CAF50", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 24 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  title: {fontSize: 24, fontWeight: "bold", marginBottom: 8, color: "#333" },
  cancelButton: {padding: 14, borderRadius: 8, alignItems: "center", marginTop: 10, marginBottom: 40 },
  cancelText: { color: "#999", fontSize: 16 },
});