import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { TextInput } from 'react-native-web';
import React from 'react';

export default function Onboarding() {
  const [name, onChangeName] = React.useState('');
  const [email, onChangeEmail] = React.useState('');
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.mainText}>Let us get to know you</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeName}
          value={name}
          inputMode="text"
          placeholder="first name"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="email"
          inputMode="email"
          keyboardType="email-address"
        />
        <Pressable></Pressable>
      </View>
    );
  }

  const styles = StyleSheet.create({
    mainText: {
      fontSize: 26,
      fontFamily: "Karla",
      alignSelf: "center",
      margin:20,
      color: "#495E57",
      fontWeight: "bold"
    },
    mainContainer: {
      flexDirection: "column",
      justifyContent: "center"
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 2,
      padding: 10,
      borderColor: "#495E57",
      color: "#495E57",
      fontFamily: "Karla",
      borderRadius: 16
    },
  });