import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { SvgUri } from 'react-native-svg';

import {RECIPES_API_KEY} from '@env'
import {DATABASE} from "../firebaseConfig"
import { collection, getDocs } from "firebase/firestore"; 

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

        countries:[{
          country: "Pakistan",
          countryCode: "pk"
        }], 

        didYouKnow: ""
    };

    //this.getRecipeOfTheDay()
    this.getCountriesForHolidays()
    this.getDidYouKnow()
  }


  async getRecipeOfTheDay() {
    let recipe;
      axios.get(`https://api.spoonacular.com/recipes/random?number=1&apiKey=${RECIPES_API_KEY}`)
      .then((res) => {
        //console.log(res.data)
        res.data.recipes.forEach((rec) => {
          if(rec.analyzedInstructions != null) {
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
      id: rec.id,
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

  async getCountriesForHolidays() {
    let countries = []
    let countryCollection = collection(DATABASE, "countries")
    let countryData = await getDocs(countryCollection)
    if (countryData.size > 0) {
      countryData.forEach((doc) => {
        countries.push({
          country: doc.data().country,
          countryCode: doc.data().countryCode
        })
      })
    } 
    let sorted = countries.sort((a, b) => a.country.localeCompare(b.country))
    //console.log(sorted)
    this.setState({countries: countries})
  }

  async goToHolidaysPage(country) {
    this.props.navigation.navigate("Holidays", {
      country: country.country,
      countryCode: country.countryCode
    })
  }

  async getDidYouKnow() {
    let didYouKnows = []
    let didYouKnowCollection = collection(DATABASE, "didyouknows")
    let didYouKnowData = await getDocs(didYouKnowCollection)
    if (didYouKnowData.size > 0) {
      didYouKnowData.forEach((doc) => {
        didYouKnows.push(doc.data().didYouKnow)
      })
    } 
    let randomFact = didYouKnows[Math.floor(Math.random() * didYouKnows.length)]
    console.log(didYouKnows)

    this.setState({didYouKnow: randomFact})
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
      periods =
      rec.period.map((period) => (
        <Text style={styles.text}>{period} |</Text>
      ))
    } else if(rec.period.length == 1){
      periods =
      <Text style={styles.text}>{rec.period[0]}</Text>
    }


    let countries = this.state.countries.map((country) =>
    <TouchableOpacity style={styles.country} onPress={() => this.goToHolidaysPage(country)}>
        <SvgUri
        uri={`https://flagcdn.com/${country.countryCode}.svg`}
        width={wp("25%")}
        height={hp("15%")}/>
      <Text  style={styles.countryName}>{country.country}</Text>
    </TouchableOpacity>
    )
    


    return (
      <ScrollView>
        <View style={styles.container}>
          <View>
          <Text style={styles.sectionTitle}>Cultural eating habit</Text>
          <View style={styles.recipe}>
            <Text  style={styles.countryName}>Did you know that ...</Text>
            <Text  style={styles.fact}>{this.state.didYouKnow}</Text>
          </View>
          </View>
          <View>
            <Text style={styles.sectionTitle}>Recipe of the day</Text>
            <TouchableOpacity style={styles.recipe} onPress={() => this.goToRecipeDetails(rec)}>
              <View style={{display:"flex", flexDirection:"row", alignItems: "center"}}>
              {rec.foodImg != "" ?(
              <Image
              source={{uri: rec.foodImg}}
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
  
                  <View style={{display:"flex", flexDirection:"row", alignItems: "center"}}>
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
                        <Text style={styles.text}>{rec.time} minutes</Text>
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
          </View>
  
          <View>
          <Text style={styles.sectionTitle}>Upcoming holidays</Text>
          <ScrollView horizontal>
           {countries}
          </ScrollView>
          </View>
      </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: hp("3%"),
    paddingTop: hp("5%"),
    backgroundColor:"#FFFFFF" 
    
  },
  sectionTitle: {
    fontSize: hp("3%"),
    fontFamily: "Nunito_700Bold",
    marginLeft: wp("3%"),
    marginTop: hp("3%"),
    color: "#FF0000"
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
  foodImg: {
    width: wp("30%"),
    height: hp("15%"),
    marginRight: wp("3%"),
    borderRadius: 10,
  },
  recipeName: {
    fontSize: hp("3%"),
    fontFamily: "Nunito_700Bold",
    marginBottom: hp("1%"),
    width: wp("55%")
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
  country: {
    backgroundColor: "white",
    padding: hp("1.5%"),
    width: wp("35%"),
    height: wp("40%"),
    borderRadius: 10,
    borderColor: "#FF5E00",
    borderWidth: 3,
    marginTop: hp("3%"),
    marginLeft: wp ("5%")
  },
  countryName: {
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
    fontSize: hp("2.5%"),
  },
  fact:{
    fontFamily:"Nunito_400Regular",
    textAlign:"center",
    fontSize: hp("2%"),
  }
});
