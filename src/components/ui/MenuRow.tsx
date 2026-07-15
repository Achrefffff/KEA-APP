import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export interface MenuRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isDestructive?: boolean;
}

export function MenuRow({ iconName, title, subtitle, onPress, isDestructive = false }: MenuRowProps) {
  const textColor = isDestructive ? '#ef4444' : Colors.light.text;
  const iconColor = isDestructive ? '#ef4444' : Colors.light.textSecondary;

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]} 
      onPress={onPress}
    >
      <View style={styles.leftContent}>
        <Ionicons name={iconName} size={22} color={iconColor} style={styles.icon} />
        <View>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.light.border} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.backgroundElement,
  },
  pressed: {
    backgroundColor: '#f9f9f9',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
});
