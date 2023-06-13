import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Alert,
  ActivityIndicator
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs} from "firebase/firestore"; 
import {DATABASE} from "../firebaseConfig"

import bcrypt from 'react-native-bcrypt';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state= {
      email: "",
      pw: "",

      isLoading: false
    }
  }

  register() {
    this.props.navigation.navigate("Register")
  }

  async checkEmail() {
    let users = []
    let userCollection = collection(DATABASE, "users")
    let userData = await getDocs(userCollection)
    if (userData.size > 0) {
      userData.forEach((doc) => {
        users.push(doc.data())
      })

      users.forEach((user) => {
        if(user.email == this.state.email) {
          this.checkPassword(user)
        } else {
          Alert.alert(
            "User not found",
            "Please re-enter your email address and password"
          )
          this.setState({email: ""})
          this.setState({pw: ""})
        }
      })
    } else {
      Alert.alert(
        "User doesn't exist",
        "Please make sure to sign up before logging in"
      )
      this.setState({email: ""})
      this.setState({pw: ""})
    }
  }

  async checkPassword(user) {
    this.setState({ isLoading: true });
  
    setTimeout(() => {
    if (this.state.pw === "") {
        Alert.alert(
          "Password not filled in",
          "Please fill in your password",
          [{ text: "OK", onPress: () => this.setState({ isLoading: false }) }]
        );
      } else {
        let compare = bcrypt.compareSync(this.state.pw, user.password);
        if (compare) {
          AsyncStorage.setItem("userLoggedIn", "true");
          AsyncStorage.setItem("firstName", user.firstName);
          AsyncStorage.setItem("lastName", user.lastName);
          AsyncStorage.setItem("email", user.email);
          this.props.navigation.goBack();
        } else {
            Alert.alert(
              "Incorrect password",
              "Please re-enter your password",
              [{ text: "OK", onPress: () => this.setState({ isLoading: false }) }]
              );
            this.setState({ pw: "" });
          }
        }
      }, 100);
  }


  render() {

    return (
      <View style={styles.container}>
          <Text style={styles.title}>Sign In</Text>

          {this.state.isLoading && <ActivityIndicator size="large"/>}
        
          <View style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
              <Text style={styles.question}>Not a user yet?</Text>
              <Text style={styles.nav} onPress={() => this.register()}>Sign Up</Text>
          </View>

          <Text style={styles.text}>Email address:</Text>
          <TextInput
          style={styles.placeholder}
          placeholder="Enter email address"
          keyboardType="email-address"
          value={this.state.email}
          onChangeText={(txt) => this.setState({email: txt})}/>

          <Text style={styles.text}>Password:</Text>
          <TextInput
          style={styles.placeholder}
          placeholder="Enter password"
          secureTextEntry
          value={this.state.pw}
          onChangeText={(txt) => this.setState({pw: txt})}/>

          <TouchableOpacity style={styles.button} onPress={() => this.checkEmail()}>
            <Text style={styles.btnText}>Sign in</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: hp("5%"),
    paddingTop: hp("5%"),
    backgroundColor:"#FFFFFF" 
  },
  title: {
    textAlign: 'center',
    fontFamily: "Nunito_700Bold",
    fontSize: hp("3.5%"),
    marginBottom: hp("5%"),
    color: "#FF0000"
  },
  question: {
      fontFamily: "Nunito_600SemiBold",
      fontSize: hp("2%"),
      marginBottom: hp("5%"),
      marginRight: wp("5%"),
      color: "#FF5E00"
  },
  nav: {
      fontFamily: "Nunito_300Light_Italic",
      fontSize: hp("2%"),
      marginBottom: hp("5%"),
      marginRight: wp("5%"),
      textDecorationLine: "underline",
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
    marginBottom: hp("3%"),
    borderColor: "#FF5E00",
    borderRadius: 10,
  },
  button: {
    width: wp("80%"),
    padding: hp("1%"),
    backgroundColor: "#FF5E00",
    borderRadius: 10,
    marginHorizontal: wp("10%"),
    marginTop: hp("5%"),
  },
  btnText:{
    fontFamily:"Nunito_400Regular",
    fontSize: hp("2.5%"),
    color: "#ffffff",
    textAlign: "center"
  },
});