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
import translations from '../translation'



export default class Cart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasData: false,
      cartItems:[],
      lang:"en"
    }
  }

  async componentDidMount() {
    this.getLang()
  }

  async getLang() {
    let langSelected = await AsyncStorage.getItem("langSelected")
    if(langSelected !== null) {
      this.setState({lang: langSelected})
    } else {
      this.setState({lang: "en"})
    }

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
      translations[this.state.lang].removeFromCart,
      translations[this.state.lang].confirmRemoveFromCart.replace('${item}', item),
      [
        {text: translations[this.state.lang].no, style: "cancel"},
        {text: translations[this.state.lang].yes, onPress: () => this.removeFromCart(item)}
      ]
    )
  }

  async removeFromCart(item) {
    let itemRemoved = this.state.cartItems.filter(i => i != item)
    this.setState({cartItems: itemRemoved})
    await AsyncStorage.setItem("cart", JSON.stringify(this.state.cartItems))
    ToastAndroid.show(translations[this.state.lang].removedFromCart.replace('${item}', item), ToastAndroid.SHORT)
    
    this.checkRemainingItems()
  }

  confirmClear() {
    Alert.alert(
      translations[this.state.lang].clearCart,
      translations[this.state.lang].confirmClearCart,
      [
        {text: translations[this.state.lang].no, style: "cancel"},
        {text: translations[this.state.lang].yes, onPress: () => this.clearList()}
      ]
    )
  }

  async clearList() {
    let emptyList = []
    this.setState({cartItems: emptyList})
    this.setState({hasData: false})
    await AsyncStorage.removeItem("cart")
    ToastAndroid.show(translations[this.state.lang].cartCleared, ToastAndroid.SHORT)
  }


  render() {
    let clearIcon =
    <Ionicons
    name="trash-outline"
    color="#FFFFFF"
    size={hp("3%")}/>

    return (
      <View style={styles.container}>
          <Text style={styles.title}>{translations[this.state.lang].cart}</Text>
          <Button
          title={translations[this.state.lang].clearList}
          icon={clearIcon}
          buttonStyle={styles.clear}
          titleStyle={{fontFamily:"Nunito_700Bold"}}
          onPress={() => this.confirmClear()}/>
        <View style={styles.cart}>
          <ScrollView>
          {this.state.hasData ? 
            this.state.cartItems.map((item, index) => (
              <View key={index} style={styles.iconText}>
                <FontAwesome
                  name={"circle"}
                  size={hp("1%")}
                  color="#115740"
                />
                <Text style={styles.cartItem}>{item}</Text>
                <FontAwesome
                name={"remove"}
                size={hp("3%")}
                color="#115740"
                onPress={() => this.confirmDelete(item)}/>
              </View>
            )) 
          :
          <Text style={styles.cartItem}>{translations[this.state.lang].emptyCart}</Text>}
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
    color: "#FF5E00"
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
    width: wp("40%"),
    left: wp("55%"),
    marginBottom: hp("3%")
  },
  cart: {
    width: wp("90%"),
    marginLeft: wp("5%"),
  }

});