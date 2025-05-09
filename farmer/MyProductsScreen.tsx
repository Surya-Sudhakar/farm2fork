import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, Alert, TouchableOpacity,
  Modal, TextInput, Button, Image
} from 'react-native';
import { ref, onValue, remove, update } from 'firebase/database';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { db } from '../services/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Ionicons } from '@expo/vector-icons';

export default function MyProductsScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editQty, setEditQty] = useState('');

  useEffect(() => {
    const productsRef = ref(db, 'products/');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const farmerProducts = Object.entries(data || {}).map(([key, value]: any) => ({
        id: key,
        ...value,
      })).filter((item) => item.farmerId === user?.uid);
      setProducts(farmerProducts);
    });

    return () => unsubscribe();
  }, []);

const handleDelete = (productId: string) => {
  const product = products.find((p) => p.id === productId);
  const storage = getStorage();

  Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        try {
          if (product?.imageUrl) {
            const decodedUrl = decodeURIComponent(product.imageUrl.split('?')[0]);
            const path = decodedUrl.split('/o/')[1]; // gets 'products%2F...'
            const cleanPath = path.replace(/%2F/g, '/'); // decode %2F to /

            const imgRef = storageRef(storage, cleanPath);
            await deleteObject(imgRef);
          }

          await remove(ref(db, `products/${productId}`));
        } catch (error) {
          console.error('Delete failed:', error);
          Alert.alert('Error', 'Failed to delete product or image.');
        }
      },
    },
  ]);
};


  const openEditModal = (product: any) => {
    setEditProduct(product);
    setEditName(product.name);
    setEditPrice(String(product.price));
    setEditQty(String(product.quantity));
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editName || !editPrice || !editQty) return alert('All fields are required.');
    try {
      await update(ref(db, `products/${editProduct.id}`), {
        name: editName,
        price: parseFloat(editPrice),
        quantity: parseInt(editQty),
      });
      setEditModalVisible(false);
      setEditProduct(null);
    } catch (error) {
      Alert.alert('Error', 'Update failed.');
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text>₹{item.price} × {item.quantity}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={{ marginRight: 12 }}>
          <Ionicons name="create-outline" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No products yet.</Text>}
      />

      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Edit Product</Text>
            <TextInput placeholder="Name" value={editName} onChangeText={setEditName} style={styles.input} />
            <TextInput placeholder="Price" value={editPrice} onChangeText={setEditPrice} keyboardType="decimal-pad" style={styles.input} />
            <TextInput placeholder="Quantity" value={editQty} onChangeText={setEditQty} keyboardType="number-pad" style={styles.input} />
            <Button title="Save" onPress={handleSaveEdit} />
            <Button title="Cancel" color="gray" onPress={() => setEditModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold' },
  actions: { flexDirection: 'row' },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
