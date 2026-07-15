import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerBackTitle: 'Retour',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#fff' },
      }}
    />
  );
}
