import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Image
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  register() {
    this.props.navigation.navigate("Register")
  }

  logIn() {
    AsyncStorage.setItem("userLoggedIn", "true")
    this.props.navigation.navigate("Profile")
  }


  render() {

    return (
      <View style={styles.container}>
          <Text style={styles.title}>Sign In</Text>

          <View style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
              <Text style={styles.question}>Not a user yet?</Text>
              <Text style={styles.nav} onPress={() => this.register()}>Sign Up</Text>
          </View>

          <Text style={styles.text}>Email address:</Text>
          <TextInput
          style={styles.placeholder}
          placeholder="Enter email address"/>

          <Text style={styles.text}>Password:</Text>
          <TextInput
          style={styles.placeholder}
          placeholder="Enter password"/>

          <TouchableOpacity style={styles.button} onPress={() => this.logIn()}>
            <Text style={styles.btnText}>Sign in</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hp("8%")    
  },
  title: {
    textAlign: 'center',
    fontFamily: "Nunito_700Bold",
    fontSize: hp("3.5%"),
    marginBottom: hp("5%")
  },
  question: {
      fontFamily: "Nunito_600SemiBold",
      fontSize: hp("2%"),
      marginBottom: hp("5%"),
      marginRight: wp("5%")
  },
  nav: {
      fontFamily: "Nunito_300Light_Italic",
      fontSize: hp("2%"),
      marginBottom: hp("5%"),
      marginRight: wp("5%"),
      textDecorationLine: "underline"
  },
  text: {
      fontFamily: "Nunito_700Bold",
      marginBottom: hp("1%"),
      marginLeft: wp("3%")
  },
  placeholder: {
    height: hp("5%"),
    borderWidth: 1,
    padding: wp("2%"),
    marginHorizontal: wp("3%"),
    marginBottom: hp("3%")
  },
  button: {
    width: wp("80%"),
    padding: hp("1%"),
    backgroundColor: "#34359A",
    borderRadius: wp("50%"),
    marginHorizontal: wp("10%"),
    marginTop: hp("5%"),
  },
  btnText:{
    fontFamily:"Nunito_400Regular",
    fontSize: hp("2.5%"),
    color: "#ffffff",
    textAlign: "center"
  }
});