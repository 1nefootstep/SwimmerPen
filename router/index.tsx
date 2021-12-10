import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Box, Text } from 'native-base';
import CameraScreen from '../screens/CameraScreen';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();

function PlaceholderScreen() {
  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <Text>Placeholder</Text>
    </Box>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'SwimmerPen', headerShown: true, headerTitleAlign: 'center'}}
        />
        <Stack.Group
          screenOptions={({ navigation }) => ({
            headerShown: false
          })}
        >
          <Stack.Screen
            name="CameraScreen"
            component={CameraScreen}
          />
        </Stack.Group>

        <Stack.Screen name="Annotation" component={PlaceholderScreen} />
        <Stack.Screen name="Result" component={PlaceholderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
