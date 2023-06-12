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
import {Ionicons, FontAwesome } from "@expo/vector-icons";
import { Button } from "react-native-elements/dist/buttons/Button";

import AsyncStorage from "@react-native-async-storage/async-storage";


export default class Cart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasData: false,
      cartItems:[]
    }
  }

  async componentDidMount() {
    this.getCartData()
  }

  async getCartData() {
    let cart = await AsyncStorage.getItem("cart")
    if(cart !== null) {
      this.setState({cartItems: JSON.parse(cart)})
      this.checkRemainingItems()
    } else {
      this.setState({hasData: false})
    }
  }

  async checkRemainingItems() {
    if(this.state.cartItems.length >0) {
      this.setState({hasData: true})
    } else {
      this.setState({hasData: false})
    }
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
    let itemRemoved = this.state.cartItems.filter(i => i != item)
    this.setState({cartItems: itemRemoved})
    await AsyncStorage.setItem("cart", JSON.stringify(this.state.cartItems))
    ToastAndroid.show(`${item} removed from cart`, ToastAndroid.SHORT)
    
    this.checkRemainingItems()
  }

  confirmClear() {
    Alert.alert(
      "Clear cart",
      `Are you sure you want to clear the cart?`,
      [
        {text: "No", style: "cancel"},
        {text: "Yes", onPress: () => this.clearList()}
      ]
    )
  }

  async clearList() {
    let emptyList = []
    this.setState({cartItems: emptyList})
    this.setState({hasData: false})
    await AsyncStorage.removeItem("cart")
    ToastAndroid.show("Cart cleared", ToastAndroid.SHORT)
  }


  render() {
    let clearIcon =
    <Ionicons
    name="trash-outline"
    color="#FFFFFF"
    size={hp("3%")}/>

    return (
      <View style={styles.container}>
          <Text style={styles.title}>Cart</Text>
          <Button
          title="Clear list"
          icon={clearIcon}
          buttonStyle={styles.clear}
          onPress={() => this.confirmClear()}/>
        <View style={styles.cart}>
          <ScrollView>
          {this.state.hasData ? 
            this.state.cartItems.map((item) => (
              <View style={styles.iconText}>
                <FontAwesome
                  name={"circle"}
                  size={hp("1%")}
                  color="#FF5E00"
                />
                <Text style={styles.cartItem}>{item}</Text>
                <FontAwesome
                name={"remove"}
                size={hp("3%")}
                color="#FF5E00"
                onPress={() => this.confirmDelete(item)}/>
              </View>
            )) 
          :
          <Text style={styles.cartItem}>Cart is empty.{'\n'} Add ingredients to see your cart</Text>}
          </ScrollView>
        </View>
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
  iconText: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  cartItem: {
    marginBottom: hp("3%"),
    marginHorizontal: wp("3%"),
    fontFamily: "Nunito_400Regular",
    fontSize: hp("2.5%"),
    textAlign: "center"
  },
  clear: {
    backgroundColor:"#ff0000",
    width: wp("30%"),
    left: wp("65%"),
    marginBottom: hp("3%")
  },
  cart: {
    width: wp("80%"),
    marginLeft: wp("5%"),
  }

});