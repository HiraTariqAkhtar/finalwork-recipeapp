import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  Alert,
  ToastAndroid
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
        myRecipes:[]
      }

      this.getUser()
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
    let myRecipes = []

    let recipeCollection = collection(DATABASE, "recipes")
    let recipes = await getDocs(recipeCollection)
    if (recipes.size > 0) {
        recipes.forEach((doc) => {
        if(doc.data().userId === this.state.userId) {
            this.setState({hasData: true})
            myRecipes.push(doc.data().recipe)
        }
    })
    } else {
        this.setState({hasData: false})
    }
    console.log(myRecipes)
    this.setState({myRecipes: myRecipes})
  }

  goToRecipeDetails(rec) {
    this.props.navigation.navigate("RecipeDetail", {
      id: rec.id,
      recipeName: rec.recipeName,
      servings: rec.servings,
      timeNeeded: rec.timeNeeded,
      dishTypes: rec.dishTypes,
      period: rec.period,
      culture: rec.culture,
      ingredients: rec.ingredients,
      instructions: rec.instructions
    })
  }


  render() {
    let cultures;
    let dishTypes;
    let periods;

    this.state.myRecipes.forEach((rec) => {
      if(rec.culture.length > 1){
        cultures = 
        rec.culture.map((culture) => (
          <Text style={styles.text}>{culture} |</Text>
          ))
      } else if(rec.culture.length == 1) {
        cultures = 
        <Text style={styles.text}>{rec.culture[0]}</Text>
      }
  
  
      if(rec.dishTypes.length > 1) {
        dishTypes =
        rec.dishTypes.map((type) => (
          <Text style={styles.text}>{type} |</Text>
        ))
      } else if(rec.dishTypes.length == 1){
        dishTypes =
        <Text style={styles.text}>{rec.dishTypes[0]}</Text>
      }
  
      if(rec.period.length > 1) {
        periods =
        rec.period.map((period) => (
          <Text style={styles.text}>{period} |</Text>
        ))
      } else if(rec.period.length == 1){
        periods =
        <Text style={styles.text}>{rec.period[0]}</Text>
      }
    })

    let recipes;
    if(this.state.myRecipes.length > 0) {
      recipes = this.state.myRecipes.map((rec) => (
        <TouchableOpacity
        key={rec.id}
        style={styles.recipe}
        onPress={() => this.goToRecipeDetails(rec)}>
          <View style={{display:"flex", flexDirection:"row", alignItems: "center"}}>
             
              <FontAwesome
                  name={"image"}
                  size={hp("15%")}
                  color="#D3D3D3"
                  marginRight={wp("3%")}
                />
    
                <View>
                  <Text style={styles.recipeName}>
                    {rec.recipeName}
                  </Text>
                  
                  <View style={{display:"flex", flexDirection:"row"}}>
                    <View style={[styles.iconText, {marginRight: wp("5%")}]}>
                      <Ionicons
                        name={"people"}
                        size={hp("2.5%")}
                        color="#FF5E00"
                      />
                      <Text style={styles.text}>{rec.servings}</Text>
  
                    </View>
  
                    <View style={styles.iconText}>
                      <Ionicons
                        name={"stopwatch"}
                        size={hp("2.5%")}
                        color="#FF5E00"
                      />
                        <Text style={styles.text}>{rec.timeNeeded} minutes</Text>
                    </View>
                  </View>
    
                  {rec.culture.length > 0 && (
                <View style={[styles.iconText, {width: wp("60%")}]}>
                <Ionicons
                  name={"flag"}
                  size={hp("2.5%")}
                  color="#FF5E00"
                />
                  {cultures}
                </View>)}
    
                {rec.dishTypes.length > 0 && (
                <View style={[styles.iconText, {width: wp("60%")}]}>
                <FontAwesome
                  name={"cutlery"}
                  size={hp("2.5%")}
                  color="#FF5E00"
                />
                  {dishTypes}
                </View>)}
    
                    {rec.period.length > 0 && (
                  <View style={[styles.iconText, {width: wp("60%")}]}>
                    <Ionicons
                      name={"calendar"}
                      size={hp("2.5%")}
                      color="#FF5E00"
                    />
                      {periods}
                    </View>)}
                </View>
              </View>
        </TouchableOpacity>
      ))
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
              color="#FF5E00"
              onPress={() => this.props.navigation.goBack()}
            />
          <Text style={styles.title}>My Cookbook</Text>
        </View>
        <ScrollView>
            {recipes}
        </ScrollView>
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
        color:"#FF0000",
        marginLeft: wp("10%")
    },
    recipe: {
        backgroundColor: "white",
        padding: hp("1.5%"),
        width: wp("95%"),
        borderRadius: 10,
        borderColor: "#FF5E00",
        borderWidth: 3,
        marginTop: hp("3%"),
        marginHorizontal: wp ("2.5%")
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
        textDecorationLine: "underline"
    },
});