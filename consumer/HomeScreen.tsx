import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebase';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsRef = ref(db, 'products/');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const allProducts = Object.entries(data || {}).map(([key, value]: any) => ({
        id: key,
        ...value,
      }));
      setProducts(allProducts);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>₹{item.price} · {item.quantity}kg</Text>
        <Text style={styles.by}>By: {item.farmerEmail || 'Local Farmer'}</Text>
      </View>
      {/* Optionally add buttons: Add to cart / favorite */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop Local Produce</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No products available.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  by: { fontSize: 12, color: '#555' },
});
