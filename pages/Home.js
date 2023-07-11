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
import { SvgUri } from 'react-native-svg';

import {RECIPES_API_KEY, HOLIDAYS_API_KEY} from '@env'
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

      holidays: [{
        name: "Independence day",
        description: "This is the description",
        locations: "All",
        datetime: {
            year: 2023,
            month: 8,
            day: 14
        },
        holidayType: "Public holiday"
      }], 

      didYouKnow: "",

      dateTime: {
        date: "",
        time: ""
      },
      weather: ""
    };

  }
  
  componentDidMount() {
    //this.getRecipeOfTheDay()
    //this.getHolidays()
    this.getDidYouKnow()
    this.getTimeDate()
  }

  async getTimeDate() {
    axios.get("https://api.open-meteo.com/v1/forecast?latitude=33.7215&longitude=73.0433&hourly=temperature_2m&current_weather=true")
      .then((res) => {
        let weatherInIslamabad = res.data.current_weather.temperature
        this.setState({weather: `${weatherInIslamabad}°C`})
      })
    setInterval(()=>{
      let date = new Date().toLocaleDateString("en-GB", {timeZone: "Asia/Karachi"})
      let time = new Date().toLocaleTimeString("en-GB", {timeZone: "Asia/Karachi"})
      let timeWithoutSeconds = time.slice(0, -3)
      //console.log(timeWithoutSeconds)
      
      let dateAndTime = {
        date: date,
        time: timeWithoutSeconds
      }
      //console.log(dateAndTime)
      this.setState({dateTime: dateAndTime})
    }, 1000)
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

  async goToHolidaysPage() {
    this.props.navigation.navigate("Holidays")
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
    //console.log(didYouKnows)

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


    let holidays = this.state.holidays.map((holiday) =>
    <TouchableOpacity style={styles.holidays} onPress={() => this.goToHolidaysPage()}>
      <Text  style={styles.holidayName}>{holiday.name}</Text>
      <Text  style={styles.holidayDate}>{holiday.datetime.day} - {holiday.datetime.month} - {holiday.datetime.year}</Text>
      {holiday.holidayType &&
                  <View style={styles.iconText}>
                <Ionicons
                    name={"information-circle"}
                    size={hp("3%")}
                    color="#FF5E00"
                />
                <Text style={styles.text}>{holiday.holidayType}</Text>
              </View>}
    </TouchableOpacity>
    )

  
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.didYouKnow}>
          <Text style={styles.dateTime}>{this.state.dateTime.date}</Text>
          <Text style={styles.dateTime}>{this.state.dateTime.time}</Text>
          <Text style={styles.dateTime}>{this.state.weather}</Text>
          </View>
          <ImageBackground
          source={require("../assets/recipeApp/food.jpg")}
          resizeMode="cover"
          style={styles.backgroundImage}>
            <View style={styles.didYouKnow}>
              <Text  style={styles.holidayName}>Did you know that ...</Text>
              <Text  style={styles.fact}>{this.state.didYouKnow}</Text>
            </View>
          </ImageBackground>
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
    height: hp("100%"),
    marginVertical: hp("5%"),
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
  holidays: {
    backgroundColor: "white",
    padding: hp("1.5%"),
    borderRadius: 10,
    borderColor: "#FF5E00",
    borderWidth: 3,
    marginTop: hp("3%"),
    marginLeft: wp ("2.5%")
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
    width: wp("95%"),
    borderRadius: 10,
    borderColor: "#FF5E00",
    borderWidth: 3,
    marginHorizontal: wp ("2.5%"),
  },
  backgroundImage: {
    justifyContent: "center",
    alignItems: "center",
    width: wp("100%"),
    height: hp("30%"),
    marginTop: hp("5%")
  },
  dateTime: {
    fontFamily: "Nunito_700Bold",
    fontSize: hp("2.5%"),
    textAlign: "center",
  }
});
