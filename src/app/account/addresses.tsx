import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchCustomerAddresses } from '@/services/shopify/customer';
import { AppAddress } from '@/services/shopify/types';
import { AddressCard } from '@/components/account/AddressCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/theme';

export default function AddressesScreen() {
  const { token } = useAuthStore();
  const [addresses, setAddresses] = useState<AppAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAddresses = async () => {
      if (token) {
        const fetchedAddresses = await fetchCustomerAddresses(token);
        // Sort to put default address first
        const sorted = fetchedAddresses.sort((a, b) => {
          if (a.isDefault) return -1;
          if (b.isDefault) return 1;
          return 0;
        });
        setAddresses(sorted);
      }
      setIsLoading(false);
    };

    loadAddresses();
  }, [token]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (addresses.length === 0) {
    return (
      <EmptyState
        iconName="location-outline"
        title="Aucune adresse"
        description="Vous n'avez pas encore d'adresse de livraison enregistrée."
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AddressCard address={item} />}
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
