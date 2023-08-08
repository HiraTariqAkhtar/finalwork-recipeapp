import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  ActivityIndicator
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

import axios from "axios";
import {LOCATION_API_KEY} from '@env'
import { collection, getDocs, addDoc } from "firebase/firestore"; 
import {DATABASE} from "../firebaseConfig"

import AsyncStorage from "@react-native-async-storage/async-storage";
import translations from '../translation'



export default class AddToMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        placeName: "",
        streetNum: "",
        postalCode: 0,
        city: "",
        placeTypes: [],
        typeSelectedInRadioBtn: [],
        selectedType: "",
        latitude: 0,
        longitude: 0,
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
      this.setState({lang: langSelected, placeTypes: translations[langSelected].placeTypes})
    } else {
      this.setState({lang: "en", placeTypes: translations["en"].placeTypes})
    }
  }

  selectRadioBtn(i, type) {
    // Check if an item is already selected
    const hasSelectedElement = this.state.typeSelectedInRadioBtn.some((element) => element === true);
  
    // Set all radio buttons as not selected when selecting another
    if (hasSelectedElement && !this.state.typeSelectedInRadioBtn[i]) {
      this.state.typeSelectedInRadioBtn.fill(false);
    }
    this.state.typeSelectedInRadioBtn[i] = !this.state.typeSelectedInRadioBtn[i];

    this.setState({ typeSelectedInRadioBtn: this.state.typeSelectedInRadioBtn, selectedType: type });

  }

  checkInputFields(){
        if(this.state.placeName == "" || this.state.selectedType == "" || this.state.streetNum == "" || this.state.postalCode == 0 || this.state.city == "") {
            Alert.alert(
                translations[this.state.lang].alertAllFieldsRequired,
                translations[this.state.lang].fillInAllFields
            )
        } else {
            this.getLatLng()
        }
  }

  async getLatLng(){
      axios.get(`https://geocode.search.hereapi.com/v1/geocode?q=${this.state.streetNum}, ${this.state.postalCode} ${this.state.city}&apiKey=${LOCATION_API_KEY}`)
      .then((res) => {
          //console.log(res.data.items[0].position)
          let latLng = res.data.items[0].position
          this.setState({latitude : latLng.lat, longitude : latLng.lng})
          this.addToMap()
      })
  }

  async addToMap() {
    this.setState({isLoading: true})
    setTimeout(async() => {
      let collectionName;
      if (this.state.selectedType === "Restaurant") {
        collectionName = "restaurants"
      } else {
        collectionName = "supermarkets"
      }
      //console.log(collectionName)
      let mapCollection = collection(DATABASE, collectionName)
      let mapData = await getDocs(mapCollection)

       addDoc((mapCollection), {
          id: mapData.size + 1,
          title: this.state.placeName,
          description: `${this.state.streetNum}, ${this.state.postalCode} ${this.state.city}`,
          coordinate: {
              latitude: this.state.latitude,
              longitude: this.state.longitude
          }
      })

      ToastAndroid.show(`${this.state.placeName} ${translations[this.state.lang].succesfullyAdded}`, ToastAndroid.SHORT)
      this.props.navigation.navigate("Map", { refresh: Date.now() });
    }, 100)
  }

  goBack() {
      if(this.state.placeName !== "" || this.state.selectedType !== "" || this.state.streetNum !== "" || this.state.postalCode !== 0 || this.state.city !== "") {
          Alert.alert(
            translations[this.state.lang].leavePage,
            translations[this.state.lang].unsavedChanges,
            [
              { text: translations[this.state.lang].no, style:"cancel" },
              { text: translations[this.state.lang].yes, onPress: () => {this.props.navigation.goBack()} }
            ]
          )
      } else {
        this.props.navigation.goBack()
      }
}


  render() {
    let select = this.state.placeTypes.map((type, index) => (
        <View style={styles.iconText} key={index}>
          <Ionicons
            name={this.state.typeSelectedInRadioBtn[index] ? "radio-button-on" : "radio-button-off"}
            color="#115740"
            size={hp("3%")}
            marginLeft={wp("3%")}
            onPress={() => {
              this.selectRadioBtn(index, type)
            }}
          />
          <Text style={styles.textRadio}>{type}</Text>
        </View>
      ));

    return (
      <View style={styles.container}>
          <View style={styles.header}>
              <Ionicons
                  name={"arrow-back"}
                  size={hp("5%")}
                  color="#115740"
                  marginRight={wp("5%")}
                  onPress={() => this.goBack()}
                />
              <Text style={styles.title}>{translations[this.state.lang].addToMap}</Text>
          </View>
          {this.state.isLoading && <ActivityIndicator size="large"/>}

          <ScrollView style={{marginTop: hp("3%")}}>
            <Text style={styles.text}>{translations[this.state.lang].placeName}</Text>
            <TextInput
            style={styles.placeholder}
            placeholder={translations[this.state.lang].placeName.slice(0, -2)}
            value={this.state.placeName}
            onChangeText={(txt) => this.setState({placeName: txt})}/>

            <Text style={styles.text}>{translations[this.state.lang].placeType}</Text>
            <View style={styles.placeTypeChoice}>
              <View style={{display:"flex", flexDirection:"row"}}>
                  {select}
              </View>
            </View>
            
            <Text style={styles.text}>{translations[this.state.lang].streetNum}</Text>
            <TextInput
            style={styles.placeholder}
            placeholder={translations[this.state.lang].streetNum.slice(0, -2)}
            value={this.state.streetNum}
            onChangeText={(txt) => this.setState({streetNum: txt})}/>

            <View style={{display:"flex", flexDirection:"row"}}>
                <View style={{display:"flex", flexDirection:"column"}}>
                    <Text style={styles.text}>{translations[this.state.lang].postalCode}</Text>
                        <TextInput
                        style={[styles.placeholder, {width:wp("25%")}]}
                        placeholder={translations[this.state.lang].postalCode.slice(0, -2)}
                        inputMode="numeric"
                        value={this.state.postalCode}
                        onChangeText={(txt) => this.setState({postalCode: parseInt(txt)})}/>
                </View>
                <View style={{display:"flex", flexDirection:"column"}}>
                    <Text style={styles.text}>{translations[this.state.lang].city}</Text>
                        <TextInput
                        style={[styles.placeholder, {width:wp("55%")}]}
                        placeholder={translations[this.state.lang].city.slice(0, -2)}
                        value={this.state.city}
                        onChangeText={(txt) => this.setState({city: txt})}/>
                </View>
            </View>

            
          <TouchableOpacity style={styles.button} onPress={() => this.checkInputFields()}>
            <Text style={styles.btnText}>{translations[this.state.lang].addToMap}</Text>
          </TouchableOpacity> 
          </ScrollView>
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
      title: {
        textAlign: 'center',
        fontFamily: "Nunito_700Bold",
        fontSize: hp("3.5%"),
        color: "#FF5E00",
      },
      text: {
        fontFamily: "Nunito_700Bold",
        marginBottom: hp("1%"),
        marginLeft: wp("3%")
    },
    placeholder: {
      height: hp("5%"),
      borderWidth: 2,
      padding: wp("2%"),
      marginHorizontal: wp("5%"),
      marginBottom: hp("2%"),
      borderColor: "#115740",
      borderRadius: 10,
    },
    button: {
        width: wp("80%"),
        padding: hp("1%"),
        backgroundColor: "#115740",
        borderRadius: 10,
        marginTop: hp("5%"),
        marginHorizontal: wp("10%")
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
    textRadio: {
        fontFamily:"Nunito_400Regular",
        fontSize: hp("2%"),
        marginLeft: wp("2%")
      },
      placeTypeChoice: {
        marginBottom:hp("3%"),
        borderRadius: 10,
        borderColor: "#115740",
        borderWidth: 2,
        width: wp("90%"),
        marginHorizontal: wp("5%"),
        paddingVertical: hp("2%")
      },
});