"use client";
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, useColorScheme, View, StyleSheet, Text } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1, position: 'relative' }} />
      <TabList asChild>
        <BottomTabBar>
          <TabTrigger name="index" href="/" asChild>
            <TabBarButton iconName="home" label="Accueil" />
          </TabTrigger>
          <TabTrigger name="search" href="/search" asChild>
            <TabBarButton iconName="search" label="Recherche" />
          </TabTrigger>
          <TabTrigger name="cart" href="/cart" asChild>
            <TabBarButton iconName="bag-handle" label="Panier" />
          </TabTrigger>
          <TabTrigger name="favorites" href="/favorites" asChild>
            <TabBarButton iconName="heart" label="Favoris" />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabBarButton iconName="person" label="Profil" />
          </TabTrigger>
        </BottomTabBar>
      </TabList>
    </Tabs>
  );
}

import { Ionicons } from '@expo/vector-icons';

function TabBarButton({ iconName, label, isFocused, ...props }: TabTriggerSlotProps & { iconName: keyof typeof Ionicons.glyphMap; label: string }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <Pressable
      {...props}
      style={[
        styles.tabButton,
        isFocused && { borderTopColor: colors.primary, borderTopWidth: 2 },
      ]}
    >
      <Ionicons name={iconName} size={20} color={isFocused ? colors.primary : colors.textSecondary} style={{ marginBottom: 2 }} />
      <Text
        style={[
          styles.tabLabel,
          { color: isFocused ? colors.primary : colors.textSecondary },
          isFocused && { fontWeight: '700' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function BottomTabBar(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <View
      {...props}
      style={[
        styles.bottomBar,
        {
          backgroundColor: colors.backgroundElement,
          borderTopColor: colors.border,
        },
      ]}
    >
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 8,
    zIndex: 100,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: 'transparent',
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.5,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
