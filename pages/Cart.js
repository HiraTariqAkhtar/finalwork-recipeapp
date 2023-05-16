import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ToastAndroid,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default class Cart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasData: false,
      cartItems:[]
    }

    this.getCartData()
  }

  async getCartData(){
    let cart = await AsyncStorage.getItem("cart")
    if(!cart) {
      this.state.hasData = false
    } else{
      this.state.hasData = true
      this.state.cartItems = JSON.parse(cart)
    }
    //console.log(this.state.cartItems)
    this.setState({state: this.state})
  }


  confirmDelete(item) {
    Alert.alert(
      "Remove from cart",
      `Are you sure you want to remove ${item} from cart?`,
      [
        {text: "No", style: "cancel"},
        {text: "Yes", onPress: () => this.removeFromCart(item)}
      ]
    )
  }

  async removeFromCart(item) {
    this.state.cartItems = this.state.cartItems.filter(i => i != item)
    console.log(this.state.cartItems)
    this.setState({state: this.state})
    await AsyncStorage.setItem("cart", JSON.stringify(this.state.cartItems))
    ToastAndroid.show(`${item} removed from cart`, ToastAndroid.SHORT)
    
    this.checkRemainingItems()
  }

  async checkRemainingItems() {
    if(this.state.cartItems.length == 0) {
      this.state.hasData = false
    } else {
      this.state.hasData = true
    }
    this.setState({state: this.state})
  }

  render() {

    return (
      <View style={styles.container}>
        <ScrollView style={styles.cart}>
          {this.state.hasData ? 
          this.state.cartItems.map((item) => (
            <View style={styles.iconText}>
              <Text style={styles.cartItem}>{item}</Text>
              <FontAwesome
              name={"remove"}
              size={hp("3%")}
              color="#ff0000"
              onPress={() => this.confirmDelete(item)}/>
            </View>
          ))
          :
          <Text style={styles.cartItem}>Cart is empty.{'\n'} Add ingredients to see your cart</Text>}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  cart:{
    marginTop: hp("10%"),
  },
  iconText: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  cartItem: {
    marginBottom: hp("3%"),
    marginHorizontal: wp("5%"),
    fontFamily: "Nunito_400Regular",
    fontSize: hp("2.5%"),
    textAlign: "center"
  }
});