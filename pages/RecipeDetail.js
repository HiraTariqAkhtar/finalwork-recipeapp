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

import AsyncStorage from "@react-native-async-storage/async-storage";


export default class RecipeDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recipe: {
        id: this.props.route.params.id,
        recipeName: this.props.route.params.recipeName,
        img: this.props.route.params.img,
        servings: this.props.route.params.servings,
        timeNeeded: this.props.route.params.timeNeeded,
        category: this.props.route.params.category,
        ingredients: this.props.route.params.ingredients,
        instructions: this.props.route.params.instructions
      },
      fav: false,
    }

      this.checkFav()
  }

  async checkFav() {
    //console.log(this.state.recipe)
    let fav = await AsyncStorage.getItem("favorites")
    if(fav) {
      favRecipesList = JSON.parse(fav)

      // check if recipe already in fav
    const isFav = favRecipesList.some(
      (recipe) => recipe.id === this.state.recipe.id
    );
    if (isFav) {
      this.setState({fav: true})
    } else {
      this.setState({fav: false})
    }

    } else {
      this.setState({fav: false})
    }
  }

  async addToCart(ingredient){
    // check if already cart available
    let cart = await AsyncStorage.getItem("cart");
    let cartItems = [];
    if (cart) {
      cartItems = JSON.parse(cart);
    }
  
    // check if ingredient already added in cart
    if(cartItems.includes(ingredient)) {
      alert(`${ingredient} already in cart`)
    } else {
      // add new ingredients in cart
      cartItems.push(ingredient);
      
      // Save edited cart
      await AsyncStorage.setItem("cart", JSON.stringify(cartItems));
      
      ToastAndroid.show(`${ingredient} added to cart`, ToastAndroid.SHORT)
    }
  }

  async addToFav() {
    // check if already something in storage
    let fav = await AsyncStorage.getItem("favorites")
    let favRecipes = []
    if(fav) {
      favRecipes = JSON.parse(fav)
    }

    // add new recipe to fav
    favRecipes.push(this.state.recipe)

    // save edited fav list
    await AsyncStorage.setItem("favorites", JSON.stringify(favRecipes));

    // Change outline heart into filled
    this.setState({fav: true})
    ToastAndroid.show(`${this.state.recipe.recipeName} added to favorites`, ToastAndroid.SHORT)
  }

  async removeFromFav() {
    let fav = await AsyncStorage.getItem("favorites")
    let favRecipes = JSON.parse(fav)

    // filter out recipe from list
    let recipeRemoved = favRecipes.filter(recipe => recipe.id != this.state.recipe.id)
    // save filtered array in storage
    await AsyncStorage.setItem("favorites", JSON.stringify(recipeRemoved));
    
    // Change filled heart into outline
    this.setState({fav: false})
    ToastAndroid.show(`${this.state.recipe.recipeName} removed from favorites`, ToastAndroid.SHORT)
  }

  render() {
    let fav;
    if(this.state.fav) {
      fav=
      <Ionicons
      name={"heart"}
      color="#FF0000"
      size={hp("5%")}
      onPress={() => this.removeFromFav()}
      />
    } else {
      fav=
      <Ionicons
      name={"heart-outline"}
      color="#FF0000"
      size={hp("5%")}
      onPress={() => this.addToFav()}
      />
    }

    let rec = this.state.recipe
    return (
      <View style={styles.container}>
         <View style={styles.header}>
          <Ionicons
              name={"arrow-back"}
              size={hp("5%")}
              color="#115740"
              onPress={() => this.props.navigation.goBack()}
            />
          <Text style={styles.pageTitle}>{rec.recipeName}</Text>
          {fav}
        </View>
          <ScrollView style={styles.recipe}> 
        {rec.img != "" && rec.img !== undefined ?(
          <Image
          source={{uri: rec.img}}
          style={styles.food}
          />)
          : 
          <FontAwesome
              name={"image"}
              size={wp("45%")}
              color="#D3D3D3"
              marginHorizontal={wp("15%")}
            />}
          
          <View style={styles.info}>
          <View style={styles.iconText}>
            <Ionicons
              name={"people"}
              size={hp("5%")}
              color="#115740"
            />
              <Text style={styles.text}>{rec.servings}</Text>
          </View>

            <View style={styles.iconText}>
              <Ionicons
              name={"stopwatch"}
              size={hp("5%")}
              color="#115740"
            />
              <Text style={styles.text}>{rec.timeNeeded} minutes</Text>
            </View>
          </View>

            {rec.category && (
            <View style={styles.iconText}>
            <FontAwesome
              name={"cutlery"}
              size={hp("4%")}
              color="#115740"
              marginRight={wp("1%")}
            />
                <Text style={styles.text}>{rec.category}</Text>
            </View>)}

                <View>
                    <Text style={styles.pageTitle}>Ingredients</Text>
                    {rec.ingredients.map((i) => (
                    <View style={styles.iconText}>
                        <FontAwesome
                          name={"circle"}
                          size={hp("1%")}
                          color="#115740"
                        />
                        <Text style={styles.text}>{i.quantity}</Text>
                        <Text style={styles.text}>{i.name}</Text>
                        <Ionicons
                          name={"cart"}
                          size={hp("3%")}
                          color="#115740"
                          marginLeft={wp("5%")}
                          onPress={() => this.addToCart(i.name)}
                        />
                    </View>
              ))}
                </View>

                <View style={{marginBottom: hp("5%")}}>
                    <Text style={styles.pageTitle}>Instructions</Text>
                    {rec.instructions.map((step) => (
                    <View style= {{marginBottom: hp("2%")}}>
                        <Text style={styles.steps}>Step {step.number}:</Text>
                        <Text style={styles.text}>{step.step}</Text>
                    </View>
              ))}
                </View>
            </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: hp("5%"),
    paddingTop: hp("5%"),
    backgroundColor:"#FFFFFF"    
  },
  header: {
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    marginHorizontal: wp("7.5%"),
    flexWrap:"wrap"
  },
  food: {
    width: wp("75%"),
    height: hp("25%"),
    marginBottom: hp("2%"),
    borderRadius: 10
  },
  pageTitle: {
    fontSize: hp("3.5%"),
    color: "#FF5E00",
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
    fontSize: hp("2.5%"),
    color: "#115740"
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
  },
  addToFav:{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between",
    marginBottom: hp("2%")
  },
  recipe:{
    backgroundColor: "white",
    padding: hp("3%"),
    width: wp("90%"),
    borderRadius: 10,
    marginBottom: hp("1%"),
    marginHorizontal: wp("5%")
  }
});
