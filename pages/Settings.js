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

import { collection, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore"; 
import {DATABASE} from "../firebaseConfig"
import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from 'react-native-bcrypt';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId:0,

      myRecipes:[{
        id:0,
        recipe:{}
      }],
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
              recipe: doc.data().recipe
            })
        }
    })
    }
    this.setState({userId: userId, myRecipes: myRecipes})

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

   if(this.state.myRecipes.length > 0) {
    for(let recipe of this.state.myRecipes) {
      await deleteDoc(doc(DATABASE, "recipes", recipe.id))
    }
   }

    // Remove everything from storage --> navigate back to profile page
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
          <Text style={styles.pageTitle}>Account settings</Text>
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