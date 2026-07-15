import React from 'react';
import { Pressable, StyleSheet, PressableProps, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface IconButtonProps extends PressableProps {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function IconButton({ 
  icon, 
  size = 24, 
  color = Colors.light.text, 
  backgroundColor = 'transparent', 
  style, 
  ...props 
}: IconButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
      {...props}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
