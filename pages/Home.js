import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  ImageBackground,
  Linking
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import {HOLIDAYS_API_KEY, WEATHER_API_KEY, NEWS_API_KEY} from '@env'
import {DATABASE} from "../firebaseConfig"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"; 

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
          chef: ""
        },

      holidays: [{
        name: "Independence Day",
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

      categories: ["Bread", "Curry", "Dessert", "Rice", "Snack", "Sweets"],

      dateTime: {
        date: "",
        time: ""
      },

      weather: {
        temp: "",
        tempMax: "",
        tempMin: "",
        feelsLike: ""
      },

      newsHeadline: {
        title: "",
        img: "",
        newsURL: "",
        src: ""
      }


    };

  }
  
  componentDidMount() {
    this.getRecipeOfTheDay()
    //this.getHolidays()
    this.getDidYouKnow()
    this.getTimeAndDate()
    this.getIslamabadWeather()
    this.getNewsHeadline()
  }

  async getTimeAndDate() {
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

  async getIslamabadWeather() {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=33.7215&lon=73.0433&appid=${WEATHER_API_KEY}`)
      .then((res) => {
        //console.log(res.data.main)
        let current_temp = this.kelvinToCelsius(res.data.main.temp)
        let temp_max = this.kelvinToCelsius(res.data.main.temp_max)
        let temp_min = this.kelvinToCelsius(res.data.main.temp_min)
        let feels_like = this.kelvinToCelsius(res.data.main.feels_like)

        let weatherInIslamabad = {
          temp:`${current_temp} °C`,
          tempMax: `${temp_max} °C`,
          tempMin: `${temp_min} °C`,
          feelsLike: `${feels_like} °C`
        }

        this.setState({weather: weatherInIslamabad})
      })
  }

  kelvinToCelsius(kelvin) {
    return Math.round(kelvin-273.15)
  }

  async getNewsHeadline() {
    axios.get(`https://gnews.io/api/v4/top-headlines?country=pk&category=nation&apikey=${NEWS_API_KEY}`)
    .then((res) => {
      console.log(res.data.articles[0])
      let article = res.data.articles[0]
      let news = {
        title: article.title,
        img: article.image,
        newsURL: article.url,
        src: article.source.name
      }

      //console.log(news)
      this.setState({newsHeadline: news})
    })
  }



  async getRecipeOfTheDay() {
    let recipes = []

    let recipeCollection = collection(DATABASE, "recipes")
    let recipeData = await getDocs(recipeCollection)
    if (recipeData.size > 0) {
      recipeData.forEach((doc) => {
        if(doc.data().public == true) {
          recipes.push(doc.data())
        }
      })
    }
    
    let today = new Date().toDateString()
    let recipeOfTheDay = {}
    let docId;

    let recipeOfTheDayCollection = collection(DATABASE, "recipeOfTheDay")
    let recipeOfTheDayData = await getDocs(recipeOfTheDayCollection)
    if (recipeOfTheDayData.size > 0) {
      recipeOfTheDayData.forEach((doc) => {
        docId = doc.id
        recipeOfTheDay = doc.data()
      })
    }
    // console.log(recipeOfTheDay)
    // console.log(docId)

     /*
      - Check if the date saved in database matches the current date
      - If the dates match, set the index stored in database
      - If the dates don't match, get the next recipe in the list and edit the values in database
      - If the index saved in database is the last recipe in the list, set index to 0
    */

    let recipeOfTheDayIndex;

    if(today === recipeOfTheDay.today) {
      recipeOfTheDayIndex = recipeOfTheDay.recipeOfTheDayIndex
    } else {
      if(recipeOfTheDay.recipeOfTheDayIndex == recipes.length-1) {
        recipeOfTheDayIndex = 0
      } else {
        recipeOfTheDayIndex = recipeOfTheDay.recipeOfTheDayIndex+1
      }
      await updateDoc(doc(DATABASE, "recipeOfTheDay", docId), {
        today: today,
        recipeOfTheDayIndex: recipeOfTheDayIndex
      })

    }
    this.setState({recipeOfTheDay: recipes[recipeOfTheDayIndex]})
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
      category: rec.category,
      chef: rec.chef,
      userId: rec.userId,
      visible: rec.public
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

    let didYouKnow = 
    <ImageBackground
    source={require("../assets/recipeApp/bgHome.jpeg")}
    resizeMode="cover"
    style={[styles.backgroundImage, {height: hp("30%")}]}>
      <Text  style={[styles.sectionTitle, {marginTop: hp("3%")}]}>Did you know that ...</Text>
      <View style={styles.didYouKnow}>
        <Text  style={styles.fact}>{this.state.didYouKnow}</Text>
      </View>
    </ImageBackground>

    let timeDate = 
    <ImageBackground
    source={require("../assets/recipeApp/bgTime.jpg")}
    resizeMode="cover"
    style={[styles.backgroundImage, {height: hp("25%")}]}>
      <Text  style={[styles.sectionTitle, {marginTop: hp("3%")}]}>Time and date in Pakistan</Text>
      <View style={{display: "flex", flexDirection:"row", justifyContent: "space-evenly"}}>
      	<View style={[styles.didYouKnow, {width: wp("40%")}]}>
      	  <Text  style={styles.holidayName}>{this.state.dateTime.date}</Text>
      	</View>
      	<View style={[styles.didYouKnow, {width: wp("40%")}]}>
      	  <Text  style={styles.holidayName}>{this.state.dateTime.time}</Text>
      	</View>
      </View>
    </ImageBackground>

    let weather = 
    <ImageBackground
    source={require("../assets/recipeApp/bgWeather.jpg")}
    resizeMode="cover"
    style={[styles.backgroundImage, {height: hp("35%")}]}>
      <Text  style={[styles.sectionTitle, {marginTop: hp("3%")}]}>Weather in Islamabad</Text>
      <View style={{display: "flex", flexDirection:"row", justifyContent: "space-evenly", alignContent:"center"}}>
        <View style={[styles.didYouKnow, {width: wp("40%")}]}>
          <Text  style={styles.holidayName}>Temperature</Text>
          <Text  style={styles.holidayName}>{this.state.weather.temp}</Text>
        </View>
          <View style={[styles.didYouKnow, {width: wp("40%")}]}>
              <Text  style={styles.holidayName}>Feels like</Text>
              <Text  style={styles.holidayName}>{this.state.weather.feelsLike}</Text>
            </View>
      </View>
        <View style={{display: "flex", flexDirection:"row", justifyContent: "space-evenly", alignContent:"center"}}>
          <View style={[styles.didYouKnow, {width: wp("40%")}]}>
              <Text  style={styles.holidayName}>Maximum</Text>
              <Text  style={styles.holidayName}>{this.state.weather.tempMax}</Text>
            </View>
          <View style={[styles.didYouKnow, {width: wp("40%")}]}>
          <Text  style={styles.holidayName}>Minimum</Text>
              <Text  style={styles.holidayName}>{this.state.weather.tempMin}</Text>
            </View>
        </View>
    </ImageBackground>

    let news;
    if(this.state.newsHeadline.title !== "") {
      news = 
      <ImageBackground
      source={require("../assets/recipeApp/bgNews.png")}
      resizeMode="cover"
      style={[styles.backgroundImage, {height: hp("40%")}]}>
        <Text  style={[styles.sectionTitle, {marginTop: hp("3%")}]}>News headline</Text>
        <TouchableOpacity style={styles.didYouKnow} onPress={() => Linking.openURL(this.state.newsHeadline.newsURL)}>
            <View style={{display:"flex", flexDirection:"row", alignItems: "center"}}>
            {this.state.newsHeadline.img != "" ?(
                  <Image
                  source={{uri: this.state.newsHeadline.img}}
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
                        <Text style={[styles.holidayName, {width: wp("45%"), textAlign: "left"}]}>
                          {this.state.newsHeadline.title}
                        </Text>
                        
                      <View style={[styles.iconText, {width: wp("60%")}]}>
                      <Ionicons
                        name={"newspaper"}
                        size={hp("2.5%")}
                        color="#115740"
                      />
                        <Text style={styles.text}>Click here to read article</Text>
                      </View>
                        
                      <View style={[styles.iconText, {width: wp("60%")}]}>
                      <MaterialCommunityIcons
                        name={"web"}
                        size={hp("2.5%")}
                        color="#115740"
                      />
                        <Text style={styles.text}>{this.state.newsHeadline.src}</Text>
                      </View>
                      </View>
                    </View>
        </TouchableOpacity>
      </ImageBackground>
    }
    

    let rec = this.state.recipeOfTheDay
    return (
      <ScrollView>
        <View style={styles.container}>
          {didYouKnow}
          {timeDate}
          {weather}
          {news}
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
                    {rec.servings != "" && (
                    <View style={[styles.iconText, {marginRight: wp("5%")}]}>
                      <Ionicons
                        name={"people"}
                        size={hp("2.5%")}
                        color="#115740"
                      />
                      <Text style={styles.text}>{rec.servings}</Text>
  
                    </View>)}
  
                    {rec.timeNeeded != "" && (
                    <View style={styles.iconText}>
                      <Ionicons
                        name={"stopwatch"}
                        size={hp("2.5%")}
                        color="#115740"
                      />
                        <Text style={styles.text}>{rec.timeNeeded} minutes</Text>
                    </View>)}
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
                  {rec.chef && (
                <View style={[styles.iconText, {width: wp("60%")}]}>
                <MaterialCommunityIcons
                  name={"chef-hat"}
                  size={hp("2.5%")}
                  color="#115740"
                />
                  <Text style={styles.text}>{rec.chef}</Text>
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
    width: wp("50%")
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
