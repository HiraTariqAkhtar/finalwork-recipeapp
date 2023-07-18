import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  ImageBackground
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import {RECIPES_API_KEY, HOLIDAYS_API_KEY} from '@env'
import {DATABASE} from "../firebaseConfig"
import { collection, getDocs } from "firebase/firestore"; 

import AsyncStorage from "@react-native-async-storage/async-storage";


export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recipeOfTheDay: {
          id:0,
          recipeName: "",
          timeNeeded: 0,
          servings: 0,
          category: "",
          ingredients: [],
          instructions: [],
          img: "",
        },

      holidays: [{
        name: "Independence day",
        description: "Pakistan celebrates its Independence Day on August 14. This day marks Pakistan’s emergence as an independent state.",
        locations: "All",
        datetime: {
            year: 2023,
            month: 8,
            day: 14
        },
        holidayType: "Public holiday"
      }], 

      didYouKnow: "",

      categories: ["Bread", "Curry", "Dessert", "Rice", "Snack", "Sweets"]
    };

  }
  
  componentDidMount() {
    this.getRecipeOfTheDay()
    //this.getHolidays()
    this.getDidYouKnow()
  }

  async getRecipeOfTheDay() {
    let recipes = []
    let recipeCollection = collection(DATABASE, "recipes")
    let recipeData = await getDocs(recipeCollection)
    if (recipeData.size > 0) {
      recipeData.forEach((doc) => {
        recipes.push(doc.data())
      })
    } 

    let today = new Date().toDateString()
    let recipeOfTheDayIndex;

    let dateSavedInStorage = await AsyncStorage.getItem('today');
    let recipeIndexInStorage = await AsyncStorage.getItem('recipeOfTheDayIndex');

  /* 
    If both the date and index are not yet saved in AsyncStorage:
    - Set a random index for the recipe of the day
    - Save the current date and index in AsyncStorage
  */
    if(dateSavedInStorage === null && recipeIndexInStorage === null) {
      AsyncStorage.setItem('today', today)
      recipeOfTheDayIndex = Math.floor(Math.random() * recipes.length)
      AsyncStorage.setItem('recipeOfTheDayIndex', recipeOfTheDayIndex.toString())
    } 
    /* If only the date or index is not yet saved in AsyncStorage => save the missing value in AsyncStorage*/
     else if(dateSavedInStorage === null && recipeIndexInStorage !== null) {
      AsyncStorage.setItem('today', today)
    } else if(dateSavedInStorage !== null && recipeIndexInStorage === null) {
      recipeOfTheDayIndex = Math.floor(Math.random() * recipes.length)
      AsyncStorage.setItem('recipeOfTheDayIndex', recipeOfTheDayIndex.toString())
    }
    /*
      If both the date and index are saved in AsyncStorage:
      - Check if the saved date matches the current date
      - If the dates match, set the index stored in AsyncStorage
      - If the dates don't match, generate a new random index for the recipe of the day and edit the date value in AsyncStorage
    */
    else {
      if(today === dateSavedInStorage) {
        recipeOfTheDayIndex = JSON.parse(recipeIndexInStorage)
      } else {
        AsyncStorage.setItem('today', today)
        recipeOfTheDayIndex = Math.floor(Math.random() * recipes.length)
        AsyncStorage.setItem('recipeOfTheDayIndex', recipeOfTheDayIndex.toString())
      }
    }

    let randomRecipe = recipes[recipeOfTheDayIndex]
    
    this.setState({recipeOfTheDay: randomRecipe})
  }

  goToRecipeDetails(rec) {
    this.props.navigation.navigate("RecipeDetail", {
      id: rec.id,
      recipeName: rec.recipeName,
      img: rec.img,
      servings: rec.servings,
      timeNeeded: rec.timeNeeded,
      ingredients: rec.ingredients,
      instructions: rec.instructions,
      category: rec.category
    })
  }

  async getHolidays() {
    let date = new Date()
      let currentDay = date.getDate()
      let currentMonth = date.getMonth()+1
      let currentYear = date.getFullYear()

      let holidaysThisMonth = []

      axios.get(`https://calendarific.com/api/v2/holidays?api_key=${HOLIDAYS_API_KEY}&country=pk&month=${currentMonth}&year=${currentYear}`)
          .then((res) => {
              //console.log(res.data.response.holidays)
              let holidays = res.data.response.holidays
              holidays.forEach((holiday) => {
                  if(holiday.date.datetime.day >= currentDay){
                      holidaysThisMonth.push({
                          name: holiday.name,
                          description: holiday.description,
                          locations: holiday.locations,
                          datetime: holiday.date.datetime,
                          holidayType: holiday.primary_type
                      })
                  }
              });
              holidaysThisMonth.sort((a,b) => a.datetime.month - b.datetime.month)
              this.setState({holidays: holidaysThisMonth})
            })

      if(currentMonth != 12) {
        for(let i = currentMonth+1; i <= 12; i++) {
          axios.get(`https://calendarific.com/api/v2/holidays?api_key=${HOLIDAYS_API_KEY}&country=pk&month=${i}&year=${currentYear}`)
          .then((res) => {
              //console.log(res.data.response.holidays)
              let holidays = res.data.response.holidays
              holidays.forEach((holiday) => {
                      holidaysThisMonth.push({
                          name: holiday.name,
                          description: holiday.description,
                          locations: holiday.locations,
                          datetime: holiday.date.datetime,
                          holidayType: holiday.primary_type
                      })
              });
              holidaysThisMonth.sort((a,b) => a.datetime.month - b.datetime.month)
              this.setState({holidays: holidaysThisMonth})
            })
      }
      }
  }

  async goToHolidaysPage(name, description, locations, day, month, year, holidayType) {
    this.props.navigation.navigate("Holidays", {
      name: name,
      description: description,
      locations: locations,
      day: day,
      month: month,
      year: year,
      holidayType: holidayType
    })
  }

  async getDidYouKnow() {
    let didYouKnows = []
    let didYouKnowCollection = collection(DATABASE, "didYouKnows")
    let didYouKnowData = await getDocs(didYouKnowCollection)
    if (didYouKnowData.size > 0) {
      didYouKnowData.forEach((doc) => {
        didYouKnows.push(doc.data().didYouKnow)
      })
    } 
    let randomFact = didYouKnows[Math.floor(Math.random() * didYouKnows.length)]
    //console.log(didYouKnows)

    this.setState({didYouKnow: randomFact})
  }

  async goToRecipePage(category) {
    this.props.navigation.navigate("Recipes", {category})
  }


  render() {
    let rec = this.state.recipeOfTheDay

    let holidays = this.state.holidays.map((holiday, index) =>
    <TouchableOpacity
      key = {index}
      style={[
        styles.holidays,
        index === this.state.holidays.length - 1 ? styles.lastHoliday : null,
      ]}
      onPress={() => this.goToHolidaysPage(holiday.name, holiday.description, holiday.locations, holiday.datetime.day, holiday.datetime.month, holiday.datetime.year, holiday.holidayType)}
      >
      <Text  style={styles.holidayName}>{holiday.name}</Text>
      <Text  style={styles.holidayDate}>{holiday.datetime.day} - {holiday.datetime.month} - {holiday.datetime.year}</Text>
      {holiday.holidayType &&
                  <View style={styles.iconText}>
                <Ionicons
                    name={"information-circle"}
                    size={hp("3%")}
                    color="#115740"
                />
                <Text style={styles.text}>{holiday.holidayType}</Text>
              </View>}
    </TouchableOpacity>
    )

    let categoryImg = {
      'Bread': require('../assets/recipeApp/bread.jpeg'),
      'Curry': require('../assets/recipeApp/curry.jpeg'),
      'Dessert': require('../assets/recipeApp/dessert.jpeg'),
      'Rice': require('../assets/recipeApp/rice.jpg'),
      'Snack': require('../assets/recipeApp/snack.jpeg'),
      'Sweets': require('../assets/recipeApp/sweets.jpeg'),
    }

    let categories = this.state.categories.map((category, index) => 
      <TouchableOpacity
        key={index}
        style={[
          styles.holidays,
          index === this.state.categories.length - 1 ? styles.lastHoliday : null,
        ]}
        onPress={() => this.goToRecipePage(category)}
      >
        <Image source={categoryImg[category]} style={styles.categoryImage} />
        <Text style={styles.holidayName}>{category}</Text>
      </TouchableOpacity>
    );
    

  
    return (
      <ScrollView>
        <View style={styles.container}>
          <ImageBackground
          source={require("../assets/recipeApp/bgHome.jpeg")}
          resizeMode="cover"
          style={styles.backgroundImage}>
              <Text  style={styles.sectionTitle}>Did you know that ...</Text>
            <View style={styles.didYouKnow}>
              <Text  style={styles.fact}>{this.state.didYouKnow}</Text>
            </View>
          </ImageBackground>
          <View>
            <Text style={styles.sectionTitle}>Recipe of the day</Text>
            <TouchableOpacity style={styles.recipe} onPress={() => this.goToRecipeDetails(rec)}>
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
  
                  <View style={{display:"flex", flexDirection:"row", alignItems: "center"}}>
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
                  {rec.category && (
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
          </View>
  
          <View>
          <Text style={styles.sectionTitle}>Recipes per category</Text>
          <ScrollView horizontal>
           {categories}
          </ScrollView>
          </View>
  
          <View>
          <Text style={styles.sectionTitle}>Upcoming holidays in Pakistan</Text>
          <ScrollView horizontal>
           {holidays}
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
    backgroundColor:"#FFFFFF",
  },
  sectionTitle: {
    fontSize: hp("3%"),
    fontFamily: "Nunito_700Bold",
    marginLeft: wp("5%"),
    marginTop: hp("1%"),
    color: "#FF5E00"
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
  holidays: {
    backgroundColor: "white",
    padding: hp("1.5%"),
    borderRadius: 10,
    borderColor: "#115740",
    borderWidth: 3,
    marginTop: hp("1%"),
    marginLeft: wp ("5%")
  },
  holidayName: {
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
    fontSize: hp("2.5%"),
  },
  holidayDate: {
    fontFamily: "Nunito_700Bold",
    fontSize: hp("2%"),
    textAlign: "center",
    marginVertical: hp("1.5%"),
  },
  fact:{
    fontFamily:"Nunito_400Regular",
    textAlign:"center",
    fontSize: hp("2%"),
  },
  didYouKnow: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: hp("1.5%"),
    width: wp("90%"),
    borderRadius: 10,
    borderColor: "#115740",
    borderWidth: 3,
    marginHorizontal: wp ("5%"),
    marginTop: hp("1%")
  },
  backgroundImage: {
    width: wp("100%"),
    height: hp("30%"),
    marginTop: hp("3%")
  },
  categoryImage: {
    width: wp("30%"),
    height: hp("10%"),
    borderRadius: 10,
  },
  lastHoliday: {
    marginRight: wp("5%")
  }
});
