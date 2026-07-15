import React from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

export function PromoCurlyJelly() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/deco_curly_jelly_pop.png')}
          style={styles.image}
          contentFit="cover"
        />
        <Pressable
          style={styles.ctaButton}
          onPress={() =>
            router.push({
              pathname: '/product/[id]',
              params: { id: encodeURIComponent('gid://shopify/Product/11995230077192') },
            })
          }
        >
          <Text style={styles.ctaText}>JE DÉCOUVRE</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          KEA SHOP - PRODUITS COSMÉTIQUES ET SOINS CAPILLAIRES{'\n'}NATURELS
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 16,
  },
  imageContainer: {
    width: width,
    height: width * 1.1, // Aspect ratio proche de celui de l'image
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ctaButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 10,
    color: '#888888',
    fontWeight: '600',
    lineHeight: 16,
  },
});
