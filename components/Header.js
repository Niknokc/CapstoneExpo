import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function Header() {
    return (
      <View style={styles.header}>
        <Image style={styles.icon} source={require('..\\img\\image.png')}
          resizeMode="contain"
          accessible={true}
          aria-label={'Burger Menu'}/>
        <Image style={styles.logo} source={require('..\\img\\littleLemonLogo.png')} 
          resizeMode="contain"
          accessible={true}
          aria-label={'Little Lemon Logo'}/>
        <Image style={[styles.icon, styles.profile]}/>
      </View>
    );
  }

  const styles = StyleSheet.create({
    icon: {
      height: 50,
      width: 50,
      margin: 10,
    },
    profile: {
      borderRadius: 25,
      backgroundColor: "#EE9972",
    },
    header: {
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
  });