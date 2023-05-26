import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      profilePic: null,
      isLoggedIn: false
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
    }
  }

  async getUserInfo(){
    
  }

  async addProfilePic() {
    
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
        <TouchableOpacity style={styles.button}>
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

    return (
      <View style={styles.container}>
         <Text style={styles.title}>Profile</Text>
         <Ionicons
            name={"person-circle"}
            size={hp("25%")}
            color="#878787"
            marginTop={hp("5%")}
          />
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
    marginTop: hp("8%"),
    alignItems:"center"
  },
  title: {
    fontFamily: "Nunito_700Bold",
    fontSize: hp("3.5%")
  },
  name: {
    fontFamily: "Nunito_400Regular",
    fontSize: hp("3%")
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
  }
});
