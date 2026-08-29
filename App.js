
import React, {useState, useEffect} from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import Ionicons from '@react-native-vector-icons/ionicons';

import notifee, {
  AndroidImportance,
} from '@notifee/react-native';

import Home from './screens/Home';
import Todolist from './screens/Todolist';
import Timeline from './screens/Timeline';
import Welcome from './screens/Welcome';
import Profile from './screens/Profile';

import {lightTheme, darkTheme} from './Theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function BottomTabs({
  theme,
  darkMode,
  toggleTheme,
  tasks,
  setTasks,
}) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,

        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#888888',

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 5,
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          }

          if (route.name === 'Timeline') {
            iconName = focused
              ? 'calendar'
              : 'calendar-outline';
          }

          if (route.name === 'Profile') {
            iconName = focused
              ? 'person'
              : 'person-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}>

      <Tab.Screen name="Home">
        {props => (
          <Home
            {...props}
            theme={theme}
            darkMode={darkMode}
            toggleTheme={toggleTheme}
          />
        )}
      </Tab.Screen>


      <Tab.Screen name="Timeline">
        {props => (
          <Timeline
            {...props}
            theme={theme}
            tasks={tasks}
          />
        )}
      </Tab.Screen>


      <Tab.Screen name="Profile">
        {props => (
          <Profile
            {...props}
            theme={theme}
          />
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
}


function App() {

  const [darkMode, setDarkMode] = useState(false);

  const [tasks, setTasks] = useState([]);

  const theme = darkMode
    ? darkTheme
    : lightTheme;


  const toggleTheme = () => {
    setDarkMode(previous => !previous);
  };


  useEffect(() => {

    const showWelcomeNotification = async () => {

      try {

        await notifee.requestPermission();

        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });

        await notifee.displayNotification({
          title: 'Welcome 👋',
          body: 'Welcome to your To-Do List App!',

          android: {
            channelId: 'default',

            pressAction: {
              id: 'default',
            },
          },
        });

      } catch (error) {

        console.log(
          'Notification Error:',
          error,
        );

      }

    };

    showWelcomeNotification();

  }, []);


  return (
    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>


        <Stack.Screen name="Welcome">
          {props => (
            <Welcome
              {...props}
              theme={theme}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
            />
          )}
        </Stack.Screen>


        <Stack.Screen name="MainTabs">
          {props => (
            <BottomTabs
              {...props}
              theme={theme}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              tasks={tasks}
              setTasks={setTasks}
            />
          )}
        </Stack.Screen>


        <Stack.Screen name="TodoList">
          {props => (
            <Todolist
              {...props}
              theme={theme}
              tasks={tasks}
              setTasks={setTasks}
            />
          )}
        </Stack.Screen>

      </Stack.Navigator>

    </NavigationContainer>
  );
}


export default App;
