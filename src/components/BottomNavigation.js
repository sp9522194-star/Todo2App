import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';

import {Fonts} from '../theme/font';
import {FontSize} from '../theme/size';

function BottomNavigation({
  navigation,
  activeScreen,
  theme,
}) {
  const tabs = [
    {
      name: 'Home',
      icon: 'home-outline',
      activeIcon: 'home',
    },
    {
      name: 'TodoList',
      icon: 'checkmark-circle-outline',
      activeIcon: 'checkmark-circle',
    },
    {
      name: 'Timeline',
      icon: 'calendar-outline',
      activeIcon: 'calendar',
    },
    {
      name: 'Profile',
      icon: 'person-outline',
      activeIcon: 'person',
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderTopColor: theme.border || '#DDDDDD',
        },
      ]}>
      {tabs.map(tab => {
        const isActive = activeScreen === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(tab.name)}>
            
            <Ionicons
              name={
                isActive
                  ? tab.activeIcon
                  : tab.icon
              }
              size={25}
              color={
                isActive
                  ? theme.button
                  : theme.text
              }
            />

            <Text
              style={[
                styles.label,
                {
                  color: isActive
                    ? theme.button
                    : theme.text,
                },
              ]}>
              {tab.name === 'TodoList'
                ? 'To-Do'
                : tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingBottom: 5,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.small,
    marginTop: 4,
  },
});

export default BottomNavigation;