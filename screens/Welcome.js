import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

function Welcome({ navigation, theme }) {
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View
      style={[
        Styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Image
        source={{
          uri: 'https://static.vecteezy.com/system/resources/thumbnails/070/941/364/small/stylized-3d-clipboard-illustrating-task-completion-representing-productivity-and-organization-in-png.png',
        }}
        style={Styles.image}
      />

      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          alignItems: 'center',
        }}
      >
        <Text
          style={[
            Styles.title,
            { color: theme.text },
          ]}
        >
          To-Do List
        </Text>

        <Text
          style={[
            Styles.subtitle,
            { color: theme.text },
          ]}
        >
          Organize your day, one task at a time.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs')}
        >
          <LinearGradient
            colors={['#9c35ae', '#635BFF']}
            style={Styles.button}
          >
            <Text style={Styles.buttonText}>
              Get Started
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: 450,
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  title: {
    marginTop: 6,
    fontSize: 40,
    fontWeight: 'bold',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 25,
    lineHeight: 26,
  },

  button: {
    marginTop: 60,
    width: 300,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Welcome;
