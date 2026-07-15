import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface ProfileSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.card}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          
          const isLast = index === React.Children.count(children) - 1;
          
          return (
            <>
              {child}
              {!isLast && <View style={styles.separator} />}
            </>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: 8,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginLeft: 54, // Aligné avec le texte, après l'icône
  },
});
