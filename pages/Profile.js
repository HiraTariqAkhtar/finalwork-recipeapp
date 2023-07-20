import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  ToastAndroid
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as ImagePicker from 'expo-image-picker'
import {STORAGE} from "../firebaseConfig"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      profilePic: null,
      isLoggedIn: false,
      isUploading: false
    }
  }

  componentDidMount() {
    this.checkLoggedIn()

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn()
  });
  }

  async checkLoggedIn(){
    let loggedIn = await AsyncStorage.getItem("userLoggedIn")
    if(loggedIn !== null) {
      this.setState({isLoggedIn: true})
      this.getUserInfo()
    } else {
      this.setState({isLoggedIn: false})
      this.setState({firstName: ""})
      this.setState({lastName: ""})
    }
  }

  async getUserInfo(){
    let userFirstName = await AsyncStorage.getItem("firstName")
    let userLastName = await AsyncStorage.getItem("lastName")

   if(userFirstName !== null && userLastName !== null) {
    this.setState({firstName: userFirstName})
    this.setState({lastName: userLastName})
   }

   // get profile pic
   const imgRef = ref(STORAGE, `profilePic${this.state.firstName}${this.state.lastName}`)
   try{
     await getDownloadURL(imgRef)
     .then((img) => {
       this.setState({profilePic: img})
     })
   } catch(e) {
    this.setState({profilePic: null})
   }

  }

  async addProfilePic() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1
    })

    if(!result.canceled) {
      const storageRef = ref(STORAGE, `profilePic${this.state.firstName}${this.state.lastName}`)  // The name you want to give to uploaded img

      const img = await fetch(result.assets[0].uri)
      const blobFile = await img.blob()

      await uploadBytes(storageRef, blobFile)

      this.uploadPic()
    } else {
      ToastAndroid.show("No photo selected", ToastAndroid.SHORT)
    }
  }

  async uploadPic() {
    const imgRef = ref(STORAGE, `profilePic${this.state.firstName}${this.state.lastName}`)
    await getDownloadURL(imgRef)
    .then((img) => {
      this.setState({profilePic: img})
    })
  }


  async updateProfilePic() {

  }

  async removeProfilePic() {

  }

  async logIn() {
    this.props.navigation.navigate("LogIn")
  }

  async logOut() {
    await AsyncStorage.removeItem("userLoggedIn")
    await AsyncStorage.removeItem("firstName")
    await AsyncStorage.removeItem("lastName")
    await AsyncStorage.removeItem("email")
    this.setState({firstName: ""})
    this.setState({lastName: ""})
    this.setState({profilePic: null})
    this.setState({isLoggedIn: false})
  }


  render() {
    let login;
    if(this.state.isLoggedIn) {
      login =
      <View>
        <TouchableOpacity style={styles.button}
        onPress={() => this.props.navigation.navigate("Cookbook")}>
          <Text style={styles.btnText}>My Cookbook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
        onPress={() => this.props.navigation.navigate("Settings")}>
          <Text style={styles.btnText}>Settings</Text>
        </TouchableOpacity>
              
        <TouchableOpacity style={styles.button}
        onPress={() => this.logOut()}>
          <Text style={styles.btnText}>Log out</Text>
        </TouchableOpacity>
      </View>
      
    } else {
      login = 
      <TouchableOpacity style={styles.button}
      onPress={() => this.logIn()}>
        <Text style={styles.btnText}>Log in</Text>
      </TouchableOpacity>
    }

    let profilePic;
    if(this.state.profilePic == null || this.state.profilePic == undefined) {
      profilePic = 
      <Ionicons
            name={"person-circle"}
            size={hp("25%")}
            color="#878787"
            marginTop={hp("5%")}
            onPress={() => this.addProfilePic()}
          />
    } else {
      profilePic = 
      <Image
      src= {this.state.profilePic}
      style={styles.profilePic}/>
    }

    return (
      <View style={styles.container}>
         <Text style={styles.title}>Profile</Text>
         {profilePic}
          <Text style={styles.name}>{this.state.firstName} {this.state.lastName}</Text>
          <View style={{marginTop: hp("10%")}}>
            
            {login}
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingBottom: hp("5%"),
    paddingTop: hp("5%"),
    backgroundColor:"#FFFFFF"
  },
  title: {
    fontFamily: "Nunito_700Bold",
    fontSize: hp("3.5%"),
    color: "#FF5E00"
  },
  name: {
    fontFamily: "Nunito_400Regular",
    fontSize: hp("3%")
  },
   button: {
    width: wp("80%"),
    padding: hp("1%"),
    backgroundColor: "#115740",
    borderRadius: 10,
    marginBottom: hp("3%")
  },
btnText:{
    fontFamily:"Nunito_700Bold",
    fontSize: hp("2.5%"),
    color: "#ffffff",
    textAlign: "center"
},
profilePic: {
  width: hp("25%"),
  height: hp("25%"),
  marginTop: hp("5%"),
  marginBottom: hp("3%"),
  borderRadius: 10,
}
});
