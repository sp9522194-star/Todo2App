import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,

} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';

import { Fonts } from '../src/theme/font';
import { FontSize } from '../src/theme/size';

function Home({ navigation, theme, darkMode, toggleTheme }) {

  const openGoogleMaps = async () => {
    try {
      await Linking.openURL(
        'https://www.google.com/maps'
      );
    } catch (error) {
      console.log('Maps Error:', error);

      Alert.alert(
        'Error',
        'Google Maps could not be opened.'
      );
    }
  };

  const requestLocationPermission = async () => {

    if (Platform.OS !== 'android') {
      openGoogleMaps();
      return;
    }

    try {

      const granted =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs your location permission.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );

      if (
        granted ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {

        Alert.alert(
          'Permission Granted',
          'Location permission granted!',
          [
            {
              text: 'Open Maps',
              onPress: openGoogleMaps,
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );

      } else {

        Alert.alert(
          'Permission Denied',
          'Location permission is required.'
        );

      }

    } catch (error) {

      console.log(
        'Location Permission Error:',
        error
      );

      Alert.alert(
        'Error',
        'Location permission error.'
      );
    }
  };

  return (

    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >

      

      <Text
        style={[
          styles.title,
          {
            color: theme.text,
          },
        ]}
      >
        MY TO-DO LIST
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: theme.text,
          },
        ]}
      >
        Stay organized and complete your tasks.
      </Text>

      <View style={styles.toggleContainer}>

        <Ionicons
          name={darkMode ? 'moon' : 'sunny'}
          size={22}
          color={theme.text}
        />

        <Text
          style={[
            styles.modeText,
            {
              color: theme.text,
            },
          ]}
        >
          Dark Mode
        </Text>

        <Switch
          value={darkMode}
          onValueChange={toggleTheme}
          trackColor={{
            false: '#CCCCCC',
            true: '#9C35AE',
          }}
          thumbColor="#FFFFFF"
        />

      </View>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={requestLocationPermission}
        activeOpacity={0.7}
      >

        <Ionicons
          name="location-outline"
          size={22}
          color="#FFFFFF"
        />

        <Text style={styles.locationButtonText}>
          Open Google Maps
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.taskButton}
        onPress={() =>
          navigation.navigate('TodoList')
        }
        activeOpacity={0.7}
      >

        <Ionicons
          name="add-circle-outline"
          size={22}
          color="#FFFFFF"
        />

        <Text style={styles.taskButtonText}>
          Add New Task
        </Text>

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },


  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.title,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.medium,
    textAlign: 'center',
    marginTop: 10,
  },

  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    gap: 10,
  },

  modeText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.medium,
  },

  locationButton: {
    marginTop: 25,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },

  locationButtonText: {
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    fontSize: FontSize.medium,
  },

  taskButton: {
    marginTop: 15,
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },

  taskButtonText: {
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    fontSize: FontSize.medium,
  },

});

export default Home;