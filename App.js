import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

import Header from './components/Header'
import WelcomeScreen from './screens/WelcomeScreen'
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator();

function App() {
  const [state, setState] = useState({
    isLoading: true,
    isOnboardingCompleted: false,
  });

  let [fontsLoaded] = useFonts({
    Karla: require('./assets/fonts/Karla.ttf'),
    MarkaziText: require('./assets/fonts/MarkaziText.ttf'),
  });

  useEffect(() => {
    const fetchAsyncStorage = async () => {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      setState({
        isLoading: false,
        isOnboardingCompleted: onboardingCompleted === 'true',
      });
    };

    if (fontsLoaded) {
      fetchAsyncStorage();
    }
  }, [fontsLoaded]);

  if (state.isLoading || !fontsLoaded) {
    return <SplashScreen />;
  }

return (
  <NavigationContainer>
    <Stack.Navigator 
    initialRouteName={state.isOnboardingCompleted ? "WelcomeScreen" : "Onboarding"} 
    >
      <Stack.Screen 
      name="Onboarding" 
      component={Onboarding}
      options={{headerShown: false}}
    />
    <Stack.Screen 
      name="Profile" 
      component={Profile}
      options={({ navigation }) => ({
        header: () => <Header navigation={navigation} />
      })}
    />
    <Stack.Screen 
      name="WelcomeScreen" 
      component={WelcomeScreen}
      options={({ navigation }) => ({
        header: () => <Header navigation={navigation} />
      })}
    />
    </Stack.Navigator>
  </NavigationContainer>
  );
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFEE',
  },
  footerContainer: { backgroundColor: '#EDEFEE' },
  header: {
    flex: 0.20,
  },
  mainContainer: {
    flex: 0.7,
  }
});
