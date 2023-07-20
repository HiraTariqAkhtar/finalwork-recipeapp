import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import axios from "axios";
import {LOCATION_API_KEY} from '@env'
import { collection, getDocs, addDoc } from "firebase/firestore"; 
import {DATABASE} from "../firebaseConfig"


export default class AddToMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        placeName: "",
        streetNum: "",
        postalCode: 0,
        city: "",
        placeTypes: ["Restaurant", "Supermarket"],
        typeSelectedInRadioBtn: [],
        selectedType: "",
        latitude: 0,
        longitude: 0
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
                "All fields required",
                "Please fill in all fields"
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
      console.log("added!!!")
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
                  marginRight={wp("15%")}
                  onPress={() => this.props.navigation.goBack()}
                />
              <Text style={styles.title}>Add to map</Text>
          </View>

          <ScrollView style={{marginTop: hp("3%")}}>
            <Text style={styles.text}>Place name *</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="Place Name"
            value={this.state.placeName}
            onChangeText={(txt) => this.setState({placeName: txt})}/>

            <Text style={styles.text}>Place type *</Text>
            <View style={{display:"flex", flexDirection:"row"}}>
                {select}
            </View>
            
            <Text style={styles.text}>Street + number *</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="Street + number"
            value={this.state.streetNum}
            onChangeText={(txt) => this.setState({streetNum: txt})}/>

            <View style={{display:"flex", flexDirection:"row"}}>
                <View style={{display:"flex", flexDirection:"column"}}>
                    <Text style={styles.text}>Postal code *</Text>
                        <TextInput
                        style={[styles.placeholder, {width:wp("25%")}]}
                        placeholder="Postal Code"
                        inputMode="numeric"
                        value={this.state.postalCode}
                        onChangeText={(txt) => this.setState({postalCode: parseInt(txt)})}/>
                </View>
                <View style={{display:"flex", flexDirection:"column"}}>
                    <Text style={styles.text}>City *</Text>
                        <TextInput
                        style={[styles.placeholder, {width:wp("63%")}]}
                        placeholder="City"
                        value={this.state.city}
                        onChangeText={(txt) => this.setState({city: txt})}/>
                </View>
            </View>

            
          <TouchableOpacity style={styles.button} onPress={() => this.checkInputFields()}>
            <Text style={styles.btnText}>Add to map</Text>
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
        color: "#FF5E00"
      },
      text: {
        fontFamily: "Nunito_700Bold",
        marginBottom: hp("1%"),
        marginLeft: wp("3%")
    },
    placeholder: {
        height: hp("5%"),
        borderWidth: 1,
        padding: wp("2%"),
        marginHorizontal: wp("3%"),
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
});