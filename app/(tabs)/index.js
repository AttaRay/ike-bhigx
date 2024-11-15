import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screen components
import Home from './home';
import Receipt from './receipt';
import Order from './orders';

// Stack Navigator for the Checkout flow
const Stack = createStackNavigator();
function CheckoutStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Receipt" component={Receipt} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Checkout"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Checkout') {
                iconName = focused ? 'cart' : 'cart-outline';
              } else if (route.name === 'Orders') {
                iconName = focused ? 'list' : 'list-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#ff4d4d',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen
            name="Checkout"
            component={CheckoutStack}
            options={{ headerShown: false }}
          />
          <Tab.Screen name="Orders" component={Order} options={{ headerShown: true }} />
        </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

