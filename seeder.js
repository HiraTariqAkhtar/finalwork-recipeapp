// Add starter data into Firestore Database
import {DATABASE} from "./firebaseConfig"
import { collection, getDocs, addDoc } from "firebase/firestore";

// Did you knows about Pakistan
const didYouKnows = [
    {
        didYouKnow: "Pakistan has the largest volunteer ambulance service in the world",
        id: 1
    },
    {
        didYouKnow: "Pakistan has the highest polo ground in the world",
        id: 2
    },
    {
        didYouKnow: "Pakistan’s Sialkot produces over half the world’s footballs",
        id: 3
    },
    {
        didYouKnow: "Pakistan has the youngest Nobel Prizewinner in the world, Malala Yousafzai",
        id: 4
    },
    {
        didYouKnow: "Pakistan is home to the second highest mountain of the world, K2",
        id: 5
    },
    {
        didYouKnow: "Pakistan has the world’s largest deep sea port",
        id: 6
    },
];

// Recipes
const recipes = [
    {
        id: 1,
        servings: 6,
        recipeName: "Pakoras",
        timeNeeded: 20,
        ingredients: [
            {name: "gram flour", quantity: "5-6 tbsp"},
            {name: "potatoes", quantity: "2 big"},
            {name: "onion", quantity: "1 big"},
            {name: "salt", quantity: "1 tsp"},
            {name: "red chilli powder", quantity: "3/4 tsp"},
            {name: "coriander leaves", quantity: "a handfull"},
            {name: "coriander seeds", quantity: "1/2 tsp"},
            {name: "green/red chilli", quantity: "1 small"},
        ],
        instructions: [
            {number: 1, step: "Peel the potatoes and cut them into small cubes."},
            {number: 2, step: "Peel the onions and cut them in slices."},
            {number: 3, step: "Cut the chilli into small pieces."},
            {number: 4, step: "Mix all ingredients (including gram flour, salt, etc) in a large ball."},
            {number: 5, step: "Add little by little water and kneed the mixture to make a dough."},
            {number: 6, step: "Heat oil in a pan on medium heat."},
            {number: 7, step: "Take spoonfull of the dough and fry until golden-brown"},
        ],
        category: "Snack",
        img:""
    }
]

export async function addDataInDatabase() {
    // did you know
    let didYouKnowCollection = collection(DATABASE, "didYouKnows")
    let didYouKnowData = await getDocs(didYouKnowCollection)
    let existingDidYouKnows = []

    if (didYouKnowData.size > 0) {
        didYouKnowData.forEach((doc) => {
            existingDidYouKnows.push(doc.data().id)
        })
    }

    didYouKnows.forEach((fact) => {
        if(!existingDidYouKnows.includes(fact.id)) {
            addDoc(didYouKnowCollection, fact)
        }
    })


    // recipes
    let recipeCollection = collection(DATABASE, "recipes")
    let recipeData = await getDocs(recipeCollection)
    let existingRecipes = []

    if (recipeData.size > 0) {
        recipeData.forEach((doc) => {
            existingRecipes.push(doc.data().id)
        })
    }

    recipes.forEach((rec) => {
        if(!existingRecipes.includes(rec.id)) {
            addDoc(recipeCollection, rec)
        }
    })
}