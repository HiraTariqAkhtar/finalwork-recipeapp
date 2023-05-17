import "react-native-gesture-handler";
import React from "react";
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

// Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navigate to pages not in bottom nav
const HomeScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      <Stack.Screen name="RecipeDetail" component={RecipeDetail}/>
    </Stack.Navigator>
  );
}
const RecipesScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Recipes" component={Recipes} options={{ headerShown: false }}/>
      <Stack.Screen name="RecipeDetail" component={RecipeDetail}/>
    </Stack.Navigator>
  );
}
const FavScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Favorites" component={Favorites} options={{ headerShown: false }}/>
      <Stack.Screen name="RecipeDetail" component={RecipeDetail}/>
    </Stack.Navigator>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return (<Image source={require("./assets/splash.png")} />);
  } else {
    return (
      <NavigationContainer>
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

            <Tab.Screen name="Profile" component={Profile}
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
      </NavigationContainer>
    );
  }
}