import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import { collection, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore"; 
import {DATABASE} from "../firebaseConfig"
import AsyncStorage from "@react-native-async-storage/async-storage";


export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        editModalVisible: false,

        firstName: "",
        lastName: "",
        email:""
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
     }

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
    await deleteDoc(doc(DATABASE, "users", userId));

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
});