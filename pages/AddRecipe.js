import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { Ionicons } from "@expo/vector-icons";
import CheckBox from 'react-native-check-box'


import { collection, getDocs, addDoc } from "firebase/firestore"; 
import {DATABASE} from "../firebaseConfig"
import AsyncStorage from "@react-native-async-storage/async-storage";


export default class AddRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userId: 0,
        
        servings: 0,
        recipeName: "",
        ingredients: [{
            id: 0,
            nameClean: "",
            quantity: "",
            original: ""
        }],
        instructions: [{
            number: 0, 
            step: "",
        }],
        culture: [],
        time: 0,
        dishTypes: [],
        period: [],

        cultureSelection: [],
        dishTypeSelection: [],
        occasionSelection: [],

        cultureCheckedInFilter: [],
        dishTypeCheckedInFilter: [],
        occasionCheckedInFilter: [],
    }
    this.getUser()
    this.getAllFilters()
  }


  async getUser() {
    let userEmail = await AsyncStorage.getItem("email")
    let userId = 0

    if(userEmail !== null) {
        let userCollection = collection(DATABASE, "users")
        let userData = await getDocs(userCollection)
    
        if (userData.size > 0) {
          userData.forEach((doc) => {
            if(doc.data().email == userEmail) {
                userId = doc.id
            }
          })
        }
        this.setState({userId: userId})
    }

}

  async getAllFilters() {
    let cultures = []
    let dishTypes = []
    let occasions = []

    cultureChecked = []
    dishTypeChecked = []
    occasionChecked = []

    // Push values from database into arrays + set checkbox to unchecked
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

    // order arrays alphabetically
    cultures.sort()
    dishTypes.sort()
    occasions.sort()

    // save data arrays in state
    this.setState({cultureSelection: cultures})
    this.setState({dishTypeSelection: dishTypes})
    this.setState({occasionSelection: occasions})

    this.setState({cultureCheckedInFilter: cultureChecked})
    this.setState({dishTypeCheckedInFilter: dishTypeChecked})
    this.setState({occasionCheckedInFilter: occasionChecked})
  }

  addFilter(checkedArray, i, item, arrayToAdd){
    checkedArray[i] = !checkedArray[i]
    if(!arrayToAdd.includes(item)){
        arrayToAdd.push(item)
    } else {
        arrayToAdd = arrayToAdd.filter(remove => remove != item)
    }
    //console.log(arrayToAdd)
    this.setState({checkedArray: checkedArray})
    this.setState({arrayToAdd: arrayToAdd})
  }

  addIngredient(ingredient, index, param) {
      let ingredients= [... this.state.ingredients]
      ingredients[index][param] = ingredient
      ingredients[index].original = `${this.state.ingredients[index].quantity} ${this.state.ingredients[index].nameClean}`

      //console.log(ingredients)

      this.setState({ingredients: ingredients})
  }

  addNewIngredient(index){
      let ingredients= [... this.state.ingredients]
      ingredients.push({
          id: index+1,
          nameClean:"",
          quantity:"",
          original: ""
        })
        
      this.setState({ingredients: ingredients})
  }

  removeIngredient(index) {
      this.state.ingredients.splice(index, 1)

      this.setState({ingredients: this.state.ingredients})
  }

  addInstruction(instruction, index) {
      let instructions= [... this.state.instructions]
      instructions[index].number = index+1
      instructions[index].step = instruction

      //console.log(instructions)
      this.setState({instructions: instructions})
  }

  addNewInstruction(index){
    let instructions= [... this.state.instructions]
    instructions.push({
          number: index+2,
          step:""
      })

      this.setState({ instructions: instructions });
  }

  removeInstruction(index) {
    this.state.instructions.splice(index, 1)

    this.setState({instructions: this.state.instructions})
}

   checkInputFields() {
      if(this.state.recipeName == "") {
          Alert.alert(
              "Recipe name required",
              "Please enter a recipe name"
              )
      } else if(this.state.ingredients.length == 1 && (this.state.ingredients[0].name == "" || this.state.ingredients[0].quantity == "")) {
          Alert.alert(
              "Ingredients required",
              "Please enter all ingredients"
              )
      } else if(this.state.instructions.length == 1 && this.state.instructions[0].step == "") {
          Alert.alert(
              "Instructions required",
              "Please enter the instructions"
              )
      } else {
          this.addRecipe()
      }
  }

  async addRecipe() {

    let recipeCollection = collection(DATABASE, "recipes")
  
    await addDoc((recipeCollection), {
     userId: this.state.userId,
     recipe: {
         servings: this.state.servings,
         recipeName: this.state.recipeName,
         ingredients: this.state.ingredients,
         instructions: this.state.instructions,
         culture: this.state.culture,
         timeNeeded: this.state.time,
         dishTypes: this.state.dishTypes,
         period: this.state.period
     }
   })

   this.goToRecipeDetails()
  }

  goToRecipeDetails() {
    this.props.navigation.navigate("RecipeDetail", {
      recipeName: this.state.recipeName,
      servings: this.state.servings,
      timeNeeded: this.state.time,
      dishTypes: this.state.dishTypes,
      period: this.state.period,
      culture: this.state.culture,
      ingredients: this.state.ingredients,
      instructions: this.state.instructions
    })

    this.setState({
        recipeName: "",
        servings: "",
        time: "",
        dishTypes: [],
        period: [],
        culture: [],
        ingredients: [{
            id: 0,
            nameClean: "",
            quantity: "",
            original: ""
        }],
        instructions: [{
            number: 0, 
            step: "",
        }],
        cultureCheckedInFilter: [],
        dishTypeCheckedInFilter: [],
        occasionCheckedInFilter: [],
    })
  }


  render() {

    return (
      <View style={styles.container}>
          <View style={styles.header}>
          <Ionicons
              name={"arrow-back"}
              size={hp("5%")}
              color="#FF5E00"
              onPress={() => this.props.navigation.goBack()}
            />
          <Text style={styles.pageTitle}>Add a new recipe</Text>
        </View>

        <ScrollView style={{marginTop: hp("3%")}} nestedScrollEnabled>
            <Text style={styles.text}>Recipe name*:</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="Recipe Name"
            value={this.state.recipeName}
            onChangeText={(txt) => this.setState({recipeName: txt})}/>
            
            <Text style={styles.text}>Servings:</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="0"
            inputMode="numeric"
            value={this.state.servings}
            onChangeText={(txt) => this.setState({servings: parseInt(txt)})}/>
            
            <Text style={styles.text}>Time needed (in minutes):</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="0 minutes"
            inputMode="numeric"
            value={this.state.time}
            onChangeText={(txt) => this.setState({time: parseInt(txt)})}/>

            <Text style={styles.text}>Select all possible filters</Text>
            
                <Text style={styles.category}>Culture:</Text>
                <ScrollView style={styles.filterChoice} nestedScrollEnabled>
                {this.state.cultureSelection.map((culture, index) => 
                <View style={styles.iconText}>
                  <CheckBox
                  style={{marginLeft: wp("3%")}}
                  isChecked = {this.state.cultureCheckedInFilter[index]}
                  onClick= {() => this.addFilter(this.state.cultureCheckedInFilter, index, culture, this.state.culture)}/>
                  <Text style={styles.text}>{culture}</Text>
                </View>)}
              </ScrollView>
  
                <Text style={styles.category}>Dish Type:</Text>
                <ScrollView style={styles.filterChoice} nestedScrollEnabled>
                  {this.state.dishTypeSelection.map((type, index) => 
                    <View style={styles.iconText}>
                      <CheckBox
                      style={{marginLeft: wp("3%")}}
                      isChecked = {this.state.dishTypeCheckedInFilter[index]}
                      onClick= {() => this.addFilter(this.state.dishTypeCheckedInFilter, index, type, this.state.dishTypes)}/>
                      <Text style={styles.text}>{type}</Text>
                    </View>)}
                </ScrollView>
  
                <Text style={styles.category}>Occasion:</Text>
                <ScrollView style={styles.filterChoice} nestedScrollEnabled>
                  {this.state.occasionSelection.map((occasion, index) => 
                  <View style={styles.iconText}>
                    <CheckBox
                    style={{marginLeft: wp("3%")}}
                    isChecked = {this.state.occasionCheckedInFilter[index]}
                    onClick= {() => this.addFilter(this.state.occasionCheckedInFilter, index, occasion, this.state.period)}/>
                    <Text style={styles.text}>{occasion}</Text>
                  </View>)}
                </ScrollView>

            <Text style={styles.text}>Ingredients*</Text>
            {this.state.ingredients.map((ingredient, index) => (
                <View style={{display:"flex", flexDirection:"row"}} key={index}>
                <TextInput
                style={[styles.placeholder, {width:wp("20%")}]}
                placeholder="quantity"
                value={ingredient.quantity}
                onChangeText={(txt) => this.addIngredient(txt, index, "quantity")}/>
                <TextInput
                style={[styles.placeholder, {width:wp("45%")}]}
                placeholder="ingredient"
                value={ingredient.nameClean}
                onChangeText={(txt) => this.addIngredient(txt, index, "nameClean")}/>

                {index == this.state.ingredients.length-1 &&(
                <Ionicons
                name={"add"}
                size={hp("5%")}
                color="#FF5E00"
                onPress={() => this.addNewIngredient(index)}/>
                )}
                {(index == this.state.ingredients.length-1 && index > 0) &&(
                <Ionicons
                name={"remove"}
                size={hp("5%")}
                color="#FF0000"
                onPress={() => this.removeIngredient(index)}/>
                )}
            </View>
            ))}

            <Text style={styles.text}>Instructions*</Text>
            {this.state.instructions.map((instruction, index) => (
                <View style={[styles.iconText, {display:"flex", flexDirection:"row"}]} key={index}>
                <Text style={styles.text}>{index + 1}</Text>
                <TextInput
                style={[styles.placeholder, {width:wp("65%")}]}
                placeholder="To do"
                value={instruction.step}
                onChangeText={(txt) => this.addInstruction(txt, index)}/>

                {index == this.state.instructions.length-1 &&(
                <Ionicons
                name={"add"}
                size={hp("5%")}
                color="#FF5E00"
                onPress={() => this.addNewInstruction(index)}/>
                )}
                {(index == this.state.instructions.length-1 && index > 0) &&(
                <Ionicons
                name={"remove"}
                size={hp("5%")}
                color="#FF0000"
                onPress={() => this.removeInstruction(index)}/>
                )}
            </View>
            ))}

          <TouchableOpacity style={styles.button} onPress={() => this.checkInputFields()}>
            <Text style={styles.btnText}>Add recipe</Text>
          </TouchableOpacity> 
          </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: hp("5%"),
        paddingTop: hp("5%"),
        backgroundColor:"#FFFFFF"    
      },
    header: {
        display:"flex",
        flexDirection:"row",
        marginHorizontal: wp("7.5%")
    },
    pageTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: hp("3.5%"),
        color:"#FF0000",
        marginLeft: wp("10%")
    },
    text: {
        fontFamily: "Nunito_700Bold",
        marginBottom: hp("1%"),
        marginLeft: wp("3%")
    },
    placeholder: {
        height: hp("5%"),
        borderWidth: 1,
        padding: wp("2%"),
        marginHorizontal: wp("3%"),
        marginBottom: hp("2%"),
        borderColor: "#FF5E00",
        borderRadius: 10,
    },
    category: {
        fontFamily: "Nunito_400Regular",
        marginLeft: wp("6%")

    },
    filterChoice: {
        marginBottom:hp("2%"),
        height: hp("15%"),
        borderRadius: 10,
        borderColor: "#FF5E00",
        borderWidth: 1,
        width: wp("80%"),
        marginHorizontal: wp("10%"),
    },
    iconText: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: hp("1%"),
    },
    button: {
        width: wp("80%"),
        padding: hp("1%"),
        backgroundColor: "#FF5E00",
        borderRadius: 10,
        marginTop: hp("5%"),
        marginHorizontal: wp("10%")
      },
    btnText:{
        fontFamily:"Nunito_400Regular",
        fontSize: hp("2.5%"),
        color: "#ffffff",
        textAlign: "center"
    },
});