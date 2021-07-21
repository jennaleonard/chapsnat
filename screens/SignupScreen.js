import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Image,
    Alert,
    TouchableOpacity,
  } from "react-native";
  
  import React, { useState, useEffect } from "react";
  import firebase from "@firebase/app";
  import Colors from "../constants/Colors";
  
  export default function SignupScreen({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const onPressCreate = async () => {
      const user = {
        name: name,
        email: email,
        password: password,
      };
  
      await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(signup_Success, onFailure);
    };
  
    const signup_Success = (userCredential) => {
        console.log("SUCCESS");
        var curr_user = userCredential.user;
        curr_user.updateProfile({
          displayName: name,
        });
      };
  
    const onFailure = async () => {
      alert("Failure! Please try again.");
    };

  return (
    <View>
      <Text style={styles.title}>Email:</Text>
      <TextInput style={styles.nameInput} onChangeText={setEmail} />

      <Text style={styles.title}>Password (6+ characters):</Text>
      <TextInput style={styles.nameInput} onChangeText={setPassword} />

      <Text style={styles.title}>Name:</Text>
      <TextInput style={styles.nameInput} onChangeText={setName} />

      <Button
        onPress={onPressCreate}
        title="Sign Up"
        color={Colors.snapblue}
        accessibilityLabel="Sign up"
        style={styles.buttonContainer}
      />
    </View>
  );
}

const offset = 16;
const styles = StyleSheet.create({
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  nameInput: {
    height: offset * 2,
    margin: offset,
    paddingHorizontal: offset,
    borderColor: "#111111",
    borderWidth: 1,
    fontSize: offset,
  },
  buttonText: {
    marginLeft: offset,
    fontSize: 42,
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 40,
    borderRadius: 30,
    backgroundColor: Colors.snapblue,
  },
});