import { StyleSheet, Text, View, Image, Pressable, TextInput, ScrollView } from 'react-native';
import { Keyboard, Animated } from 'react-native';

import { useEffect, useState } from 'react';
import React from 'react';
import littleLemonLogo from '../img/littleLemonLogo.png';
import food from '../img/Bruschetta.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Onboarding({navigation}) {
  const [firstName, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const nameRef = React.useRef(null);
  const emailRef = React.useRef(null);

  const topImageHeight = new Animated.Value(150); // Initial value for height: 100

  useEffect(() => {
    // Add keyboard event listeners
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    // Cleanup function
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const keyboardDidShow = () => {
    Animated.timing(topImageHeight, {
      toValue: 0, // Reduce height to 0
      duration: 200, // Duration of the animation
      useNativeDriver: false, // Can't use native driver for height animation
    }).start();
  };

  const keyboardDidHide = () => {
    Animated.timing(topImageHeight, {
      toValue: 150, // Increase height to original value
      duration: 200, // Duration of the animation
      useNativeDriver: false, // Can't use native driver for height animation
    }).start();
  };

  const onChangeName = (text) => {
    if (text.trim() !== '' && /^[a-zA-Z]+$/.test(text)) {
      setName(text);
      setNameError(false);
    } else {
      setName(text);
      setNameError(true);
    }
  };

  const onChangeEmail = (text) => {
    if (text.trim() !== '' && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(text)) {
      setEmail(text);
      setEmailError(false);
    } else {
      setEmail(text);
      setEmailError(true);
    }
  };
  let disabledContinue = !firstName || !email || nameError || emailError;
  
    return (
      <ScrollView
        style={styles.mainContainer}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.header}>
        <Image style={styles.logo} source={littleLemonLogo} 
          resizeMode="contain"
          accessible={true}
          aria-label={'Little Lemon Logo'}/>
        </View>
        <View style={styles.formContainer}> 
          <Animated.Image 
            source={food} 
            style={{...styles.imageTop, height: topImageHeight}} 
            resizeMode='cover' 
            aria-label={'Bruschetta'}
          />
          <Text style={styles.mainText}>Let us get to know you</Text>
        <View style={styles.form}>
          <Text style={styles.tooltip}>First Name</Text>
          <TextInput
            ref={nameRef}
            style={nameError ? styles.inputError : styles.input}
            onChangeText={onChangeName}
            value={firstName}
            inputMode="text"
            placeholder="first name"
            onSubmitEditing={() => emailRef.current.focus()}
            returnKeyType="next"
          />
        </View>
        <View style={styles.form}>
          <Text style={styles.tooltip}>E-Mail</Text>
          <TextInput
            ref={emailRef}
            style={emailError ? styles.inputError : styles.input}
            onChangeText={onChangeEmail}
            value={email}
            placeholder="email"
            inputMode="email"
            keyboardType="email-address"
            returnKeyType="done"
          />
        </View>
          <SubmitButton 
            disabled={disabledContinue} 
            firstName={firstName} 
            email={email} 
            navigation={navigation} 
            setName={setName} 
            setEmail={setEmail} 
          />
        </View>
        
      </ScrollView>
    );
  }

  const SubmitButton = ({ disabled, firstName, email, navigation, setName, setEmail }) => (
    <Pressable
      style={disabled ? styles.buttonDisabled  : styles.button}
      onPress={async () => {
        try {
          await AsyncStorage.setItem('firstName', firstName);
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('onboardingCompleted', 'true');
          setName(''); // reset the name field
          setEmail(''); // reset the email field
          navigation.reset({
            index: 0,
            routes: [{ name: 'WelcomeScreen' }],
          });
        } catch (error) {
          console.error(error);
        }
      }}
      disabled={disabled}
    >
      <Text style={styles.text}>Next</Text>
    </Pressable>
  );

  const styles = StyleSheet.create({
    mainText: {
      fontSize: 26,
      fontFamily: "Karla",
      alignSelf: "center",
      margin:20,
      color: "#495E57",
    },
    mainContainer: {
      flexDirection: "column",
      flex: 1,
    },
    input: {
      height: 40,
      margin: 12,
      marginVertical: 3,
      borderWidth: 2,
      padding: 10,
      borderColor: "#495E57",
      color: "#495E57",
      fontFamily: "Karla",
      borderRadius: 16
    },
    inputError: {
      height: 40,
      margin: 12,
      padding: 10,
      borderWidth: 3,
      borderColor: "#FF0000",
      color: "#495E57",
      fontFamily: "Karla",
      borderRadius: 16
    },
    form: {
      flexDirection: "column",
    },
    tooltip: {
      fontSize: 16,
      fontFamily: "Karla",
      margin: 12,
      marginVertical: 3,
      color: "#495E57",
    },
    header: {
      paddingTop: 35,
      flexDirection: "row",
      backgroundColor: '#FBDABB',
      justifyContent: "space-between",
    },
    logo: {flex: 1,
      height: 50,
      width: "auto",
      marginTop: 10,
      marginBottom: 10,
    },
    text: {
      fontSize: 20,
      fontFamily: "Karla",
      margin: 15,
      color: "#FBDABB",
    },
    button: {
      borderRadius: 16,
      backgroundColor: "#495E57",
      margin: 12,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-end"
    },
    buttonDisabled: {
      borderRadius: 16,
      backgroundColor: "grey",
      margin: 12,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-end"
    },
    formContainer: {
      flex: 0.7,
      flexDirection: "column",
      marginTop: 0,
      paddingTop: 0,
    },
    footerContainer: {
      flex: 0.2,
    },
    imageTop: {
      width: "100%", // this will make the image cover the entire width without distorting its aspect ratio
    },
  });