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
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs} from "firebase/firestore"; 
import {DATABASE} from "../firebaseConfig"
import {AUTH} from "../firebaseConfig"
import { signInWithEmailAndPassword } from "firebase/auth"; 
import * as Facebook from 'expo-facebook';



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


  async checkCredentials() {
    this.setState({ isLoading: true });
  
    try {
      await signInWithEmailAndPassword(AUTH, this.state.email, this.state.pw);
      const users = await getDocs(collection(DATABASE, "users"));
    
      users.forEach((doc) => {
        const user = doc.data();
        if (user.email === this.state.email) {
          AsyncStorage.setItem("userLoggedIn", "true");
          AsyncStorage.setItem("firstName", user.firstName);
          AsyncStorage.setItem("lastName", user.lastName);
          AsyncStorage.setItem("email", user.email);
          userFound = true;
          this.props.navigation.goBack();
        }
      });
    } catch (error) {
      const errorMsg = error.message;
      console.log(`Error: ${errorMsg}`);
      
      Alert.alert(
        "User not found",
        "Please re-enter your email address and password"
      );
      this.setState({ email: "", pw: "" });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {

    return (
      <View style={styles.container}>
         <View style={styles.header}>
          <Ionicons
              name={"arrow-back"}
              size={hp("5%")}
              color="#115740"
              marginRight={wp("20%")}
              onPress={() => this.props.navigation.goBack()}
            />
          <Text style={styles.title}>Sign In</Text>
        </View>

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

          <TouchableOpacity style={styles.button} onPress={() => this.checkCredentials()}>
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
  header: {
    display:"flex",
    flexDirection:"row",
    marginHorizontal: wp("7.5%"),
  },
  title: {
    textAlign: 'center',
    fontFamily: "Nunito_700Bold",
    fontSize: hp("3.5%"),
    marginBottom: hp("5%"),
    color: "#FF5E00"
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
      color: "#115740"
  },
  text: {
      fontFamily: "Nunito_700Bold",
      marginBottom: hp("1%"),
      marginLeft: wp("3%")
  },
  placeholder: {
    height: hp("5%"),
    borderWidth: 3,
    padding: wp("2%"),
    marginHorizontal: wp("3%"),
    marginBottom: hp("3%"),
    borderColor: "#115740",
    borderRadius: 10,
  },
  button: {
    width: wp("80%"),
    padding: hp("1%"),
    backgroundColor: "#115740",
    borderRadius: 10,
    marginTop: hp("5%"),
    marginHorizontal: wp("10%")
  },
btnText:{
    fontFamily:"Nunito_700Bold",
    fontSize: hp("2.5%"),
    color: "#ffffff",
    textAlign: "center"
},
});