//Flávia Glenda Guimarães Carvalho
//Lucas Randal Abreu Balderrama
import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RealizarLogin from './src/screens/RealizarLogin';
import CadastroUsuario from './src/screens/CadastroUsuario';
import FeedToki from './src/screens/FeedToki';
import ChatToki from './src/screens/ChatToki';

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="CadastroUsuario" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={RealizarLogin} />
      <Stack.Screen name="CadastroUsuario" component={CadastroUsuario} />
      <Stack.Screen name="Feed" component={FeedToki} />
      <Stack.Screen name="Chat" component={ChatToki} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
