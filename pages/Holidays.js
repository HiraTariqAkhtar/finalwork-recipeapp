import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

import axios from "axios";
import {HOLIDAYS_API_KEY} from '@env'



export default class Holidays extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}

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
          <Text style={styles.pageTitle}>{this.props.route.params.name}</Text>
        </View>
        <ScrollView style={{marginHorizontal: wp("7.5%"), marginTop: hp("3%")}}>
           <View style={styles.iconText}>
            <Ionicons
              name={"calendar"}
              size={hp("3.5%")}
              color="#115740"
            />
            <Text style={styles.text}>{this.props.route.params.day} - {this.props.route.params.month} - {this.props.route.params.year}</Text>
           </View>

           {this.props.route.params.locations && 
            <View style={styles.iconText}>
              <Ionicons
                name={"location"}
                size={hp("3.5%")}
                color="#115740"
              />
              <Text style={styles.text}>{this.props.route.params.locations}</Text>
             </View>}

           {this.props.route.params.description && 
            <View style={styles.iconText}>
              <Ionicons
                name={"information-circle"}
                size={hp("3.5%")}
                color="#115740"
              />
              <Text style={styles.text}>{this.props.route.params.description}</Text>
             </View>}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
  holiday: {
    backgroundColor: "white",
    padding: hp("1.5%"),
    width: wp("90%"),
    borderRadius: 10,
    borderColor: "#FF5E00",
    borderWidth: 2,
    marginTop: hp("3%"),
    marginHorizontal: wp ("5%")
  },
  holidayName: {
    fontFamily: "Nunito_700Bold",
    fontSize: hp("2.5%"),
  },
  holidayDate: {
    fontFamily: "Nunito_700Bold",
    fontSize: hp("2.5%"),
  },
  text: {
    fontFamily: "Nunito_400Regular",
    fontSize: hp("2.5%"),
    width:wp("75%"),
    marginLeft: wp("2%")
  },
  iconText: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: hp("1%"),
  },
});