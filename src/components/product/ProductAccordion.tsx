import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface ProductAccordionProps {
  description: string;
  ingredients?: string;
  usage?: string;
}

export function ProductAccordion({ description, ingredients, usage }: ProductAccordionProps) {
  return (
    <View style={styles.container}>
      <AccordionItem title="Description" content={description} defaultOpen />
      {usage && <AccordionItem title="Conseils d'utilisation" content={usage} />}
      {ingredients && <AccordionItem title="Ingrédients" content={ingredients} />}
    </View>
  );
}

function AccordionItem({ title, content, defaultOpen = false }: { title: string, content: string, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <View style={styles.item}>
      <Pressable style={styles.header} onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.light.textSecondary} />
      </Pressable>
      {isOpen && (
        <View style={styles.content}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  content: {
    paddingBottom: 16,
  },
  contentText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
});
