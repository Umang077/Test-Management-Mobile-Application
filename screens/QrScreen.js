import React, { useState, useEffect, useRef } from "react";
import { Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";

import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeInDown,
  FadeOutRight,
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
export default function QRScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const [value, setValue] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setScannedData(data);
    const url = `http://172.18.16.23:3001/api/qrlogin/${data}`;

    fetch(url)
      .then((response) => {
        if (response == []) {
          throw new Error("QR code not found in database");
        }
        return response.json();
      })
      .then((data_value) => {
        // Scanned QR code found in database
        // Proceed to the camera page

        // console.log("Data", data);
        const value = data_value[0][""]; // Accessing the value with key ""
        console.log("Value:", value);
        console.log("Data", data);
        if (value > 0) {
          navigation.navigate("Camera", {
            scanned_Data: data, // Pass any necessary data to the camera page
          });
          handleCloseScanner();
        } else {
          navigation.navigate("error");
          handleCloseScanner();

          //   Alert.alert("Error", "Failed to verify QR code");
        }
      })
      .catch((error) => {
        // Error handling
        console.error("Error verifying QR code:", error);
        // Reset scanned state to false
        setScanned(false);
        // Show error message
        Alert.alert("Error", "QR code not found in database");
      });
  };

  const handleOpenScanner = () => {
    setShowScanner(true);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
    setScanned(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  //   const verfiyQrData = () => {
  //     const url = `http://172.18.16.23:3001/api/qrlogin/${scannedData}`;
  //     fetch(url, {
  //       method: "GET",
  //       headers: {
  //         "Content-type": "application/json; charset=UTF-8",
  //         "Access-Control-Allow-Origin": "*",
  //       },
  //       body: JSON.stringify(data_value),
  //     })
  //       .then((response) => {
  //         console.log("response", response);
  //       })
  //       .catch((err) => {
  //         console.log(err.message);
  //       });
  //   };

  return (
    <View style={styles.container}>
      <View style={styles.hangs}>
        <StatusBar style="light" />
        <Animated.View
          entering={FadeIn.delay(600).duration(2000).springify()}
          style={styles.tricontainer}
        >
          <Animated.Image
            entering={FadeInUp.delay(300).duration(1000).springify().damping(3)}
            style={styles.imagetripic}
            source={require("../assets/tripic.png")}
          />
        </Animated.View>
        <Image
          style={styles.image1}
          source={require("../assets/background.png")}
        />
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
      {/* <View style={styles.titlecontainer}> */}
      <Animated.Text
        entering={FadeInUp.duration(1000).springify().damping(3)}
        style={styles.title}
      >
        Login
      </Animated.Text>
      <Animated.Text
        entering={FadeInUp.duration(1000).springify().damping(3)}
        style={styles.title1}
      >
        Scan the QR to Login!
      </Animated.Text>
      {/* </View> */}

      {!showScanner && (
        // <Button title="Open Scanner" onPress={handleOpenScanner} />
        <Animated.View
          entering={FadeInDown.delay(400).duration(2000).springify()}
          style={styles.buttoncontainer}
        >
          <TouchableOpacity style={styles.opacity}>
            <Text onPress={handleOpenScanner} style={styles.text}>
              Open Scanner!
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      {showScanner && (
        <View style={styles.scannerContainer}>
          <Animated.View
            entering={FadeInUp.delay(400).duration(2000).springify()}
            style={styles.barcodebox}
          >
            <Camera
              ref={cameraRef}
              style={styles.camera}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
          </Animated.View>
          {/* <Button title="Close Scanner" onPress={handleCloseScanner} /> */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(2000).springify()}
            style={styles.buttoncontainer}
          >
            <TouchableOpacity style={styles.opacity}>
              <Text
                onPress={() => {
                  handleCloseScanner();
                }}
                style={styles.text}
              >
                Close Scanner!
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
      {/* {showScanner && (
        <Text style={styles.data}>{`Scanned data: ${scannedData}`}</Text>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  scannerContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // overflow: "hidden",
  },
  barcodebox: {
    top: 185,
    alignItems: "center",
    justifyContent: "center",
    height: 260,
    width: 260,
    overflow: "hidden",
    borderRadius: 30,
    // backgroundColor: "tomato",
  },
  camera: {
    // top: 180,
    height: 275,
    width: 275,
  },
  //   data: {
  //     fontSize: 20,
  //     bottom: 110,
  //     fontWeight: "bold",
  //     color: "black",
  //     textAlign: "center",
  //   },
  image1: {
    height: "112%",
    width: "100%",
    // position: "absolute",
  },
  tricontainer: {
    backgroundColor: "#e6faff",
    // padding: 15,

    // marginBottom: 10,
    // marginTop: 10,
    // marginHorizontal: 43,
    borderRadius: 16,
    marginTop: 65,
    marginLeft: "12.5%",
    // marginLeft: "auto",
    // marginRight: "auto",
    height: "5%",
    width: "75%",
    position: "absolute",
    zIndex: 1,
  },
  imagetripic: {
    // marginTop: 3,
    marginLeft: 20,
    height: "85%",
    width: "90%",
    position: "absolute",
    zIndex: 1,
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

  title: {
    position: "absolute",
    fontWeight: "bold",
    letterSpacing: 2,
    fontSize: 40,
    color: "white",
    top: 290,
    // marginBottom: "30%",
  },
  title1: {
    position: "absolute",
    fontWeight: "bold",
    letterSpacing: 2,
    fontSize: 20,
    color: "white",
    top: 339,
    // marginBottom: "30%",
  },

  buttoncontainer: {
    width: "100%",
  },
  opacity: {
    width: "80%",
    backgroundColor: "deepskyblue",
    padding: 15,
    top: 200,
    borderRadius: 16,
    // marginBottom: 10,
    // marginTop: 10,
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
