import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  Modal,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import CheckBox from 'react-native-check-box'

import {RECIPES_API_KEY} from '@env'

import { collection, getDocs, addDoc } from "firebase/firestore"; 
import {DATABASE} from "../firebaseConfig"

import AsyncStorage from "@react-native-async-storage/async-storage";


export default class Recipes extends React.Component {
  constructor(props) {
    super(props);
    //this.getRecipes()


    this.state = {
      randomRecipes: [
        {
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
      ],

      allCultures:[],
      allDishTypes:[],
      allOccasions:[],

      filterScreenVisible: false,
      filters: [],

      cultureCheckedInFilter:[],
      dishTypeCheckedInFilter:[],
      occasionCheckedInFilter:[],
    };
  }


  async getRecipes() {
    axios.get(`https://api.spoonacular.com/recipes/random?number=5&apiKey=${RECIPES_API_KEY}`)
    .then((res) => {
      let recipes = []
      res.data.recipes.forEach((rec) => {
        if(rec.analyzedInstructions !== null) {
          recipes.push({
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
        }
      })
      
      this.setState({randomRecipes: recipes})
    })
    this.getFilterData()
  }

  async getFilterData() {
    let cultures = []
    let dishTypes = []
    let occasions = []

    cultureChecked = []
    dishTypeChecked = []
    occasionChecked = []

    // Push culture and dish type values from database into arrays + set checkbox to unchecked
    let cultureCollection = collection(DATABASE, "cultures")
    let cultureData = await getDocs(cultureCollection)
    if (cultureData.size > 0) {
      cultureData.forEach((doc) => {
        cultures.push(doc.data().culture)
        cultureChecked.push(false)
      })
    } 

    let dishTypeCollection = collection(DATABASE, "dishTypes")
    let dishTypeData = await getDocs(dishTypeCollection)
    if (dishTypeData.size > 0) {
      dishTypeData.forEach((doc) => {
        dishTypes.push(doc.data().dishType)
        dishTypeChecked.push(false)
      })
    } 

    // Check if already data available in database --> occasions
    let occasionCollection = collection(DATABASE, "occasions")
    let occasionData = await getDocs(occasionCollection)
    if (occasionData.size > 0) {
      occasionData.forEach((doc) => {
        occasions.push(doc.data().occasion)
        occasionChecked.push(false)
      })
    } 

    // add occasions in db if not already
    for(let rec of this.state.randomRecipes) {
      for(let occasion of rec.period) {
        if(!occasions.includes(occasion)) {
          occasions.push(occasion)
          occasionChecked.push(false)
          await addDoc((occasionCollection), {occasion: occasion})
        }
      }

    }

    // order arrays alphabetically
    cultures.sort()
    dishTypes.sort()
    occasions.sort()

    // save data arrays in state
    this.setState({allCultures: cultures})
    this.setState({allDishTypes: dishTypes})
    this.setState({allOccasions: occasions})

    this.setState({cultureCheckedInFilter: cultureChecked})
    this.setState({dishTypeCheckedInFilter: dishTypeChecked})
    this.setState({occasionCheckedInFilter: occasionChecked})

    //console.log(this.state.occasionCheckedInFilter)
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
      instructions: rec.instructions
    })
  }

  openFilterScreen() {
    this.setState({filterScreenVisible: true})
  }

  closeFilterScreen() { 
    // uncheck all filters
    let uncheckCultureFilters = []
    let uncheckDishTypeFilters = []
    let uncheckOccasionFilters = []

    this.state.cultureCheckedInFilter.forEach(() => {
      uncheckCultureFilters.push(false)
    })
    this.state.dishTypeCheckedInFilter.forEach(() => {
      uncheckDishTypeFilters.push(false)
    })
    this.state.occasionCheckedInFilter.forEach(() => {
      uncheckOccasionFilters.push(false)
    })

    this.setState({filterScreenVisible: false})
    this.setState({cultureCheckedInFilter: uncheckCultureFilters})
    this.setState({dishTypeCheckedInFilter: uncheckDishTypeFilters})
    this.setState({occasionCheckedInFilter: uncheckOccasionFilters})

  }

  async applyFilter() {
    this.setState({filterScreenVisible: false})

    // set the filters to lower case => for api call
    let filterTags = this.state.filters.toString().toLowerCase()
    //console.log(filterTags)

    axios.get(`https://api.spoonacular.com/recipes/random?number=3&tags=${filterTags}&apiKey=${RECIPES_API_KEY}`)
    .then((res) => {
      let filteredRecipes = []
      res.data.recipes.forEach((rec) => {
        if(rec.analyzedInstructions != null) {
          filteredRecipes.push({
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
        }
      })
      this.setState({randomRecipes: filteredRecipes})
    })

    this.getFilterData()
  }

  addFilter(checkedArray, i, item){
    checkedArray[i] = !checkedArray[i]
    if(!this.state.filters.includes(item)){
      this.state.filters.push(item)
    } else {
      this.state.filters = this.state.filters.filter(remove => remove != item)
    }
    //console.log(this.state.filters)
    this.setState({checkedArray: checkedArray})
    this.setState({filters: this.state.filters})
  }

  removeFilter(filter) {
    this.refs._scrollView.scrollTo({x: 0, y: 0, animated: true});
    //console.log(`${filter} clicked`)
    this.state.filters = this.state.filters.filter(remove => remove != filter)
    if(this.state.filters.length == 0) {
      this.getRecipes()
    } else {
      this.applyFilter()
    }
    this.setState({filters: this.state.filters})
  }

  async addRecipe() {
    let loggedIn = await AsyncStorage.getItem("userLoggedIn")
    if(loggedIn !==  null) {
      this.props.navigation.navigate("AddRecipe")
    } else {
      Alert.alert(
        "Not logged in",
        "You need to log in to add a new recipe",
        [
          {text: "Cancel", style: "cancel"},
          {text: "Log in", onPress: () => this.props.navigation.navigate("LogIn")}
        ]
      )
    }
  }

  render() {
    let cultures;
    let dishTypes;
    let periods;
    this.state.randomRecipes.forEach((rec) => {
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

    if(this.state.randomRecipes.length > 0) {
    recipes = this.state.randomRecipes.map((rec) => (
      <TouchableOpacity
      key={rec.id}
      style={styles.recipe}
      onPress={() => this.goToRecipeDetails(rec)}>
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
                      <Text style={styles.text}>{rec.time} minutes</Text>
                  </View>
                </View>
  
                {rec.culture.length > 0 && (
              <View style={[styles.iconText, {width: wp("60%")}]}>
              <Ionicons
                name={"flag"}
                size={hp("2.5%")}
                color="#115740"
              />
                {cultures}
              </View>)}
  
              {rec.dishTypes.length > 0 && (
              <View style={[styles.iconText, {width: wp("60%")}]}>
              <FontAwesome
                name={"cutlery"}
                size={hp("2.5%")}
                color="#115740"
              />
                {dishTypes}
              </View>)}
  
                  {rec.period.length > 0 && (
                <View style={[styles.iconText, {width: wp("60%")}]}>
                  <Ionicons
                    name={"calendar"}
                    size={hp("2.5%")}
                    color="#115740"
                  />
                    {periods}
                  </View>)}
              </View>
            </View>
      </TouchableOpacity>
    ))
  } else {
    recipes = <Text style={styles.noRecipes}>No recipes found</Text>
  }

    let filters = this.state.filters.map((filter) => (
      <View style={[styles.iconText, styles.filteredItems]}>
        <Text style={styles.text}>{filter}</Text>
        <Ionicons
              name={"close"}
              size={hp("3%")}
              color="#115740"
              onPress={() => this.removeFilter(filter)}
            />
      </View>
    ))


    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons
              name={"add"}
              size={hp("5%")}
              color="#115740"
              onPress={() => this.addRecipe()}
            />
          <Text style={styles.pageTitle}>Recipes</Text>
          <Ionicons
              name={"filter"}
              size={hp("5%")}
              color="#115740"
              onPress={() => this.openFilterScreen()}
            />
        </View>
        {this.state.filters.length > 0 && 
        <ScrollView 
        horizontal={true}
        style={{marginLeft: wp("5%"), marginVertical: hp("1%")}}>
          {filters}
        </ScrollView>}
        <ScrollView ref='_scrollView'>
          {recipes}
        </ScrollView>

        {this.state.randomRecipes.length > 0 &&
          <TouchableOpacity style={styles.button}
          onPress={() => this.removeFilter()}>
              <Text style={styles.btnText}>Show more recipes</Text>
        </TouchableOpacity>}

        {/* filterscreen */}
        <Modal
        visible={this.state.filterScreenVisible}>
          <Ionicons
              name={"close"}
              size={hp("5%")}
              color="#115740"
              marginLeft={wp("85%")}
              marginTop={hp("3%")}
              onPress={() => this.closeFilterScreen()}
            />
              <View>
                <Text style={styles.category}>Culture</Text>
            <ScrollView style={styles.filterChoice}>
                {this.state.allCultures.map((culture, index) => 
                <View style={styles.iconText}>
                  <CheckBox
                  style={{marginLeft: wp("3%")}}
                  isChecked = {this.state.cultureCheckedInFilter[index]}
                  onClick= {() => this.addFilter(this.state.cultureCheckedInFilter, index, culture)}/>
                  <Text style={styles.text}>{culture}</Text>
                </View>)}
              </ScrollView>
              </View>
  
              <View>
                <Text style={styles.category}>Dish Type</Text>
                <ScrollView style={styles.filterChoice}>
                  {this.state.allDishTypes.map((type, index) => 
                    <View style={styles.iconText}>
                      <CheckBox
                      style={{marginLeft: wp("3%")}}
                      isChecked = {this.state.dishTypeCheckedInFilter[index]}
                      onClick= {() => this.addFilter(this.state.dishTypeCheckedInFilter, index, type)}/>
                      <Text style={styles.text}>{type}</Text>
                    </View>)}
                </ScrollView>
              </View>
  
              <View>
                <Text style={styles.category}>Occasion</Text>
                <ScrollView style={styles.filterChoice}>
                  {this.state.allOccasions.map((occasion, index) => 
                  <View style={styles.iconText}>
                    <CheckBox
                    style={{marginLeft: wp("3%")}}
                    isChecked = {this.state.occasionCheckedInFilter[index]}
                    onClick= {() => this.addFilter(this.state.occasionCheckedInFilter, index, occasion)}/>
                    <Text style={styles.text}>{occasion}</Text>
                  </View>)}
                </ScrollView>
              </View>
            <TouchableOpacity style={styles.filterBtn} onPress={() => this.applyFilter()}>
              <Text style={styles.btnText}>Apply filter(s)</Text>
            </TouchableOpacity>
            
        </Modal>
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
    marginHorizontal: wp("7.5%")
  },
  pageTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: hp("3.5%"),
    color:"#FF5E00"
  },
  recipe: {
    backgroundColor: "white",
    padding: hp("1.5%"),
    width: wp("95%"),
    borderRadius: 10,
    borderColor: "#115740",
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

  filterBtn:{
    width: wp("50%"),
    padding: hp("1%"),
    backgroundColor: "#115740",
    borderRadius: 10,
    marginHorizontal: wp("25%"),
    marginBottom: hp("3%"),
  },
  category:{
    fontFamily:"Nunito_700Bold",
    marginLeft: wp("5%"),
    marginBottom: hp("1%"),
    fontSize: hp("2%"),
  },
  filteredItems:{
    height: hp("5%"),
    marginRight: wp("3%"),
    borderWidth: 1,
    borderRadius: 20,
    padding: wp("1%")
  },
  noRecipes:{
    textAlign: "center",
    fontFamily:"Nunito_700Bold",
    fontSize: hp("3%"),
    marginTop: hp("20%")
  },
  button: {
    width: wp("80%"),
    padding: hp("1%"),
    backgroundColor: "#115740",
    borderRadius: 10,
    marginTop: hp("10%"),
    marginHorizontal: wp("10%")
  },
btnText:{
    fontFamily:"Nunito_700Bold",
    fontSize: hp("2.5%"),
    color: "#ffffff",
    textAlign: "center"
},
  filterChoice: {
    marginBottom:hp("3%"),
    height: hp("20%"),
    borderRadius: 10,
    borderColor: "#115740",
    borderWidth: 3,
    width: wp("90%"),
    marginHorizontal: wp("5%"),
  }
});
