import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import menu from '../img/Back.png';
import littleLemonLogo from '../img/littleLemonLogo.png';
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import { set } from 'lodash';

export default function Header({navigation, eventEmitter}) {
  const [image, setImage] = useState(null);
  const [firstName, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);

  const fetchProfileData = async () => {
    try {
        setImage(null);
        setName('');
        setLastName('');
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedLastName = await AsyncStorage.getItem('lastName');
        const storedImage = await AsyncStorage.getItem('image');

        if (storedImage !== null) setImage(JSON.parse(storedImage));
        if (storedFirstName !== null) setName(storedFirstName);
        if (storedLastName !== null) setLastName(storedLastName);
      } catch (error) {
        console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
        fetchProfileData();
      setCanGoBack(navigation.canGoBack());
  
      return () => {
      };
    }, [])
  );

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('imageUpdated', fetchProfileData);
  
    return () => {
      subscription.remove();
    };
  }, []);

    return (
      <View style={styles.header}>
        <Pressable onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}>
           
          <Image style={styles.icon} source={canGoBack ? menu : {uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}}
            resizeMode="contain"
            accessible={true}
            aria-label={'Burger Menu'}/>
        </Pressable>
        <Image style={styles.logo} source={littleLemonLogo} 
          resizeMode="contain"
          accessible={true}
          aria-label={'Little Lemon Logo'}/>
        <Pressable onPress={
          () => navigation.navigate('Profile')
        }>
          {image ? 
          <Image style={[styles.icon, styles.profile]} source={{uri: image}}/> : 
          <View style={[styles.icon, styles.profile]}>
            <Text style={styles.letterPicture}>{firstName[0]}{lastName[0]}</Text> 
          </View>
          }
        </Pressable>
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
    letterPicture: {
      fontSize: 18,
      color: "#495E57",
      textAlign: "center",
      lineHeight: 50,
    },
  });