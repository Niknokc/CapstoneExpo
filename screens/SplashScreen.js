import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
    useEffect(() => {
        // Add any necessary logic or async tasks here
        // For example, you can check if the user is authenticated and navigate accordingly
        // setTimeout(() => {
        //   // Navigate to the next screen
        // }, 2000);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/splash.png')}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    image: {
        width: '80%',
        height: '80%',
    },
});

export default SplashScreen;