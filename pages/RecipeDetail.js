import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  ToastAndroid
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default class RecipeDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cart:[]
    }

    this.props.navigation.setOptions({
        title: ""
      });

  }

  async addToCart(ingredient){
    this.state.cart.push(ingredient)
    this.setState({state:this.state})
    //console.log(this.state.cart)
    await AsyncStorage.setItem("cart", JSON.stringify(this.state.cart))
    ToastAndroid.show(`${ingredient} added to cart`, ToastAndroid.SHORT)
  }

  render() {

    return (
      <View style={styles.container}>
          <ScrollView>
        <View style={styles.button1}>
        <Text style={styles.title}>{this.props.route.params.recipeName}</Text>
          <Image
          source={{uri: this.props.route.params.foodImg}}
          style={styles.food}
          />
          <View style={styles.info}>
          <View style={styles.iconText}>
            <Ionicons
              name={"people"}
              size={hp("5%")}
              color="#34359A"
            />
              <Text style={styles.text}>{this.props.route.params.servings}</Text>
          </View>

            <View style={styles.iconText}>
              <Ionicons
              name={"stopwatch"}
              size={hp("5%")}
              color="#34359A"
            />
              <Text style={styles.text}>{this.props.route.params.timeNeeded} minutes</Text>
            </View>
          </View>

            {this.props.route.params.dishTypes.length > 0 && (
            <View style={styles.iconText}>
            <FontAwesome
              name={"cutlery"}
              size={hp("4%")}
              color="#34359A"
              marginRight={wp("1%")}
            />
              {this.props.route.params.dishTypes.map((type) => (
                <Text style={styles.text}>{type}</Text>
              ))}
            </View>)}

           {this.props.route.params.period.length > 0 && (
           <View style={styles.iconText}>
            <Ionicons
              name={"calendar"}
              size={hp("4%")}
              color="#34359A"
              marginRight={wp("1%")}
            />
              {this.props.route.params.period.map((period) => (
                <Text style={styles.text}>{period}</Text>
              ))}
            </View>)}

            {this.props.route.params.culture.length > 0 && (
            <View style={styles.iconText}>
            <Ionicons
              name={"flag"}
              size={hp("4%")}
              color="#34359A"
              marginRight={wp("1%")}
            />
              {this.props.route.params.culture.map((type) => (
                <Text style={styles.text}>{type}</Text>
              ))}
            </View>)}
            
                <View>
                    <Text style={styles.title}>Ingredients</Text>
                    {this.props.route.params.ingredients.map((i) => (
                    <View style={styles.iconText}>
                        <FontAwesome
                          name={"circle"}
                          size={hp("1%")}
                          color="#000000"
                        />
                        <Text style={styles.text}>{i.original}</Text>
                        <Ionicons
                          name={"cart"}
                          size={hp("3%")}
                          color="#34359A"
                          marginLeft={wp("5%")}
                          onPress={() => this.addToCart(i.nameClean)}
                        />
                    </View>
              ))}
                </View>

                <View>
                    <Text style={styles.title}>Instructions</Text>
                    {this.props.route.params.instructions.map((step) => (
                    <View style= {{marginBottom: hp("2%")}}>
                        <Text style={styles.steps}>Step {step.number}:</Text>
                        <Text style={styles.text}>{step.step}</Text>
                    </View>
              ))}
                </View>
        </View>
            </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    
  },
  button1: {
    backgroundColor: "white",
    padding: hp("3%"),
    width: wp("90%"),
    borderRadius: 10,
    marginBottom: hp("1%"),
  },
  food: {
    width: wp("75%"),
    height: hp("25%"),
    marginBottom: hp("2%")
  },
  title: {
    fontSize: hp("3.5%"),
    color: "#34359A",
    fontFamily: "Nunito_700Bold",
    marginBottom: hp("1%"),
  },
  info: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  steps: {
    fontFamily:"Nunito_700Bold",
    fontSize: hp("2.5%")
  },
  iconText: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  text: {
    fontFamily:"Nunito_400Regular",
    fontSize: hp("2%"),
    marginLeft: wp("2%")
  }
});
