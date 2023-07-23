import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import axios from "axios";
import {HOLIDAYS_API_KEY} from '@env'



export default class Holidays extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      img: "",
      info: "",
      src: ""
    }

    this.getHolidayInfo()
  }



  async getHolidayInfo() {

    let holidayName;
    if(this.props.route.params.name === "Independence Day"){
      holidayName = "Independence Day Pakistan"
    }else if(this.props.route.params.name === "Christmas Day"){
      holidayName = "Christmas"
    } else {
      holidayName = this.props.route.params.name
    }

    // URL Wikipedia API
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&titles=${holidayName}&pithumbsize=300`;

    axios.get(apiUrl)
      .then((res) => {
        //console.log(Object.keys(res.data.query.pages))
        const pages = res.data.query.pages;
        const pageId = Object.keys(pages)[0];
        const pageData = pages[pageId];

        //console.log(pageData)

        if(pageId === "-1") {
          //console.log("No data found")
          this.setState({info: this.props.route.params.description, src:""})
        } else {
          //console.log("Data found")
          this.setState({info: "data", src:"Source: Wikipedia"})
        }

        // Get image url if available
        if (pageData.thumbnail) {
          const imageUrl = pageData.thumbnail.source;
          this.setState({img: imageUrl})
        } else {
          this.setState({img: ""})
        }
      })
      .catch((error) => {
        console.error('Error getting data: ', error);
      });
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
        {this.state.img != "" ?(
              <Image
              source={{uri: this.state.img}}
              style={styles.img}
              />)
              : 
              <FontAwesome
              name={"image"}
              size={wp("45%")}
              color="#D3D3D3"
              marginHorizontal={wp("15%")}
                />}
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

           {this.state.info !== "" && 
            <View style={styles.iconText}>
              <Ionicons
                name={"information-circle"}
                size={hp("3.5%")}
                color="#115740"
              />
              <Text style={styles.text}>{this.state.info}</Text>
              <Text style={styles.src}>{this.state.src}</Text>
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
    marginHorizontal: wp("10%")
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
  img: {
    width: wp("80%"),
    height: hp("25%"),
    marginBottom: hp("2%"),
    borderRadius: 10,
    marginHorizontal: wp("5%")
  },
  src: {
    fontFamily: "Nunito_300Light_Italic",
    fontSize: hp("1.5%"),
    marginBottom: hp("5%"),
    marginRight: wp("5%"),
    textDecorationLine: "underline",
    color: "#115740"
},
});