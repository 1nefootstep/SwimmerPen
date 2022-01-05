import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from '../screens/CameraScreen';
import Home from '../screens/Home';
import AnnotationScreen from '../screens/AnnotationScreen';
import ResultScreen from '../screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'SwimmerPen',
            headerShown: true,
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Group
          screenOptions={({ navigation }) => ({
            headerShown: false,
          })}
        >
          <Stack.Screen name="CameraScreen" component={CameraScreen} />
          <Stack.Screen name="AnnotationScreen" component={AnnotationScreen} />
        </Stack.Group>

        <Stack.Screen name="Statistics" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
