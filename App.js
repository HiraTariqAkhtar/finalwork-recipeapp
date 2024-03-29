import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from "@expo/vector-icons";
import {Image} from "react-native"
import {
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Font import
import {
  useFonts,
  Nunito_300Light,
  Nunito_300Light_Italic,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";

// Page imports
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Cart from "./pages/Cart"
import Favorites from "./pages/Favorites"
import Profile from "./pages/Profile"
import LogIn from "./pages/LogIn"
import Register from "./pages/Register"
import Settings from "./pages/Settings"
import Holidays from "./pages/Holidays"
import AddRecipe from "./pages/AddRecipe"
import Cookbook from "./pages/Cookbook"
import Map from "./pages/Map"
import EditProfile from "./pages/EditProfile"
import AddToMap from "./pages/AddToMap"

// Seeder import
import { addDataInDatabase } from "./seeder"


// Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navigate to pages not in bottom nav
const HomeScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      <Stack.Screen name="RecipeDetail" component={RecipeDetail} options={{ headerShown: false }}/>
      <Stack.Screen name="Holidays" component={Holidays} options={{ headerShown: false }}/>
      <Stack.Screen name="Recipes" component={Recipes} options={{ headerShown: false }}/>
      <Stack.Screen name="AddRecipe" component={AddRecipe} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}
const RecipesScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Recipes" component={Recipes} options={{ headerShown: false }}/>
      <Stack.Screen name="RecipeDetail" component={RecipeDetail} options={{ headerShown: false }}/>
      <Stack.Screen name="AddRecipe" component={AddRecipe} options={{ headerShown: false }}/>
      <Stack.Screen name="Cookbook" component={Cookbook} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}
const FavScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Favorites" component={Favorites} options={{ headerShown: false }}/>
      <Stack.Screen name="RecipeDetail" component={RecipeDetail} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}
const ProfileScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }}/>
      <Stack.Screen name="Cookbook" component={Cookbook} options={{ headerShown: false }}/>
      <Stack.Screen name="RecipeDetail" component={RecipeDetail} options={{ headerShown: false }}/>
      <Stack.Screen name="AddRecipe" component={AddRecipe} options={{ headerShown: false }}/>
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}
const MapScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Map" component={Map} options={{ headerShown: false }}/>
      <Stack.Screen name="AddToMap" component={AddToMap} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

// Bottom nav
const Tabs = () => {
  return(
    <Tab.Navigator
  screenOptions={{
    headerShown: false,
    tabBarShowLabel: false,
  }}
>
    <Tab.Screen name="HomeScreen" component={HomeScreen}
    options= {{
      tabBarIcon: ({focused}) => (
        <Ionicons
        name={focused? 'home' : 'home-outline'}
        size={hp("5%")}
        color = "#ff0000"
        />
      ),
      unmountOnBlur: true
    }}/>

    <Tab.Screen name="MapScreen" component={MapScreen}
    options= {{
      tabBarIcon: ({focused}) => (
        <Ionicons
        name={focused? 'map' : 'map-outline'}
        size={hp("5%")}
        color = "#ff0000"
        />
      ),
      unmountOnBlur: true
    }}/>

    <Tab.Screen name="RecipesScreen" component={RecipesScreen}
    options= {{
      tabBarIcon: ({focused}) => (
        <Ionicons
        name={focused? 'book' : 'book-outline'}
        size={hp("5%")}
        color = "#ff0000"
        />
      ),
      unmountOnBlur: true
    }}/>

    <Tab.Screen name="Cart" component={Cart}
    options= {{
      tabBarIcon: ({focused}) => (
        <Ionicons
        name={focused? 'cart' : 'cart-outline'}
        size={hp("5%")}
        color = "#ff0000"
        />
      ),
      unmountOnBlur: true
    }}/>

    <Tab.Screen name="FavScreen" component={FavScreen}
    options= {{
      tabBarIcon: ({focused}) => (
        <Ionicons
        name={focused? 'heart' : 'heart-outline'}
        size={hp("5%")}
        color = "#ff0000"
        />
      ),
      unmountOnBlur: true
    }}/>

    <Tab.Screen name="ProfileScreen" component={ProfileScreen}
    options= {{
      tabBarIcon: ({focused}) => (
        <Ionicons
        name={focused? 'person' : 'person-outline'}
        size={hp("5%")}
        color = "#ff0000"
        />
      ),
      unmountOnBlur: true
    }}/>
</Tab.Navigator>
  )
}



export default function App() {
  let [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_300Light_Italic,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  //Add data in database
  useEffect(() => {
    addDataInDatabase();
  }, []);

  if (!fontsLoaded) {
    return (<Image source={require("./assets/recipeApp/splash.png")} />);
  } else {
    return (
      <NavigationContainer>
       <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }}/>
        {/* Screens where no bottom nav needed */}
        <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
       </Stack.Navigator>
      </NavigationContainer>
    );
  }
}