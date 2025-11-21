import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import BreedListScreen from '../screens/BreedListScreen';
import BreedDetailScreen from '../screens/BreedDetailScreen';
import SightingsListScreen from '../screens/SightingsListScreen';
import SightingDetailScreen from '../screens/SightingDetailScreen';
import SightingFormScreen from '../screens/SightingFormScreen';
import TraitMatcherScreen from '../screens/TraitMatcherScreen';
import { COLORS } from '../utils/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = 'paw';

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Breeds') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'Sightings') {
                        iconName = focused ? 'list' : 'list-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Breeds" component={BreedListScreen} />
            <Tab.Screen name="Sightings" component={SightingsListScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: COLORS.primary },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                <Stack.Screen
                    name="Main"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BreedDetail"
                    component={BreedDetailScreen}
                    options={{ title: 'Breed Details' }}
                />
                <Stack.Screen
                    name="SightingForm"
                    component={SightingFormScreen}
                    options={{ title: 'Log Sighting' }}
                />
                <Stack.Screen
                    name="SightingDetail"
                    component={SightingDetailScreen}
                    options={{ title: 'Sighting Details' }}
                />
                <Stack.Screen
                    name="TraitMatcher"
                    component={TraitMatcherScreen}
                    options={{ title: 'Identify Dog' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
