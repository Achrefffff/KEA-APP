import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { AppOrder } from '@/services/shopify/types';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface OrderCardProps {
  order: AppOrder;
}

export function OrderCard({ order }: OrderCardProps) {
  const date = new Date(order.processedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate total items
  const totalItems = order.lineItems.reduce((acc, item) => acc + item.quantity, 0);

  // Get up to 3 images
  const images = order.lineItems
    .map(item => item.imageUrl)
    .filter((url): url is string => url !== null)
    .slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.orderNumber}>Commande #{order.orderNumber}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.price}>
          {order.totalPrice.amount} {order.totalPrice.currencyCode}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.imagesContainer}>
          {images.map((url, index) => (
            <Image
              key={`${url}-${index}`}
              source={{ uri: url }}
              style={[styles.image, { marginLeft: index > 0 ? -12 : 0 }]}
              contentFit="cover"
              cachePolicy="disk"
              recyclingKey={`order-${order.orderNumber}-${index}`}
              transition={200}
            />
          ))}
          {images.length === 0 && (
            <View style={[styles.image, styles.placeholderImage]}>
              <Ionicons name="cube-outline" size={20} color={Colors.light.textSecondary} />
            </View>
          )}
        </View>
        <Text style={styles.itemCount}>
          {totalItems} article{totalItems > 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {order.fulfillmentStatus === 'FULFILLED' ? 'Livré' : 'En cours'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statusBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
  },
});
