//Flávia Glenda Guimarães Carvalho N°04
//Lucas Randal Abreu Balderrama N°18
import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RealizarLogin from './src/screens/RealizarLogin';
import CadastroUsuario from './src/screens/CadastroUsuario';
import FeedToki from './src/screens/FeedToki';
import ChatToki from './src/screens/ChatToki';
import PerfilUsuario from './src/screens/perfilUsuario';

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="PerfilUsuario" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={RealizarLogin} />
      <Stack.Screen name="CadastroUsuario" component={CadastroUsuario} />
      <Stack.Screen name="FeedToki" component={FeedToki} />
      <Stack.Screen name="ChatToki" component={ChatToki} />
      <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
