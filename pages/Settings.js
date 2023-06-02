import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
  TextInput,
  ActivityIndicator
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import { collection, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore"; 
import {DATABASE} from "../firebaseConfig"
import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from 'react-native-bcrypt';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        editModalVisible: false,

        firstName: "",
        lastName: "",
        email:"",
        userId:0,

        firstNameEdited:"",
        lastNameEdited:"",
        emailEdited:"",
        currPw:"",
        newPw:"",
        confirmNewPw:"",

        pwBeforeEdit: false,
        pw:"",
        isLoading: false
    }

    this.getUserDetails()
  }

  async getUserDetails() {
      let userFirstName = await AsyncStorage.getItem("firstName")
      let userLastName = await AsyncStorage.getItem("lastName")
      let userEmail = await AsyncStorage.getItem("email")
  
     if(userFirstName !== null && userLastName !== null && userEmail !== null) {
      this.setState({firstName: userFirstName})
      this.setState({lastName: userLastName})
      this.setState({email: userEmail})
      
      this.setState({firstNameEdited: userFirstName})
      this.setState({lastNameEdited: userLastName})
      this.setState({emailEdited: userEmail})
     }

     let userId = 0

    let userCollection = collection(DATABASE, "users")
    let userData = await getDocs(userCollection)
    if (userData.size > 0) {
      userData.forEach((doc) => {
        if(doc.data().email == this.state.email) {
            userId = doc.id
        }
      })
    }
    this.setState({userId: userId})

  }

  async confirmDelete() {
    Alert.alert(
      "Delete account?",
      "Are you sure you want to delete your account? \n \nThis action cannot be undone.",
      [
        { text: "No", style:"cancel" },
        { text: "Yes", onPress: () => this.deleteProfile() }
      ]
    )
  }

  async deleteProfile() {
    
    await deleteDoc(doc(DATABASE, "users", this.state.userId));

    // Remove everything from storage --> navigate back to profile page
    await AsyncStorage.removeItem("userLoggedIn")
    await AsyncStorage.removeItem("firstName")
    await AsyncStorage.removeItem("lastName")
    await AsyncStorage.removeItem("email")

    this.props.navigation.navigate("Profile")
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
            this.setState({editModalVisible: false})
            this.setState({firstNameEdited: this.state.firstName})
            this.setState({lastNameEdited: this.state.lastName})
            this.setState({emailEdited: this.state.email})
            this.setState({currPw: ""})
            this.setState({newPw: ""})
            this.setState({confirmNewPw: ""})

            this.setState({pwBeforeEdit: false})
          } }
        ]
      )
    } else{
      this.setState({editModalVisible: false})
    }
  }

  async editProfile() {  
    if( this.state.firstName !== this.state.firstNameEdited || this.state.lastName !== this.state.lastNameEdited || this.state.email !== this.state.emailEdited && (this.state.currPw === "" && this.state.newPw === "" && this.state.confirmNewPw === "")){
      let emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (emailCheck.test(this.state.emailEdited) === false) {
        Alert.alert(
          "Invalid email address",
          "Please fill in a valid email address"
        )
        this.setState({emailEdited:this.state.email})
      } else{
        this.checkEmailAvailability()
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
      this.setState({editModalVisible: false})
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

    let userCollection = collection(DATABASE, "users")
    let userData = await getDocs(userCollection)
    
    let userPw = ""

    if (userData.size > 0) {
      userData.forEach((doc) => {
        if(doc.data().email == this.state.email) {
          userPw = doc.data().password
        }
      })
    }
    let comparePasswords = bcrypt.compareSync(password, userPw);
        if (comparePasswords) {
          let pwHash = bcrypt.hashSync(this.state.newPw, 8);
          updateDoc(doc(DATABASE, "users", this.state.userId), {
            firstName: this.state.firstNameEdited,
            lastName: this.state.lastNameEdited,
            email: this.state.emailEdited,
            password: pwHash
          })
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
          <TouchableOpacity style={styles.button}
          onPress={() => this.setState({editModalVisible: true})}>
          <View style={styles.iconText}>
              <FontAwesome
              name="pencil"
              color="#FFFFFF"
              size={hp("3%")}
              marginHorizontal={wp("5%")}/>
              <Text style={styles.btnText}>Edit profile</Text>
          </View>
        </TouchableOpacity>
              
        <TouchableOpacity style={[styles.button, {backgroundColor: "#FF0000"}]}
        onPress={() => this.confirmDelete()}>
          <View style={styles.iconText}>
              <Ionicons
              name="trash-outline"
              color="#FFFFFF"
              size={hp("3%")}
              marginHorizontal={wp("5%")}/>
              <Text style={styles.btnText}>Delete profile</Text>
          </View>
        </TouchableOpacity>

        <Modal
        visible={this.state.editModalVisible}>
          <Ionicons
              name={"close"}
              size={hp("5%")}
              marginLeft={wp("5%")}
              marginTop={hp("3%")}
              onPress={() => this.closeEditScreen()}
            />
            <View style={styles.editScreen}>
            {this.state.isLoading && <ActivityIndicator size="large"/>}

                <Text style={styles.title}>Edit profile</Text>

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
        </Modal>

        {/* Password before confirming edit */}
        <Modal
        visible={this.state.pwBeforeEdit}>
          <View style={styles.confirmEdit}>
          <Ionicons
              name={"close"}
              size={hp("5%")}
              marginTop={hp("-45%")}
              marginBottom={hp("15%")}
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
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: wp("80%"),
    padding: hp("1%"),
    backgroundColor: "#34359A",
    borderRadius: wp("50%"),
    marginBottom: hp("3%")
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
  },
  editScreen: {
    marginHorizontal: wp("5%"),
    marginBottom: hp("5%")
  },
  title: {
    textAlign: 'center',
    fontFamily: "Nunito_700Bold",
    fontSize: hp("3.5%"),
    marginBottom: hp("3%")
  },
  placeholder: {
    height: hp("5%"),
    borderWidth: 1,
    padding: wp("2%"),
    marginHorizontal: wp("3%"),
    marginBottom: hp("3%")
  },
  buttonEdit: {
    width: wp("35%"),
    padding: hp("1%"),
    backgroundColor: "#34359A",
    borderRadius: wp("50%"),
    marginTop: hp("3%"),
  },
  confirmEdit:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  }
});