import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"; 
import {DATABASE, AUTH, STORAGE} from "../firebaseConfig"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUser } from "firebase/auth"; 
import { ref, deleteObject } from 'firebase/storage';
import translations from "../translation";


export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId:0,

      myRecipes:[{
        id:0,
        recipe:{}
      }],

      lang:"en"
    }
  }

  componentDidMount(){
    this.getLang()
  }

  async getLang() {
    let langSelected = await AsyncStorage.getItem("langSelected")
    if(langSelected !== null) {
      this.setState({lang: langSelected})
    } else {
      this.setState({lang: "en"})
    }

    this.getUserDetails()

  }


  async getUserDetails() {
      let userEmail = await AsyncStorage.getItem("email")
     let userId = 0

    let userCollection = collection(DATABASE, "users")
    let userData = await getDocs(userCollection)
    if (userData.size > 0) {
      userData.forEach((doc) => {
        if(doc.data().email == userEmail) {
            userId = doc.id
        }
      })
    }

    let myRecipes = []

    let recipeCollection = collection(DATABASE, "recipes")
    let recipes = await getDocs(recipeCollection)
    if (recipes.size > 0) {
        recipes.forEach((doc) => {
        if(doc.data().userId === userId) {
            myRecipes.push({
              id: doc.id,
              foodImg: doc.data().img
            })
        }
    })
    }
    this.setState({userId: userId, myRecipes: myRecipes})

  }

  async confirmDelete() {
    Alert.alert(
      translations[this.state.lang].deleteAcc,
      translations[this.state.lang].confirmDeleteAcc,
      [
        { text: translations[this.state.lang].no, style:"cancel" },
        { text: translations[this.state.lang].yes, onPress: () => this.deleteProfile() }
      ]
    )
  }

  async deleteProfile() {
   if(this.state.myRecipes.length > 0) {
    for(let recipe of this.state.myRecipes) {
      // Remove recipes made by user from db
      await deleteDoc(doc(DATABASE, "recipes", recipe.id))

      //Remove recipe image from storage
      if(recipe.foodImg !== "") {
        const foodImg = ref(STORAGE, recipe.foodImg)
        await deleteObject(foodImg)
      }
    }
   }
   // Remove profile pic from storage
   const profilePic = ref(STORAGE, `profilePicUser${this.state.userId}`)
   try{
     await deleteObject(profilePic)
   } catch(e) {
     console.log(e)
   }

   await deleteDoc(doc(DATABASE, "users", this.state.userId));
   await deleteUser(AUTH.currentUser)

    // Remove everything from AsyncStorage --> navigate back to profile page
    await AsyncStorage.removeItem("userLoggedIn")
    await AsyncStorage.removeItem("firstName")
    await AsyncStorage.removeItem("lastName")
    await AsyncStorage.removeItem("email")

    this.props.navigation.navigate("Profile")
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons
              name={"arrow-back"}
              size={hp("5%")}
              color="#115740"
              onPress={() => this.props.navigation.goBack()}
            />
          <Text style={styles.pageTitle}>{translations[this.state.lang].settings}</Text>
        </View>
          <View style={{marginTop: hp("25%"), marginHorizontal: wp("10%")}}>
            <TouchableOpacity style={styles.button}
            onPress={() => this.props.navigation.navigate("EditProfile",{userId: this.state.userId})}>
            <View style={styles.iconText}>
                <FontAwesome
                name="pencil"
                color="#FFFFFF"
                size={hp("3%")}
                marginHorizontal={wp("5%")}/>
                <Text style={styles.btnText}>{translations[this.state.lang].editProfile}</Text>
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
                <Text style={styles.btnText}>{translations[this.state.lang].deleteProfile}</Text>
            </View>
          </TouchableOpacity>
          </View>
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
    marginHorizontal: wp("7.5%")
  },
  pageTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: hp("3.5%"),
    color:"#FF5E00",
    marginLeft: wp("10%")
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
  iconText: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  
  title: {
    textAlign: 'center',
    fontFamily: "Nunito_700Bold",
    fontSize: hp("3.5%"),
    marginBottom: hp("3%"),
    color:"#FF5E00",
  },
 
  
});