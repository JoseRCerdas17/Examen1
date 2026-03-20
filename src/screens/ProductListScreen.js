import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../services/firebase";

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "products"),
      where("userId", "==", auth.currentUser.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(data);
    });
    return unsub;
  }, []);

  const handleDelete = (id) => {
    Alert.alert("Eliminar", "¿Seguro que quieres eliminar este producto?", [
      { text: "Cancelar" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteDoc(doc(db, "products", id)) },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.quantity <= 5 && styles.lowStock]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.detail}>Categoría: {item.category}</Text>
        <Text style={styles.detail}>Precio: ₡{item.price}</Text>
        <Text style={styles.detail}>Cantidad: {item.quantity}</Text>
        {item.quantity <= 5 && <Text style={styles.alert}>⚠️ Stock bajo</Text>}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate("ProductForm", { product: item })}>
          <Text style={styles.edit}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.delete}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={products} keyExtractor={(i) => i.id} renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No hay productos aún.</Text>} />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("ProductForm", {})}>
        <Text style={styles.fabText}>+ Agregar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logout} onPress={() => signOut(auth)}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 10, flexDirection: "row", elevation: 2 },
  lowStock: { borderLeftWidth: 4, borderLeftColor: "#FF5722" },
  name: { fontSize: 16, fontWeight: "bold" },
  detail: { color: "#666", marginTop: 2 },
  alert: { color: "#FF5722", fontWeight: "bold", marginTop: 4 },
  actions: { justifyContent: "space-around" },
  edit: { fontSize: 22 },
  delete: { fontSize: 22 },
  empty: { textAlign: "center", marginTop: 40, color: "#999" },
  fab: { backgroundColor: "#4CAF50", padding: 14, borderRadius: 30, alignItems: "center", marginTop: 10 },
  fabText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  logout: { alignItems: "center", marginTop: 8, marginBottom: 4 },
  logoutText: { color: "#999" },
});