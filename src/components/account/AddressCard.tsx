import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppAddress } from '@/services/shopify/types';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface AddressCardProps {
  address: AppAddress;
}

export function AddressCard({ address }: AddressCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="location-outline" size={20} color={Colors.light.text} />
          <Text style={styles.name}>
            {address.firstName} {address.lastName}
          </Text>
        </View>
        {address.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Par défaut</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.text}>{address.address1}</Text>
        {address.address2 ? <Text style={styles.text}>{address.address2}</Text> : null}
        <Text style={styles.text}>
          {address.zip} {address.city}
        </Text>
        <Text style={styles.text}>{address.country}</Text>
        {address.phone ? (
          <Text style={[styles.text, styles.phone]}>{address.phone}</Text>
        ) : null}
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
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  defaultBadge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  details: {
    paddingLeft: 28, // align with text after icon
  },
  text: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  phone: {
    marginTop: 8,
    color: Colors.light.text,
  },
});
