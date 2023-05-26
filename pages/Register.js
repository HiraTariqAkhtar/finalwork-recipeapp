import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Modal
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        confirmDetails: false
    }
  }

  login() {
    this.props.navigation.navigate("LogIn")
  }

  checkInputData(){

      this.setState({confirmDetails: true})
  }


  render() {

    return (
      <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>

          <View style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
              <Text style={styles.question}>Already a user?</Text>
              <Text style={styles.nav} onPress={() => this.login()}>Sign In</Text>
          </View>

          <Text style={styles.text}>First Name:</Text>
          <TextInput
          style={styles.placeholder}
          placeholder="First Name"/>

          <Text style={styles.text}>Last Name:</Text>
          <TextInput
          style={styles.placeholder}
          placeholder="Last Name"/>

          <Text style={styles.text}>Email address:</Text>
          <TextInput
          style={styles.placeholder}
          placeholder="someone@example.com"/>

          <Text style={styles.text}>Password:</Text>
          <TextInput
          style={styles.placeholder}
          placeholder="**********"/>

          <Text style={styles.text}>Confirm Password:</Text>
          <TextInput
          style={styles.placeholder}
          placeholder="**********"/>

          <TouchableOpacity style={styles.button} onPress={() => this.checkInputData()}>
            <Text style={styles.btnText}>Next</Text>
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
    width: wp("50%"),
    padding: hp("1%"),
    backgroundColor: "#34359A",
    borderRadius: wp("50%"),
    marginLeft: wp("45%"),
    marginTop: hp("3%"),
  },
  btnText:{
    fontFamily:"Nunito_400Regular",
    fontSize: hp("2.5%"),
    color: "#ffffff",
    textAlign: "center"
  }
});