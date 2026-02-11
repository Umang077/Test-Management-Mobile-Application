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
  Permissions,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { RNS3 } from "react-native-aws3";
import AWS from "aws-sdk";

import { useNavigation } from "@react-navigation/native";

export default function CameraScreen({ route }) {
  const [image, setImage] = useState(null);
  const [value, setValue] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [lastSelectedButton, setLastSelectedButton] = useState(null);

  const navigation = useNavigation();
  //   if (!route.params) {
  //     // Handle case where params are not available
  //     return (
  //       <View style={styles.container}>
  //         <Text>Error: Params not available</Text>
  //       </View>
  //     );
  //   }
  const { scanned_Data } = route.params;
  console.log("Camera screen data", scanned_Data);

  const addExtractedData = () => {
    const data_value = {
      username: scanned_Data,
      extracted_data: extractedText,
    };
    const url = "http://172.18.16.23:3000/api/login/add";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data_value),
    })
      .then((response) => {
        console.log("response", response);
      })
      .catch((err) => {
        console.log(err.message);
      });
    setValue([data_value]);
  };

  const [extractedText, setExtractedText] = useState("");

  const pickImageGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      performOCR(result.assets[0].uri);

      setImage(result.assets[0].uri);
      setLastSelectedButton("gallery");
    }
  };

  // Function to capture an image using the
  // device's camera
  //   const pickImageCamera = async () => {
  //     let result = await ImagePicker.launchCameraAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       base64: true,
  //       allowsMultipleSelection: false,
  //     });
  //     if (!result.canceled) {
  //       // Perform OCR on the captured image
  //       // Set the captured image in state
  //       performOCR(result.assets[0]);
  //       setImage(result.assets[0].uri);
  //     }
  //   };
  //   const pickImageCamera = async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     if (status === "granted") {
  //       let result = await ImagePicker.launchCameraAsync({
  //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //         allowsEditing: true,
  //         base64: true,
  //         allowsMultipleSelection: false,
  //       });
  //       if (!result.cancelled) {
  //         // Perform OCR on the captured image
  //         // Set the captured image in state
  //         performOCR(result.assets[0]);
  //         setImage(result.assets[0].uri);
  //       }
  //     } else {
  //       // Permission denied
  //       Alert.alert("Camera permission required");
  //     }
  //   };
  AWS.config.update({
    accessKeyId: "AKIAQ3EGWHSN7TLK4P6L",
    secretAccessKey: "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",
    region: "ap-south-1",
  });
  const s3 = new AWS.S3();

  const pickImageCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        base64: true,
        allowsMultipleSelection: false,
      });
      if (!result.canceled) {
        try {
          // Read the image file and convert it to base64
          const response = await fetch(result.assets[0].uri);
          const blob = await response.blob();
          // const base64Image = await blobToBase64(blob);

          // Upload the base64 encoded image to S3 bucket
          const fileName = `${Date.now()}.jpeg`; // Unique file name for the image

          const params = {
            Bucket: "mobile-app-textract",
            Key: fileName,
            Body: blob,
            mimeType: "image/jpeg",
            ACL: "public-read",
          };

          s3.upload(params, async (err, data) => {
            if (err) {
              console.log("S3 upload error:", err);
            } else {
              console.log("S3 upload success:", data.Location);
              // Perform OCR on the uploaded image
              performOCR(fileName);
            }
          });

          setImage(result.assets[0].uri);
          setLastSelectedButton("camera");
        } catch (error) {
          console.error("Error converting image to base64:", error);
        }
      }
    } else {
      // Permission denied
      Alert.alert("Camera permission required");
    }
  };

  // Function to convert Blob to base64 string
  // const blobToBase64 = async (blob) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onerror = reject;
  //     reader.onload = () => {
  //       resolve(reader.result.split(",")[1]);
  //     };
  //     reader.readAsDataURL(blob);
  //   });
  // };
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Camera roll permission required");
      }
    })();
  }, []);

  // Function to perform OCR on an image
  // and extract text
  // Function to perform OCR on an image and extract text

  const performOCR = (file) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      file_name: file,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: raw,
      redirect: "follow",
    };

    fetch("http://13.201.76.57:5000/textract_text", requestOptions)
      .then((response) => response.text())
      .then((result) => setExtractedText(result))
      .catch((error) => console.error(error));
  };

  // const performOCR = (file) => {
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   const raw = JSON.stringify({
  //     file_path: file,
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };

  //   fetch("http://13.201.76.57:5000/upload", requestOptions)
  //     .then((response) => response.text())
  //     .then((result) => console.log(result))
  //     .catch((error) => console.error(error));
  // };

  //   const handleSaveText = () => {
  //     setShowAlert(true);
  //     // Alert.alert("Congratulations! Your test has been saved!");
  //     setImage(null);
  //     setExtractedText("");
  //   };
  // useEffect(() => {
  //   if (showAlert) {
  //     const timer = setTimeout(() => {
  //       setShowAlert(false);
  //       navigation.navigate("Thankyou", {
  //         user_name: "",
  //         password_: "",
  //       });
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [showAlert, navigation]);
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.image1}
        source={require("../assets/background.png")}
      />
      {!image && (
        <View style={styles.hangs}>
          <Animated.View
            entering={FadeInDown.delay(600).duration(2000).springify()}
          >
            <TouchableOpacity style={styles.opacity3}>
              <Text
                style={styles.text}
                onPress={() => {
                  navigation.navigate("Login", {
                    scannedData: "",
                  });
                }}
              >
                Back
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.Image
            entering={FadeInUp.delay(200).duration(1000).springify().damping(3)}
            style={styles.image4}
            source={require("../assets/light.png")}
          />
          <Animated.Image
            entering={FadeInUp.delay(400).duration(1000).springify().damping(3)}
            style={styles.image5}
            source={require("../assets/light.png")}
          />
        </View>
      )}
      {image && (
        <Button
          color="white"
          style={styles.backbutton}
          title="Back"
          onPress={() => {
            setImage(null);
            setExtractedText("");
            if (lastSelectedButton === "gallery") {
              pickImageGallery(); // Re-trigger gallery pick if it was last selected
            } else if (lastSelectedButton === "camera") {
              pickImageCamera(); // Re-trigger camera pick if it was last selected
            }
          }}
        />
      )}

      {/* <Text style={styles.heading}>Welcome to the file</Text>
      <Text style={styles.heading2}>Image to Text App</Text> */}

      {image && (
        <Animated.Image
          entering={FadeIn.delay(300).duration(2000).springify()}
          source={{ uri: image }}
          style={{
            width: "90%",
            height: 300,
            // objectFit: "contain",
            // marginLeft: 15,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 35,
          }}
        />
      )}

      {/* <Text style={styles.text1}>Extracted text:</Text> */}
      {/* <View style={styles.box}>
        <Text style={styles.text}>{extractedText}</Text>
      </View> */}
      {image && (
        <View style={styles.scrollViewContainer}>
          <Animated.ScrollView
            entering={FadeIn.delay(400).duration(2000).springify()}
            contentContainerStyle={styles.scrollView}
          >
            <Text style={styles.extractedText}>{extractedText}</Text>
          </Animated.ScrollView>

          <Animated.View
            entering={FadeInUp.delay(400).duration(2000).springify()}
          >
            <TouchableOpacity style={styles.opacity1}>
              <Text
                style={styles.text1}
                onPress={() => {
                  addExtractedData();
                  //   handleSaveText();
                  navigation.navigate("Thankyou", {
                    scannedData: "",
                  });
                }}
              >
                Save Text
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      <StatusBar style="auto" />
      {!image && (
        <View style={styles.container2}>
          <View style={styles.textcontainer}>
            {/* <Animated.View
              entering={FadeInDown.delay(400).duration(2000).springify()}
            >
              <TouchableOpacity style={styles.opacity}>
                <Text style={styles.text} onPress={pickImageGallery}>
                  Pick an image from gallery
                </Text>
              </TouchableOpacity>
            </Animated.View> */}

            <Animated.View
              entering={FadeInDown.delay(600).duration(2000).springify()}
            >
              <TouchableOpacity style={styles.opacity}>
                <Text style={styles.text} onPress={pickImageCamera}>
                  Pick an image from camera
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    // backgroundColor: "white",
  },
  image1: {
    height: "110%",
    width: "100%",
    position: "absolute",
  },
  container2: {
    top: "60%",
  },
  hangs: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  textcontainer: { marginTop: "5%" },
  opacity: {
    width: "80%",
    backgroundColor: "deepskyblue",
    padding: 10,
    borderRadius: 16,
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 40,
    // position: "absolute",
    top: 45,
    // width: "100%",
    alignItems: "center",
  },
  opacity1: {
    width: "50%",
    backgroundColor: "deepskyblue",
    padding: 10,
    borderRadius: 16,
    // marginBottom: 10,
    marginTop: 15,
    marginHorizontal: 40,
    marginLeft: "auto",
    marginRight: "auto",
    // position: "absolute",
    // bottom: 5,
    // width: "100%",
    alignItems: "center",
  },
  opacity3: {
    width: "20%",
    backgroundColor: "deepskyblue",
    padding: 10,
    borderRadius: 16,
    // marginBottom: 10,
    marginTop: 55,
    // marginHorizontal: 40,
    // marginLeft: "auto",
    marginRight: "auto",
    // position: "absolute",
    // bottom: 5,
    // width: "100%",
    alignItems: "center",
    zIndex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: "5%",
  },
  text1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  scrollViewContainer: {
    flex: 1,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10%",
  },
  scrollView: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    // marginBottom: 20,
  },
  extractedText: {
    fontSize: 16,
    color: "black",
  },
  image4: {
    height: "23%",
    width: "1%",
    position: "absolute",
    marginLeft: "20%",
  },
  image5: {
    marginLeft: "55%",
    height: "35%",
    width: "4%",
    position: "absolute",
  },
});
