import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function Detection({ route }) {
  const { predictions } = route.params; // Get predictions from route params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detection Results</Text>
      {predictions && predictions.length > 0 ? (
        <FlatList
          data={predictions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.predictionItem}>
              <Text style={styles.predictionText}>{item}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noResultsText}>No predictions received.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1E90FF',
  },
  predictionItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  predictionText: {
    fontSize: 18,
    color: '#333',
  },
  noResultsText: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
});
