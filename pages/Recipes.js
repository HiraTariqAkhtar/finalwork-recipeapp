import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  Modal,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import CheckBox from 'react-native-check-box'

import {API_KEY} from '@env'

import { collection, getDocs, addDoc } from "firebase/firestore"; 
import {DATABASE} from "../firebaseConfig"

export default class Recipes extends React.Component {
  constructor(props) {
    super(props);
    this.getRecipes()


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
      //     period: [],
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
          culture: ["European"],
          time: 30,
          foodImg: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/02/vegetable-pakora-recipe.jpg",
          dishTypes: ["snack"],
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
    // axios.get(`https://api.spoonacular.com/recipes/random?number=5&apiKey=${API_KEY}`)
    // .then((res) => {
    //   let recipes = []
    //   res.data.recipes.forEach((rec) => {
    //     if(rec.analyzedInstructions) {
    //       recipes.push({
    //         id: rec.id,
    //         servings: rec.servings,
    //         recipeName: rec.title,
    //         ingredients: rec.extendedIngredients,
    //         instructions: rec.analyzedInstructions[0].steps,
    //         culture: rec.cuisines,
    //         time: rec.readyInMinutes,
    //         foodImg: rec.image,
    //         dishTypes: rec.dishTypes,
    //         period: rec.occasions
    //       })
    //     }
    //   })
      
    //   this.setState({randomRecipes: recipes})
    // })
    this.getFilterData()
  }

  async getFilterData() {
    let cultures = []
    let dishTypes = []
    let occasions = []

    cultureChecked = []
    dishTypeChecked = []
    occasionChecked = []

    // Check if already data available in database
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

    let occasionCollection = collection(DATABASE, "occasions")
    let occasionData = await getDocs(occasionCollection)
    if (occasionData.size > 0) {
      occasionData.forEach((doc) => {
        occasions.push(doc.data().occasion)
        occasionChecked.push(false)
      })
    } 


    // add data in db if not already
    for(let rec of this.state.randomRecipes) {
      // cultures
      for(let culture of rec.culture) {
        if(!cultures.includes(culture)) {
          cultures.push(culture)
          cultureChecked.push(false)
          await addDoc((cultureCollection), {culture: culture})
        }
      }
      
      // dishTypes
      for(let type of rec.dishTypes) {
        if(!dishTypes.includes(type)) {
          dishTypes.push(type)
          dishTypeChecked.push(false)
          await addDoc((dishTypeCollection), {dishType: type})
        }
      }
      // occasions
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

    // axios.get(`https://api.spoonacular.com/recipes/random?number=3&tags=${filterTags}&apiKey=${API_KEY}`)
    // .then((res) => {
    //   let filteredRecipes = []
    //   res.data.recipes.forEach((rec) => {
    //     if(rec.analyzedInstructions) {
    //       filteredRecipes.push({
    //         id: rec.id,
    //         servings: rec.servings,
    //         recipeName: rec.title,
    //         ingredients: rec.extendedIngredients,
    //         instructions: rec.analyzedInstructions[0].steps,
    //         culture: rec.cuisines,
    //         time: rec.readyInMinutes,
    //         foodImg: rec.image,
    //         dishTypes: rec.dishTypes,
    //         period: rec.occasions
    //       })
    //     }
    //   })
    //   this.setState({filters: []})
    //   this.setState({randomRecipes: filteredRecipes})
    // })

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

  render() {
    let recipes = this.state.randomRecipes.map((rec) => (
      <TouchableOpacity
      key={rec.id}
      style={styles.recipe}
      onPress={() => this.goToRecipeDetails(rec)}>
        <View>
        {rec.foodImg != "" ?(
          <Image
          source={{uri: rec.foodImg}}
          style={styles.foodImg}
          />)
          : 
          <FontAwesome
              name={"image"}
              size={wp("40%")}
              color="#D3D3D3"
              marginHorizontal={wp("15%")}
            />}

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
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Recipes</Text>
          <Ionicons
              name={"filter"}
              size={hp("5%")}
              color="#34359A"
              onPress={() => this.openFilterScreen()}
            />
        </View>
        <ScrollView>
          {recipes}
        </ScrollView>

        {/* filterscreen */}
        <Modal
        visible={this.state.filterScreenVisible}>
          <Ionicons
              name={"close"}
              size={hp("5%")}
              color="#34359A"
              marginLeft={wp("85%")}
              marginTop={hp("3%")}
              onPress={() => this.closeFilterScreen()}
            />
            <ScrollView>
              <View style={{marginBottom:hp("3%")}}>
                <Text style={styles.category}>Culture</Text>
                {this.state.allCultures.map((culture, index) => 
                <View style={styles.iconText}>
                  <CheckBox
                  style={{marginLeft: wp("3%")}}
                  isChecked = {this.state.cultureCheckedInFilter[index]}
                  onClick= {() => this.addFilter(this.state.cultureCheckedInFilter, index, culture)}/>
                  <Text style={styles.text}>{culture}</Text>
                </View>)}
              </View>
  
              <View style={{marginBottom:hp("3%")}}>
                <Text style={styles.category}>Dish Type</Text>
                {this.state.allDishTypes.map((type, index) => 
                <View style={styles.iconText}>
                  <CheckBox
                  style={{marginLeft: wp("3%")}}
                  isChecked = {this.state.dishTypeCheckedInFilter[index]}
                  onClick= {() => this.addFilter(this.state.dishTypeCheckedInFilter, index, type)}/>
                  <Text style={styles.text}>{type}</Text>
                </View>)}
              </View>
  
              <View style={{marginBottom:hp("3%")}}>
                <Text style={styles.category}>Occasion</Text>
                {this.state.allOccasions.map((occasion, index) => 
                <View style={styles.iconText}>
                  <CheckBox
                  style={{marginLeft: wp("3%")}}
                  isChecked = {this.state.occasionCheckedInFilter[index]}
                  onClick= {() => this.addFilter(this.state.occasionCheckedInFilter, index, occasion)}/>
                  <Text style={styles.text}>{occasion}</Text>
                </View>)}
              </View>
            <TouchableOpacity style={styles.filterBtn} onPress={() => this.applyFilter()}>
              <Text style={styles.filterText}>Apply filter(s)</Text>
            </TouchableOpacity>
            </ScrollView>
        </Modal>
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
  header: {
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    marginHorizontal: wp("7.5%")
  },
  pageTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: hp("3.5%")
  },
  recipe: {
    backgroundColor: "white",
    padding: hp("3%"),
    width: wp("85%"),
    borderRadius: 10,
    marginTop: hp("3%"),
    marginHorizontal: wp("7.5%")
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
  },
  filterText: {
    fontFamily:"Nunito_700Bold",
    fontSize: hp("2.5%"),
    color: "#ffffff",
    textAlign: "center"
  },
  filterBtn:{
    width: wp("50%"),
    padding: hp("1%"),
    backgroundColor: "#34359A",
    borderRadius: wp("50%"),
    marginHorizontal: wp("25%"),
    marginBottom: hp("3%"),
  },
  category:{
    fontFamily:"Nunito_700Bold",
    marginLeft: wp("5%"),
    marginBottom: hp("2%"),
    fontSize: hp("2%"),
  }
});
