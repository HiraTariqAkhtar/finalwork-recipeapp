import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  ToastAndroid,
  TouchableOpacity,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {DATABASE} from "../firebaseConfig"
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"; 


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
        instructions: this.props.route.params.instructions,
        chef: "",
        userId: this.props.route.params.userId,
        visible: this.props.route.params.visible,
        recipeId:""
      },
      fav: false,
      recipeByCurrentUser: false,
    }
  }
  componentDidMount() {
    this.getRecipeDetails()
  }
  componentDidUpdate() {
    this.getRecipeDetails()
  }

  async getRecipeDetails() {
    let userEmail = await AsyncStorage.getItem("email")
    if(userEmail != null) {
      let userId = ""
      let userFirstName;
      let userLastName;
      let userCollection = collection(DATABASE, "users")
      let userData = await getDocs(userCollection)
      if (userData.size > 0) {
        userData.forEach((doc) => {
          if(doc.data().email === userEmail) {
              userId = doc.id
              userFirstName = doc.data().firstName
              userLastName = doc.data().lastName
          }
        })
      }
      if(this.state.recipe.userId !== undefined && this.state.recipe.userId === userId) {
        let chefName = `${userFirstName} ${userLastName}`
        this.setState((prevState) => ({
          recipe: {
            ...prevState.recipe, 
            chef: chefName
          }, recipeByCurrentUser: true}))
      } else{
        this.setState({recipeByCurrentUser: false})
      }
    }else{
      this.setState({recipeByCurrentUser: false})
    }

    let recipeCollection = collection(DATABASE, "recipes")
    let recipeData = await getDocs(recipeCollection)
    if(recipeData.size > 1) {
      recipeData.forEach((doc) => {
        if(doc.data().id === this.state.recipe.id) {
          this.setState((prevState) => ({
            recipe: {
              ...prevState.recipe, 
              recipeId: doc.id
            }
          }))
        }
      })
    }
    this.checkFav()
  }

  async checkFav() {
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

  async editRecipeVisibility() {
    Alert.alert(
      "Change recipe visibility",
      "Are you sure you want to change the visibility of this recipe?",
      [
        { text: "No", style:"cancel" },
        { text: "Yes", onPress: () => {
          updateDoc(doc(DATABASE, "recipes", this.state.recipe.recipeId), 
          {public: !this.state.recipe.visible}
          )
          this.props.navigation.navigate("Cookbook", { refresh: Date.now() })
        }
        }
      ]
      );
  }

  async editRecipe() {
    this.props.navigation.navigate("AddRecipe", {
      recipe: this.state.recipe
    })
  }

  async deleterecipe() {
    Alert.alert(
      "Delete recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "No", style:"cancel" },
        { text: "Yes", onPress: () => {
          deleteDoc(doc(DATABASE, "recipes", this.state.recipe.recipeId))
          this.props.navigation.navigate("Cookbook", { refresh: Date.now() })
        }
        }
      ]
      );
  }

  render() {
    let rec = this.state.recipe
    let fav;
    let editRecipe;
    let deleterecipe;

    if(this.state.recipeByCurrentUser) {
      if(rec.visible) {
        fav= 
        <TouchableOpacity
        style= {[styles.editVisibility, {display: "flex", flexDirection: "row"}]}
        onPress={() => this.editRecipeVisibility()}>
          <Ionicons
        name={"eye-off"}
        color="#FFFFFF"
        size={hp("3%")}
        marginRight={wp("1%")}
        />
        <Text style= {styles.btnText}> Make recipe private</Text>
        </TouchableOpacity>
      }
      else {
        fav= 
        <TouchableOpacity 
        style= {[styles.editVisibility, {display: "flex", flexDirection: "row"}]}
        onPress={() => this.editRecipeVisibility()}>
          <Ionicons
        name={"eye"}
        color="#FFFFFF"
        size={hp("3%")}
        marginRight={wp("1%")}
        />
        <Text style= {styles.btnText}> Make recipe public</Text>
        </TouchableOpacity>
      }

      editRecipe = 
      <FontAwesome
          name={"edit"}
          size={hp("4%")}
          color="#115740"
          marginRight={wp("10%")}
          onPress={() => this.editRecipe()}
        />

      deleterecipe = 
      <Ionicons
          name={"trash-outline"}
          size={hp("4%")}
          color="#ff0000"
          onPress={() => this.deleterecipe()}
        />
    } else {
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
    }


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
          <View style= {{display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: hp("2%")}}>
            {editRecipe}
            {deleterecipe}
          </View>
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
          {rec.servings && (
          <View style={styles.iconText}>
            <Ionicons
              name={"people"}
              size={hp("5%")}
              color="#115740"
            />
              <Text style={styles.text}>{rec.servings}</Text>
          </View>)}

            {rec.timeNeeded && (
            <View style={styles.iconText}>
              <Ionicons
              name={"stopwatch"}
              size={hp("5%")}
              color="#115740"
            />
              <Text style={styles.text}>{rec.timeNeeded} minutes</Text>
            </View>)}
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

            {rec.chef && (
            <View style={styles.iconText}>
            <MaterialCommunityIcons
              name={"chef-hat"}
              size={hp("4%")}
              color="#115740"
              marginRight={wp("1%")}
            />
                <Text style={styles.text}>{rec.chef}</Text>
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
  },
  editVisibility: {
    width: wp("25%"),
    padding: hp("1%"),
    backgroundColor: "#115740",
    borderRadius: 10,
  },
  btnText:{
    fontFamily:"Nunito_700Bold",
    color: "#ffffff",
    fontSize: hp("1.25%"),
    width: wp("15%"),
},
});
