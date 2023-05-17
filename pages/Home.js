import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import {API_KEY} from '@env'

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recipeOfTheDay: {
          id:0,
          servings: 0,
          recipeName: "",
          ingredients: [{
            id: 0,
            nameAndQuantity: "",
            img: "",
          }],
          instructions: [],
          culture: [],
          time: 0,
          foodImg: "",
          dishTypes: [],
          period: [],
        },
    };

    //this.getRecipeOfTheDay()
  }

  async getRecipeOfTheDay() {
    let recipe;
      axios.get(`https://api.spoonacular.com/recipes/random?number=1&apiKey=${API_KEY}`)
      .then((res) => {
        //console.log(res.data)
        res.data.recipes.forEach((rec) => {
          if(rec.analyzedInstructions) {
            recipe = {
              id: rec.id,
              servings: rec.servings,
              recipeName: rec.title,
              ingredients: rec.extendedIngredients,
              instructions: rec.analyzedInstructions[0].steps,
              culture: rec.cuisines,
              time: rec.readyInMinutes,
              foodImg: rec.image,
              dishTypes: rec.dishTypes,
              period: rec.occasions,
            }
          }
        })
        
        //console.log(recipe)
        this.setState({recipeOfTheDay: recipe})
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
      instructions: rec.instructions,
    })
  }


  render() {
    let rec = this.state.recipeOfTheDay

    let cultures;
    if(rec.culture.length > 1){
      cultures = 
      rec.culture.map((culture) => (
        <Text style={styles.text}>{culture} |</Text>
        ))
    } else if(rec.culture.length == 1) {
      cultures = 
      <Text style={styles.text}>{rec.culture[0]}</Text>
    }


    let dishTypes;
    if(rec.dishTypes.length > 1) {
      dishTypes =
      rec.dishTypes.map((type) => (
        <Text style={styles.text}>{type} |</Text>
      ))
    } else if(rec.dishTypes.length == 1){
      dishTypes =
      <Text style={styles.text}>{rec.dishTypes[0]}</Text>
    }

    let periods;
    if(rec.period.length > 1) {
      period =
      rec.period.map((period) => (
        <Text style={styles.text}>{period} |</Text>
      ))
    } else if(rec.period.length == 1){
      period =
      <Text style={styles.text}>{rec.period[0]}</Text>
    }


    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Recipe of the day</Text>
        <TouchableOpacity style={styles.recipe} onPress={() => this.goToRecipeDetails(rec)}>
          <View style={{display:"flex", flexDirection:"row", alignItems: "center"}}>
          <Image
          source={{uri: rec.foodImg}}
          style={styles.foodImg}
          />
            <View>
              <Text style={styles.recipeName}>
                {rec.recipeName}
              </Text>

              {rec.culture.length > 0 && (
            <View style={styles.iconText}>
            <Ionicons
              name={"flag"}
              size={hp("2.5%")}
              color="#34359A"
              marginRight={wp("1%")}
            />
              {cultures}
            </View>)}

            {rec.dishTypes.length > 0 && (
            <View style={styles.iconText}>
            <FontAwesome
              name={"cutlery"}
              size={hp("2.5%")}
              color="#34359A"
              marginRight={wp("1%")}
            />
              {dishTypes}
            </View>)}

                {rec.period.length > 0 && (
              <View style={styles.iconText}>
                <Ionicons
                  name={"calendar"}
                  size={hp("2.5%")}
                  color="#34359A"
                  marginRight={wp("1%")}
                />
                  {periods}
                </View>)}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: hp("10%"),
    marginTop: hp("5%")
    
  },
  sectionTitle: {
    fontSize: hp("3%"),
    fontFamily: "Nunito_700Bold",
    marginLeft: wp("3%")
  },
  recipe: {
    backgroundColor: "white",
    padding: hp("1.5%"),
    width: wp("95%"),
    borderRadius: 10,
    marginTop: hp("3%"),
    marginHorizontal: wp ("2.5%")
  },
  foodImg: {
    width: wp("30%"),
    height: hp("15%"),
    marginRight: wp("3%")
  },
  recipeName: {
    fontSize: hp("2.5%"),
    color: "#34359A",
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
    width: wp("55%")
  },
  text: {
    fontFamily:"Nunito_400Regular",
    fontSize: hp("2%"),
    marginLeft: wp("2%")
  }
});
