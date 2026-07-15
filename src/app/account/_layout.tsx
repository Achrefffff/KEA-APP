import { Stack } from 'expo-router';

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Retour',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen 
        name="orders" 
        options={{ title: 'Mes Commandes' }} 
      />
      <Stack.Screen 
        name="personal-info" 
        options={{ title: 'Mes Informations' }} 
      />
      <Stack.Screen 
        name="addresses" 
        options={{ title: 'Mes Adresses' }} 
      />
    </Stack>
  );
}
