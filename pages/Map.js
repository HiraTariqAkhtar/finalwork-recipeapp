import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Image
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import SelectDropdown from 'react-native-select-dropdown'


export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mapOptions: ["All", "Restaurants", "Supermarkets"]
    }
  }

  async filterResults(selected) {
    console.log(selected)
  }


  render() {

    return (
      <View style={styles.container}>
          <Text style={styles.title}>Map</Text>
          <SelectDropdown
          buttonStyle = {styles.dropDown}
          buttonTextStyle = {styles.dropDownText}
          dropdownStyle = {styles.dropDownOptions}
          rowTextStyle = {styles.dropDownText}
          data = {this.state.mapOptions}
          onSelect={(selectedItem) => {
            this.filterResults(selectedItem)
          }}
          defaultValue = "All"
          renderDropdownIcon={isOpened => {
            return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#115740'} size={20} />;
          }}/>

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
      title: {
        textAlign: 'center',
        fontFamily: "Nunito_700Bold",
        fontSize: hp("3.5%"),
        color: "#FF0000"
      },
      dropDown: {
        width: wp("80%"),
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: "#115740",
        borderWidth: 2,
        marginHorizontal: wp("10%"),
        marginTop: hp("3%")
      },
      dropDownOptions: {
        backgroundColor: "#fff",
        borderRadius: 10,
      },
      dropDownText: {
        fontFamily: "Nunito_700Bold",
        fontSize: hp("2.5%"),
      }
});