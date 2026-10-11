import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HomeAluno() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.badge}>⚔️ REINO DE TRONUS</Text>
        <Text style={styles.title}>Jornada do Conhecimento</Text>
        <Text style={styles.subtitle}>Sua aventura educacional começa aqui!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  badge: {
    color: '#FFD700', // Dourado
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 16,
    textAlign: 'center',
  },
});