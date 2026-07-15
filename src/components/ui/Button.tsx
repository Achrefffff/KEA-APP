import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/theme';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ label, variant = 'primary', isLoading = false, disabled, style, textStyle, ...props }: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return '#e0e0e0';
    if (variant === 'primary') return Colors.light.primary;
    if (variant === 'secondary') return Colors.light.backgroundSelected;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return '#999999';
    if (variant === 'primary') return Colors.light.primaryText;
    if (variant === 'secondary') return Colors.light.text;
    return Colors.light.primary;
  };

  const getBorderColor = () => {
    if (variant === 'outline') return disabled ? '#e0e0e0' : Colors.light.border;
    return 'transparent';
  };

  return (
    <Pressable
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: pressed && !disabled ? 0.8 : 1,
        },
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.label, { color: getTextColor() }, textStyle]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
