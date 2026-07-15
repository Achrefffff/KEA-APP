import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { searchProducts } from '@/services/shopify';
import { AppProduct } from '@/services/shopify/types';

import { SearchBar } from '@/components/ui/SearchBar';
import { SearchHistory } from '@/components/search/SearchHistory';
import { SearchSuggestions } from '@/components/search/SearchSuggestions';
import { SearchResults } from '@/components/search/SearchResults';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  
  // Simulation de l'historique et des suggestions
  const [history, setHistory] = useState(['Shampoing', 'Crème visage', 'Coffret cadeau']);
  const popularSearches = ['Sérum hydratant', 'Masque capillaire', 'Nouveautés', 'Vegan'];

  const [results, setResults] = useState<AppProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    // Si la recherche est vide ou trop courte, on nettoie les résultats
    if (query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Debounce de 500ms
    const timeoutId = setTimeout(async () => {
      const fetchedResults = await searchProducts(query, 20);
      setResults(fetchedResults);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelectSearch = (term: string) => {
    setQuery(term);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      <View style={styles.header}>
        <SearchBar 
          value={query} 
          onChangeText={setQuery} 
          autoFocus={true} 
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {query.length > 0 ? (
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : (
            <SearchResults query={query} results={results} />
          )
        ) : (
          <View>
            <SearchHistory 
              searches={history} 
              onSelect={handleSelectSearch} 
              onClear={handleClearHistory} 
            />
            <SearchSuggestions 
              suggestions={popularSearches} 
              onSelect={handleSelectSearch} 
            />
          </View>
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.backgroundElement,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  loadingContainer: {
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
