import { Redirect } from 'expo-router';

export default function Index() {
  // Aponta diretamente para o grupo do aluno
  return <Redirect href="/(aluno)" />;
}