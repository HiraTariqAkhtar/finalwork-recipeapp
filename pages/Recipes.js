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
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import { collection, getDocs } from "firebase/firestore"; 
import {DATABASE} from "../firebaseConfig"

import AsyncStorage from "@react-native-async-storage/async-storage";
import translations from '../translation'


export default class Recipes extends React.Component {
  constructor(props) {
    super(props);

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
          chef: ""
        },
      ],

      allCategories:[],
      allServings:[],
      allPrepTime:[],
      allIngredientAmount:[],
      allChefs:[],

      filterScreenVisible: false,
      filters: [],

      categoryCheckedInFilter: [],
      servingsCheckedInFilter: [],
      prepTimeCheckedInFilter: [],
      ingredientAmountCheckedInFilter: [],
      chefCheckedInFilter: [],

      selectedCategory: "",
      selectedServings: "",
      selectedPrepTime: "",
      selectedIngredientAmount: "",
      selectedChef: "",

      lang: "en"
    };

  }

  componentDidMount() {
    this.getLang()
  }

  async getLang() {
    let langSelected = await AsyncStorage.getItem("langSelected")
    if(langSelected !== null) {
      this.setState({lang: langSelected, allCategories: translations[langSelected].categories, allServings: translations[langSelected].allServings, allPrepTime: translations[langSelected].allPrepTime, allIngredientAmount: translations[langSelected].allIngredientAmount})
    } else {
      this.setState({lang: "en", allCategories: translations["en"].categories, allServings: translations["en"].allServings, allPrepTime: translations["en"].allPrepTime, allIngredientAmount: translations["en"].allIngredientAmount})
    }

    this.getRecipes()
  }

  async getRecipes() {
    let selectedCategoryFromHome = this.props.route.params?.category;
    //console.log(selectedCategoryFromHome)

    let recipes = []
    let chefs = []
    let recipeCollection = collection(DATABASE, "recipes")
    let recipeData = await getDocs(recipeCollection)
    if (recipeData.size > 0) {
      if(selectedCategoryFromHome !== undefined) {
        this.setState({selectedCategory: selectedCategoryFromHome})
        this.addFilter()
        recipeData.forEach((doc) => {
          if(doc.data().lang === this.state.lang && doc.data().public == true) {
            if(doc.data().category === selectedCategoryFromHome) {
              recipes.push(doc.data())
            }
          }
        })
        this.props.navigation.setParams({ category: undefined });
      } else {
        recipeData.forEach((doc) => {
          if(doc.data().lang === this.state.lang && doc.data().public == true) {
            recipes.push(doc.data()) 
          }
        })
      }
      recipeData.forEach((doc) => {
        if(!chefs.includes(doc.data().chef) && doc.data().chef !== undefined && doc.data().chef !== "") {
          chefs.push(doc.data().chef)
          chefs.sort()
        }
      })
    }
    //console.log(recipes)
    //console.log(chefs)
    this.setState({recipes: recipes, allChefs: chefs})
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

  openFilterScreen() {
    this.setState({filterScreenVisible: true})
  }

  closeFilterScreen() { 
    // uncheck all filters
    this.state.categoryCheckedInFilter.fill(false)
    
    this.state.servingsCheckedInFilter.fill(false)
    
    this.state.prepTimeCheckedInFilter.fill(false)
    
    this.state.ingredientAmountCheckedInFilter.fill(false)
    
    this.setState({filterScreenVisible: false})
    this.setState({categoryCheckedInFilter: this.state.categoryCheckedInFilter})
    this.setState({servingsCheckedInFilter: this.state.servingsCheckedInFilter})
    this.setState({prepTimeCheckedInFilter: this.state.prepTimeCheckedInFilter})
    this.setState({ingredientAmountCheckedInFilter: this.state.ingredientAmountCheckedInFilter})

  }

  async applyFilter() {
    let filteredRecipes = []
    let recipeCollection = collection(DATABASE, "recipes")
    let recipeData = await getDocs(recipeCollection)

    if(recipeData.size > 0) {
      // Filter per category
    if(this.state.selectedCategory != "") {
      recipeData.forEach((doc) => {
        if(doc.data().lang === this.state.lang && doc.data().category === this.state.selectedCategory) {
          if(!filteredRecipes.some((rec) => rec.id === doc.data().id)) {
            filteredRecipes.push(doc.data())
          }
        }
      })
    }

    // Filter per serving
    if(this.state.selectedServings != "") {
      if(doc.data().lang === this.state.lang && this.state.selectedServings === translations[this.state.lang].allServings[0]) {
        recipeData.forEach((doc) => {
          if(doc.data().servings < 5) {
            if(!filteredRecipes.some((rec) => rec.id === doc.data().id)) {
              filteredRecipes.push(doc.data())
            }
          } 
        })
      } else if (doc.data().lang === this.state.lang && this.state.selectedServings === translations[this.state.lang].allServings[1]) {
        recipeData.forEach((doc) => {
          if(doc.data().servings >= 5 && doc.data().servings <= 10) {
            if(!filteredRecipes.some((rec) => rec.id === doc.data().id)) {
              filteredRecipes.push(doc.data())
            }
          } 
        })
      } else if (doc.data().lang === this.state.lang && this.state.selectedServings === translations[this.state.lang].allServings[2]) {
        recipeData.forEach((doc) => {
          if(doc.data().servings > 10) {
            if(!filteredRecipes.some((rec) => rec.id === doc.data().id)) {
              filteredRecipes.push(doc.data())
            }
          } 
        })
      }
    }

    // Filter per prep time
    if(this.state.selectedPrepTime != "") {
      if(doc.data().lang === this.state.lang && this.state.selectedPrepTime === translations[this.state.lang].allPrepTime[0]) {
        recipeData.forEach((doc) => {
          if(doc.data().timeNeeded < 10) {
            if(!filteredRecipes.some((rec) => rec.id === doc.data().id)) {
              filteredRecipes.push(doc.data())
            }
          } 
        })
      } else if (this.state.selectedPrepTime === translations[this.state.lang].allPrepTime[1]) {
        recipeData.forEach((doc) => {
          if(doc.data().lang === this.state.lang && doc.data().timeNeeded >= 10 && doc.data().timeNeeded <= 30) {
            if(!filteredRecipes.some((rec) => rec.id === doc.data().id)) {
              filteredRecipes.push(doc.data())
            }
          } 
        })
      } else if (this.state.selectedPrepTime === translations[this.state.lang].allPrepTime[2]) {
        recipeData.forEach((doc) => {
          if(doc.data().lang === this.state.lang && doc.data().timeNeeded > 30) {
            if(!filteredRecipes.some((rec) => rec.id === doc.data().id)) {
              filteredRecipes.push(doc.data())
            }
          } 
        })
      }
    }

    // Filter per number of ingredients
    if(this.state.selectedIngredientAmount != "") {
      if(doc.data().lang === this.state.lang && this.state.selectedIngredientAmount === translations[this.state.lang].allIngredientAmount[0]) {
        recipeData.forEach((doc) => {
          if(doc.data().ingredients.length < 5) {
            if(!filteredRecipes.some((rec) => rec.id === doc.data().id)) {
              filteredRecipes.push(doc.data())
            }
          } 
        })
      } else if (doc.data().lang === this.state.lang && this.state.selectedIngredientAmount === translations[this.state.lang].allIngredientAmount[1]) {
        recipeData.forEach((doc) => {
          if(doc.data().ingredients.length >= 5 && doc.data().servings <= 10) {
            if(!filteredRecipes.some((rec) => rec.id === doc.data().id)) {
              filteredRecipes.push(doc.data())
            }
          } 
        })
      } else if (doc.data().lang === this.state.lang && this.state.selectedIngredientAmount === translations[this.state.lang].allIngredientAmount[2]) {
        recipeData.forEach((doc) => {
          if(doc.data().ingredients.length > 10) {
            if(!filteredRecipes.some((rec) => rec.id === doc.data().id)) {
              filteredRecipes.push(doc.data())
            }
          } 
        })
      }
    }

    if(this.state.selectedChef != "") {
      recipeData.forEach((doc) => {
        if(doc.data().lang === this.state.lang && doc.data().chef === this.state.selectedChef) {
          if(!filteredRecipes.some((rec) => rec.id === doc.data().id)) {
            filteredRecipes.push(doc.data())
          }
        }
      })
    }
    }

    this.setState({recipes: filteredRecipes})
    this.closeFilterScreen()
  }

  selectRadioBtn(checkedArray, i) {
    // Check if an item is already selected
    const hasSelectedElement = checkedArray.some((element) => element === true);
  
    // Set all radio buttons as not selected when selecting another
    if (hasSelectedElement && !checkedArray[i]) {
      checkedArray.fill(false);
    }
    checkedArray[i] = !checkedArray[i];

    this.setState({ checkedArray: checkedArray }, () => this.addFilter());
    
  }

  addFilter() {
    //console.log(this.state.selectedCategory, this.state.selectedServings, this.state.selectedPrepTime, this.state.selectedIngredientAmount)
    let filters = []

    if(this.state.selectedCategory != "") {
      filters.push(this.state.selectedCategory)
    }
    if(this.state.selectedServings != "") {
      filters.push(this.state.selectedServings)
    }
    if(this.state.selectedPrepTime != "") {
      filters.push(this.state.selectedPrepTime)
    }
    if(this.state.selectedIngredientAmount != "") {
      filters.push(this.state.selectedIngredientAmount)
    }
    if(this.state.selectedChef != "") {
      filters.push(this.state.selectedChef)
    }
  
    this.setState({ filters: filters })

  }
  

  removeFilter(filter) {
    this.refs._scrollView.scrollTo({x: 0, y: 0, animated: true});
    //console.log(`${filter} clicked`)
    let filtersLeft = this.state.filters.filter(remove => remove != filter)

    // Check which filter removed --> uncheck radio btn + state: ""
    if (filter === this.state.selectedCategory) {
      this.state.categoryCheckedInFilter.fill(false)
      this.setState({ selectedCategory: "" , categoryCheckedInFilter: this.state.categoryCheckedInFilter})
    }

    if (filter === this.state.selectedServings) {
      this.state.servingsCheckedInFilter.fill(false)
      this.setState({ selectedServings: "" , servingsCheckedInFilter: this.state.servingsCheckedInFilter})
    }

    if (filter === this.state.selectedPrepTime) {
      this.state.servingsCheckedInFilter.fill(false)
      this.setState({ selectedPrepTime: "" , prepTimeCheckedInFilter: this.state.prepTimeCheckedInFilter})
    }

    if (filter === this.state.selectedIngredientAmount) {
      this.state.servingsCheckedInFilter.fill(false)
      this.setState({ selectedIngredientAmount: "" , ingredientAmountCheckedInFilter: this.state.ingredientAmountCheckedInFilter});
    }

    if (filter === this.state.selectedChef) {
      this.state.chefCheckedInFilter.fill(false)
      this.setState({ selectedChef: "" , chefCheckedInFilter: this.state.chefCheckedInFilter});
    }

    if(filtersLeft.length == 0) {
      this.getRecipes()
    } else {
      this.applyFilter()
    }
    this.setState({filters: filtersLeft})
  }

  async addRecipe() {
    let loggedIn = await AsyncStorage.getItem("userLoggedIn")
    if(loggedIn !==  null) {
      this.props.navigation.navigate("AddRecipe")
    } else {
      Alert.alert(
        translations[this.state.lang].alertNotLoggedIn,
        translations[this.state.lang].logInToAddRecipe,
        [
          {text: translations[this.state.lang].cancel, style: "cancel"},
          {text: translations[this.state.lang].login, onPress: () => this.props.navigation.navigate("LogIn")}
        ]
      )
    }
  }

  render() {
    let filterSelectionCategory = this.state.allCategories.map((category, index) => (
      <View style={styles.iconText} key={`category${index}`}>
        <Ionicons
          name={this.state.categoryCheckedInFilter[index] ? "radio-button-on" : "radio-button-off"}
          color="#115740"
          size={hp("3%")}
          marginLeft={wp("3%")}
          onPress={() => {
            this.setState({selectedCategory: category})
            this.selectRadioBtn(this.state.categoryCheckedInFilter, index)
          }}
        />
        <Text style={styles.filterText}>{category}</Text>
      </View>
    ));

    let filterSelectionServings = this.state.allServings.map((serving, index) => (
      <View style={styles.iconText} key={`serving${index}`}>
        <Ionicons
          name={this.state.servingsCheckedInFilter[index] ? "radio-button-on" : "radio-button-off"}
          color="#115740"
          size={hp("3%")}
          marginLeft={wp("3%")}
          onPress={() => {
            this.setState({selectedServings: serving})
            this.selectRadioBtn(this.state.servingsCheckedInFilter, index)
          }}
        />
        <Text style={styles.filterText}>{serving}</Text>
      </View>
    ));

    let filterSelectionPrepTime = this.state.allPrepTime.map((time, index) => (
      <View style={styles.iconText} key={`prepTime${index}`}>
        <Ionicons
          name={this.state.prepTimeCheckedInFilter[index] ? "radio-button-on" : "radio-button-off"}
          color="#115740"
          size={hp("3%")}
          marginLeft={wp("3%")}
          onPress={() => {
            this.setState({selectedPrepTime: time})
            this.selectRadioBtn(this.state.prepTimeCheckedInFilter, index)
          }}
        />
        <Text style={styles.filterText}>{time}</Text>
      </View>
    ));

    let filterSelectionIngredients = this.state.allIngredientAmount.map((ingredients, index) => (
      <View style={styles.iconText} key={`Ingredients${index}`}>
        <Ionicons
          name={this.state.ingredientAmountCheckedInFilter[index] ? "radio-button-on" : "radio-button-off"}
          color="#115740"
          size={hp("3%")}
          marginLeft={wp("3%")}
          onPress={() => {
            this.setState({selectedIngredientAmount: ingredients})
            this.selectRadioBtn(this.state.ingredientAmountCheckedInFilter, index)
          }}
        />
        <Text style={styles.filterText}>{ingredients}</Text>
      </View>
    ));

    let filterSelectionChefs = this.state.allChefs.map((chef, index) => (
      <View style={styles.iconText} key={`chef${index}`}>
        <Ionicons
          name={this.state.chefCheckedInFilter[index] ? "radio-button-on" : "radio-button-off"}
          color="#115740"
          size={hp("3%")}
          marginLeft={wp("3%")}
          onPress={() => {
            this.setState({selectedChef: chef})
            this.selectRadioBtn(this.state.chefCheckedInFilter, index)
          }}
        />
        <Text style={styles.filterText}>{chef}</Text>
      </View>
    ));
    

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
                      <Text style={styles.text}>{rec.timeNeeded} {translations[this.state.lang].minutes}</Text>
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
    ))
  } else {
    recipes = <Text style={styles.noRecipes}>{translations[this.state.lang].noRecipesFound}</Text>
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
          <Text style={styles.pageTitle}>{translations[this.state.lang].recipes}</Text>
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
              <ScrollView>
                <View>
                  <Text style={styles.category}>Chef</Text>
                  <View style={styles.filterChoice}>
                    {filterSelectionChefs}
                  </View>
                </View>
  
                <View>
                  <Text style={styles.category}>{translations[this.state.lang].category}</Text>
                  <View style={styles.filterChoice}>
                    {filterSelectionCategory}
                  </View>
                </View>
    
                <View>
                  <Text style={styles.category}>{translations[this.state.lang].servings}</Text>
                  <View style={styles.filterChoice}>
                    {filterSelectionServings}
                  </View>
                </View>
    
                <View>
                  <Text style={styles.category}>{translations[this.state.lang].prepTime}</Text>
                  <View style={styles.filterChoice}>
                   {filterSelectionPrepTime}
                  </View>
                </View>
    
                <View>
                  <Text style={styles.category}>{translations[this.state.lang].numIngredients}</Text>
                  <View style={styles.filterChoice}>
                    {filterSelectionIngredients}
                  </View>
                </View>
  
              <TouchableOpacity style={[styles.button, {marginBottom: hp("5%")}]} onPress={() => this.applyFilter()}>
                <Text style={styles.btnText}>{translations[this.state.lang].applyFilters}</Text>
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
    width: wp("90%"),
    borderRadius: 10,
    borderColor: "#115740",
    borderWidth: 3,
    marginTop: hp("3%"),
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
    width: wp("90%"),
    padding: hp("1%"),
    backgroundColor: "#115740",
    borderRadius: 10,
    marginHorizontal: wp("5%")
  },
btnText:{
    fontFamily:"Nunito_700Bold",
    fontSize: hp("2.5%"),
    color: "#ffffff",
    textAlign: "center"
},
  filterChoice: {
    display:"flex", 
    flexDirection:"row", 
    flexWrap:"wrap",
    marginBottom:hp("3%"),
    borderRadius: 10,
    borderColor: "#115740",
    borderWidth: 3,
    width: wp("90%"),
    marginHorizontal: wp("5%"),
    paddingVertical: hp("2%")
  },
  filterText: {
      fontFamily:"Nunito_400Regular",
      fontSize: hp("2%"),
  }
});
