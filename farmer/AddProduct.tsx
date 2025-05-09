import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, push } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../services/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function AddProductScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState<any>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleAddProduct = async () => {
    if (!name || !price || !quantity || !image) {
      Alert.alert('Please fill all fields and select an image');
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storage = getStorage();
      const imagePath = `products/${user?.uid}/${Date.now()}.jpg`;
      const imgRef = storageRef(storage, imagePath);

      const response = await fetch(image.uri);
      const blob = await response.blob();
      await uploadBytes(imgRef, blob);

      const imageUrl = await getDownloadURL(imgRef);

      // Save product data in DB
      const productsRef = ref(db, 'products/');
      await push(productsRef, {
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        imageUrl,
        farmerId: user?.uid,
      });

      setName('');
      setPrice('');
      setQuantity('');
      setImage(null);
      Alert.alert('Product added!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error adding product');
    }
  };

return (
  <View style={styles.container}>
    <Text style={styles.title}>Add New Product</Text>

    <Text style={styles.label}>Product Name</Text>
    <TextInput
      placeholder="e.g., Organic Tomatoes"
      style={styles.input}
      value={name}
      onChangeText={setName}
    />

    <Text style={styles.label}>Price (₹)</Text>
    <TextInput
      placeholder="e.g., 45"
      style={styles.input}
      value={price}
      onChangeText={setPrice}
      keyboardType="decimal-pad"
    />

    <Text style={styles.label}>Quantity (kg)</Text>
    <TextInput
      placeholder="e.g., 10"
      style={styles.input}
      value={quantity}
      onChangeText={setQuantity}
      keyboardType="number-pad"
    />

    <Button title="Select Product Image" onPress={pickImage} />

    {image && (
      <Image source={{ uri: image.uri }} style={styles.preview} />
    )}

    <View style={styles.buttonContainer}>
      <Button title="Add Product" onPress={handleAddProduct} color="#4CAF50" />
    </View>
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 20,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
