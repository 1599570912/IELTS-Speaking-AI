/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, useColorScheme } from 'react-native';
import RecordingScreen from './src/components/RecordingScreen';
import RecordingsListScreen from './src/components/RecordingsListScreen';

const Tab = createBottomTabNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F7',
          },
          headerStyle: {
            backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F7',
          },
          headerTintColor: isDarkMode ? '#FFFFFF' : '#000000',
        }}
      >
        <Tab.Screen
          name="Record"
          component={RecordingScreen}
          options={{
            tabBarLabel: 'Record',
            headerTitle: 'IELTS Speaking Practice',
          }}
        />
        <Tab.Screen
          name="Recordings"
          component={RecordingsListScreen}
          options={{
            tabBarLabel: 'My Recordings',
            headerTitle: 'My Recordings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
