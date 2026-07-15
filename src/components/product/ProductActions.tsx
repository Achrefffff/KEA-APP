import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

interface ProductActionsProps {
  price: string;
  onAddToCart: (quantity: number) => void;
}

export function ProductActions({ price, onAddToCart }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <View style={styles.container}>
      <View style={styles.quantitySelector}>
        <Pressable onPress={decrement} style={styles.qtyBtn}>
          <Text style={styles.qtyBtnText}>-</Text>
        </Pressable>
        <Text style={styles.qtyText}>{quantity}</Text>
        <Pressable onPress={increment} style={styles.qtyBtn}>
          <Text style={styles.qtyBtnText}>+</Text>
        </Pressable>
      </View>
      
      <Button 
        label={`Ajouter • ${(parseFloat(price) * quantity).toFixed(2)}€`}
        onPress={() => onAddToCart(quantity)}
        style={styles.addButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32, // Extra padding for bottom safe area
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    height: 52,
  },
  qtyBtn: {
    width: 44,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 20,
    color: Colors.light.text,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    width: 24,
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
    height: 52,
    paddingVertical: 0,
  },
});
