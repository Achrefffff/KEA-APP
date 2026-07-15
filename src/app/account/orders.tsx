import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchCustomerOrders } from '@/services/shopify/customer';
import { AppOrder } from '@/services/shopify/types';
import { OrderCard } from '@/components/account/OrderCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function OrdersScreen() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<AppOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (token) {
        const fetchedOrders = await fetchCustomerOrders(token);
        setOrders(fetchedOrders);
      }
      setIsLoading(false);
    };

    loadOrders();
  }, [token]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        iconName="cube-outline"
        title="Aucune commande"
        description="Vous n'avez pas encore passé de commande sur notre boutique."
        buttonLabel="Découvrir nos produits"
        onButtonPress={() => router.replace('/(tabs)')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
});
