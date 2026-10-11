import { StyleSheet, Text, View } from 'react-native';

export default function AdminHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡️ Painel do Professor / ADM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121214',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});