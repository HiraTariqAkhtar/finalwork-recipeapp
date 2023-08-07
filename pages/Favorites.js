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
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-elements/dist/buttons/Button";

import AsyncStorage from "@react-native-async-storage/async-storage";
import translations from '../translation'


export default class Favorites extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasData: false,
      favRecipes:[],
      lang:"en"
    }
  }
  componentDidMount() {
    this.getLang();
  
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getLang();
    });
  }

  async getLang() {
    let langSelected = await AsyncStorage.getItem("langSelected")
    if(langSelected !== null) {
      this.setState({lang: langSelected})
    } else {
      this.setState({lang: "en"})
    }

    this.getFavList();

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
      translations[this.state.lang].clearList,
      translations[this.state.lang].confirmClearList,
      [
        {text: translations[this.state.lang].no, style: "cancel"},
        {text: translations[this.state.lang].yes, onPress: () => this.clearList()}
      ]
    )
  }

  async clearList() {
    let emptyList = []
    this.setState({favRecipes: emptyList})
    this.setState({hasData: false})
    await AsyncStorage.removeItem("favorites")
    ToastAndroid.show(translations[this.state.lang].listCleared, ToastAndroid.SHORT)
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


  render() {

    let clearIcon =
    <Ionicons
    name="trash-outline"
    color="#FFFFFF"
    size={hp("3%")}/>

    let recipes;
    if(this.state.favRecipes.length > 0) {
      recipes = this.state.favRecipes.map((rec) => (
        <TouchableOpacity
        key={rec.id}
        style={styles.recipe}
        onPress={() => this.goToRecipeDetails(rec)}>
          <View style={{display:"flex", flexDirection:"row", alignItems: "center"}}>
              {rec.img != "" && rec.img !== undefined ?(
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

    return (
      <View style={styles.container}>
          <Text style={styles.title}>{translations[this.state.lang].fav}</Text>
          <Button
          title={translations[this.state.lang].clearList}
          icon={clearIcon}
          buttonStyle={styles.clear}
          titleStyle={{fontFamily:"Nunito_700Bold"}}
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
    color: "#FF5E00"
  },
  iconText: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  clear: {
    backgroundColor:"#ff0000",
    width: wp("40%"),
    left: wp("55%"),
    marginBottom: hp("3%")
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