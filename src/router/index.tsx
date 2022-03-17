import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import CameraScreen from '../screens/CameraScreen';
import Home from '../screens/Home';
import AnnotationScreen from '../screens/AnnotationScreen';
import SingleResultScreen from '../screens/ResultScreen/SingleResultScreen';
import MultiResultScreen from '../screens/ResultScreen/MultiResultScreen';

export type RootStackParamList = {
  Home: undefined;
  CameraScreen: undefined;
  AnnotationScreen: undefined;
  MultiStatistics: undefined;
  Statistics: undefined;
};

export type NavigatorProps = NativeStackScreenProps<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ gestureEnabled: false }}
      >
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
          <Stack.Screen name="MultiStatistics" component={MultiResultScreen} />
          <Stack.Screen name="Statistics" component={SingleResultScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
