import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  Modal,
  Alert,
  ActivityIndicator
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, FontAwesome } from "@expo/vector-icons";


import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, addDoc } from "firebase/firestore"; 
import {DATABASE} from "../firebaseConfig"
import {AUTH} from "../firebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"; 


import bcrypt from 'react-native-bcrypt';

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

        emailAvailable: true,

        showPw: false,

        isLoading: false
    }
  }

  login() {
    this.props.navigation.navigate("LogIn")
  }

  async checkEmailAvailability(text){
    this.setState({email: text})

    let emails = []
    let userCollection = collection(DATABASE, "users")
    let userData = await getDocs(userCollection)
    if (userData.size > 0) {
      userData.forEach((doc) => {
        emails.push(doc.data().email)
      })
    }
    if(emails.includes(this.state.email)) {
    this.setState({emailAvailable: false})
    } else{
    this.setState({emailAvailable: true})
    }
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
    
    if(!this.state.emailAvailable) {
      Alert.alert(
        "Email-address is already in use",
        "Please use another email address"
      )
      this.setState({email: ""})
    }

    if (emailCheck && this.state.emailAvailable) {
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

    if(emailCheck && pwCheck && this.state.emailAvailable) {
      this.setState({confirmDetails: true})
    }
    }
  }


  async register() {
    this.setState({isLoading: true})
    
    setTimeout(() => {
      createUserWithEmailAndPassword(AUTH, this.state.email, this.state.pw)
      .then(() => {
        const user = {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
        };

        // Add user to database
        const userCollection = collection(DATABASE, "users");
        addDoc(userCollection, user);
        
        AsyncStorage.setItem("userLoggedIn", "true")
        AsyncStorage.setItem("firstName", this.state.firstName)
        AsyncStorage.setItem("lastName", this.state.lastName)
        AsyncStorage.setItem("email", this.state.email)

        this.props.navigation.navigate("Profile")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMsg = error.message;

        console.log(`Error occured with code ${errorCode} : ${errorMsg}`)
      })
    }, 100)

  }


  render() {
    let pw;
    let showPassword;

    if(this.state.showPw) {
      pw = this.state.pw
      showPassword =
      <Ionicons
        name="eye-off"
        size={hp("2.5%")}
        marginLeft={wp("3%")}
        color="#115740"
        onPress={() => this.setState({showPw: !this.state.showPw})}/>
    } else {
      pw = "**********"
      showPassword =
      <Ionicons
        name="eye"
        size={hp("2.5%")}
        marginLeft={wp("3%")}
        color="#115740"
        onPress={() => this.setState({showPw: !this.state.showPw})}/>
    }

    let emailAvailable;
    if(this.state.email.length > 0) {
      if(this.state.emailAvailable) {
        emailAvailable = <Text style={{marginLeft:wp("3%"), marginBottom:hp("3%"), color:"#00FF00"}}>Email-address is available</Text>
      } else {
      emailAvailable = <Text style={{marginLeft:wp("3%"), marginBottom:hp("3%"), color:"#FF0000"}}>Email-address is already in use. {"\n"}Please use another email address</Text>
      }
    }

    let pwOK;
    if(this.state.pw.length > 0) {
      if(this.state.pw.length >= 6) {
        pwOK = <Text style={{marginLeft:wp("3%"), marginTop:hp("-3%"), marginBottom:hp("3%"), color:"#00FF00"}}>Password can be used</Text>
      } else {
        pwOK = <Text style={{marginLeft:wp("3%"), marginTop:hp("-3%"), marginBottom:hp("3%"), color:"#FF0000"}}>Password should be at least 6 characters</Text>
      }
    }

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
          <Text style={styles.title}>Sign Up</Text>
        </View>

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
            style={[styles.placeholder, {marginBottom:hp("0%")}]}
            placeholder="someone@example.com"
            keyboardType="email-address"
            value={this.state.email}
            onChangeText={(txt) => this.checkEmailAvailability(txt)}/>
            {emailAvailable}
  
            <Text style={styles.text}>Password:</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="**********"
            secureTextEntry
            value={this.state.pw}
            onChangeText={(txt) => this.setState({pw: txt})}/>
            {pwOK}
  
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

            {this.state.isLoading && <ActivityIndicator size="large"/>}
            
            <View style={{marginLeft:wp("5%"), marginBottom:hp("1.5%")}}>
              <View style={styles.iconText}>
              <Text style={{marginBottom:hp("1.5%")}}>Name: {this.state.firstName} {this.state.lastName}</Text>
               <FontAwesome
                name="pencil"
                size={hp("2.5%")}
                marginLeft={wp("3%")}
                color="#115740"
                onPress={() => this.setState({confirmDetails: false})}/>

              </View>
              <View style={styles.iconText}>
              <Text style={{marginBottom:hp("1.5%")}}>Email: {this.state.email}</Text>
               <FontAwesome
                name="pencil"
                size={hp("2.5%")}
                marginLeft={wp("3%")}
                color="#115740"
                onPress={() => this.setState({confirmDetails: false})}/>

              </View>
              <View style={styles.iconText}>
                <Text>Password: {pw}</Text>
                {showPassword}

                <FontAwesome
                name="pencil"
                size={hp("2.5%")}
                marginLeft={wp("3%")}
                color="#115740"
                onPress={() => this.setState({confirmDetails: false})}/>

              </View>
            </View>

          <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginHorizontal:wp("2%")}}>
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
    width: wp("45%"),
    padding: hp("1%"),
    backgroundColor: "#115740",
    borderRadius: 10,
    marginTop: hp("3%"),
  },
  btnText:{
    fontFamily:"Nunito_700Bold",
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