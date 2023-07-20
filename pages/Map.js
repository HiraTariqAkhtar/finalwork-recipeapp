import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import SelectDropdown from 'react-native-select-dropdown'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import {DATABASE} from "../firebaseConfig"
import { collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mapOptions: ["All", "Restaurants", "Supermarkets"],
      permissionGranted: "",
      userLocation: {
        latitude: 0,
        longitude: 0
      },
      category : "All",
      restaurants: [],
      supermarkets: [],
    }

  }
  
  componentDidMount() {
    this.askLocationPermission()
  }

  componentDidUpdate(prevProps) {
    if (this.props.route.params?.refresh !== prevProps.route.params?.refresh) {
      this.setMarkers();
    }
  }

  async askLocationPermission() {
    let status = await Location.requestForegroundPermissionsAsync();
    //console.log(status)
    if(status.status !== "granted") {
      ToastAndroid.show("Current location needed so you can view nearby Pakistani supermarkets and restaurants", ToastAndroid.LONG)
    }
    this.setState({permissionGranted: status.status})

    this.getUserLocation()
  }

  async getUserLocation() {
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      },
      (location) => {
        //console.log(location)
      this.setState({userLocation: {latitude: location.coords.latitude, longitude: location.coords.longitude}})
      }
    );

    this.setMarkers()
  }

  async setMarkers() {
    let supermarkets = [];
    let restaurants = [];

    let supermarketCollection = collection(DATABASE, "supermarkets")
    let supermarketData = await getDocs(supermarketCollection)
    if(supermarketData.size > 0) {
      supermarketData.forEach((doc) => {
        supermarkets.push(doc.data())
      })
    }

    let restaurantCollection = collection(DATABASE, "restaurants")
    let restaurantData = await getDocs(restaurantCollection)

    if(restaurantData.size > 0) {
        restaurantData.forEach((doc) => {
          restaurants.push(doc.data())
        })
    }

    this.setState({supermarkets: supermarkets, restaurants:restaurants})
  }

  async addToMap() {
    let loggedIn = await AsyncStorage.getItem("userLoggedIn")
    if(loggedIn !==  null) {
      this.props.navigation.navigate("AddToMap")
    } else {
      Alert.alert(
        "Not logged in",
        "You need to log in to add a new recipe",
        [
          {text: "Cancel", style: "cancel"},
          {text: "Log in", onPress: () => this.props.navigation.navigate("LogIn")}
        ]
      )
    }
  }

  render() {
    let restaurants =  this.state.restaurants.map((location) => (
      <Marker
        key={location.description}
        title={location.title}
        description={location.description}
        coordinate={{
          latitude: location.coordinate.latitude,
          longitude: location.coordinate.longitude
        }}
      >
          <FontAwesome 
            name={"cutlery"} 
            size={hp("4%")} 
            color="#FF5E00"
          />
      </Marker>
    ))

    let supermarkets =  this.state.supermarkets.map((location) => (
      <Marker
        key={location.description}
        title={location.title}
        description={location.description}
        coordinate={{
          latitude: location.coordinate.latitude,
          longitude: location.coordinate.longitude
        }}
      >
          <Ionicons
            name={"cart"}
            size={hp("5%")}
            color="#115740"
          />
      </Marker>
    ))

    let locations = []
    if(this.state.category === "All"){
      locations = restaurants.concat(supermarkets)
    } else if(this.state.category === "Restaurants") {
      locations = restaurants
    } else if(this.state.category === "Supermarkets") {
      locations = supermarkets
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons
                name={"add"}
                size={hp("5%")}
                color="#115740"
                marginRight={wp("25%")}
                onPress={() => this.addToMap()}
              />
            <Text style={styles.title}>Map</Text>
        </View>
          <View style={{display: "flex", flexDirection: "row"}}>
            <SelectDropdown
            buttonStyle = {styles.dropDown}
            buttonTextStyle = {styles.dropDownText}
            dropdownStyle = {styles.dropDownOptions}
            rowTextStyle = {styles.dropDownText}
            data = {this.state.mapOptions}
            onSelect={(selectedItem) => {
              this.setState({category: selectedItem})
            }}
            defaultValue = "All"
            renderDropdownIcon={isOpened => {
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#115740'} size={20} />;
            }}/>

            <View style={styles.legend}>
              <View style={styles.iconText}>
                <Ionicons
                  name={"location"}
                  size={hp("4%")}
                  color="#FF0000"
                />
                <Text style={styles.legendText}>Your location</Text>
              </View>
              <View style={styles.iconText}>
                <Ionicons
                  name={"cart"}
                  size={hp("4%")}
                  color="#115740"
                />
                <Text style={styles.legendText}>Supermarkets</Text>
              </View>
              <View style={styles.iconText}>
                <FontAwesome
                  name={"cutlery"}
                  size={hp("3.5%")}
                  color="#FF5E00"
                  marginHorizontal={wp("1%")}
                />
                <Text style={styles.legendText}>Restaurants</Text>
              </View>
            </View>
          </View>

          <MapView 
          style={{height: '65%', width: '100%', marginTop: hp("5%")}}
          initialRegion={{
            latitude: 50.8503396,
            longitude: 4.3517103,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>

            <Marker
            coordinate={this.state.userLocation}>
              <Ionicons
                  name={"location"}
                  size={hp("5%")}
                  color="#FF0000"
                />
            </Marker>
            {locations}
          </MapView>

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
        color: "#FF5E00"
      },
      dropDown: {
        width: wp("40%"),
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: "#115740",
        borderWidth: 2,
        marginHorizontal: wp("5%"),
        marginTop: hp("3%")
      },
      dropDownOptions: {
        backgroundColor: "#fff",
        borderRadius: 10,
      },
      dropDownText: {
        fontFamily: "Nunito_700Bold",
        fontSize: hp("2.5%"),
      },
      iconText: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: hp("1%"),
      },
      legend: {
        width: wp("40%"),
        marginTop: hp("3%"),
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#115740",
        padding: 5
      },
      legendText: {
        fontFamily: "Nunito_400Regular",
        marginLeft: wp("3%")
      },
});