// import { StatusBar } from "expo-status-bar";
// import React, { Component } from "react";
// import Login from "./components/Login";
// import {
//   Alert,
//   AppRegistry,
//   Button,
//   SafeAreaView,
//   Text,
//   StyleSheet,
//   View,
//   BackHandler,
// } from "react-native";

// export default function App() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Login />
//     </View>
//   );
// }

// In App.js in a new project

import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import CameraScreen from "./screens/CameraScreen";
import ThankyouScreen from "./screens/ThankyouScreen";
import QRScreen from "./screens/QrScreen";
import ErrorScreen from "./screens/ErrorScreen";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={QRScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Thankyou" component={ThankyouScreen} />
        <Stack.Screen name="error" component={ErrorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
