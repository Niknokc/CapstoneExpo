import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Keyboard, Animated, ScrollView, Image } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useEffect, useState, } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { DeviceEventEmitter } from 'react-native';

const FormField = ({ editMode, error, value, onChange, inputMode, placeholder, onSubmitEditing, returnKeyType }) => (
    <View style={styles.form}>
      <Text style={styles.tooltip}>{placeholder}</Text>
      {!editMode ? (
        <Text style={styles.regularField}>{value}</Text>
      ) : (
        <TextInput
          style={error ? styles.inputError : styles.input}
          onChangeText={onChange}
          value={value}
          inputMode={inputMode}
          placeholder={placeholder.toLowerCase()}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
        />
      )}
    </View>
  );

const Profile = ({navigation}) => {
    const [firstName, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [image, setImage] = useState(null);
    const [orderCheckBox, setOrderCheckBox] = useState(false);
    const [passwordCheckBox, setPasswordCheckBox] = useState(false);
    const [specialCheckBox, setSpecialCheckBox] = useState(false);
    const [newsletterCheckBox, setNewsletterCheckBox] = useState(false);

    const [firstNameError, setFirstNameError] = React.useState(false);
    const [lastNameError, setLastNameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [phoneError, setPhoneError] = React.useState(false);

    const disabled = phoneError || emailError || lastNameError || firstNameError;

    const topImageHeight = new Animated.Value(150);

    const keyboardDidShow = () => {
        Animated.timing(topImageHeight, {
          toValue: 0, // Reduce height to 0
          duration: 200, // Duration of the animation
          useNativeDriver: false,
        }).start();
    };

    const keyboardDidHide = () => {
        Animated.timing(topImageHeight, {
          toValue: 150, // Increase height to original value
          duration: 200, // Duration of the animation
          useNativeDriver: false,
        }).start();
    };

    const onChangeFirstName = (text) => {
        if (text.trim() !== '' && /^[a-zA-Z]+$/.test(text)) {
            setName(text);
            setFirstNameError(false);
        } else {
            setName(text);
            setFirstNameError(true);
        }
    };

    const onChangeLastName = (text) => {
        if (text.trim() !== '' && /^[a-zA-Z]+$/.test(text)) {
            setLastName(text);
            setLastNameError(false);
        } else {
            setLastName(text);
            setLastNameError(true);
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

    const onChangePhone = (text) => {

        const phoneRegex = /^(\+1|1)?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        if (text.trim() !== '' && phoneRegex.test(text)) {
            setPhone(text);
            setPhoneError(false);
        } else {
            setPhone(text);
            setPhoneError(true);
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };

    const removeImage = () => {
        setImage(null);
    }

    const fetchProfileData = async () => {
        try {
            const storedFirstName = await AsyncStorage.getItem('firstName');
            const storedLastName = await AsyncStorage.getItem('lastName');
            const storedEmail = await AsyncStorage.getItem('email');
            const storedPhone = await AsyncStorage.getItem('phone');
            const storedImage = await AsyncStorage.getItem('image');
            const storedOrderCheckBox = await AsyncStorage.getItem('orderCheckBox');
            const storedPasswordCheckBox = await AsyncStorage.getItem('passwordCheckBox');
            const storedSpecialCheckBox = await AsyncStorage.getItem('specialCheckBox');
            const storedNewsletterCheckBox = await AsyncStorage.getItem('newsletterCheckBox');

            if (storedImage !== null) setImage(JSON.parse(storedImage));
            if (storedFirstName !== null) setName(storedFirstName);
            if (storedLastName !== null) setLastName(storedLastName);
            if (storedEmail !== null) setEmail(storedEmail);
            if (storedPhone !== null) setPhone(storedPhone);
            if (storedOrderCheckBox !== null) setOrderCheckBox(JSON.parse(storedOrderCheckBox));
            if (storedPasswordCheckBox !== null) setPasswordCheckBox(JSON.parse(storedPasswordCheckBox));
            if (storedSpecialCheckBox !== null) setSpecialCheckBox(JSON.parse(storedSpecialCheckBox));
            if (storedNewsletterCheckBox !== null) setNewsletterCheckBox(JSON.parse(storedNewsletterCheckBox));

        } catch (error) {
            console.error(error);
        }
    };

    const save = async () => {
        try {
            await AsyncStorage.setItem('firstName', firstName);
            await AsyncStorage.setItem('lastName', lastName);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('phone', phone);
            await AsyncStorage.setItem('image', JSON.stringify(image));
            await AsyncStorage.setItem('orderCheckBox', JSON.stringify(orderCheckBox));
            await AsyncStorage.setItem('passwordCheckBox', JSON.stringify(passwordCheckBox));
            await AsyncStorage.setItem('specialCheckBox', JSON.stringify(specialCheckBox));
            await AsyncStorage.setItem('newsletterCheckBox', JSON.stringify(newsletterCheckBox));
            editMode && setEditMode(!editMode);
            DeviceEventEmitter.emit('imageUpdated');
        } catch (error) {
            console.error('Failed to save profile data', error);
        }
    }
    
    const cancel = async () => {
        try {
            const storedFirstName = await AsyncStorage.getItem('firstName');
            const storedLastName = await AsyncStorage.getItem('lastName');
            const storedEmail = await AsyncStorage.getItem('email');
            const storedPhone = await AsyncStorage.getItem('phone');
            const storedImage = await AsyncStorage.getItem('image');
            const storedOrderCheckBox = await AsyncStorage.getItem('orderCheckBox');
            const storedPasswordCheckBox = await AsyncStorage.getItem('passwordCheckBox');
            const storedSpecialCheckBox = await AsyncStorage.getItem('specialCheckBox');
            const storedNewsletterCheckBox = await AsyncStorage.getItem('newsletterCheckBox');
    
            if (storedFirstName !== null) setName(storedFirstName);
            if (storedLastName !== null) setLastName(storedLastName);
            if (storedEmail !== null) setEmail(storedEmail);
            if (storedPhone !== null) setPhone(storedPhone);
            if (storedImage !== null) setImage(JSON.parse(storedImage));
            if (storedOrderCheckBox !== null) setOrderCheckBox(JSON.parse(storedOrderCheckBox));
            if (storedPasswordCheckBox !== null) setPasswordCheckBox(JSON.parse(storedPasswordCheckBox));
            if (storedSpecialCheckBox !== null) setSpecialCheckBox(JSON.parse(storedSpecialCheckBox));
            if (storedNewsletterCheckBox !== null) setNewsletterCheckBox(JSON.parse(storedNewsletterCheckBox));
            editMode && setEditMode(!editMode);
        } catch (error) {
            console.error('Failed to load profile data', error);
        }
    }

    useFocusEffect(
    React.useCallback(() => {

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
        fetchProfileData();
      
  
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, [])
  );

    return (
        <ScrollView
        style={styles.container}
        contentContainerStyle={{  
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
        }}
        keyboardDismissMode="on-drag"
        >
            <View style={styles.topView}>
                <Text style={styles.title}>Personal Information</Text>
                {!editMode && (<Pressable 
                onPress={() => {
                    setEditMode(!editMode);
                }}
                >
                    <Text style={styles.tooltip}>Edit</Text>
                </Pressable>)}
            </View>
            <Animated.View style={[styles.avatarContainer, { height: topImageHeight }]}>
            {editMode && image &&
            <Pressable onPress={pickImage} disabled={!editMode} style={styles.changeButton}>
                <Text style={styles.buttonText}>Change</Text>
            </Pressable>
            }

            <Pressable onPress={pickImage} disabled={!editMode}>
                {image ? (
                <Animated.Image source={{ uri: image }} style={[styles.avatarImage, { height: topImageHeight }]} />
                ) : (
                <Animated.View style={[styles.avatar, { height: topImageHeight }]}>
                    <Animated.Text style={[styles.letterPicture, { height: topImageHeight }]}>
                    {firstName[0]}{lastName[0]}
                    </Animated.Text>
                </Animated.View>
                )}
            </Pressable>
            {editMode && image &&
            <Pressable onPress={removeImage} disabled={!editMode} style={styles.removeButton}>
                <Text style={styles.buttonText}>Remove</Text>
            </Pressable>
            }
            </Animated.View>
            
            <View style={styles.formContainer}>
                <FormField
                    editMode={editMode}
                    error={firstNameError}
                    value={firstName}
                    onChange={onChangeFirstName}
                    inputMode="text"
                    placeholder="First Name"
                    returnKeyType="next"
                />
                <FormField
                    editMode={editMode}
                    error={lastNameError}
                    value={lastName}
                    onChange={onChangeLastName}
                    inputMode="text"
                    placeholder="Last Name"
                    returnKeyType="next"
                />
                <FormField
                    editMode={editMode}
                    error={emailError}
                    value={email}
                    onChange={onChangeEmail}
                    inputMode="email"
                    placeholder="E-mail"
                    returnKeyType="next"
                />
                <FormField
                    editMode={editMode}
                    error={phoneError}
                    value={phone}
                    onChange={onChangePhone}
                    inputMode="tel"
                    placeholder="Phone Number"
                    returnKeyType="next"
                />
            </View>
            <View style={styles.topView}>
                <Text style={styles.title}>Email notifications</Text>
            </View>
            <View style={styles.form}>
                <View style={styles.checkboxView}>
                    <Checkbox disabled={!editMode} value={orderCheckBox} onValueChange={(newValue) => setOrderCheckBox(newValue)} color={orderCheckBox ? '#495E57' : undefined}/> 
                    <Text style={styles.tooltip}>Order statuses</Text>
                </View>

                <View style={styles.checkboxView}>
                    <Checkbox disabled={!editMode} value={passwordCheckBox} onValueChange={(newValue) => setPasswordCheckBox(newValue)} color={passwordCheckBox ? '#495E57' : undefined}/> 
                    <Text style={styles.tooltip}>Password changes</Text>
                </View>
                
                <View style={styles.checkboxView}>
                    <Checkbox disabled={!editMode} value={specialCheckBox} onValueChange={(newValue) => setSpecialCheckBox(newValue)} color={specialCheckBox ? '#495E57' : undefined}/> 
                    <Text style={styles.tooltip}>Special offers</Text>
                </View>
                
                <View style={styles.checkboxView}>
                    <Checkbox disabled={!editMode} value={newsletterCheckBox} onValueChange={(newValue) => setNewsletterCheckBox(newValue)} color={newsletterCheckBox ? '#495E57' : undefined}/> 
                    <Text style={styles.tooltip}>Newsletter</Text>
                </View>
            </View>
            
            <View style={styles.bottomView}>

                <Pressable 
                onPress={async () => {
                    try {
                        const keys = await AsyncStorage.getAllKeys();
                        if (keys.length > 0) {
                            await AsyncStorage.clear();
                        }
                        // Clear all states
                        setName('');
                        setLastName('');
                        setEmail('');
                        setPhone('');
                        setImage(null);
                        setOrderCheckBox(false);
                        setPasswordCheckBox(false);
                        setSpecialCheckBox(false);
                        setNewsletterCheckBox(false);
                        DeviceEventEmitter.emit('imageUpdated')
                        navigation.navigate('Onboarding');
                    } catch (error) {
                    console.error(error);
                    }
                }}

                style={styles.logoutButton}
                >
                    <Text style={styles.tooltip}>Sign Out</Text>
                </Pressable>

                {editMode && <View style={styles.applyButtonsView}>
                    <Pressable style={styles.cancelButton} onPress={cancel}>
                        <Text style={{color:"grey", fontFamily:"Karla", fontWeight:"bold"}}>Discard Changes</Text>
                    </Pressable>
                    <Pressable style={[styles.confirmButton, disabled && {backgroundColor: "red"}]} onPress={save} disabled={disabled}>
                        <Text style={{color:"white", fontFamily:"Karla", fontWeight:"bold"}}>Save Changes</Text>
                    </Pressable>
                </View>}
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 12,
        color: "#495E57",
        fontFamily: "Karla",
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
        borderRadius: 16, 
    },
    regularField: {
        height: 40,
        margin: 12,
        marginVertical: 3,
        padding: 10,
        borderColor: "#495E57",
        color: "#495E57",
        fontFamily: "Karla",
        borderRadius: 16,
        backgroundColor: "#E0E0E0",
    },
    inputError: {
        height: 40,
        margin: 12,
        padding: 10,
        borderWidth: 3,
        borderColor: "#FF0000",
        color: "#495E57",
        fontFamily: "Karla",
        borderRadius: 16,
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
    formContainer: {
        flexDirection: "column",
        marginTop: 0,
        paddingTop: 0,
        width: "100%",
    },
    topView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    checkboxView: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        margin: 12,
        borderRadius: 5,
        color: "#495E57",
    },
    avatar: {
        borderRadius: 75,
        backgroundColor: "#EE9972",
        color: "#495E57",
    },
    avatarImage: {
        borderRadius: 75,
        backgroundColor: "#EE9972",
        width: 150,
        borderColor: "white",
    },
    avatarContainer: {
        margin: 12,
        alignSelf: "center",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    letterPicture: {
        width: 150,
        height: 150,
        fontSize: 48,
        color: "#495E57",
        textAlign: "center",
        lineHeight: 150,
    },
    applyButtonsView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#495E57",
    },
    logoutButton: {
        borderRadius: 16,
        backgroundColor: "#F4CE14",
        margin: 12,
        width: "90%",
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButton: {
        borderRadius: 16,
        backgroundColor: "#D0D0D0",
        borderColor: "#495E57",
        margin: 12,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-end",
        padding: 12,
        fontFamily: "Karla",
        fontWeight: "bold",
    },
    confirmButton: {
        borderRadius: 16,
        backgroundColor: "#495E57",
        margin: 12,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-end",
        padding: 12,
        fontFamily: "Karla",
        fontWeight: "bold",
        color: "#FBDABB",
    },
    bottomView: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
    },
    changeButton: {
        borderRadius: 16,
        backgroundColor: "#495E57",
        margin: 12,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
      },
    removeButton: { 
        borderRadius: 16,
        backgroundColor: "#FF0000",
        margin: 12,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        fontFamily: "Karla",
    },
    buttonText: {
        color: "#FBDABB",
        fontFamily: "Karla",
        fontWeight: "bold",
      },
});

export default Profile;