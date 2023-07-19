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


import { collection, getDocs, addDoc } from "firebase/firestore"; 
import {DATABASE} from "../firebaseConfig"

import AsyncStorage from "@react-native-async-storage/async-storage";


export default class Recipes extends React.Component {
  constructor(props) {
    super(props);
    this.getRecipes()


    this.state = {
      recipes: [
        {
          id:0,
          recipeName: "",
          timeNeeded: 0,
          servings: 0,
          category: "",
          ingredients: [],
          instructions: [],
          img: "",
        },
      ],

      allCategories:["Bread", "Curry", "Dessert", "Rice", "Snack", "Sweets"],
      allServings:["<5 ppl", "5-10 ppl", ">10 ppl"],
      allPrepTime:["<10 minutes", "10-30 minutes", ">30 minutes"],
      allIngredientAmount:["<5 ingredients", "5-10 ingredients", ">10 ingredients"],

      filterScreenVisible: false,
      filters: [],

      categoryCheckedInFilter: "",
      servingsCheckedInFilter: 0,
      prepTimeCheckedInFilter: 0,
      ingredientAmountCheckedInFilter: 0,
    };
  }


  async getRecipes() {
    let selectedCategoryFromHome = this.props.route.params?.category;
    //console.log(selectedCategoryFromHome)

    let recipes = []
    let recipeCollection = collection(DATABASE, "recipes")
    let recipeData = await getDocs(recipeCollection)
    if (recipeData.size > 0) {
      if(selectedCategoryFromHome !== undefined) {
        this.state.filters.push(selectedCategoryFromHome)
        recipeData.forEach((doc) => {
          if(doc.data().category === selectedCategoryFromHome) {
            recipes.push(doc.data())
          }
        })
        this.props.navigation.setParams({ category: undefined });
      } else {
        recipeData.forEach((doc) => {
          recipes.push(doc.data())
        })
      }
    }

    //console.log(recipes)
    this.setState({recipes: recipes})
    this.setState({filters: this.state.filters})
  }

  async getFilterData() {
    categoryChecked = []
    servingsChecked = []
    prepTimeChecked = []
    ingredientAmountChecked = []

    this.state.allCategories.forEach(() => {
      categoryChecked.push(false)
    })

    this.state.allServings.forEach(() => {
      servingsChecked.push(false)
    })

    this.state.allPrepTime.forEach(() => {
      prepTimeChecked.push(false)
    })

    this.state.allIngredientAmount.forEach(() => {
      ingredientAmountChecked.push(false)
    })


    this.setState({categoryCheckedInFilter: categoryChecked})
    this.setState({servingsCheckedInFilter: servingsChecked})
    this.setState({prepTimeCheckedInFilter: prepTimeChecked})
    this.setState({ingredientAmountCheckedInFilter: ingredientAmountChecked})

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

  openFilterScreen() {
    this.setState({filterScreenVisible: true})
  }

  closeFilterScreen() { 
    // uncheck all filters
    let uncheckCategoryFilters = []
    let uncheckServingsFilters = []
    let uncheckPrepTimeFilters = []
    let uncheckIngredientAmountFilters = []

    if(this.state.categoryCheckedInFilter.length > 0) {
      this.state.categoryCheckedInFilter.forEach(() => {
        uncheckCategoryFilters.push(false)
      })
    }

    if(this.state.servingsCheckedInFilter.length > 0) {
      this.state.servingsCheckedInFilter.forEach(() => {
        uncheckServingsFilters.push(false)
      })
    }

    if(this.state.prepTimeCheckedInFilter.length > 0) {
      this.state.prepTimeCheckedInFilter.forEach(() => {
        uncheckPrepTimeFilters.push(false)
      })
    }
    
    if(this.state.ingredientAmountCheckedInFilter.length > 0) {
      this.state.ingredientAmountCheckedInFilter.forEach(() => {
        uncheckIngredientAmountFilters.push(false)
      })
    }
    
    this.setState({filterScreenVisible: false})
    this.setState({categoryCheckedInFilter: uncheckCategoryFilters})
    this.setState({servingsCheckedInFilter: uncheckServingsFilters})
    this.setState({prepTimeCheckedInFilter: uncheckPrepTimeFilters})
    this.setState({ingredientAmountCheckedInFilter: uncheckIngredientAmountFilters})

  }

  async applyFilter() {
    this.setState({filterScreenVisible: false})
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
    let recipes;

    if(this.state.recipes.length > 0) {
    recipes = this.state.recipes.map((rec) => (
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
        style={{marginLeft: wp("5%")}}>
          {filters}
        </ScrollView>}
        <ScrollView ref='_scrollView'>
          {recipes}
        </ScrollView>

        {this.state.recipes.length > 0 &&
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
                <Text style={styles.category}>Category</Text>
            <ScrollView style={styles.filterChoice}>
                {this.state.allCategories.map((category, index) => 
                <View style={styles.iconText}>
                  <CheckBox
                  style={{marginLeft: wp("3%")}}
                  isChecked = {this.state.categoryCheckedInFilter[index]}
                  onClick= {() => this.addFilter(this.state.categoryCheckedInFilter, index, category)}/>
                  <Text style={styles.text}>{category}</Text>
                </View>)}
              </ScrollView>
              </View>
  
              <View>
                <Text style={styles.category}>Servings</Text>
                <ScrollView style={styles.filterChoice}>
                  {this.state.allServings.map((serving, index) => 
                    <View style={styles.iconText}>
                      <CheckBox
                      style={{marginLeft: wp("3%")}}
                      isChecked = {this.state.servingsCheckedInFilter[index]}
                      onClick= {() => this.addFilter(this.state.servingsCheckedInFilter, index, serving)}/>
                      <Text style={styles.text}>{serving}</Text>
                    </View>)}
                </ScrollView>
              </View>
  
              <View>
                <Text style={styles.category}>Prep time</Text>
                <ScrollView style={styles.filterChoice}>
                  {this.state.allPrepTime.map((prepTime, index) => 
                  <View style={styles.iconText}>
                    <CheckBox
                    style={{marginLeft: wp("3%")}}
                    isChecked = {this.state.prepTimeCheckedInFilter[index]}
                    onClick= {() => this.addFilter(this.state.prepTimeCheckedInFilter, index, prepTime)}/>
                    <Text style={styles.text}>{prepTime}</Text>
                  </View>)}
                </ScrollView>
              </View>
  
              <View>
                <Text style={styles.category}>Number of ingredients</Text>
                <ScrollView style={styles.filterChoice}>
                  {this.state.allIngredientAmount.map((ingredients, index) => 
                  <View style={styles.iconText}>
                    <CheckBox
                    style={{marginLeft: wp("3%")}}
                    isChecked = {this.state.ingredientAmountCheckedInFilter[index]}
                    onClick= {() => this.addFilter(this.state.ingredientAmountCheckedInFilter, index, ingredients)}/>
                    <Text style={styles.text}>{ingredients}</Text>
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
    height: hp("10%"),
    borderRadius: 10,
    borderColor: "#115740",
    borderWidth: 3,
    width: wp("90%"),
    marginHorizontal: wp("5%"),
  }
});
