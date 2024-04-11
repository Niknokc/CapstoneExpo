import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Header from './components/Header'
import WelcomeScreen from './screens/WelcomeScreen'
import Onboarding from './screens/Onboarding';

export default function App() {
  return (
    <View style={styles.container}>
      <Header style={styles.header}/>
      <Onboarding style={styles.mainContainer}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFEE',
  },
  footerContainer: { backgroundColor: '#EDEFEE' },
  header: {
    flex: 0.15,
  },
  mainContainer: {
    flex: 0.8,
  }
});
