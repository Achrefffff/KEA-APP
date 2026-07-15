import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export function AuthInput({ label, error, isPassword = false, ...props }: AuthInputProps) {
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.light.textSecondary}
          secureTextEntry={isSecure}
          autoCapitalize={isPassword ? 'none' : props.autoCapitalize}
          {...props}
        />
        {isPassword && (
          <Pressable onPress={() => setIsSecure(!isSecure)} style={styles.eyeButton}>
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.light.textSecondary}
            />
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e53935',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.light.text,
  },
  eyeButton: {
    paddingHorizontal: 14,
    height: 50,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#e53935',
    marginTop: 6,
    marginLeft: 4,
  },
});
