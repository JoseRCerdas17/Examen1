import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const ref = collection(db, 'productos');

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(lista);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.detail}>Precio: ₡{item.price.toLocaleString()}</Text>
      <Text style={styles.stock}>Stock: {item.quantity}</Text>
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
        contentContainerStyle={styles.lista}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'right',
  },
  alertBanner: {
    backgroundColor: '#FF5722',
    color: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: 'center',
  },
  lista: {
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E4057',
  },
  detail: {
    fontSize: 14,
    color: '#048A81',
    marginTop: 4,
  },
  stock: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});

export default ProductListScreen;