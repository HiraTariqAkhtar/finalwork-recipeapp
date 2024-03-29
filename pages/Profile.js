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
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as ImagePicker from 'expo-image-picker'
import {STORAGE, DATABASE, AUTH} from "../firebaseConfig"
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, getDocs } from "firebase/firestore"; 
import { signInWithEmailAndPassword, signOut } from "firebase/auth"; 

import translations from '../translation'


export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      profilePic: null,
      isLoggedIn: false,
      userId: "",
      lang:"en"
    }
  }

  componentDidMount() {
    this.getLang()

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getLang()
  });
  }

  async getLang() {
    let langSelected = await AsyncStorage.getItem("langSelected")
    if(langSelected !== null) {
      this.setState({lang: langSelected})
    } else {
      this.setState({lang: "en"})
    }

    this.checkLoggedIn()
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
    let userEmail = await AsyncStorage.getItem("email")
    let userPw = await AsyncStorage.getItem("password")
    let userId = 0

    if(userEmail !== null) {

      // Login user again to get user from firebase auth
      await signInWithEmailAndPassword(AUTH, userEmail, userPw)

      // Get user id and name from firebase
      let userFirstName;
      let userLastName;

        let userCollection = collection(DATABASE, "users")
        let userData = await getDocs(userCollection)
    
        if (userData.size > 0) {
          userData.forEach((doc) => {
            if(doc.data().email == userEmail) {
                userId = doc.id
                userFirstName = doc.data().firstName
                userLastName = doc.data().lastName
            }
          })

          // check if user has uploaded a profile pic --> get url
        const userProfilePic = ref(STORAGE, `profilePicUser${userId}`)
        try {
          await getDownloadURL(userProfilePic)
          .then((img) => {
            this.setState({profilePic: img})
          })
        } catch {
          this.setState({profilePic: null})
        }
        }
        this.setState({userId: userId, firstName: userFirstName, lastName: userLastName})
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
      const storageRef = ref(STORAGE, `profilePicUser${this.state.userId}`)  // The name you want to give to uploaded img

      const uri = result.assets[0].uri
      const blobFile = await this.uriToBlob(uri);
      console.log(blobFile);

      await uploadBytes(storageRef, blobFile)

      this.uploadPic()
    } else {
      ToastAndroid.show(translations[this.state.lang].noPhotoSelected, ToastAndroid.SHORT)
    }
  }

  uriToBlob(uri) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        reject(console.log('uriToBlob failed'));
      };

      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    })
  }

  async uploadPic() {
    const imgRef = ref(STORAGE, `profilePicUser${this.state.userId}`)
    await getDownloadURL(imgRef)
    .then((img) => {
      this.setState({profilePic: img})
    })
  }

  async confirmDelete(){
    Alert.alert(
      translations[this.state.lang].removeProfilePic,
      translations[this.state.lang].confirmRemoveProfilePic,
      [
        {text: translations[this.state.lang].no, style: 'cancel'},
        {text: translations[this.state.lang].yes, onPress: () => this.removeProfilePic()}
      ]
    )
  }
  
  async removeProfilePic() {
    const imgRef = ref(STORAGE, `profilePicUser${this.state.userId}`)
    await deleteObject(imgRef)
    .then(() => {
      this.setState({profilePic: null})
      ToastAndroid.show(translations[this.state.lang].profilePicRemoved, ToastAndroid.SHORT)
    })
  }

  async logIn() {
    this.props.navigation.navigate("LogIn")
  }

  async register() {
    this.props.navigation.navigate("Register")
  }

  async logOut() {
    await AsyncStorage.removeItem("userLoggedIn")
    await AsyncStorage.removeItem("firstName")
    await AsyncStorage.removeItem("lastName")
    await AsyncStorage.removeItem("email")
    await AsyncStorage.removeItem("password")
    
    await signOut(AUTH)

    this.setState({firstName: ""})
    this.setState({lastName: ""})
    this.setState({profilePic: null})
    this.setState({isLoggedIn: false})
  }


  render() {
    let login;
    let profilePic;
    let uploadPic;
    let editPic;
    let removePic;

    if(this.state.isLoggedIn) {
      login =
      <View>
        <TouchableOpacity style={styles.button}
        onPress={() => this.props.navigation.navigate("Cookbook")}>
          <Text style={styles.btnText}>{translations[this.state.lang].myCookbook}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
        onPress={() => this.props.navigation.navigate("Settings")}>
          <Text style={styles.btnText}>{translations[this.state.lang].settings}</Text>
        </TouchableOpacity>
              
        <TouchableOpacity style={styles.button}
        onPress={() => this.logOut()}>
          <Text style={styles.btnText}>{translations[this.state.lang].logOut}</Text>
        </TouchableOpacity>
      </View>
      
      if(this.state.profilePic == null || this.state.profilePic == undefined) {
        profilePic = 
        <Ionicons
          name={"person-circle"}
          size={hp("25%")}
          color="#878787"
          marginTop={hp("5%")}
        />
        uploadPic = 
        <FontAwesome
          name={"upload"}
          size={hp("4%")}
          color="#115740"
          marginTop={hp("-25%")}
          marginBottom={hp("25%")}
          marginLeft={wp("50%")}
          onPress={() => this.addProfilePic()}
        />
      } else {
        profilePic = 
        <Image
        src= {this.state.profilePic}
        style={styles.profilePic}/>
  
        editPic = 
        <FontAwesome
          name={"edit"}
          size={hp("4%")}
          color="#115740"
          marginRight={wp("3%")}
          onPress={() => this.addProfilePic()}
        />
  
        removePic =
        <Ionicons
          name={"trash-outline"}
          size={hp("4%")}
          color="#ff0000"
          onPress={() => this.confirmDelete()}
        />
      }
    } else {
      login = 
      <View>
        <TouchableOpacity style={styles.button}
        onPress={() => this.logIn()}>
          <Text style={styles.btnText}>{translations[this.state.lang].login}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
        onPress={() => this.register()}>
          <Text style={styles.btnText}>{translations[this.state.lang].signUp}</Text>
        </TouchableOpacity>
      </View>

      profilePic = 
      <Ionicons
        name={"person-circle"}
        size={hp("25%")}
        color="#878787"
        marginTop={hp("5%")}
      />
    }

    

    return (
      <View style={styles.container}>
         <Text style={styles.title}>{translations[this.state.lang].profile}</Text>
         {profilePic}
           {uploadPic}
         <View style={styles.managePic}>
           {editPic}
           {removePic}
         </View>
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
},
managePic: {
  display:"flex",
  flexDirection:"row",
  marginLeft: wp("75%"),
  marginTop: hp("-28%"),
  marginBottom: hp("25%")
}
});
