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
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import {APIKEY} from '@env'

export default class Recipes extends React.Component {
  constructor(props) {
    super(props);
    //this.getRecipes()


    this.state = {
      // randomRecipes: [
      //   {
      //     id:0,
      //     servings: 0,
      //     recipeName: "",
      //     ingredients: [{
      //       id: 0,
      //       nameAndQuantity: "",
      //       img: "",
      //     }],
      //     instructions: [],
      //     culture: [],
      //     time: 0,
      //     foodImg: "",
      //     dishTypes: [],
      //     period: []
      //   },
      // ],

      randomRecipes: [
        {
          id:0,
          servings: 5,
          recipeName: "Pakora",
          ingredients: [
            {
            id: 0,
            original: "2 gujvjfdhg",
            img: "",
            nameClean: "jfdgujvjfdhghg"
          },
          {
            id: 0,
            original: "1 chilhbghkv",
            img: "",
            nameClean: "chilhbghkv"
          },
          {
            id: 0,
            original: "7 fejvgilqbchjqd ",
            img: "",
            nameClean: "fejvgilqbchjqd"
          }
        ],
          instructions: [
            {
            number: 1,
            step: "hjg"
          },
          {
            number: 2,
            step: "hjg"
          },
          {
            number: 3,
            step: "hjg"
          },
          {
            number: 4,
            step: "hjg"
          },
        ],
          culture: ["azerty"],
          time: 30,
          foodImg: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/02/vegetable-pakora-recipe.jpg",
          dishTypes: ["fhgj"],
          period: ["fyghvgdj"]
        },
      ],
    };
  }


  async getRecipes() {
    axios.get(`https://api.spoonacular.com/recipes/random?number=5&apiKey=${APIKEY}`)
    .then((res) => {
      res.data.recipes.forEach((rec) => {
        this.state.randomRecipes.push({
          id: rec.id,
          servings: rec.servings,
          recipeName: rec.title,
          ingredients: rec.extendedIngredients,
          instructions: rec.analyzedInstructions[0].steps,
          culture: rec.cuisines,
          time: rec.readyInMinutes,
          foodImg: rec.image,
          dishTypes: rec.dishTypes,
          period: rec.occasions
        })
      })
      
      //console.log(this.state.randomRecipes[1])
      this.setState({state: this.state})
    })
  }

  goToRecipeDetails(rec) {
    this.props.navigation.navigate("RecipeDetail", {
      recipeName: rec.recipeName,
      foodImg: rec.foodImg,
      servings: rec.servings,
      timeNeeded: rec.time,
      dishTypes: rec.dishTypes,
      period: rec.period,
      culture: rec.culture,
      ingredients: rec.ingredients,
      instructions: rec.instructions
    })
  }

  render() {

    let recipes = this.state.randomRecipes
    //.slice(1)
    .map((rec) => (
      <TouchableOpacity
      key={rec.id}
      style={styles.recipe}
      onPress={() => this.goToRecipeDetails(rec)}>
        <View>
        <Image
          source={{uri: rec.foodImg}}
          style={styles.foodImg}
          />

        <Text style={styles.recipeName}>
            {rec.recipeName}
        </Text>

         
          <View style={styles.info}>
          <View style={styles.iconText}>
            <Ionicons
              name={"people"}
              size={hp("5%")}
              color="#34359A"
            />
              <Text style={styles.text}>{rec.servings}</Text>
          </View>

            <View style={styles.iconText}>
              <Ionicons
              name={"stopwatch"}
              size={hp("5%")}
              color="#34359A"
            />
              <Text style={styles.text}>{rec.time} minutes</Text>
            </View>
          </View>

            {rec.dishTypes.length > 0 && (
            <View style={styles.iconText}>
            <FontAwesome
              name={"cutlery"}
              size={hp("4%")}
              color="#34359A"
              marginRight={wp("1%")}
            />
              {rec.dishTypes.map((type) => (
                <Text style={styles.text}>{type}</Text>
              ))}
            </View>)}

           {rec.period.length > 0 && (
           <View style={styles.iconText}>
            <Ionicons
              name={"calendar"}
              size={hp("4%")}
              color="#34359A"
              marginRight={wp("1%")}
            />
              {rec.period.map((period) => (
                <Text style={styles.text}>{period}</Text>
              ))}
            </View>)}

            {rec.culture.length > 0 && (
            <View style={styles.iconText}>
            <Ionicons
              name={"flag"}
              size={hp("4%")}
              color="#34359A"
              marginRight={wp("1%")}
            />
              {rec.culture.map((type) => (
                <Text style={styles.text}>{type}</Text>
              ))}
            </View>)}
        </View>
      </TouchableOpacity>
    ))

    return (
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Recipes</Text>
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("10%"),
    marginTop: hp("5%")
    
  },
  pageTitle: {
    fontSize: hp("4%"),
    color: "#34359A",
    fontFamily: "Nunito_700Bold",
    marginBottom: hp("1%"),
    textAlign: "center"
  },
  recipe: {
    backgroundColor: "white",
    padding: hp("3%"),
    width: wp("85%"),
    borderRadius: 10,
    marginTop: hp("3%"),
  },
  foodImg: {
    width: wp("65%"),
    height: hp("25%"),
    marginBottom: hp("2%"),
    marginHorizontal: wp("5%")
  },
  recipeName: {
    fontSize: hp("3.5%"),
    color: "#34359A",
    fontFamily: "Nunito_700Bold",
    marginBottom: hp("1%"),
    textAlign: "center"
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
  }
});
