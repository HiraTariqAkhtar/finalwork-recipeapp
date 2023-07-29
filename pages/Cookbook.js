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

import { Ionicons, FontAwesome } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {DATABASE} from "../firebaseConfig"
import { collection, getDocs } from "firebase/firestore"; 


export default class Cookbook extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        userId: "",
        hasData: false,
        myPublicRecipes:[],
        myPrivateRecipes:[]
      }
  }

  componentDidMount() {
    this.getUser()
  }

  componentDidUpdate(prevProps) {
    if (this.props.route.params?.refresh !== prevProps.route.params?.refresh) {
      this.getUser()
    }
  }

  async getUser() {
    let userEmail = await AsyncStorage.getItem("email")
    let userId = 0

    let userCollection = collection(DATABASE, "users")
    let userData = await getDocs(userCollection)
    if (userData.size > 0) {
      userData.forEach((doc) => {
        if(doc.data().email === userEmail) {
            userId = doc.id
        }
      })
    }
    this.setState({userId: userId})
    this.getRecipeList()
  }

  async getRecipeList() {
    let publicRecipes = []
    let privateRecipes = []

    let recipeCollection = collection(DATABASE, "recipes")
    let recipes = await getDocs(recipeCollection)
    if (recipes.size > 0) {
        recipes.forEach((doc) => {
        if(doc.data().userId === this.state.userId) {
            this.setState({hasData: true})
            if(doc.data().public == true) {
              publicRecipes.push(doc.data())
            } else if(doc.data().public == false) {
              privateRecipes.push(doc.data())
            }
        }
    })
    } else {
        this.setState({hasData: false})
    }
    //console.log(myRecipes)
    this.setState({myPublicRecipes: publicRecipes, myPrivateRecipes: privateRecipes})
  }

  goToRecipeDetails(rec) {
    //console.log(rec)
    this.props.navigation.navigate("RecipeDetail", {
      id: rec.id,
      recipeName: rec.recipeName,
      servings: rec.servings,
      timeNeeded: rec.timeNeeded,
      category: rec.category,
      ingredients: rec.ingredients,
      instructions: rec.instructions,
      img: rec.img,
      userId: rec.userId,
      visible: rec.public
    })
  }


  render() {
    let recipes;
    if(this.state.myPublicRecipes.length > 0 || this.state.myPrivateRecipes.length > 0) {
      recipes = 
      <View>
        <Text style={styles.section}>Public Recipes</Text>
        <ScrollView style={{height: hp("33%")}}>
         { this.state.myPublicRecipes.map((rec) => (
            <TouchableOpacity
            key={rec.id}
            style={styles.recipe}
            onPress={() => this.goToRecipeDetails(rec)}>
              <View style={{display:"flex", flexDirection:"row", alignItems: "center"}}>
                 
              {rec.img != "" ?(
            <Image
            source={{uri: rec.img}}
            style={styles.foodImg}
            />)
            : 
            <FontAwesome
                name={"image"}
                size={hp("15%")}
                color="#D3D3D3"
                marginRight={wp("3%")}
              />}
        
                    <View>
                      <Text style={styles.recipeName}>
                        {rec.recipeName}
                      </Text>
                      
                      <View style={{display:"flex", flexDirection:"row"}}>
                        <View style={[styles.iconText, {marginRight: wp("5%")}]}>
                          <Ionicons
                            name={"people"}
                            size={hp("2.5%")}
                            color="#115740"
                          />
                          <Text style={styles.text}>{rec.servings}</Text>
      
                        </View>
      
                        <View style={styles.iconText}>
                          <Ionicons
                            name={"stopwatch"}
                            size={hp("2.5%")}
                            color="#115740"
                          />
                            <Text style={styles.text}>{rec.timeNeeded} minutes</Text>
                        </View>
                      </View>
        
                      {rec.category.length > 0 && (
                    <View style={[styles.iconText, {width: wp("60%")}]}>
                    <FontAwesome
                      name={"cutlery"}
                      size={hp("2.5%")}
                      color="#115740"
                    />
                      <Text style={styles.text}>{rec.category}</Text>
                    </View>)}
                    </View>
                  </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.section}>Private Recipes</Text>
        <ScrollView style={{height: hp("33%")}}>
         { this.state.myPrivateRecipes.map((rec) => (
            <TouchableOpacity
            key={rec.id}
            style={styles.recipe}
            onPress={() => this.goToRecipeDetails(rec)}>
              <View style={{display:"flex", flexDirection:"row", alignItems: "center"}}>
              {rec.img != "" ?(
            <Image
            source={{uri: rec.img}}
            style={styles.foodImg}
            />)
            : 
            <FontAwesome
                name={"image"}
                size={hp("15%")}
                color="#D3D3D3"
                marginRight={wp("3%")}
              />}
        
                    <View>
                      <Text style={styles.recipeName}>
                        {rec.recipeName}
                      </Text>
                      
                      <View style={{display:"flex", flexDirection:"row"}}>
                        <View style={[styles.iconText, {marginRight: wp("5%")}]}>
                          <Ionicons
                            name={"people"}
                            size={hp("2.5%")}
                            color="#115740"
                          />
                          <Text style={styles.text}>{rec.servings}</Text>
      
                        </View>
      
                        <View style={styles.iconText}>
                          <Ionicons
                            name={"stopwatch"}
                            size={hp("2.5%")}
                            color="#115740"
                          />
                            <Text style={styles.text}>{rec.timeNeeded} minutes</Text>
                        </View>
                      </View>
        
                      {rec.category.length > 0 && (
                    <View style={[styles.iconText, {width: wp("60%")}]}>
                    <FontAwesome
                      name={"cutlery"}
                      size={hp("2.5%")}
                      color="#115740"
                    />
                      <Text style={styles.text}>{rec.category}</Text>
                    </View>)}
                    </View>
                  </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    } else {
      recipes = 
      <View>
          <Text style={styles.noRecipes}>No recipes added yet</Text>
          <View style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
                <Text style={styles.question}>Add a new recipe?</Text>
                <Text style={styles.nav} onPress={() => this.props.navigation.navigate("AddRecipe")}>Click here</Text>
        </View>
      </View>
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
          <Text style={styles.title}>My Cookbook</Text>
        </View>
        <View>
            {recipes}
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
    header: {
        display:"flex",
        flexDirection:"row",
        marginHorizontal: wp("7.5%")
    },
    title: {
        fontFamily: "Nunito_700Bold",
        fontSize: hp("3.5%"),
        color:"#FF5E00",
        marginLeft: wp("10%")
    },
    recipe: {
      backgroundColor: "white",
      padding: hp("1.5%"),
      width: wp("90%"),
      borderRadius: 10,
      borderColor: "#115740",
      borderWidth: 3,
      marginTop: hp("1%"),
      marginHorizontal: wp ("5%")
    },
      recipeName: {
        fontSize: hp("2.5%"),
        fontFamily: "Nunito_700Bold",
        marginBottom: hp("1%"),
        width: wp("55%")
      },
      info: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly"
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
      noRecipes:{
        marginTop: hp("5%"),
        marginBottom: hp("3%"),
        marginHorizontal: wp("3%"),
        fontFamily: "Nunito_400Regular",
        fontSize: hp("2.5%"),
        textAlign: "center"
      },
      question: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: hp("2%"),
        marginBottom: hp("5%"),
        marginRight: wp("5%"),
        color: "#FF5E00"
    },
    nav: {
        fontFamily: "Nunito_300Light_Italic",
        fontSize: hp("2%"),
        marginBottom: hp("5%"),
        marginRight: wp("5%"),
        textDecorationLine: "underline",
        color: "#115740"
    },
    section: {
      fontSize: hp("2.5%"),
      fontFamily: "Nunito_700Bold",
      marginLeft: hp("3%"),
      width: wp("55%"),
      color:"#FF5E00",
      marginTop: hp("3%"),
    },
    foodImg: {
      width: wp("30%"),
      height: hp("15%"),
      marginRight: wp("3%"),
      borderRadius: 10,
    },
});