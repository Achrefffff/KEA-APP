import React from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';

import { Colors } from '@/constants/theme';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { checkout } from '@/services/shopify';

import { ShippingProgress } from '@/components/cart/ShippingProgress';
import { GiftBanner } from '@/components/cart/GiftBanner';
import { CartItem as CartItemComponent } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';

export default function Cart() {
  const { items: cartItems, updateQuantity, removeItem: handleRemoveItem, getCartTotal, getItemCount } = useCartStore();
  const { token } = useAuthStore();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  const subtotal = getCartTotal();
  const itemCount = getItemCount();

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setIsCheckingOut(true);
    const checkoutUrl = await checkout(cartItems, token);
    setIsCheckingOut(false);

    if (checkoutUrl) {
      await WebBrowser.openBrowserAsync(checkoutUrl);
    } else {
      Alert.alert('Erreur', 'Impossible de créer le panier. Veuillez réessayer.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Panier</Text>
        <Text style={styles.headerCount}>
          {itemCount} articles
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        <ShippingProgress subtotal={subtotal} freeShippingThreshold={79} />
        
        <GiftBanner remainingForGift={Math.max(0, 100 - subtotal)} />

        {/* Liste des produits */}
        <View style={styles.itemsList}>
          {cartItems.map((item) => (
            <CartItemComponent 
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              price={item.price}
              image={item.image}
              quantity={item.quantity}
              onIncrement={() => updateQuantity(item.id, 1)}
              onDecrement={() => updateQuantity(item.id, -1)}
              onRemove={() => handleRemoveItem(item.id)}
            />
          ))}
        </View>

      </ScrollView>

      {/* Résumé fixe en bas */}
      <CartSummary 
        subtotal={subtotal} 
        isLoading={isCheckingOut}
        onCheckout={handleCheckout} 
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundElement,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.text,
  },
  headerCount: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20, // Plus besoin d'espace énorme car le bloc n'est plus flottant
  },
  itemsList: {
    marginTop: 8,
  },
});
