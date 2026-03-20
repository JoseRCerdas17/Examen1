import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../services/firebase';

const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'products'),
      where('userId', '==', auth.currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(lista);
      setCargando(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = (id, name) => {
    Alert.alert("🗑️ Eliminar", `¿Seguro que quieres eliminar "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteDoc(doc(db, "products", id)) },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.quantity <= 5 && styles.lowStockCard]}>
      <View style={styles.cardLeft}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.nombre}>{item.name}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.precio}>₡{item.price?.toLocaleString()}</Text>
          <View style={[styles.stockBadge, item.quantity <= 5 && styles.stockBadgeLow]}>
            <Text style={[styles.stockText, item.quantity <= 5 && styles.stockTextLow]}>
              {item.quantity} uds
            </Text>
          </View>
        </View>
        {item.quantity <= 5 && (
          <Text style={styles.alertText}>⚠️ Stock bajo</Text>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate("ProductForm", { product: item })}>
          <Text style={styles.editBtnText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.name)}>
          <Text style={styles.deleteBtnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2E4057" />
        <Text style={styles.cargandoText}>Cargando inventario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>📦 Mi Inventario</Text>
          <Text style={styles.headerSubtitle}>{products.length} producto{products.length !== 1 ? 's' : ''} en total</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => signOut(auth)}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {products.some(p => p.quantity <= 5) && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertBannerText}>⚠️ Tienes productos con stock bajo</Text>
        </View>
      )}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>No hay productos aún</Text>
            <Text style={styles.emptySubtext}>Agrega tu primer producto con el botón de abajo</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("ProductForm", {})}>
        <Text style={styles.fabText}>+ Agregar producto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f0f4f8" },
  cargandoText: { color: "#2E4057", marginTop: 12, fontSize: 15 },
  header: { backgroundColor: "#2E4057", padding: 20, paddingTop: 50, paddingBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 13, color: "#aac4e0", marginTop: 2 },
  logoutBtn: { backgroundColor: "rgba(255,255,255,0.15)", padding: 8, paddingHorizontal: 14, borderRadius: 20 },
  logoutText: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  alertBanner: { backgroundColor: "#FF5722", padding: 10, alignItems: "center" },
  alertBannerText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  lista: { padding: 16, gap: 12, paddingBottom: 100 },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, flexDirection: "row", elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6 },
  lowStockCard: { borderLeftWidth: 4, borderLeftColor: "#FF5722" },
  cardLeft: { flex: 1 },
  categoryBadge: { backgroundColor: "#e8f5e9", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, alignSelf: "flex-start", marginBottom: 6 },
  categoryText: { color: "#2E7D32", fontSize: 11, fontWeight: "bold" },
  nombre: { fontSize: 17, fontWeight: "bold", color: "#2E4057", marginBottom: 8 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  precio: { fontSize: 16, color: "#048A81", fontWeight: "bold" },
  stockBadge: { backgroundColor: "#e3f2fd", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  stockBadgeLow: { backgroundColor: "#fbe9e7" },
  stockText: { color: "#1565C0", fontSize: 12, fontWeight: "bold" },
  stockTextLow: { color: "#FF5722" },
  alertText: { color: "#FF5722", fontSize: 12, fontWeight: "bold", marginTop: 6 },
  actions: { justifyContent: "space-around", paddingLeft: 10 },
  editBtn: { backgroundColor: "#e3f2fd", padding: 8, borderRadius: 10, marginBottom: 6 },
  editBtnText: { fontSize: 18 },
  deleteBtn: { backgroundColor: "#fbe9e7", padding: 8, borderRadius: 10 },
  deleteBtnText: { fontSize: 18 },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyEmoji: { fontSize: 60, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "#2E4057" },
  emptySubtext: { fontSize: 14, color: "#999", marginTop: 6, textAlign: "center" },
  fab: { position: "absolute", bottom: 24, left: 24, right: 24, backgroundColor: "#4CAF50", padding: 16, borderRadius: 14, alignItems: "center", elevation: 4 },
  fabText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default ProductListScreen;