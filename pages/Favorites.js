import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  Alert,
  ToastAndroid
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Button } from "react-native-elements/dist/buttons/Button";

import AsyncStorage from "@react-native-async-storage/async-storage";


export default class Favorites extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasData: false,
      favRecipes:[]
    }
  }
  componentDidMount() {
    this.getFavList();
  
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getFavList();
    });
  }

  async getFavList() {
    let favList = await AsyncStorage.getItem("favorites")
    if(favList !== null) {
      this.setState({favRecipes: JSON.parse(favList)})
      this.checkListItems()
    } else {
      this.setState({hasData: false})
    }
  }

  async checkListItems() {
    if(this.state.favRecipes.length >0) {
      this.setState({hasData: true})
    } else {
      this.setState({hasData: false})
    }
  }


  confirmClear() {
    Alert.alert(
      "Clear list",
      `Are you sure you want to clear the list?`,
      [
        {text: "No", style: "cancel"},
        {text: "Yes", onPress: () => this.clearList()}
      ]
    )
  }

  async clearList() {
    let emptyList = []
    this.setState({favRecipes: emptyList})
    this.setState({hasData: false})
    await AsyncStorage.removeItem("favorites")
    ToastAndroid.show("list cleared", ToastAndroid.SHORT)
  }

  goToRecipeDetails(rec) {
    this.props.navigation.navigate("RecipeDetail", {
      id: rec.id,
      recipeName: rec.recipeName,
      foodImg: rec.foodImg,
      servings: rec.servings,
      timeNeeded: rec.timeNeeded,
      dishTypes: rec.dishTypes,
      period: rec.period,
      culture: rec.culture,
      ingredients: rec.ingredients,
      instructions: rec.instructions
    })
  }


  render() {

    let clearIcon =
    <Ionicons
    name="trash-outline"
    color="#FFFFFF"
    size={hp("3%")}/>


    let cultures;
    let dishTypes;
    let periods;
    this.state.favRecipes.forEach((rec) => {
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
    if(this.state.favRecipes.length > 0) {
      recipes = this.state.favRecipes.map((rec) => (
        <TouchableOpacity
        key={rec.id}
        style={styles.recipe}
        onPress={() => this.goToRecipeDetails(rec)}>
          <View style={{display:"flex", flexDirection:"row", alignItems: "center"}}>
              {rec.foodImg != "" && rec.foodImg !== undefined ?(
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
                        <Text style={styles.text}>{rec.timeNeeded} minutes</Text>
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
      ))
    } else {
      recipes = <Text style={styles.noRecipes}>No recipes found</Text>
    }

    return (
      <View style={styles.container}>
          <Text style={styles.title}>Favorites</Text>
          <Button
          title="Clear list"
          icon={clearIcon}
          buttonStyle={styles.clear}
          onPress={() => this.confirmClear()}/>
        <ScrollView>
        {recipes}
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
  title: {
    textAlign: 'center',
    fontFamily: "Nunito_700Bold",
    fontSize: hp("3.5%"),
    color: "#FF0000"
  },
  iconText: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  clear: {
    backgroundColor:"#ff0000",
    width: wp("30%"),
    left: wp("65%"),
    marginBottom: hp("3%")
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
    fontSize: hp("2.5%"),
    fontFamily: "Nunito_700Bold",
    marginBottom: hp("1%"),
    width: wp("55%")
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
  noRecipes:{
    marginBottom: hp("3%"),
    marginHorizontal: wp("3%"),
    fontFamily: "Nunito_400Regular",
    fontSize: hp("2.5%"),
    textAlign: "center"
  },
});