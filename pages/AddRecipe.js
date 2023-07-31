import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ToastAndroid,
  ActivityIndicator
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { Ionicons, FontAwesome } from "@expo/vector-icons";
import SelectDropdown from 'react-native-select-dropdown'

import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore"; 
import {DATABASE, STORAGE } from "../firebaseConfig"
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

import uuid from 'react-native-uuid';


export default class AddRecipe extends React.Component {
  constructor(props) {
    super(props);
    if(this.props.route.params?.recipe !== undefined) {
      let rec = this.props.route.params.recipe
      let visibilitySelected;
      let categorySelected;
      let visibility;

      if(rec.visible) {
        visibilitySelected = [true, false]
        visibility = "Public"
      } else {
        visibilitySelected = [false, true]
        visibility = "Private"
      }

      if(rec.category === "Bread") {
        categorySelected = [true, false, false, false, false, false]
      } else if(rec.category === "Curry") {
        categorySelected = [false, true, false, false, false, false]
      } else if(rec.category === "Dessert") {
        categorySelected = [false, false, true, false, false, false]
      } else if(rec.category === "Rice") {
        categorySelected = [false, false, false, true, false, false]
      } else if(rec.category === "Snack") {
        categorySelected = [false, false, false, false, true, false]
      } else if(rec.category === "Sweets") {
        categorySelected = [false, false, false, false, false, true]
      }


      this.state = {
        userId: 0,

        servings: rec.servings.toString(),
        recipeName: rec.recipeName,
        ingredients: rec.ingredients,
        instructions: rec.instructions,
        time: rec.timeNeeded.toString(),

        categorySelection: ["Bread", "Curry", "Dessert", "Rice", "Snack", "Sweets"],
        visibilitySelection: ["Public", "Private"],
        unitOptions: ["N/A", "tbsp", "tsp", "cup", "A pinch", "kg", "g", "liter", "bunch", "piece", "A little bit", "To taste", "To fry", "As required"],


        categoryCheckedInFilter: categorySelected,
        visibilityCheckedInFilter: visibilitySelected,


        selectedCategory: rec.category,
        selectedVisibility: visibility,
        imgUrl: rec.img,

        isLoading: false,
        imgLoading: false
      }
    } else {
      this.state = {
        userId: 0,

        servings: 0,
        recipeName: "",
        ingredients: [{
            name: "",
            quantity: "",
            unit: ""
        }],
        instructions: [{
            number: 0, 
            step: "",
        }],
        time: 0,

        categorySelection: ["Bread", "Curry", "Dessert", "Rice", "Snack", "Sweets"],
        visibilitySelection: ["Public", "Private"],
        unitOptions: ["N/A", "tbsp", "tsp", "cup", "A pinch", "kg", "g", "liter", "bunch", "piece", "A little bit", "To taste", "To fry", "As required"],

        categoryCheckedInFilter: [],
        visibilityCheckedInFilter: [],

        selectedCategory: "",
        selectedVisibility: "",
        imgUrl: "",

        isLoading: false,
        imgLoading: false
    }
    }
    this.getUser()
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

selectVisibility(i, visibility) {
  // Check if an item is already selected
  const hasSelectedElement = this.state.visibilityCheckedInFilter.some((element) => element === true);

  // Set all radio buttons as not selected when selecting another
  if (hasSelectedElement && !this.state.visibilityCheckedInFilter[i]) {
    this.state.visibilityCheckedInFilter.fill(false);
  }
  this.state.visibilityCheckedInFilter[i] = !this.state.visibilityCheckedInFilter[i];

  this.setState({ visibilityCheckedInFilter: this.state.visibilityCheckedInFilter, selectedVisibility: visibility});
  
}

selectCategory(i, category) {
  // Check if an item is already selected
  const hasSelectedElement = this.state.categoryCheckedInFilter.some((element) => element === true);

  // Set all radio buttons as not selected when selecting another
  if (hasSelectedElement && !this.state.categoryCheckedInFilter[i]) {
    this.state.categoryCheckedInFilter.fill(false);
  }
  this.state.categoryCheckedInFilter[i] = !this.state.categoryCheckedInFilter[i];

  this.setState({ categoryCheckedInFilter: this.state.categoryCheckedInFilter, selectedCategory: category});
  
}

  addIngredient(ingredient, index, param) {
      let ingredients= [... this.state.ingredients]
      ingredients[index][param] = ingredient

      if(ingredient === "To taste" || ingredient === "A pinch" || ingredient === "To fry" || ingredient === "As required"){
        ingredients[index]["quantity"] = 0
      }

      console.log(ingredients)

      this.setState({ingredients: ingredients})
  }

  addNewIngredient(){
      let ingredients= [... this.state.ingredients]
      ingredients.push({
          name:"",
          quantity:0,
          unit: ""
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

  dragInstructionUp(index) {
      let instructions = [...this.state.instructions];
    let currentInstruction = instructions[index].step
      instructions[index].step = instructions[index - 1].step
      instructions[index -1].step = currentInstruction

      console.log(instructions)
      this.setState({instructions: instructions})
  };

  dragInstructionDown(index) {
    let instructions = [...this.state.instructions];
    let currentInstruction = instructions[index].step
    instructions[index].step = instructions[index + 1].step
    instructions[index + 1].step = currentInstruction

    console.log(instructions)
    this.setState({instructions: instructions})
  };

  async selectPhoto() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1
    })

    if(!result.canceled) {
      const storageRef = ref(STORAGE, `recipe-${this.state.recipeName}-user-${this.state.userId}`)  // The name you want to give to uploaded img

      const img = result.assets[0].uri
      const blobFile = await this.uriToBlob(img)

      await uploadBytes(storageRef, blobFile)

      this.uploadPic()
    } else {
      ToastAndroid.show("No photo selected", ToastAndroid.SHORT)
    }
  }

  uriToBlob(uri) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        reject(console.log('uriToBlob failed'));
      };

      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    })
  }

  async uploadPic() {
    this.setState({imgLoading: true})
    setTimeout(async() => {
      const imgRef = ref(STORAGE, `recipe-${this.state.recipeName}-user-${this.state.userId}`)
      await getDownloadURL(imgRef)
      .then((img) => {
        this.setState({imgUrl: img})
      })
      this.setState({imgLoading: false})
    }, 100)  
  }

  confirmDelete() {
    Alert.alert(
      "Remove picture",
      "Are you sure you want to remove this picture?",
      [
        {text: 'No', style: 'cancel'},
        {text: 'Yes', onPress: () => this.removePhoto()}
      ]
    )
  }

  async removePhoto() {
    this.setState({imgLoading: true})
    setTimeout(async() => {
      const imgRef = ref(STORAGE, `recipe-${this.state.recipeName}-user-${this.state.userId}`)
      await deleteObject(imgRef)
      .then(() => {
        this.setState({imgUrl: ""})
        ToastAndroid.show("Picture removed", ToastAndroid.SHORT)
      })
      this.setState({imgLoading: false})
    }, 100)  
    
  }

   checkInputFields() {
     let unitNotSelected;
     let noQuantity;
     let noIngredient;
     this.state.ingredients.some((ingredient) => {
       if(ingredient.unit === "") {
         unitNotSelected = true
       } else {
         unitNotSelected = false
       }

       if(ingredient.quantity === "") {
         noQuantity = true
       }else {
         noQuantity = false
       }

       if(ingredient.name === "") {
         noIngredient = true
       }else {
         noIngredient = false
       }
     })

     let noInstructions;
     this.state.instructions.forEach((step) => {
       if(step.step === "") {
        noInstructions = true
       } else {
        noInstructions = false
       }
     })

      if(this.state.selectedVisibility == "") {
          Alert.alert(
            "Visibility required",
            "Please select visibility"
          )
      } else if(this.state.recipe == "") {
          Alert.alert(
            "Recipe name required",
            "Please enter a recipe name"
          )
      } else if(this.state.selectedCategory == "") {
          Alert.alert(
              "Category required",
              "Please select a category"
              )
      } else if(noQuantity) {
          Alert.alert(
            "Quantity required",
            "Please enter a quantity for each ingredient"
              )
      } else if(noIngredient) {
        Alert.alert(
            "Ingredients required",
            "Please enter all ingredients"
            )
      }else if(unitNotSelected) {
        Alert.alert(
          "Unit required",
          "Please select a unit for each ingredient"
          )
      } else if(noInstructions) {
          Alert.alert(
              "Instructions required",
              "Please enter all instructions"
              )
      } else {
          this.addRecipe()
        }
    }


  async addRecipe() {
  let visible;
  if(this.state.selectedVisibility === "Public") {
    visible = true
  } else if(this.state.selectedVisibility === "Private") {
    visible = false
  }

  this.setState({isLoading: true})
  setTimeout(() => {
    if(this.props.route.params?.recipe !== undefined) {
      let rec = this.props.route.params.recipe
      updateDoc(doc(DATABASE, "recipes", rec.recipeId),{
        servings: this.state.servings,
        recipeName: this.state.recipeName,
        ingredients: this.state.ingredients,
        instructions: this.state.instructions,
        category: this.state.selectedCategory,
        timeNeeded: this.state.time,
        img: this.state.imgUrl,
        public: visible,
      })
      
    } else {
      let recipeCollection = collection(DATABASE, "recipes")
      addDoc((recipeCollection), {
        userId: this.state.userId,
        id: uuid.v4(),
        servings: this.state.servings,
        recipeName: this.state.recipeName,
        ingredients: this.state.ingredients,
        instructions: this.state.instructions,
        category: this.state.selectedCategory,
        timeNeeded: this.state.time,
        img: this.state.imgUrl,
        public: visible,
        chef: "A registered user"
      })
    }
   this.goToCookbook()
  }, 100)    
  }

  goToCookbook() {
    this.props.navigation.navigate("Cookbook", { refresh: Date.now() })

    this.setState({
        recipeName: "",
        servings: 0,
        time: 0,
        category: [],
        ingredients: [{
            name: "",
            quantity: 0,
            unit: ""
        }],
        instructions: [{
            number: 0, 
            step: "",
        }],
        categoryCheckedInFilter: [],
        visibilityCheckedInFilter: [],
        selectedCategory: "",
        selectedVisibility: false,
        imgUrl: "",
    })
  }

  goBack() {
          Alert.alert(
            "Leave page?",
            "All unsaved changes will be lost",
            [
              { text: "No", style:"cancel" },
              { text: "Yes", onPress: () => {this.props.navigation.goBack()} }
            ]
          )
  }


  render() {
    let filterSelectionVisibility = this.state.visibilitySelection.map((visible, index) => (
      <View style={styles.iconText} key={index}>
        <Ionicons
          name={this.state.visibilityCheckedInFilter[index] ? "radio-button-on" : "radio-button-off"}
          color="#115740"
          size={hp("3%")}
          marginLeft={wp("3%")}
          onPress={() => {
            this.selectVisibility(index, visible)
          }}
        />
        <Text style={styles.filterText}>{visible}</Text>
      </View>
       ));

    let filterSelectionCategory = this.state.categorySelection.map((category, index) => (
      <View style={styles.iconText} key={index}>
        <Ionicons
          name={this.state.categoryCheckedInFilter[index] ? "radio-button-on" : "radio-button-off"}
          color="#115740"
          size={hp("3%")}
          marginLeft={wp("3%")}
          onPress={() => {
            this.selectCategory(index, category)
          }}
        />
        <Text style={styles.filterText}>{category}</Text>
      </View>
    ));

    let textVisibility;
    if(this.state.selectedVisibility === "Public") {
      textVisibility = <Text style={styles.info}>Added recipe will be visible for other users</Text>
    } else if(this.state.selectedVisibility === "Private") {
      textVisibility = <Text style={styles.info}>Added recipe will not be visible for other users</Text>
    }

    let img;
    if(this.state.imgUrl == "") {
      img = 
      <TouchableOpacity style={styles.button} onPress={() => this.selectPhoto()}>
        <Text style={styles.btnText}>Select photo</Text>
      </TouchableOpacity>
    } else {
      img = 
        <View>
        	<Image
        	src= {this.state.imgUrl}
        	style={styles.foodImg}/>
          <TouchableOpacity style={[styles.photoOptions, {marginTop: hp("-13%"), backgroundColor: "#115740"}]} onPress={() => this.selectPhoto()}>
            <Text style={styles.btnText}>Select another photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.photoOptions, {marginTop: hp("1%"), backgroundColor: "#FF0000"}]} onPress={() => this.confirmDelete()}>
            <Text style={styles.btnText}>Remove photo</Text>
          </TouchableOpacity>
        </View>
    }

    return (
      <View style={styles.container}>
          <View style={styles.header}>
          <Ionicons
              name={"arrow-back"}
              size={hp("5%")}
              color="#115740"
              onPress={() => this.goBack()}
            />
          <Text style={styles.pageTitle}>Add a new recipe</Text>
        </View>

        <ScrollView style={{marginTop: hp("3%")}} nestedScrollEnabled>
            <Text style={styles.text}>Select visibility *</Text>
            <View style={styles.visibilityChoice}>
              <View style={{display:"flex", flexDirection:"row"}}>
                {filterSelectionVisibility}
              </View>
              {textVisibility}
            </View>
            <Text style={styles.text}>Recipe name *</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="Recipe Name"
            value={this.state.recipeName}
            onChangeText={(txt) => this.setState({recipeName: txt})}/>
            
            <Text style={styles.text}>Servings</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="0"
            inputMode="numeric"
            value={this.state.servings}
            onChangeText={(txt) => this.setState({servings: parseInt(txt)})}/>
            
            <Text style={styles.text}>Time needed (in minutes)</Text>
            <TextInput
            style={styles.placeholder}
            placeholder="0 minutes"
            inputMode="numeric"
            value={this.state.time}
            onChangeText={(txt) => this.setState({time: parseInt(txt)})}/>

            <Text style={styles.text}>Category *</Text>
              <View style={[styles.filterChoice]}>
                {filterSelectionCategory}
              </View>

            <Text style={[styles.text, {marginBottom:hp("0")}]}>Ingredients *</Text>
            <Text style={[styles.info, {width:wp("90%"), marginBottom:hp("1")}]}>Please select "N/A" as unit if no specific unit is required.</Text>
            {this.state.ingredients.map((ingredient, index) => (
                <View style={{display:"flex", flexDirection:"row"}} key={index}>
                <TextInput
                style={[styles.placeholder, {width:wp("10%"), marginRight:wp("1.5%")}]}
                placeholder="0"
                inputMode="numeric"
                value={ingredient.quantity}
                onChangeText={(txt) => this.addIngredient(txt, index, "quantity")}/>
                <SelectDropdown
                  buttonStyle = {[styles.placeholder, {width:wp("20%"), marginRight:wp("0%"), marginLeft:wp("1.5%"), backgroundColor:"#FFF"}]}
                  buttonTextStyle = {styles.filterText}
                  dropdownStyle = {{backgroundColor: "#fff", borderRadius: 10}}
                  rowTextStyle = {styles.filterText}
                  data = {this.state.unitOptions}
                  onSelect={(selectedItem) => {
                    this.addIngredient(selectedItem, index, "unit")
                  }}
                  defaultButtonText= "unit"
                  renderDropdownIcon={isOpened => {
                    return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#115740'} size={10} />;
                  }}/>
                <TextInput
                style={[styles.placeholder, {width:wp("40%"), marginHorizontal:wp("0%")}]}
                placeholder="ingredient"
                value={ingredient.name}
                onChangeText={(txt) => this.addIngredient(txt, index, "name")}/>

                {index == this.state.ingredients.length-1 &&(
                <Ionicons
                name={"add"}
                size={hp("5%")}
                color="#115740"
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

            <Text style={[styles.text, {marginBottom:hp("0")}]}>Instructions *</Text>
            <Text style={[styles.info, {width:wp("90%"), marginBottom:hp("1")}]}>You can reorder the instructions by clicking on the correct arrow</Text>
            {this.state.instructions.map((instruction, index) => (
                <View style={[styles.iconText, {display:"flex", flexDirection:"row"}]} key={index}>
                  {(index > 0) ?(
                <Ionicons
                name={'arrow-up'}
                size={hp('3%')}
                color="#115740"
                style={{ marginLeft: wp("3%") }}
                onPress={() => this.dragInstructionUp(index)}
                />
                )
              :
              <Ionicons
              name={'arrow-up'}
              size={hp('3%')}
              color="#fff"
              style={{ marginLeft: wp("3%") }}
              />
              }
                  
                <Text style={[styles.text]}>{index + 1}</Text>
                <TextInput
                style={[styles.placeholder, {width:wp("55%"), marginHorizontal:wp("1.5%")}]}
                placeholder="To do"
                value={instruction.step}
                onChangeText={(txt) => this.addInstruction(txt, index)}/>

                {index == this.state.instructions.length-1 &&(
                <Ionicons
                name={"add"}
                size={hp("5%")}
                color="#115740"
                onPress={() => this.addNewInstruction(index)}/>
                )}
                {(index == this.state.instructions.length-1 && index > 0) &&(
                <Ionicons
                name={"remove"}
                size={hp("5%")}
                color="#FF0000"
                onPress={() => this.removeInstruction(index)}/>
                )}
                {(this.state.instructions.length > 1 && index < this.state.instructions.length - 1) &&(
                <Ionicons
                name={'arrow-down'}
                size={hp('3%')}
                color="#115740"
                style={{ marginLeft: wp("3%") }}
                onPress={() => this.dragInstructionDown(index)}
              />
                )}
                
            </View>
            ))}

            <Text style={styles.text}>Add photo</Text>
            {this.state.imgLoading && <ActivityIndicator size="large"/>}
            {img}

            {this.state.isLoading && <ActivityIndicator size="large"/>}

          <TouchableOpacity style={[styles.button, {marginTop: hp("5%")}]} onPress={() => this.checkInputFields()}>
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
        color:"#FF5E00",
        marginLeft: wp("10%")
    },
    text: {
        fontFamily: "Nunito_700Bold",
        marginBottom: hp("1%"),
        marginLeft: wp("3%")
    },
    placeholder: {
        height: hp("5%"),
        borderWidth: 2,
        padding: wp("2%"),
        marginHorizontal: wp("5%"),
        marginBottom: hp("2%"),
        borderColor: "#115740",
        borderRadius: 10,
    },
    filterText: {
        fontFamily: "Nunito_400Regular",
        fontSize: hp("2%"),
    },
    visibilityChoice: {
      marginBottom:hp("3%"),
      borderRadius: 10,
      borderColor: "#115740",
      borderWidth: 2,
      width: wp("90%"),
      marginHorizontal: wp("5%"),
      paddingVertical: hp("2%")
    },
    info: {
      fontFamily: "Nunito_300Light_Italic",
      fontSize: hp("2%"),
      marginLeft: wp("5%"),
      color: "#115740"
  },
    filterChoice: {
      display:"flex", 
      flexDirection:"row", 
      flexWrap:"wrap",
      marginBottom:hp("3%"),
      borderRadius: 10,
      borderColor: "#115740",
      borderWidth: 2,
      width: wp("90%"),
      marginHorizontal: wp("5%"),
      paddingVertical: hp("2%")
    },
    iconText: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: hp("1%"),
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
    foodImg: {
      width: wp("30%"),
      height: hp("15%"),
      marginLeft: wp("5%"),
      borderRadius: 10,
    },
    photoOptions: {
      width:wp("55%"),
      marginLeft: wp("40%"),
      padding: hp("1%"),
      borderRadius: 10,
      marginHorizontal: wp("5%")
    }
});