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

  const handleDelete = (id) => {
    Alert.alert("Eliminar", "¿Seguro que quieres eliminar este producto?", [
      { text: "Cancelar" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteDoc(doc(db, "products", id)) },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.quantity <= 5 && styles.lowStock]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{item.name}</Text>
        <Text style={styles.detail}>Categoría: {item.category}</Text>
        <Text style={styles.detail}>Precio: ₡{item.price?.toLocaleString()}</Text>
        <Text style={styles.stock}>Stock: {item.quantity}</Text>
        {item.quantity <= 5 && <Text style={styles.alertText}>⚠️ Stock bajo</Text>}
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

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2E4057" />
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.counter}>Total de productos: {products.length}</Text>
      {products.some(p => p.quantity <= 5) && (
        <Text style={styles.alertBanner}>⚠️ Tienes productos con stock bajo</Text>
      )}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No hay productos aún.</Text>}
        contentContainerStyle={styles.lista}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("ProductForm", {})}>
        <Text style={styles.fabText}>+ Agregar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logout} onPress={() => signOut(auth)}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  counter: { fontSize: 14, color: '#666', marginBottom: 10, textAlign: 'right' },
  alertBanner: { backgroundColor: '#FF5722', color: '#fff', padding: 8, borderRadius: 8, marginBottom: 10, textAlign: 'center' },
  lista: { gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, flexDirection: 'row', elevation: 3 },
  lowStock: { borderLeftWidth: 4, borderLeftColor: '#FF5722' },
  nombre: { fontSize: 16, fontWeight: 'bold', color: '#2E4057' },
  detail: { fontSize: 14, color: '#048A81', marginTop: 4 },
  stock: { fontSize: 13, color: '#666', marginTop: 2 },
  alertText: { color: '#FF5722', fontWeight: 'bold', marginTop: 4 },
  actions: { justifyContent: 'space-around' },
  edit: { fontSize: 22 },
  delete: { fontSize: 22 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
  fab: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  logout: { alignItems: 'center', marginTop: 8, marginBottom: 4 },
  logoutText: { color: '#999' },
});

export default ProductListScreen;