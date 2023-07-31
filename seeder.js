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
    {
        didYouKnow: "Pakistan produces over 500 varieties of mangoes",
        id: 7
    },
    {
        didYouKnow: "Pakistani dishes are known for having aromatic and sometimes spicy flavours",
        id: 8
    },
    {
        didYouKnow: "Pakistan was the first Muslim nation to elect a female prime minister",
        id: 9
    },
    {
        didYouKnow: "Pakistan is one of the few nations in the world that has nuclear warheads",
        id: 10
    },
    {
        didYouKnow: "There are six UNESCO World heritage sites in Pakistan",
        id: 11
    },
    {
        didYouKnow: "Field hockey is the national sport of Pakistan",
        id: 12
    },
    {
        didYouKnow: "The Markhor is the national animal of Pakistan",
        id: 13
    },
    {
        didYouKnow: "Pakistan is one of the largest producers of cotton in the world",
        id: 14
    },
    {
        didYouKnow: "Pakistan literally translates to “Land of The Pure”",
        id: 15
    },
    {
        didYouKnow: "There are over 80 languages spoken in Pakistan",
        id: 16
    },
    {
        didYouKnow: "Pakistan has the second largest salt mine in the world",
        id: 17
    },
    {
        didYouKnow: "The most popular sport in Pakistan is cricket",
        id: 18
    },
    {
        didYouKnow: "Pakistan’s military is the strongest in the islamic world",
        id: 19
    },
    {
        didYouKnow: "Pakistani military has 0% suicide rate",
        id: 20
    },
    {
        didYouKnow: "Pakistan’s national anthem, the qaumi taranah, is entirely written in Persian",
        id: 21
    },
    {
        didYouKnow: "Pakistan Air Force is the 10th strongest air force in the world",
        id: 22
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
            {name: "gram flour", quantity: "5-6", unit: "tbsp"},
            {name: "potatoes", quantity: "2", unit: "N/A"},
            {name: "onion", quantity: "1", unit: "N/A"},
            {name: "salt", quantity: "1", unit: "tsp"},
            {name: "red chilli powder", quantity: "3/4", unit: "tsp"},
            {name: "coriander leaves", quantity: 0, unit: "a handfull"},
            {name: "coriander seeds", quantity: "1/2", unit: "tsp"},
            {name: "green/red chilli", quantity: "1", unit: "N/A"},
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
        img:"data:image/jpeg;base64,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",
        public: true
    },

    {
        id: 2,
        servings: 4,
        recipeName: "Spicy Cheelay",
        timeNeeded: 60,
        ingredients: [
            {name: "Moong Lentils", quantity: "1", unit: "cup"},
            {name: "White Lentils", quantity: "2", unit: "cup"},
            {name: "Cumin Powder", quantity: "1", unit: "tbsp"},
            {name: "Red Chili Powder", quantity: "1", unit: "tbsp"},
            {name: "Green Chilies", quantity: "4-5", unit: "N/A"},
            {name: "Garlic Paste", quantity: "1", unit: "tsp"},
            {name: "Eggs", quantity: "2-3", unit: "N/A"},
            {name: "Coriander Leaves", quantity: "1/2", unit: "bunch"},
            {name: "Oil", quantity: 0, unit: "To fry"},
            {name: "Salt", quantity: 0, unit: "To taste"},
        ],
        instructions: [
            {number: 1, step: "Wash and Soak lentils."},
            {number: 2, step: "Make batter by grinding together lentils, cumin, red pepper powder, garlic paste, egg, coriander leaves and salt in a blender."},
            {number: 3, step: "Now heat oil in a pan and fry scoops of the batter to form pancakes."},
            {number: 4, step: "Now cook these pancakes on a pan with 1 tbsp oil, fry from both the sides ."},
            {number: 5, step: "Serve with chutney"},
        ],
        category: "Snack",
        img:"https://www.masala.tv/wp-content/uploads/2017/01/IMG_7004.jpg",
        public: true,
        chef: "Gulzar Hussain"
    },

    {
        id: 3,
        servings: 4,
        recipeName: "Seekh Kabab",
        timeNeeded: 75,
        ingredients: [
            {name: "Ground Beef", quantity: "1/2", unit: "kg"},
            {name: "Fats", quantity: "50", unit: "g"},
            {name: "Crushed Black Pepper", quantity: "1", unit: "tsp"},
            {name: "Red Chili Powder", quantity: "1", unit: "tbsp"},
            {name: "Green cardamom Powder", quantity: "1", unit: "tsp"},
            {name: "Cumin Powder", quantity: "1", unit: "cup"},
            {name: "Green Chilies", quantity: "4", unit: "N/A"},
            {name: "Fresh Coriander", quantity: "1", unit: "bunch"},
            {name: "Ginger Garlic Paste", quantity: "2", unit: "tbsp"},
            {name: "Fried Onions Paste", quantity: "1/2", unit: "cup"},
            {name: "Roasted Chickpea Powder", quantity: "2-3", unit: "tbsp"},
            {name: "Salt", quantity: 0, unit: "To taste"},
            {name: "Oil", quantity: 0, unit: "As required"},
            {name: "Coal", quantity: "1", unit: "piece"},
        ],
        instructions: [
            {number: 1, step: "Mix together beef with all spices."},
            {number: 2, step: "Process the meat in the chopper with all spices."},
            {number: 3, step: "Sew the mince on the skewers and steam fry ."},
            {number: 4, step: "Lastly give dum with coal and Serve"},
        ],
        category: "Snack",
        img:"https://www.masala.tv/wp-content/uploads/2016/11/1.jpg",
        public: true,
        chef: "Gulzar Hussain"
    },

    {
        id: 4,
        servings: "",
        recipeName: "Gajar Ka Halwa",
        timeNeeded: "",
        ingredients: [
            {name: "Carrots", quantity: "1 + 1/2", unit: "kg"},
            {name: "Sugar", quantity: "1/2", unit: "kg"},
            {name: "Khoya", quantity: "1/2", unit: "kg"},
            {name: "Clarified butter", quantity: "1/2", unit: "cup"},
            {name: "Almonds, pistachios", quantity: "1/2", unit: "cup"},
            {name: "Cardamom ground", quantity: "1/2", unit: "tsp"},
        ],
        instructions: [
            {number: 1, step: "In a pan add grated carrots ,sugar and mix"},
            {number: 2, step: "Cover & let it cook till tender."},
            {number: 3, step: "Now fry till sugar and carrot water dries."},
            {number: 4, step: "Add clarified butter and fry."},
            {number: 5, step: "Add cardamoms ground, then add khoya and cover the pan."},
            {number: 6, step: "Lastly sprinkle almonds and pistachios and serve."},
        ],
        category: "Dessert",
        img:"https://www.masala.tv/wp-content/uploads/2019/11/Gajar-Ka-Halwa.jpg",
        public: true,
        chef: "Shireen Anwar"
    },

    {
        id: 5,
        servings: 4,
        recipeName: "Frozen paratha",
        timeNeeded: 30,
        ingredients: [
            {name: "Flour", quantity: "1/2", unit: "kg"},
            {name: "Salt", quantity: "1", unit: "tsp"},
            {name: "Sugar", quantity: "2", unit: "tbsp"},
            {name: "Powder milk", quantity: "2", unit: "tbsp"},
            {name: "Baking powder", quantity: "1", unit: "tsp"},
            {name: "Master puff", quantity: "200", unit: "g"},
            {name: "Ghee", quantity: "1", unit: "tbsp"},
        ],
        instructions: [
            {number: 1, step: "Mix flour with salt, sugar, baking powder, dry milk and knead into a dough with lukewarm water."},
            {number: 2, step: "Beat master puff. Keep aside. Make balls with the prepared dough."},
            {number: 3, step: "Make into saucer size. Spread with master puff and again form into a ball."},
            {number: 4, step: "Now roll this into a paratha very lightly and keep putting paratha on a plastic sheet."},
            {number: 5, step: "Cover with another plastic sheet and put to freeze in the freezer."},
            {number: 6, step: "Use as required."},
        ],
        category: "Bread",
        img:"https://www.masala.tv/wp-content/uploads/2015/10/FROZEN-PARATHA-1.jpg",
        public: true,
        chef: "Shireen Anwar"
    },

    {
        id: 6,
        servings: 4,
        recipeName: "Matar Qeema Karahi",
        timeNeeded: 45,
        ingredients: [
            {name: "Mince Beef, Lamb, or Chicken", quantity: "500", unit: "g"},
            {name: "Oil", quantity: "2", unit: "tbsp"},
            {name: "Onion", quantity: "1", unit: "N/A"},
            {name: "Garlic Minced", quantity: "2", unit: "cloves"},
            {name: "Ginger Grated", quantity: "1", unit: "inch"},
            {name: "Tomatoes", quantity: "2", unit: "N/A"},
            {name: "Coriander Powder", quantity: "2", unit: "tsp"},
            {name: "Cumin Powder", quantity: "1", unit: "tsp"},
            {name: "Turmeric Powder", quantity: "1", unit: "tsp"},
            {name: "Red Chili Powder", quantity: "1", unit: "tsp"},
            {name: "Garam Masala Powder", quantity: "1", unit: "tsp"},
            {name: "Salt", quantity: 0, unit: "To taste"},
            {name: "Frozen Peas", quantity: "100", unit: "g"},
        ],
        instructions: [
            {number: 1, step: "Heat the oil in a large skillet or karahi over medium heat."},
            {number: 2, step: "Sauté the chopped onion until it turns golden brown."},
            {number: 3, step: "Incorporate the minced garlic and grated ginger, and cook for another minute until a fragrant aroma arises."},
            {number: 4, step: "Introduce the chopped tomatoes to the skillet and continue cooking until the oil separates from the masala mixture, which typically takes about 5-7 minutes."},
            {number: 5, step: "Combine the ground coriander, ground cumin, turmeric powder, red chili powder, garam masala, and salt. Stir thoroughly to incorporate the spices into the masala mixture."},
            {number: 6, step: "Add the minced meat to the skillet, ensuring it is well-coated with the masala. Cook for 15-20 minutes or until the meat is thoroughly cooked, stirring occasionally."},
            {number: 7, step: "Incorporate the frozen peas into the skillet and cook for an additional 3-4 minutes until they are heated through."},
            {number: 8, step: "Taste the dish and make any necessary adjustments to the seasoning."},
            {number: 9, step: "Sprinkle fresh coriander leaves on top for garnish."},
            {number: 10, step: "Serve the dish hot with naan or rice."},
        ],
        category: "Curry",
        img:"https://shireenanwer.com/wp-content/uploads/2023/07/Untitled-design-74.png",
        public: true,
        chef: "Shireen Anwar"
    },

    {
        id: 7,
        servings: 4,
        recipeName: "Makhni Garlic Naan",
        timeNeeded: 50,
        ingredients: [
            {name: "White flour", quantity: "500", unit: "g"},
            {name: "Yeast", quantity: "2", unit: "tsp"},
            {name: "Salt", quantity: "1/2", unit: "tsp"},
            {name: "Oil", quantity: "4", unit: "tbsp"},
            {name: "Hot water", quantity: 0, unit: "As required"},
            {name: "Garlic chopped", quantity: "2", unit: "tbsp"},
            {name: "Green Coriander", quantity: "2", unit: "tsp"},
            {name: "Butter", quantity: "50", unit: "g"},
        ],
        instructions: [
            {number: 1, step: "In a bowl, mix yeast, salt, flour and oil with hot water."},
            {number: 2, step: "Knead a soft dough."},
            {number: 3, step: "Let it rise for 1 hour."},
            {number: 4, step: "When dough rise, punch it down."},
            {number: 5, step: "Divide dough into 4 equal portions."},
            {number: 6, step: "Roll each ball into a flat naan."},
            {number: 7, step: "In a separate bowl, add garlic, coriander and butter mix well."},
            {number: 8, step: "Apply on naan and bake at 180 C for 30 minutes or until golden on top."},
            {number: 9, step: "Remove from the oven and apply butter."},
            {number: 10, step: "Serve with any type of curry or kebabs."},
        ],
        category: "Bread",
        img:"https://www.pakistanichefrecipes.com/wp-content/uploads/2021/11/Makhni-Garlic-Naan-500x500.jpg",
        public: true,
        chef: "Rida Aftab"
    },
    
]

// Pakistani supermarkets
const supermarkets = [
    {
        id: 1,
        title: "Iqbal Traders sprl",
        description: "Otletstraat 63, 1070 Brussel", 
        coordinate:{
            latitude: 50.841720,
            longitude: 4.336440
        },
    },
    {
        id: 2,
        title: "Ideal Cash & Carry", 
        description: "Steenweg op Gent 33, 1080 Sint-Jans-Molenbeek", 
        coordinate:{
            latitude: 50.856710, 
            longitude: 4.336840
        },
    },
    {
        id: 3,
        title: "Express Afro-Indian", 
        description: "Zuidlaan 98, 1000 Brussel", 
        coordinate:{
            latitude: 50.8370456, 
            longitude: 4.3423893
        },
    },
]

// Pakistani restaurants
const restaurants = [
    {
        id: 1,
        title: "Tandoori village",
        description: "Charleroise Steenweg 248, 1060 Sint-Gillis", 
        coordinate:{
            latitude: 50.823140, 
            longitude: 4.354060
        }
    },
    {
        id: 2,
        title: "Maharaja Tandoori", 
        description: "Beursstraat 12, 1000 Brussel", 
        coordinate:{
        latitude: 50.848390, 
        longitude: 4.350570
        }
    },
    {
        id: 3,
        title: "Maharaja Tandoori Restaurant", 
        description: "Rue de Fiennesstraat 48, 1070 Anderlecht", 
        coordinate:{
        latitude: 50.838910, 
        longitude: 4.332180
        }
    },
        {
        id: 4,
        title: "Chanab Tandoori", 
        description: "Rue de Fiennes 19, 1070 Anderlecht", 
        coordinate:{
        latitude: 50.838910, 
        longitude: 4.332180
        }
    },
        {
        id: 5,
        title: "Shezan", 
        description: "Waverse Steenweg 120,1050 Ixelles", 
        coordinate:{
        latitude: 50.8364988, 
        longitude: 4.3674027
        }
    },
        {
        id: 6,
        title: "Zam Zam", 
        description: "Rue Brogniez 78, 1070 Anderlecht", 
        coordinate:{
        latitude: 50.8404409, 
        longitude: 4.3355466
        }
    },
]

// Recipe of the day
const recipeOfTheDay = {
    today: new Date().toDateString(),
    recipeOfTheDayIndex: 0
}


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


    // supermarkets
    let supermarketCollection = collection(DATABASE, "supermarkets")
    let supermarketData = await getDocs(supermarketCollection)
    let existingSupermarkets = []

    if(supermarketData.size > 0) {
        supermarketData.forEach((doc) => {
            existingSupermarkets.push(doc.data().id)
        })
    }
    supermarkets.forEach((store) => {
        if(!existingSupermarkets.includes(store.id)) {
            addDoc(supermarketCollection, store)
        }
    })


    // restaurants
    let restaurantCollection = collection(DATABASE, "restaurants")
    let restaurantData = await getDocs(restaurantCollection)
    let existingRestaurants = []

    if(restaurantData.size > 0) {
        restaurantData.forEach((doc) => {
            existingRestaurants.push(doc.data().id)
        })
    }
    restaurants.forEach((resto) => {
        if(!existingRestaurants.includes(resto.id)) {
            addDoc(restaurantCollection, resto)
        }
    })


    // today's date for recipe of the day
    let todayCollection = collection(DATABASE, "recipeOfTheDay")
    let todayData = await getDocs(todayCollection)

    if(todayData.size == 0) {
        addDoc(todayCollection, recipeOfTheDay)
    }


}