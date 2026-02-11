import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";

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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
export default function LoginScreen() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  // const [hasPermission, setHasPermission] = useState(null);
  // const [scanned, setScanned] = useState(false);
  // const [text, setText] = useState("Not yet Scanned");
  // const askForCameraPermission = () => {
  //   async () => {
  //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     setHasPermission(status == "granted");
  //   };
  // };
  // useEffect(() => {
  //   askForCameraPermission();
  // }, []);
  // const handleBarCodScanned = ({ type, data }) => {
  //   setScanned(true);
  //   setText(data);
  // };
  // if (hasPermission === null) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Requesting for camera permission</Text>
  //     </View>
  //   );
  // }
  // if (hasPermission == false) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={{ margin: 10 }}>No access to camera</Text>
  //       <Button
  //         title={"Allow Camera"}
  //         onPress={() => {
  //           askForCameraPermission();
  //         }}
  //       />
  //     </View>
  //   );
  // }
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        // setShowAlert(false);
        navigation.navigate("Camera", {
          user_name: userName,
          password_: password,
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [navigation, userName, password]);

  const navigation = useNavigation();
  // console.log("userName", userName);
  // console.log("Password", password);
  const handleLogin = () => {
    // setShowAlert(true);
    // Alert.alert(`Welcome to the App! ${userName}`);
    // nextPage();
  };
  // const nextPage = () => {
  //   navigation.navigate("Camera", {
  //     user_name: userName,
  //     password_: password,
  //   });
  // };

  return (
    // <View style={styles.container}>
    //   <View style={styles.container}>
    //     <BarCodeScanner
    //       onBarCodeScanned={scanned ? undefined : handleBarCodScanned}
    //     />
    //   </View>
    //   <Text style={styles.maintext}>{data}</Text>
    //   {scanned && (
    //     <Button
    //       title={"Scan again?"}
    //       onPress={() => setScanned(false)}
    //       color="tomato"
    //     />
    //   )}
    // </View>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
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
              entering={FadeInUp.duration(1000).springify().damping(3)}
              style={styles.title}
            >
              Login
            </Animated.Text>
          </View>

          <View style={styles.formvalue}>
            <Animated.View
              entering={FadeInDown.delay(200).duration(2000).springify()}
              style={styles.formvalue2}
            >
              <TextInput
                onChangeText={(currentData) => {
                  setUserName(currentData);
                }}
                placeholder="Username"
                placeholderTextColor={"gray"}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(400).duration(2000).springify()}
              style={styles.formvalue2}
            >
              <TextInput
                onChangeText={(currentData) => {
                  setPassword(currentData);
                }}
                placeholder="Password"
                placeholderTextColor={"gray"}
                secureTextEntry
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(600).duration(2000).springify()}
              style={styles.buttoncontainer}
            >
              <TouchableOpacity style={styles.opacity}>
                <Text
                  onPress={() => {
                    navigation.navigate("Camera", {
                      user_name: userName,
                      password_: password,
                    });
                  }}
                  style={styles.text}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    // flex: 1,
    // backgroundColor: "white",
    // alignItems: "center",
    // justifyContent: "center",
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "tomato",
  },
  image1: {
    height: "105%",
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
    margin: 45,
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
