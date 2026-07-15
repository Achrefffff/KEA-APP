import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface CartItemProps {
  title: string;
  subtitle: string;
  price: string;
  image: string;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItem({ title, subtitle, price, image, quantity, onIncrement, onDecrement, onRemove }: CartItemProps) {
  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: image }} style={styles.itemImage} contentFit="cover" cachePolicy="disk" recyclingKey={title} transition={200} />
      <View style={styles.itemDetails}>
        <View style={styles.titleRow}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {title}
          </Text>
          <Pressable onPress={onRemove} style={styles.removeBtn}>
            <Ionicons name="trash-outline" size={20} color={Colors.light.textSecondary} />
          </Pressable>
        </View>
        <Text style={styles.itemSubtitle}>
          {subtitle}
        </Text>

        <View style={styles.itemBottom}>
          <Text style={styles.itemPrice}>{price}€</Text>
          <View style={styles.quantityControl}>
            <Pressable onPress={onDecrement} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>−</Text>
            </Pressable>
            <Text style={styles.qtyText}>{quantity}</Text>
            <Pressable onPress={onIncrement} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: Colors.light.backgroundElement,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 0,
    marginRight: 14,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    paddingRight: 8,
  },
  removeBtn: {
    padding: 2,
  },
  itemSubtitle: {
    fontSize: 12,
    marginTop: 2,
    color: Colors.light.textSecondary,
  },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.text,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 10,
  },
  qtyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '300',
    color: Colors.light.text,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
    color: Colors.light.text,
  },
});
