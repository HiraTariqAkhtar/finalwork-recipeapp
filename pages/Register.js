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
import translations from "../translation";


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

        isLoading: false,

        lang:"en"
    }
  }

  componentDidMount() {
    this.getLang()
  }

  async getLang() {
    let langSelected = await AsyncStorage.getItem("langSelected")
    if(langSelected !== null) {
      this.setState({lang: langSelected})
    } else {
      this.setState({lang: "en"})
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
        emails.push(doc.data().email.toLowerCase())
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
        translations[this.state.lang].alertAllFieldsRequired,
        translations[this.state.lang].fillInAllFields
      )
    } else {
    let emailCheck
    let pwCheck

    // email check
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) === false) {
      Alert.alert(
        translations[this.state.lang].invalidMail,
        translations[this.state.lang].plzFillValidMail
      )
      emailCheck =  false;
    }
    else {
      emailCheck =  true;
    }
    
    if(!this.state.emailAvailable) {
      Alert.alert(
        translations[this.state.lang].emailInUse,
        translations[this.state.lang].useAnotherMail
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
        translations[this.state.lang].pwNotSame,
        translations[this.state.lang].reEnterPw
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
        AsyncStorage.setItem("password", this.state.pw)

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
        emailAvailable = <Text style={{marginLeft:wp("3%"), marginBottom:hp("3%"), color:"#00FF00"}}>{ translations[this.state.lang].emailAvailable}</Text>
      } else {
      emailAvailable = <Text style={{marginLeft:wp("3%"), marginBottom:hp("3%"), color:"#FF0000"}}>{ translations[this.state.lang].emailInUse} {"\n"}{ translations[this.state.lang].useAnotherMail}</Text>
      }
    } else {
      emailAvailable = <Text></Text>
    }

    let pwOK;
    if(this.state.pw.length > 0) {
      if(this.state.pw.length >= 6) {
        pwOK = <Text style={{marginLeft:wp("3%"), marginTop:hp("-3%"), marginBottom:hp("3%"), color:"#00FF00"}}>{ translations[this.state.lang].pwOk}</Text>
      } else {
        pwOK = <Text style={{marginLeft:wp("3%"), marginTop:hp("-3%"), marginBottom:hp("3%"), color:"#FF0000"}}>{ translations[this.state.lang].pw6char}</Text>
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
          <Text style={styles.title}>{ translations[this.state.lang].signUp}</Text>
        </View>

          <View style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
              <Text style={styles.question}>{ translations[this.state.lang].alreadyUser}</Text>
              <Text style={styles.nav} onPress={() => this.login()}>{ translations[this.state.lang].login}</Text>
          </View>

          <ScrollView>
            <Text style={styles.text}>{ translations[this.state.lang].firstName}:</Text>
            <TextInput
            style={styles.placeholder}
            placeholder={translations[this.state.lang].firstName}
            onChangeText={(txt) => this.setState({firstName: txt})}/>
  
            <Text style={styles.text}>{ translations[this.state.lang].lastName}:</Text>
            <TextInput
            style={styles.placeholder}
            placeholder={translations[this.state.lang].lastName}
            onChangeText={(txt) => this.setState({lastName: txt})}/>
  
            <Text style={styles.text}>{ translations[this.state.lang].email}:</Text>
            <TextInput
            style={[styles.placeholder, {marginBottom:hp("0%")}]}
            placeholder="someone@example.com"
            keyboardType="email-address"
            value={this.state.email}
            onChangeText={(txt) => this.checkEmailAvailability(txt)}/>
            {emailAvailable}
  
            <Text style={styles.text}>{translations[this.state.lang].pw}:</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="**********"
            secureTextEntry
            value={this.state.pw}
            onChangeText={(txt) => this.setState({pw: txt})}/>
            {pwOK}
  
            <Text style={styles.text}>{translations[this.state.lang].confirmPw}:</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="**********"
            secureTextEntry
            value={this.state.pwConfirm}
            onChangeText={(txt) => this.setState({pwConfirm: txt})}/>

          <TouchableOpacity style={[styles.button, {marginLeft: wp("50%")}]} onPress={() => this.checkInputData()}>
            <Text style={styles.btnText}>{translations[this.state.lang].next}</Text>
          </TouchableOpacity>
          </ScrollView>


          <Modal
          visible={this.state.confirmDetails}>
            
            <Text style={[styles.question, {marginLeft:wp("5%"),  marginTop:hp("5%")}]}>{translations[this.state.lang].confirmBeforeFinish}</Text>

            {this.state.isLoading && <ActivityIndicator size="large"/>}
            
            <View style={{marginLeft:wp("5%"), marginBottom:hp("1.5%")}}>
              <View style={styles.iconText}>
              <Text style={{marginBottom:hp("1.5%")}}>{translations[this.state.lang].name}: {this.state.firstName} {this.state.lastName}</Text>
               <FontAwesome
                name="pencil"
                size={hp("2.5%")}
                marginLeft={wp("3%")}
                color="#115740"
                onPress={() => this.setState({confirmDetails: false})}/>

              </View>
              <View style={styles.iconText}>
              <Text style={{marginBottom:hp("1.5%")}}>{translations[this.state.lang].email}: {this.state.email}</Text>
               <FontAwesome
                name="pencil"
                size={hp("2.5%")}
                marginLeft={wp("3%")}
                color="#115740"
                onPress={() => this.setState({confirmDetails: false})}/>

              </View>
              <View style={styles.iconText}>
                <Text>{translations[this.state.lang].pw}: {pw}</Text>
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
              <Text style={styles.btnText}>{translations[this.state.lang].back}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => this.register()}>
              <Text style={styles.btnText}>{translations[this.state.lang].finish}</Text>
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