import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Button } from './Button';

interface EmptyStateProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
  style?: ViewStyle;
}

export function EmptyState({ 
  iconName, 
  title, 
  description, 
  buttonLabel, 
  onButtonPress,
  style 
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={48} color={Colors.light.textSecondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      {buttonLabel && onButtonPress && (
        <Button 
          label={buttonLabel} 
          onPress={onButtonPress} 
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    minWidth: 200,
  },
});
