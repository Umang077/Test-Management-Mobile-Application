import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
// import { View, Text, Button } from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeInDown,
} from "react-native-reanimated";
import {
  Alert,
  Button,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Permissions,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
export default function ThankyouScreen() {
  const navigation = useNavigation();

  //   console.log("Thankyou screen username", user_name);
  //   console.log("Thankyou screen password", password_);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        style={styles.image1}
        source={require("../assets/background.png")}
      />
      <View style={styles.hangs}>
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify().damping(3)}
          style={styles.image2}
          source={require("../assets/light.png")}
        />
        <Animated.Image
          entering={FadeInUp.delay(400).duration(1000).springify().damping(3)}
          style={styles.image3}
          source={require("../assets/light.png")}
        />
      </View>
      <View style={styles.container2}>
        <View style={styles.titlecontainer}>
          <Animated.Text
            entering={FadeInUp.duration(4000).springify()}
            style={styles.title}
          >
            Thank You!
          </Animated.Text>
        </View>

        <View style={styles.formvalue}>
          <Animated.View
            entering={FadeInDown.delay(600).duration(2000).springify()}
            style={styles.buttoncontainer}
          >
            <TouchableOpacity style={styles.opacity}>
              <Text
                onPress={() => {
                  navigation.navigate("Login");
                }}
                style={styles.text}
              >
                Back to Login!
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
  },
  image1: {
    height: "110%",
    width: "100%",
    position: "absolute",
  },
  hangs: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  image2: {
    height: "23%",
    width: "5%",
    position: "absolute",
    marginLeft: "20%",
  },
  image3: {
    marginLeft: "55%",
    height: "30%",
    width: "4%",
    position: "absolute",
  },
  container2: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    paddingTop: 40,
    paddingBottom: 10,
  },
  titlecontainer: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontWeight: 400,
    fontStyle: "normal",
    fontWeight: "bold",
    letterSpacing: 2,
    fontSize: 40,
    color: "white",
    marginTop: "40%",
  },
  formvalue: {
    display: "flex",
    alignItems: "center",
    marginHorizontal: 4,
    margin: 50,
  },
  formvalue2: {
    backgroundColor: "gainsboro",
    padding: 20,
    borderRadius: 16,
    width: "80%",
    marginTop: 10,
  },
  buttoncontainer: {
    width: "100%",
  },
  opacity: {
    width: "80%",
    backgroundColor: "deepskyblue",
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    marginTop: 10,
    // marginHorizontal: 43,
    marginLeft: "auto",
    marginRight: "auto",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
