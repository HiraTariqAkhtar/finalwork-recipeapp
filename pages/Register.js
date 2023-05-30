import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  Modal,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        confirmDetails: false,

        firstName: "",
        lastName: "",
        email: "",
        pw: "",
        pwConfirm: "",

        showPw: false
    }
  }

  login() {
    this.props.navigation.navigate("LogIn")
  }

  register() {
    AsyncStorage.setItem("userLoggedIn", "true")
    this.props.navigation.navigate("Profile")
  }

  checkInputData(){
    // check if all input fields filled in
    if(this.state.firstName == "" || this.state.lastName == "" || this.state.email == "" || this.state.pw == "" || this.state.pwConfirm == "") {
      Alert.alert(
        "Some fields not filled in",
        "Please fill in all fields"
      )
    } else {
    let emailCheck
    let pwCheck

    // email check
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) === false) {
      Alert.alert(
        "Invalid email address",
        "Please fill in a valid email address"
      )
      emailCheck =  false;
    }
    else {
      emailCheck =  true;
    }
    
    if (emailCheck) {
    // pw check
    if(this.state.pw == this.state.pwConfirm) {
      pwCheck = true
    } else {
      pwCheck= false
      Alert.alert(
        "Passwords not same",
        "Please rewrite your password"
      )
      this.setState({pw: ""})
      this.setState({pwConfirm: ""})
    }}


    if(emailCheck && pwCheck) {
      this.setState({confirmDetails: true})
    }
    }
  }


  render() {

    let pw;
    if(this.state.showPw) {
      pw = this.state.pw
    } else {
      pw = "**********"
    }

    return (
      <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>

          <View style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
              <Text style={styles.question}>Already a user?</Text>
              <Text style={styles.nav} onPress={() => this.login()}>Sign In</Text>
          </View>

          <ScrollView>
            <Text style={styles.text}>First Name:</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="First Name"
            onChangeText={(txt) => this.setState({firstName: txt})}/>
  
            <Text style={styles.text}>Last Name:</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="Last Name"
            onChangeText={(txt) => this.setState({lastName: txt})}/>
  
            <Text style={styles.text}>Email address:</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="someone@example.com"
            keyboardType="email-address"
            value={this.state.email}
            onChangeText={(txt) => this.setState({email: txt})}/>
  
            <Text style={styles.text}>Password:</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="**********"
            secureTextEntry
            value={this.state.pw}
            onChangeText={(txt) => this.setState({pw: txt})}/>
  
            <Text style={styles.text}>Confirm Password:</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="**********"
            secureTextEntry
            value={this.state.pwConfirm}
            onChangeText={(txt) => this.setState({pwConfirm: txt})}/>

          <TouchableOpacity style={[styles.button, {marginLeft: wp("50%")}]} onPress={() => this.checkInputData()}>
            <Text style={styles.btnText}>Next</Text>
          </TouchableOpacity>
          </ScrollView>


          <Modal
          visible={this.state.confirmDetails}>

            <Text style={[styles.question, {marginLeft:wp("5%"),  marginTop:hp("5%")}]}>Please confirm before finishing</Text>
            <View style={{marginLeft:wp("5%"), marginBottom:hp("1.5%"), marginTop:hp("3%")}}>
              <Text style={{marginBottom:hp("1.5%")}}>Name: {this.state.firstName} {this.state.lastName}</Text>
              <Text style={{marginBottom:hp("1.5%")}}>Email: {this.state.email}</Text>
              <View style={styles.iconText}>
                <Text>Password: {pw}</Text>
                <Ionicons
                name="eye"
                size={hp("2.5%")}
                marginLeft={wp("3%")}
                onPress={() => this.setState({showPw: !this.state.showPw})}/>
              </View>
            </View>

          <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
            <TouchableOpacity style={styles.button} onPress={() => this.setState({confirmDetails: false})}>
              <Text style={styles.btnText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => this.register()}>
              <Text style={styles.btnText}>Finish</Text>
            </TouchableOpacity>
          </View>
          </Modal>
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
    width: wp("45%"),
    padding: hp("1%"),
    backgroundColor: "#34359A",
    borderRadius: wp("50%"),
    marginTop: hp("3%"),
  },
  btnText:{
    fontFamily:"Nunito_400Regular",
    fontSize: hp("2.5%"),
    color: "#ffffff",
    textAlign: "center"
  },
  iconText: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
});