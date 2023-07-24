import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"; 
import {  signInWithEmailAndPassword, updateEmail, updatePassword } from "firebase/auth"; 
import {DATABASE, AUTH} from "../firebaseConfig"



export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: 0,
      firstName: "",
      lastName: "",
      email:"",
      password:"",

      firstNameEdited:"",
      lastNameEdited:"",
      emailEdited:"",
      currPw:"",
      newPw:"",
      confirmNewPw:"",
      pwBeforeEdit: false,
      pw:"",
      isLoading: false,
    }

    this.getUserDetails()
  }

  async getUserDetails(){
    let userFirstName = await AsyncStorage.getItem("firstName")
    let userLastName = await AsyncStorage.getItem("lastName")
    let userEmail = await AsyncStorage.getItem("email")
    let userPw = await AsyncStorage.getItem("password")
  
     if(userFirstName !== null && userLastName !== null && userEmail !== null && userPw !== null) {
      this.setState({firstName: userFirstName})
      this.setState({lastName: userLastName})
      this.setState({email: userEmail})
      this.setState({password: userPw})
      
      this.setState({firstNameEdited: userFirstName})
      this.setState({lastNameEdited: userLastName})
      this.setState({emailEdited: userEmail})

      await signInWithEmailAndPassword(AUTH, userEmail, userPw)
     }
  }

  closeEditScreen() {
    // warning before closing edit screen if changes available
    if(this.state.firstName !== this.state.firstNameEdited || this.state.lastName !== this.state.lastNameEdited || this.state.email !== this.state.emailEdited ||
      this.state.currPw !== "" || this.state.newPw !== "" || this.state.confirmNewPw !== "") 
    {
      Alert.alert(
        "Cancel editing?",
        "All unsaved changes will be lost",
        [
          { text: "No", style:"cancel" },
          { text: "Yes", onPress: () => {
            this.setState({firstNameEdited: this.state.firstName})
            this.setState({lastNameEdited: this.state.lastName})
            this.setState({emailEdited: this.state.email})
            this.setState({currPw: ""})
            this.setState({newPw: ""})
            this.setState({confirmNewPw: ""})

            this.setState({pwBeforeEdit: false})
            this.props.navigation.goBack()
          } }
        ]
      )
    } else{
      this.props.navigation.goBack()
    }
  }

  async editProfile() {  
    if( this.state.firstName !== this.state.firstNameEdited || this.state.lastName !== this.state.lastNameEdited || this.state.email !== this.state.emailEdited && (this.state.currPw === "" && this.state.newPw === "" && this.state.confirmNewPw === "")){
      let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(this.state.email !== this.state.emailEdited) {
        if (emailCheck.test(this.state.emailEdited) === false) {
          Alert.alert(
            "Invalid email address",
            "Please fill in a valid email address"
          )
          this.setState({emailEdited:this.state.email})
        } else{
          this.checkEmailAvailability()
        }
      } else{
        this.setState({pwBeforeEdit: true})
        }
    } else if(this.state.currPw !== "" && (this.state.newPw === "" && this.state.confirmNewPw === "")){
      alert("Please enter a new password")
    } else if(this.state.currPw !== "" && (this.state.newPw === "" || this.state.confirmNewPw === "")){
      alert("Please confirm new password")
    } else if(this.state.currPw !== "" && this.state.newPw !== "" && this.state.confirmNewPw !== ""){
      if(this.state.newPw !== this.state.confirmNewPw) {
        Alert.alert(
          "Passwords not same",
          "Please rewrite your password"
        )
        this.setState({currPw: ""})
        this.setState({newPw: ""})
        this.setState({confirmNewPw: ""})
      } else {
        this.confirmPw(this.state.currPw)
      }
    } else {
        this.props.navigation.goBack()
    }
  }

  async checkEmailAvailability(){

    let emails = []
    let userCollection = collection(DATABASE, "users")
    let userData = await getDocs(userCollection)
    if (userData.size > 0) {
      userData.forEach((doc) => {
        emails.push(doc.data().email)
      })
    }
    if(emails.includes(this.state.emailEdited)) {
      Alert.alert(
        "Email-address is already in use",
        "Please use another email address"
      )
      this.setState({emailEdited:this.state.email})
    } else{
    this.setState({pwBeforeEdit: true})
    }
  }
  
  async confirmPw(password) {
    this.setState({ isLoading: true });
    let comparePasswords;
    if(password === this.state.password) {
      comparePasswords = true
    } else {
      comparePasswords = false
    }

    let user = AUTH.currentUser
    
        if (comparePasswords) {
          // Update email if changed
          if(this.state.email !== this.state.emailEdited) {
            await updateEmail(user, this.state.emailEdited)
          }
          
          // Update password if changed
          if(this.state.currPw !== "" && this.state.newPw !== "" && this.state.confirmNewPw !== "") {
            await updatePassword(user, this.state.newPw)
            AsyncStorage.setItem("password", this.state.newPw);
          }

          // Update user details in database
          updateDoc(doc(DATABASE, "users", this.props.route.params.userId), {
            firstName: this.state.firstNameEdited,
            lastName: this.state.lastNameEdited,
            email: this.state.emailEdited,
          })
          
          // Set details in AsyncStorage
          AsyncStorage.setItem("firstName", this.state.firstNameEdited);
          AsyncStorage.setItem("lastName", this.state.lastNameEdited);
          AsyncStorage.setItem("email", this.state.emailEdited);

          this.props.navigation.navigate("Profile");
        } else {
            Alert.alert(
              "Incorrect password",
              "Please re-enter your password",
              [{ text: "OK", onPress: () => this.setState({ isLoading: false }) }]
              );
            this.setState({ pw: "" });
          }
  }


  render() {

    return (
      <View style={styles.container}>
            <Text style={styles.title}>Edit profile</Text>
          
            <View style={styles.editScreen}>
            {this.state.isLoading && <ActivityIndicator size="large"/>}

              <View style={styles.iconText}>
                <Text style={styles.text}>First Name:</Text>
  
                <TextInput
                style={styles.placeholder}
                placeholder="First Name"
                value={this.state.firstNameEdited}
                onChangeText={(txt) => this.setState({firstNameEdited: txt})}/>
              </View>
    
              <View style={styles.iconText}>
                <Text style={styles.text}>Last Name:</Text>

                <TextInput
                style={styles.placeholder}
                placeholder="Last Name"
                value={this.state.lastNameEdited}
                onChangeText={(txt) => this.setState({lastNameEdited: txt})}/>

              </View>
    
              <View style={styles.iconText}>
                <Text style={styles.text}>Email address:</Text>

                <TextInput
                style={[styles.placeholder, {marginBottom:hp("0%")}]}
                placeholder="someone@example.com"
                keyboardType="email-address"
                value={this.state.emailEdited}
                onChangeText={(txt) => this.setState({emailEdited: txt})}/>

              </View>
            </View>
              <Text style={styles.title}>Change password</Text>

              <View style={styles.editScreen}>
                <View style={styles.iconText}>
                  <Text style={styles.text}>Current Password:</Text>

                <TextInput
                style={styles.placeholder}
                placeholder="**********"
                secureTextEntry
                value={this.state.currPw}
                onChangeText={(txt) => this.setState({currPw: txt})}/>

                </View>
    
              <View style={styles.iconText}>
                <Text style={styles.text}>New Password:</Text>

                <TextInput
                style={styles.placeholder}
                placeholder="**********"
                secureTextEntry
                value={this.state.newPw}
                onChangeText={(txt) => this.setState({newPw: txt})}/>

              </View>
    
              <View style={styles.iconText}>
                <Text style={styles.text}>Confirm Password:</Text>
                <TextInput
                style={styles.placeholder}
                placeholder="**********"
                secureTextEntry
                value={this.state.confirmNewPw}
                onChangeText={(txt) => this.setState({confirmNewPw: txt})}/>

              </View>
              </View>

              <View style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
              <TouchableOpacity style={styles.buttonEdit} onPress={() => this.closeEditScreen()}>
                <Text style={styles.btnText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonEdit} onPress={() => this.editProfile()}>
                <Text style={styles.btnText}>Finish</Text>
              </TouchableOpacity>
            </View>

        {/* Password before confirming edit */}
        <Modal
        visible={this.state.pwBeforeEdit}>
          <View style={styles.confirmEdit}>
          <Ionicons
              name={"close"}
              size={hp("5%")}
              marginTop={hp("-45%")}
              marginBottom={hp("15%")}
              color="#115740"
              onPress={() => this.closeEditScreen()}
            />
            {this.state.isLoading && <ActivityIndicator size="large"/>}
            <Text style={styles.title}>Please enter your password</Text>
  
              <TextInput
              style={styles.placeholder}
              placeholder="**********"
              secureTextEntry
              value={this.state.pw}
              onChangeText={(txt) => this.setState({pw: txt})}/>
  
              <TouchableOpacity style={[styles.buttonEdit, {marginHorizontal:wp("32.5%")}]} onPress={() => this.confirmPw(this.state.pw)}>
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
        color: "#FF5E00"
      },
      editScreen: {
        marginHorizontal: wp("5%"),
        marginBottom: hp("5%")
      },
      iconText: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
      },
      placeholder: {
        height: hp("5%"),
        borderWidth: 1,
        padding: wp("2%"),
        marginHorizontal: wp("3%"),
        marginBottom: hp("3%"),
        borderRadius: 10
      },
      buttonEdit: {
        width: wp("35%"),
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
      confirmEdit:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
      }
});