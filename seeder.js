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

    {
        id: 8,
        servings: 2,
        recipeName: "Yakhni Pulao",
        timeNeeded: 105,
        ingredients: [
            {name: "Chicken", quantity: "1", unit: "kg"},
            {name: "Onions", quantity: "5", unit: "N/A"},
            {name: "Green chillies", quantity: "3", unit: "N/A"},
            {name: "Green cardamoms", quantity: "5-6", unit: "N/A"},
            {name: "Oil", quantity: "1", unit: "cup"},
            {name: "Yogurt", quantity: "1/2", unit: "cup"},
            {name: "Rice", quantity: "2 + 1/2", unit: "cup"},
            {name: "Carawy Seeds", quantity: "1", unit: "tsp"},
            {name: "Ginger Garlic Paste", quantity: "1", unit: "tbsp"},
            {name: "Salt", quantity: 0, unit: "To taste"},
            {name: "Garlic", quantity: "1", unit: "clove"},
            {name: "Ginger", quantity: "1", unit: "piece"},
            {name: "All spice (whole)", quantity: 0, unit: "A pinch"},
            {name: "Cumin seeds", quantity: "1", unit: "tsp"},
            {name: "Fennel seeds", quantity: "1", unit: "tbsp"},
            {name: "Coriander", quantity: "2", unit: "tbsp"},
        ],
        instructions: [
            {number: 1, step: "Add 1 kg chicken, 3 glass water, salt, 2 onions, 1 clove and 1 piece ginger in a wok."},
            {number: 2, step: "Wrap 1 tbsp fennel seeds, 2 tbsp whole coriander, a pinch whole all spices and 1 tsp cumin seeds in a small malmal cloth."},
            {number: 3, step: "Place this spices pouch in the wok."},
            {number: 4, step: "When chicken is tender enough, remove it from the wok."},
            {number: 5, step: "Clear the stalk by sieving it."},
            {number: 6, step: "Now heat 1 cup oil in another pan, and fry 3 finely chopped onions till they turn golden brown, remove half of the onions from and pan and keep them aside."},
            {number: 7, step: "Add ½ cup yogurt in the pan with remaining onions, with 1 tbsp ginger garlic paste, 5-6 green cardamoms, 1 tsp caraway seeds and 3 green chilies."},
            {number: 8, step: "Cook the ingredients for a while."},
            {number: 9, step: "After 5 minutes add the clear sieved stalk."},
            {number: 10, step: "When stalk reaches boil , then remove water from soaked rice and ad them in the stalk."},
            {number: 11, step: "Stir and add salt."},
            {number: 12, step: "Cover the pan."},
            {number: 13, step: "When the stalk is dried, keep it to simmer."},
            {number: 14, step: "As steam starts appearing, that’s when your Yakhni Pulao is ready."},
        ],
        category: "Rice",
        img:"https://www.masala.tv/wp-content/uploads/2016/07/1-12.jpg",
        public: true,
        chef: "Zubaida Tariq"
    },

    {
        id: 9,
        servings: 4,
        recipeName: "Shahi Tukray",
        timeNeeded: 35,
        ingredients: [
            {name: "Bread Slices", quantity: "6", unit: "N/A"},
            {name: "Milk", quantity: "1", unit: "liter"},
            {name: "Sugar", quantity: "1", unit: "cup"},
            {name: "Green Cardamom", quantity: "6", unit: "N/A"},
            {name: "Almonds", quantity: "20", unit: "N/A"},
            {name: "Yellow food color", quantity: 0, unit: "A little bit"},
            {name: "Khoya (Unsweetened)", quantity: "250", unit: "g"},
            {name: "Pistachios", quantity: "10-15", unit: "N/A"},
            {name: "Oil", quantity: 0, unit: "As required"},
            {name: "Silver Leaf", quantity: 0, unit: "For garnishing"},
        ],
        instructions: [
            {number: 1, step: "Soak 10-15 Pistachios and 20 almonds in water."},
            {number: 2, step: "Peel and finely chop them."},
            {number: 3, step: "Heat oil in a pan and fry 6 bread slices till they turn golden brown."},
            {number: 4, step: "When the pan is cool enough, remove the oil and pour 1 liter milk with 6 green cardamoms, Cook for a while."},
            {number: 5, step: "As the milk start getting thick, Add 2-3 bread slices, half cup sugar and a pinch of yellow food color."},
            {number: 6, step: "Dish out the bread slices when they completely absorb the milk from the pan, Repeat the same procedure with rest of the slices."},
            {number: 7, step: "Pour the remaining milk and sprinkle almonds and pistachios on the dish."},
            {number: 8, step: "Add 250 gram unsweetened Khoya in the dish."},
            {number: 9, step: "In the end garnish it with silver foil."},
        ],
        category: "Dessert",
        img:"https://www.masala.tv/wp-content/uploads/2016/06/Shahi-Tukray-Zubaida-Tariq.jpg",
        public: true,
        chef: "Zubaida Tariq"
    },

    {
        id: 10,
        servings: 4,
        recipeName: "Kofta Biryani",
        timeNeeded: 40,
        ingredients: [
            {name: "Beef/ Chicken Mince", quantity: "1/2", unit: "kg"},
            {name: "Bread Slices", quantity: "2", unit: "N/A"},
            {name: "Lemons", quantity: "2", unit: "N/A"},
            {name: "Onions", quantity: "3", unit: "N/A"},
            {name: "Black Pepper", quantity: "4", unit: "N/A"},
            {name: "Green Chilies", quantity: "8", unit: "N/A"},
            {name: "Green Cardamoms", quantity: "6", unit: "N/A"},
            {name: "Yellow Food Color", quantity: 0, unit: "A pinch"},
            {name: "Oil", quantity: "1", unit: "cup"},
            {name: "Fresh Milk", quantity: "1", unit: "cup"},
            {name: "Rice", quantity: "2", unit: "cup"},
            {name: "Yogurt", quantity: "1/2", unit: "cup"},
            {name: "Mint Leaves", quantity: "1", unit: "bunch"},
            {name: "Cumin Seeds", quantity: "1", unit: "tsp"},
            {name: "Turmeric", quantity: "1", unit: "tsp"},
            {name: "All spice", quantity: "1", unit: "tsp"},
            {name: "Red Chili Powder", quantity: "1", unit: "tbsp"},
            {name: "Ground Coriander", quantity: "1", unit: "tbsp"},
            {name: "Roasted Chickpeas", quantity: "1", unit: "tbsp"},
            {name: "Poppy Seeds", quantity: "1", unit: "tbsp"},
            {name: "Ginger Garlic Paste ", quantity: "1", unit: "tbsp"},
            {name: "Salt", quantity: 0, unit: "To taste"},
        ],
        instructions: [
            {number: 1, step: "Grind mince with 1 tbsp roasted chickpeas, 1 tbsp poppy seeds, 1 tsp cumin seeds and black pepper."},
            {number: 2, step: "Now fold bread center soft part in the ground mince."},
            {number: 3, step: "Now grind mince again with green masala."},
            {number: 4, step: "Add in salt, 4 green chilies and ½ bunch mint , mix well and make fine kofta balls."},
            {number: 5, step: "Shallow fry the mince balls."},
            {number: 6, step: "Now heat oil in a pan and fry onions till they turn golden brown, remove and spread them on paper."},
            {number: 7, step: "Crush these fried onions when they are dry and mix them with yogurt, add in red chilli powder, 1 tbsp ground coriander, 1 tsp turmeric and salt."},
            {number: 8, step: "Mix well and add this mixture in the pan and cook."},
            {number: 9, step: "Now spread fried kofta balls in the pan and leave it on dum for min."},
            {number: 10, step: "Boil 2 cups rice in a pan with salt, 4 green chilies mint leaves , 6 green cardamoms."},
            {number: 11, step: "Cook till they are ¾ done"},
            {number: 12, step: "Remove water from the rice."},
            {number: 13, step: "Now grease a pan and spread rice evenly on its base"},
            {number: 14, step: "Now spread a layer of kofta masala, Spinkle mint leaves and green chilies"},
            {number: 15, step: "Spread another layer of rice and pour yellow food color mixed with milk."},
            {number: 16, step: "Sqeeze lemon juice and then spread fried koftas on it. Leave it to simmer."},
        ],
        category: "Rice",
        img:"https://www.masala.tv/wp-content/uploads/2015/09/1.jpg",
        public: true,
        chef: "Zubaida Tariq"
    },

    {
        id: 11,
        servings: "",
        recipeName: "Peshawari Vegetable Kabab",
        timeNeeded: 105,
        ingredients: [
            {name: "Potatoes", quantity: "1/2", unit: "kg"},
            {name: "Carrots", quantity: "2", unit: "N/A"},
            {name: "Dill", quantity: "2", unit: "bunch"},
            {name: "Green Chillies", quantity: "6", unit: "N/A"},
            {name: "Peas", quantity: "1/2", unit: "cup"},
            {name: "Roasted Cumin", quantity: "1", unit: "tsp"},
            {name: "Ground Cumin", quantity: "1", unit: "tsp"},
            {name: "Crushed Black Pepper", quantity: "1", unit: "tsp"},
            {name: "Crushed Red Pepper", quantity: "1", unit: "tbsp"},
            {name: "Rice Flour", quantity: "3", unit: "tbsp"},
            {name: "Egg whites", quantity: "2", unit: "N/A"},
            {name: "Bread Crumbs", quantity: 0, unit: "As required"},
            {name: "Salt", quantity: 0, unit: "To taste"},
            {name: "Lemons", quantity: "2", unit: "N/A"},
            {name: "Coriander Leaves", quantity: "1", unit: "bunch"},
            {name: "Oil", quantity: 0, unit: "To fry"},
        ],
        instructions: [
            {number: 1, step: "Boil the potatoes, grate the carrots finely chop the dill."},
            {number: 2, step: "Add peas in a chopper and chop well. Mix it with lemon juice."},
            {number: 3, step: "Mash boiled potatoes."},
            {number: 4, step: "Make kababs by mixing boiled potatoes, peas mixture, green chilies, carrots, coriander , cumin, black pepperand rice flour."},
            {number: 5, step: "Dip in egg white, roll in crumbs and fry."},
        ],
        category: "Snack",
        img:"https://www.masala.tv/wp-content/uploads/2016/06/Peshawari-Vegetable-Kabab.jpg",
        public: true,
        chef: "Zubaida Tariq"
    },

    {
        id: 12,
        servings: "",
        recipeName: "Tandoori Chicken",
        timeNeeded: "",
        ingredients: [
            {name: "Chicken", quantity: "1", unit: "kg"},
            {name: "Roasted, Ground Cumin", quantity: "1", unit: "tsp"},
            {name: "Crushed Pomegranate seeds", quantity: "2", unit: "tbsp"},
            {name: "Chaat Masala", quantity: "1", unit: "tbsp"},
            {name: "Red Chili Powder", quantity: "1", unit: "tsp"},
            {name: "Salt", quantity: "1", unit: "tsp"},
            {name: "Black Pepper Powder", quantity: "1", unit: "tsp"},
            {name: "Lemon Juice", quantity: "4", unit: "tbsp"},
            {name: "Oil", quantity: "1/2", unit: "cup"},
            {name: "All Spice Powder", quantity: "1", unit: "tsp"},
            {name: "Carom seeds", quantity: "1", unit: "tsp"},
            {name: "Yogurt", quantity: "1/2", unit: "cup"},
            {name: "Green Chilies", quantity: "2", unit: "N/A"},
            {name: "Onion", quantity: "2", unit: "N/A"},
            {name: "Tomato", quantity: "2", unit: "N/A"},
            {name: "Ginger Garlic", quantity: "1", unit: "tbsp"},
            {name: "Beet root water", quantity: "4", unit: "tbsp"}
        ],
        instructions: [
            {number: 1, step: "In a clean bowl, add yogurt, roasted ground cumin, ground pomegranate seeds, chaat masala, red chili powder, salt, black pepper powder, oil, lime juice, all spice powder, celery powder, ginger garlic, and beet root water. Mix everything well and set aside."},
            {number: 2, step: "Meanwhile, give cuts on the chicken and pour all the yogurt mixture evenly and marinate for 1 hour."},
            {number: 3, step: "Once it is well marinated, heat oil in a wok and cook the chicken for at least 20 minutes, until the water dries."},
            {number: 4, step: "After it is done, transfer the chicken on a baking tray, add tomatoes and onions on the side of the tray, and grill it for 10 minutes."},
            {number: 5, step: "Serve hot."}
        ],
        category: "Snack",
        img:"https://www.masala.tv/wp-content/uploads/2020/03/Tandoori-Chicken-Recipe.png",
        public: true,
        chef: "Rida Aftab"
    },

    {
        id: 13,
        servings: 4,
        recipeName: "Besan ka Halwa",
        timeNeeded: 40,
        ingredients: [
            {name: "Khoya", quantity: "1/2", unit: "kg"},
            { name: "Gram Flour", quantity: "250", unit: "g" },
            { name: "Ghee", quantity: "250", unit: "g" },
            { name: "Cardamom Powder", quantity: "1/2", unit: "tsp" },
            { name: "Sugar", quantity: "375", unit: "g" },
            { name: "Yellow Food Color", quantity: "1/2", unit: "tsp" },
            { name: "Milk", quantity: "2", unit: "cup" },
            { name: "Almonds", quantity: 0, unit: "As required" },
            { name: "Pistachios", quantity: 0, unit: "As required" }
        ],
        instructions: [
            { number: 1, step: "In a pan, heat ghee, add gram flour, and fry." },
            { number: 2, step: "When aroma comes, add khoya and fry until golden brown." },
            { number: 3, step: "Add sugar, cardamom powder, yellow food color, milk, and cook on low flame." },
            { number: 4, step: "When milk dries, remove from the stove." },
            { number: 5, step: "Sprinkle almonds, pistachios, and serve." }
        ],
        category: "Dessert",
        img:"https://www.masala.tv/wp-content/uploads/2015/08/1-1-1.jpg",
        public: true,
        chef: "Rida Aftab"
    },

    {
        id: 14,
        servings: 3,
        recipeName: "Sabzi Pulao",
        timeNeeded: 40,
        ingredients: [
            { name: "Rice", quantity: "1/2", unit: "kg" },
            { name: "Green Peas", quantity: "1", unit: "cup" },
            { name: "Potatoes", quantity: "2", unit: "N/A" },
            { name: "Tomatoes", quantity: "2", unit: "N/A" },
            { name: "Carrots", quantity: "2", unit: "N/A" },
            { name: "Green Chilies", quantity: "6", unit: "N/A" },
            { name: "Butter", quantity: "50", unit: "g" },
            { name: "Currants", quantity: "100", unit: "g" },
            { name: "Black Pepper", quantity: "1", unit: "tsp" },
            { name: "Cumin Seeds", quantity: "1", unit: "tsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Oil", quantity: "4", unit: "tbsp" }
          ],
          instructions: [
            { number: 1, step: "Boil the rice." },
            { number: 2, step: "In a pan, heat butter and add black pepper, salt, cumin seeds, green chilies, and water. Cook on low flame." },
            { number: 3, step: "When stock is remaining, remove from the stove." },
            { number: 4, step: "In another pan, heat oil and add potatoes, carrots, and green peas. Fry and add water." },
            { number: 5, step: "When the vegetables are tender, add boiled rice, salt, and mix." },
            { number: 6, step: "Then add currants and the stock. Let it simmer for 10 minutes." },
            { number: 7, step: "Delicious pulao is ready." }
          ],
        category: "Rice",
        img:"https://www.masala.tv/wp-content/uploads/2015/06/1-2.jpg",
        public: true,
        chef: "Rida Aftab"
    },

    {
        id: 15,
        servings: "4-6",
        recipeName: "Gulab Jaman",
        timeNeeded: 105,
        ingredients: [
          { name: "Plain Flour", quantity: "1/2", unit: "cup" },
          { name: "Full Cream Milk", quantity: "2", unit: "cup" },
          { name: "Baking Soda", quantity: "1", unit: "tsp" },
          { name: "Ghee", quantity: "35", unit: "g" },
          { name: "Cardamom Powder", quantity: 0, unit: "A pinch" },
          { name: "Ghee", quantity: 0, unit: "To fry" },
          { name: "Sugar", quantity: "1/2", unit: "kg" },
          { name: "Water", quantity: "1/2", unit: "l" },
          { name: "Kewra Essence", quantity: 0, unit: "A few drops" },
          { name: "Almonds", quantity: 0, unit: "As required" },
          { name: "Pistachios", quantity: 0, unit: "As required" }
        ],
        instructions: [
          { number: 1, step: "In a bowl, add full cream milk, baking soda, and cardamom powder. Mix it and knead with ghee." },
          { number: 2, step: "Now make small balls and fry them in heated ghee until golden brown. Take them out and place them in a dish." },
          { number: 3, step: "In a pan, add sugar, water, and kewra essence. Let it cook to make the syrup." },
          { number: 4, step: "Place the syrup on low flame and dip the golden brown gulab jamans in the syrup before you serve." },
          { number: 5, step: "Garnish with almonds and pistachios." }
        ],
        category: "Sweets",
        img: "https://example.com/khushk_doodh_kay_gulab_jaman.jpg",
        public: true,
        chef: "Rida Aftab"
    },

    {
        id: 16,
        servings: 4,
        recipeName: "Achari Chicken",
        timeNeeded: 61,
        ingredients: [
          { name: "Chicken Drumsticks", quantity: "1", unit: "kg" },
          { name: "Garlic Paste", quantity: "1 + 1/2", unit: "tbsp" },
          { name: "Ginger Paste", quantity: "1", unit: "tbsp" },
          { name: "Coriander Powder", quantity: "1", unit: "tbsp" },
          { name: "Salt", quantity: "1 + 1/2", unit: "tbsp" },
          { name: "Turmeric", quantity: "1", unit: "tbsp" },
          { name: "Red Chilli Powder", quantity: "1 + 1/2", unit: "tbsp" },
          { name: "Yogurt", quantity: "250", unit: "g" },
          { name: "Oil", quantity: "1/2", unit: "cup" },
          { name: "Onions", quantity: "2", unit: "N/A" },
          { name: "Cumin Seeds", quantity: "2", unit: "tbsp" },
          { name: "Coriander Seeds", quantity: "2", unit: "tbsp" },
          { name: "Kasuri Methi", quantity: "1", unit: "tbsp" },
          { name: "Fennel Seeds", quantity: "2", unit: "tbsp" },
          { name: "Fenugreek Seeds", quantity: "1", unit: "tbsp" },
          { name: "Mustard Seeds", quantity: "1", unit: "tbsp" },
          { name: "Nigella Seeds", quantity: "1", unit: "tbsp" },
          { name: "Citric Acid", quantity: "1/4", unit: "tbsp" },
          { name: "Chopped Coriander", quantity: "1/2", unit: "cup" }
        ],
        instructions: [
            { number: 1, step: "Mix ginger paste, garlic paste, coriander powder, salt, turmeric, red chilli powder, and yogurt well. Marinate the chicken with this mixture for 30 minutes." },
            { number: 2, step: "Grind cumin seeds, coriander seeds, kasuri methi, fennel seeds, fenugreek seeds, mustard seeds, nigella seeds, citric acid, and coriander leaves into a powder to make the Achari Masala." },
            { number: 3, step: "Take 1/4 cup of yogurt and mix 2 tsp of the Achari Masala in it." },
            { number: 4, step: "Make a slit in the green chilies and stuff them with the yogurt mixture. Mix well and fry for 3 minutes on medium-high flame." },
            { number: 5, step: "In a pan, add 1/2 cup oil and fry sliced onions until they become light pink." },
            { number: 6, step: "Add the marinated chicken and fry it well for 3 minutes." },
            { number: 7, step: "Add the Achari Masala and 3 medium tomatoes (boiled & blended) to the chicken." },
            { number: 8, step: "Add 1 cup of water, cover, and cook on medium-low flame for 15 minutes." },
            { number: 9, step: "Now place the stuffed green chilies among the chicken pieces, cover, and cook for an additional 10 minutes on medium-low flame." },
            { number: 10, step: "Garnish with 1/2 cup of chopped coriander. Your easy and delicious Achari Chicken is now ready to be served." }
          ],
        category: "Curry",
        img: "https://shireenanwer.com/wp-content/uploads/2023/07/Achari-Chicken.png",
        public: true,
        chef: "Shireen Anwar"
    },

    {
        id: 17,
        servings: 5,
        recipeName: "Suji Ka Halwa",
        timeNeeded: 35, 
        ingredients: [
          { name: "Semolina (Suji)", quantity: "1", unit:"cup" },
          { name: "Sugar", quantity: "1", unit:"cup"},
          { name: "Water", quantity: "4", unit:"cup" },
          { name: "Ghee", quantity: "1/2", unit:"cup" },
          { name: "Green Cardamom Powder", quantity: "1/4", unit:"tsp" },
          { name: "Almonds", quantity: 0, unit: "As required" }
        ],
        instructions: [
          { number: 1, step: "In a deep, heavy-based saucepan, melt the ghee. Add the suji and stir-fry over medium/low heat, depending on how often you stir it." },
          { number: 2, step: "At the same time, in another pan, dissolve the sugar in the water over low heat and keep it on simmer, till required." },
          { number: 3, step: "Tip - It is convenient to do this in a pan with a long handle because when you pour the sugar solution into the suji mixture, a lot of steam is created, which can burn your hand." },
          { number: 4, step: "When the suji is light brown, gets a glossy look, and does not stick together much (which means it is fried enough), add the sugar solution and the cardamom. Bring it to a boil, then simmer till the liquid is absorbed. At this stage, you can stir off and on, not continuously." },
          { number: 5, step: "Serve hot, garnished with almonds." }
        ],
        category: "Dessert",
        img: "https://shireenanwer.com/wp-content/uploads/2022/11/Untitled-design-96.png",
        public: true,
        chef: "Shireen Anwar"
    },

    {
        id: 18,
        servings: 8,
        recipeName: "Traditional Mango Kulfi",
        timeNeeded: 20,
        ingredients: [
          { name: "Heavy Cream", quantity: "1 + 1/3", unit: "cup" },
          { name: "Mango Chunks", quantity: "2 + 1/2", unit: "cup" },
          { name: "Sweetened Condensed Milk", quantity: "1/2", unit: "can" },
          { name: "Evaporated Milk",  quantity: "1/2", unit: "can" },
          { name: "Green Cardamom Powder",  quantity: "1/2", unit: "tsp" },
          { name: "Yellow Food Color", quantity: "1/4", unit: "tsp" },
          { name: "Powdered Sugar", quantity: "2-3", unit: "tbsp"}
        ],
        instructions: [
          { number: 1, step: "Make mango pulp by pulsing mango cubes in a blender until smooth. Set aside." },
          { number: 2, step: "Whip the cream until it reaches soft peaks stage and is doubled in volume." },
          { number: 3, step: "Mix mango pulp and condensed milk in whipped cream. Set aside." },
          { number: 4, step: "Whip chilled evaporated milk until doubled in volume." },
          { number: 5, step: "Mix condensed milk and mango mixture with whipped evaporated milk until combined. Add cardamom powder and yellow food color, if using." },
          { number: 6, step: "Do a taste test and add more sugar only if needed." },
          { number: 7, step: "Pour kulfi mixture into moulds and cover the lids. Freeze for 6-8 hours until solid." },
          { number: 8, step: "To un-mould kulfi, run tap water over kulfi moulds for 3 seconds. Hold the kulfi mould upside down with the lid side facing down. Run water over the tail side." },
          { number: 9, step: "Insert an ice cream stick in the kulfi mould. This might need some pressure. Then twist the stick and pull kulfi out of the mould. Enjoy." }
        ],
        category: "Dessert",
        img: "https://shireenanwer.com/wp-content/uploads/2023/02/Untitled-design-2023-02-28T004342.021.png",
        public: true,
        chef: "Shireen Anwar"
    },

    {
        id: 19,
        servings: "",
        recipeName: "Aloo Pilau",
        timeNeeded: "",
        ingredients: [
            { name: "Basmati Rice", quantity: "2 ", unit: "cup" },
            { name: "Onion", quantity: "1", unit: "N/A" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Chili Powder", quantity: "1", unit: "tsp" },
            { name: "Green Chillies", quantity: "2", unit: "N/A" },
            { name: "Oil Spread (or Butter)", quantity: "4", unit: "tbsp" },
            { name: "Star Anise", quantity: "2", unit: "N/A" },
            { name: "Cloves", quantity: "4", unit: "N/A" },
            { name: "Garam Masala", quantity: "1", unit: "tsp" },
            { name: "Cinnamon Stick", quantity: "1", unit: "N/A" },
            { name: "Potato", quantity: "2", unit: "N/A" }
          ],
          instructions: [
            { number: 1, step: "Heat the oil spread (or butter) in a pan until melted." },
            { number: 2, step: "Thinly slice the onions and add it together with the salt, and whole spices in the pan." },
            { number: 3, step: "Cook the onions on medium heat until golden brown." },
            { number: 4, step: "Add the garam masala and chili powder." },
            { number: 5, step: "Add the potatoes, green chilies, and 1/2 cup water." },
            { number: 6, step: "Cook on medium heat for 5 minutes, then add the rice." },
            { number: 7, step: "Cook on low heat for 10 minutes until the rice is partially cooked." },
            { number: 8, step: "Simmer until the water has evaporated and the rice is cooked." },
            { number: 9, step: "If the rice is not fully cooked and the water has run out, add 1/4 cup water and continue cooking." },
            { number: 10, step: "Once the rice is cooked, cover the pan with a lid." },
            { number: 11, step: "Leave it on the lowest heat for a few minutes and then it's ready to serve." }
          ],
        category: "Rice",
        img:"https://www.masala.tv/wp-content/uploads/2014/09/Aloo-pilau-rice-Tahir-Chaudhary.jpg",
        public: true,
        chef: "Tahir Chaudhary"
    },

    {
        id: 20,
        servings: 4,
        recipeName: "Besan ki Barfi",
        timeNeeded: 35,
        ingredients: [
            { name: "Gram flour", quantity: "2", unit: "cup" },
            { name: "Clarified butter", quantity: "2", unit: "cup" },
            { name: "Dry milk", quantity: "2", unit: "cup" },
            { name: "Sugar", quantity: "3", unit: "cup" },
            { name: "Water", quantity: "4", unit: "cup" },
            { name: "Pistachios", quantity: "1/2", unit: "cup" },
            { name: "Cardamom powder", quantity: "1/2", unit: "tsp" },
            { name: "Screwpine essence", quantity: 0, unit: "A few drops" }
        ],
        instructions: [
            { number: 1, step: "Heat clarified butter and lightly roast gram flour. Then mix in dry milk." },
            { number: 2, step: "In a pot, mix water and sugar well and make a thick syrup." },
            { number: 3, step: "Now mix cardamom powder and screwpine essence into the syrup." },
            { number: 4, step: "Then dish out the mixture into a greased platter and garnish with pistachios." },
            { number: 5, step: "After it cools down, cut it into pieces and your Besan ki Barfi is ready." }
        ],
        category: "Sweets",
        img: "https://www.masala.tv/wp-content/uploads/2018/01/1-2-1.jpg",
        public: true,
        chef: ""
    },

    {
        id: 21,
        servings: 4,
        recipeName: "Jalebi",
        timeNeeded: 25,
        ingredients: [
        { name: "Sugar", quantity: "1", unit: "kg" },
        { name: "Water", quantity: "250", unit: "g" },
        { name: "Baking Powder", quantity: "100", unit: "g" },
        { name: "Flour", quantity: "200", unit: "g" },
        { name: "Soda", quantity: 0, unit: "A pinch" },
        { name: "Water", quantity: "100", unit: "g" },
        { name: "Oil", quantity: 0, unit: "To fry" }
        ],
        instructions: [
        { number: 1, step: "Cook sugar and water together until it boils. Then turn off the stove." },
        { number: 2, step: "For Jalebi, mix all the ingredients except oil and make a paste." },
        { number: 3, step: "Put the mixture in a jalebi cloth and make jalebis in hot oil." },
        { number: 4, step: "Fry till they turn brown in color from both sides." },
        { number: 5, step: "Put the fried jalebis in the prepared sugar syrup and serve." }
        ],
        category: "Sweets",
        img: "https://www.masala.tv/wp-content/uploads/2017/05/1-11.jpg",
        public: true,
        chef: ""
    },

    {
        id: 22,
        servings: 4,
        recipeName: "Motichoor Ladoo",
        timeNeeded: 35,
        ingredients: [
            { name: "Gram flour (Besan)", quantity: "1/2", unit: "kg" },
            { name: "Semolina (Sooji)", quantity: "1", unit: "cup" },
            { name: "Water", quantity: 0, unit: "As required" },
            { name: "Yellow food color", quantity: "1/2", unit: "tsp" },
            { name: "Sugar", quantity: "250", unit: "g" },
            { name: "Water", quantity: "3/4", unit: "cup" },
            { name: "Cardamom pods (Elaichi)", quantity: "1 tsp", unit: "" },
            { name: "Melon seeds (Char Magaz)", quantity: "as required", unit: "" }
        ],
        instructions: [
            { number: 1, step: "In a bowl, mix gram flour, semolina, and water to make a thick batter." },
            { number: 2, step: "Add yellow food color for a traditional look." },
            { number: 3, step: "Heat oil in a deep pan. " },
            { number: 4, step: "Hold a slotted ladle (jharna) over the hot oil and pour some batter on it. Tap gently to let small droplets fall into the oil to form boondi." },
            { number: 5, step: "Fry until they are lightly golden and crispy." },
            { number: 6, step: "Remove and keep aside." },
            { number: 7, step: "Fry all the boondi in batches and set them aside." },
            { number: 8, step: "In a separate pan, add sugar and water." },
            { number: 9, step: "Bring it to a boil and let it simmer until the syrup reaches one-string consistency." },
            { number: 10, step: "Add crushed cardamom pods and melon seeds (char magaz) to the syrup." },
            { number: 11, step: "Add all the fried boondi into the prepared sugar syrup. Let it soak for about 10 minutes on low heat." },
            { number: 12, step: "After soaking, take the mixture out and let it cool slightly." },
            { number: 13, step: "Take a small portion of the mixture in your hand and shape it into round ladoos." }
        ],
        category: "Sweets",
        img: "https://www.masala.tv/wp-content/uploads/2018/01/1-27.jpg",
        public: true,
        chef: ""
    }, 
    
    {
        id: 23,
        servings: 6,
        recipeName: "Bread Barfi",
        timeNeeded: 100,
        ingredients: [
            { name: "bread slices", quantity: "4", unit: "N/A" },
            { name: "ricotta cheese", quantity: "1", unit: "cup" },
            { name: "milk", quantity: "1/2", unit: "l" },
            { name: "sugar", quantity: "250", unit: "g" },
            { name: "pistachios", quantity: "50", unit: "g" },
            { name: "sugar", quantity: "2", unit: "tbsp" },
            { name: "kewra water", quantity: "1", unit: "tbsp" },
            { name: "cardamom powder", quantity: "1/2", unit: "tsp" }
        ],
        instructions: [
            { number: 1, step: "Soak bread slices in milk for 2 hours." },
            { number: 2, step: "Place soaked bread slices in a blender and blend well until smooth." },
            { number: 3, step: "Take it out in a pan and cook on low flame for 10-15 minutes or until all water dries up. Keep stirring." },
            { number: 4, step: "Add sugar, ground cardamoms, and kewra water. Cook on low flame for another 10 minutes, then add crumbled khoya." },
            { number: 5, step: "Grease a dish or tray with butter and spread the bread mixture on it." },
            { number: 6, step: "Bake in a preheated oven at 180°C for 30 minutes." },
            { number: 7, step: "Take it out from the oven and cut into squares." },
            { number: 8, step: "Sprinkle chopped pistachios over it." },
            { number: 9, step: "Bread Barfi is ready to serve." }
        ],
        category: "Sweest",
        img: "http://www.pakistanichefrecipes.com/wp-content/uploads/2018/12/Bread-Barfi.jpg",
        public: true,
        chef: "Rida Aftab"
    },

    {
        id: 24,
        servings: 4,
        recipeName: "Ginger Beef",
        timeNeeded: 90,
        ingredients: [
            { name: "Beef", quantity: "500", unit: "g" },
            { name: "Ginger", quantity: "2", unit: "piece" },
            { name: "Onion", quantity: "1", unit: "N/A" },
            { name: "Green chilies", quantity: "2-3", unit: "N/A" },
            { name: "Tomatoes", quantity: "3", unit: "N/A" },
            { name: "Turmeric powder", quantity: "1/2", unit: "tsp" },
            { name: "Crushed red pepper", quantity: "1", unit: "tsp" },
            { name: "Chili powder", quantity: "1", unit: "tsp" },
            { name: "Yogurt", quantity: "125", unit: "g" },
            { name: "Dry ginger powder", quantity: "1/4", unit: "tsp" },
            { name: "Cloves", quantity: "6-8", unit: "N/A" },
            { name: "Green chilies", quantity: "3-4", unit: "N/A" },
            { name: "Coriander leaves", quantity: 0, unit: "As required" },
            { name: "Salt", quantity: 0, unit: "To taste" },
            { name: "Oil", quantity: "3-4", unit: "tbsp" },
            { name: "Water", quantity: "1/2", unit: "cup" }
        ],
        instructions: [
            { number: 1, step: "Boil the tomatoes and finely chop ginger and 1 onion, keep aside." },
            { number: 2, step: "Heat 3-4 tbsp oil in a pan, add chopped ginger and chopped onion. Fry till golden brown." },
            { number: 3, step: "Now add undercut cubes of beef and cook until meat changes its color and is no longer pink." },
            { number: 4, step: "Add 3-4 green cardamoms, cloves, turmeric, red chili powder, crushed red pepper, and yogurt. Fry for 1-2 minutes." },
            { number: 5, step: "Now add dry ginger powder, water, and salt to taste. Cover and cook on low flame for 8-10 minutes." },
            { number: 6, step: "Then remove the lid, add chopped coriander leaves, 2-3 chopped green chilies, and chopped tomatoes." },
            { number: 7, step: "Cook and stir for a few minutes or until oil comes on top." },
            { number: 8, step: "Take it out in a serving dish and serve hot." }
        ],
        category: "Curry",
        img: "http://www.pakistanichefrecipes.com/wp-content/uploads/2021/10/ginger-beef.jpg",
        public: true,
        chef: "Zakir Qureshi"
    },
    
    {
        id: 25,
        servings: 4,
        recipeName: "Chicken Jalfrezi",
        timeNeeded: 30,
        ingredients: [
            { name: "Chicken", quantity: "500", unit: "g" },
            { name: "Oil", quantity: "2", unit: "2" },
            { name: "Onion", quantity: "2", unit: "N/A" },
            { name: "Capsicum", quantity: "2", unit: "N/A" },
            { name: "Garlic paste", quantity: "1", unit: "tsp" },
            { name: "Tomatoes", quantity: "2", unit: "N/A" },
            { name: "Butter", quantity: "3", unit: "tbsp" },
            { name: "Red chili powder", quantity: "1 + 1/4", unit: "tbsp" },
            { name: "All spice powder", quantity: "1 + 1/2", unit: "tbsp" },
            { name: "Tomato ketchup", quantity: "3", unit: "tbsp" },
            { name: "Salt", quantity: 0, unit: "To taste" },
            { name: "Ginger", quantity: "2", unit: "inch piece" },
            { name: "Fresh coriander leaves", quantity: 0, unit: "As required" }
        ],
        
        instructions: [
            { number: 1, step: "Heat oil in a deep pan over medium heat." },
            { number: 2, step: "Slice the onions and deep fry the them for a few minutes or until light brown in color." },
            { number: 3, step: "Drain on an absorbent paper and set aside to cool. Grind it to a fine paste." },
            { number: 4, step: "Heat two tablespoons oil in another pan." },
            { number: 5, step: "Add capsicum strips and sauté. Remove and set aside on absorbent paper." },
            { number: 6, step: "Add garlic paste to the same oil and sauté for half a minute. Add chopped tomatoes and cook." },
            { number: 7, step: "Heat butter in another pan, add chicken strips and keep stirring continuously till golden brown in color." },
            { number: 8, step: "Add red chili powder, all spice powder, tomato ketchup, and salt and mix well. Cover and cook till tender." },
            { number: 9, step: "Add fried onion paste, ginger, and capsicum and sauté for two minutes." },
            { number: 10, step: "Add the tomato-garlic mixture and mix well and cook for a few more minutes." },
            { number: 11, step: "Turn the flame off and dish it out. Garnish with coriander leaves." }
        ],
        category: "Curry",
        img: "http://www.pakistanichefrecipes.com/wp-content/uploads/2021/04/Chicken-Jalfrezi.jpg",
        public: true,
        chef: "Zarnak Sidhwa"
    },

    {
        id: 26,
        servings: 4,
        recipeName: "Hyderabadi Achaar Gosht",
        timeNeeded: 45,
        ingredients: [
            { name: "Chicken", quantity: "750", unit: "g" },
            { name: "Onion", quantity: "1 + 1/2", unit: "tbsp" },
            { name: "Tomatoes", quantity: "6-7", unit: "N/A" },
            { name: "Garlic paste", quantity: "1 + 1/2", unit: "tbsp" },
            { name: "Ginger paste", quantity: "1 + 1/2", unit: "tbsp" },
            { name: "Green chilies", quantity: "10-12", unit: "N/A" },
            { name: "Yogurt", quantity: "1 + 1/2", unit: "cup" },
            { name: "Lemon juice", quantity: "3-4", unit: "tbsp" },
            { name: "Oil or clarified butter", quantity: "1 + 1/4", unit: "cup" },
            { name: "Achar gosht masala", quantity: "50", unit: "g" }
        ],
        instructions: [
            { number: 1, step: "In a small bowl, mix together the lemon juice and achar gosht masala." },
            { number: 2, step: "Cut green chilies and stuff masala in it." },
            { number: 3, step: "Heat oil or ghee in a pan or wok over medium heat." },
            { number: 4, step: "Cook onion till soft or transparent." },
            { number: 5, step: "Now add chicken, ginger garlic paste and cook for 5 minutes." },
            { number: 6, step: "Add remaining achar ghost masala and yogurt mix well." },
            { number: 7, step: "Add 1 cup of water, cover, and cook until all water dries up." },
            { number: 8, step: "Add tomatoes and cook on high flame until chicken is done." },
            { number: 9, step: "When oil separates, add spiced chilies and cook for 10 minutes on low flame." },
            { number: 10, step: "Add lemon juice to enhance the flavor." },
            { number: 11, step: "Apply tarka on curry leaves and whole red chilies." },
            { number: 12, step: "Garnish with coriander leaves." }
        ],
        category: "Curry",
        img: "http://www.pakistanichefrecipes.com/wp-content/uploads/2020/12/Hyderabadi-Achaar-Gosht.jpg",
        public: true,
        chef: "Mehboob Khan"
    },
    
    {
        id: 27,
        servings: 4,
        recipeName: "Butter Chicken Biryani",
        timeNeeded: 50,
        ingredients: [
            { name: "Chicken", quantity: "500", unit: "g" },
            { name: "Cooked rice", quantity: "3", unit: "cup" },
            { name: "Oil", quantity: "1/2", unit: "cup" },
            { name: "Butter", quantity: "1/4", unit: "cup" },
            { name: "Green chilies", quantity: "2-3", unit: "N/A" },
            { name: "All spice powder", quantity: "1", unit: "tbsp" },
            { name: "Golden Onions", quantity: "1/2", unit: "cup" },
            { name: "Ginger-garlic paste", quantity: "1", unit: "tbsp" },
            { name: "Tomato", quantity: "3", unit: "cus" },
            { name: "Red chili powder", quantity: "1", unit: "tbsp" },
            { name: "All spice powder", quantity: "1", unit: "tsp" },
            { name: "Dried fenugreek leaves", quantity: "1/2", unit: "tsp" },
            { name: "Salt", quantity: 0, unit: "To taste" },
            { name: "Fresh cream", quantity: "2", unit: "tbsp" },
            { name: "Fresh coriander leaves", quantity: "2", unit: "tbsp" },
            { name: "Fresh mint leaves", quantity: "8-9", unit: "N/A" },
            { name: "Browned Onions", quantity: "1", unit: "cup" },
            { name: "Clarified butter (ghee)", quantity: "3-4", unit: "tbsp" },
            { name: "Screwpine water", quantity: "2", unit: "tsp" }
        ],
        instructions: [
            { number: 1, step: "Heat oil and butter in a non-stick pan." },
            { number: 2, step: "Add green chilies, Garam masala and sauté for a minute." },
            { number: 3, step: "Add ginger-garlic paste, mix and sauté for a minute." },
            { number: 4, step: "Add chopped tomato and mix well." },
            { number: 5, step: "Add chili powder, mix, cover, and cook for 8-10 minutes." },
            { number: 6, step: "Add 1 teaspoon garam masala powder, dried fenugreek leaves and salt, mix well and cook for 2-3 minutes." },
            { number: 7, step: "Add chicken pieces and mix well." },
            { number: 8, step: "Add cream and mix well." },
            { number: 9, step: "Spread rice over the chicken, top with some chopped coriander leaves, mint leaves, remaining garam masala powder, and half the browned onions." },
            { number: 10, step: "Spread the remaining rice, add remaining browned onions." },
            { number: 11, step: "Drizzle ghee and screw pine water." },
            { number: 12, step: "Cover and cook on low heat for 15-20 minutes." }
        ],
        category: "Rice",
        img: "http://www.pakistanichefrecipes.com/wp-content/uploads/2021/05/Butter-Chicken-Biryani.jpg",
        public: true,
        chef: "Abida Baloch"
    },

    {
        id: 28,
        servings: 1,
        recipeName: "Anda Paratha",
        timeNeeded: "",
        ingredients: [
        { name: "Flour dough", quantity: "2", unit: "parathas" },
        { name: "Eggs", quantity: "2", unit: "N/A" },
        { name: "Onion", quantity: "1", unit: "N/A" },
        { name: "Green chilies", quantity: "2", unit: "N/A" },
        { name: "Green coriander", quantity: "2", unit: "tbsp" },
        { name: "Cumin powder", quantity: "1/2", unit: "tsp" },
        { name: "Red chili powder", quantity: "1/2", unit: "tsp" },
        { name: "Salt", quantity: 0, unit: "To taste" },
        { name: "Ghee", quantity: 0, unit: "As required" }
        ],
        instructions: [
        { number: 1, step: "Mix eggs, chopped onion, chopped green chilies, green coriander, cumin powder, red chili powder, and salt in a bowl." },
        { number: 2, step: "Make a paratha; put it on a pan, then flip the side and pour half egg mixture on top of the paratha with a little ghee." },
        { number: 3, step: "Now turn the paratha to the other side and fry it with ghee." }
        ],
        category: "Bread",
        img: "https://www.masala.tv/wp-content/uploads/2015/07/Anda-Paratha.jpg",
        public: true,
        chef: "Shireen Anwar"
    },

    {
        id: 29,
        servings: 4,
        recipeName: "Mooli Ka Paratha",
        timeNeeded: 30,
        ingredients: [
        { name: "Radish", quantity: "1", unit: "N/A" },
        { name: "Red Chili Powder", quantity: "1", unit: "tsp" },
        { name: "Cumin Seeds", quantity: "1", unit: "tsp" },
        { name: "Ginger", quantity: "1", unit: "inch-piece" },
        { name: "Coriander seeds", quantity: "1", unit: "tsp" },
        { name: "Green Chilies", quantity: "1", unit: "tbsp" },
        { name: "Green Coriander", quantity: "2", unit: "tbsp" },
        { name: "Salt", quantity: 0, unit: "A pinch" },
        { name: "Ghee", quantity: 0, unit: "To fry" }
        ],
        instructions: [
        { number: 1, step: "Knead a smooth dough and let it rest for 15 mins." },
        { number: 2, step: "Grate the radish and squeeze the grated radish in a muslin cloth to remove excess water." },
        { number: 3, step: "In a bowl, add the squeezed radish, red chili powder, cumin seeds, crushed ginger, coriander seeds, green chilies, and green coriander. Mix well to make the stuffing." },
        { number: 4, step: "Take some dry flour in a plate for dusting/coating." },
        { number: 5, step: "Knead the dough again and take out two small dough balls, giving them a round shape." },
        { number: 6, step: "Press each ball slightly between your palms to give it a flattened shape and coat it with dry flour." },
        { number: 7, step: "Roll out one dough ball into a round shape with the help of a rolling pin and set it aside." },
        { number: 8, step: "Roll out the second dough ball and put the prepared stuffing in the center. Sprinkle a pinch of salt and place another round dough on top." },
        { number: 9, step: "Seal the edges and roll it out carefully with the help of a rolling pin." },
        { number: 10, step: "Heat a griddle and place the rolled paratha on it. Fry from both sides with ghee until golden brown and cooked." }
        ],
        category: "Bread",
        img: "https://shireenanwer.com/wp-content/uploads/2022/11/Untitled-design-12-1.png",
        public: true,
        chef: "Shireen Anwar"
    },

    {
        id: 30,
        servings: 6,
        recipeName: "Garlic Naan",
        timeNeeded: 40,
        ingredients: [
        { name: "plain flour", quantity: "2 + 1/2", unit: "cup" },
        { name: "yogurt", quantity: "4", unit: "tbsp" },
        { name: "ghee", quantity: "2", unit: "tbsp" },
        { name: "fresh coriander leaves", quantity: "1", unit: "tbsp" },
        { name: "honey", quantity: "1", unit: "tbsp"},
        { name: "instant yeast", quantity: "1 + 1/2", unit: "tsp" },
        { name: "salt", quantity: "1", unit: "tsp" },
        { name: "garlic", quantity: "1", unit: "tsp" },
        { name: "onion seeds", quantity: "1", unit: "tsp" },
        { name: "Melted ghee ", quantity: 0, unit: "For brushing" }
        ],
        instructions: [
        { number: 1, step: "Preheat the oven to 230 degrees C." },
        { number: 2, step: "Place a baking tray in the oven to heat." },
        { number: 3, step: "In a large bowl, sieve together flour and salt." },
        { number: 4, step: "Add yeast, whipped yogurt, melted ghee, chopped garlic, onion seeds, and fresh coriander to the flour." },
        { number: 5, step: "Knead a soft dough with water." },
        { number: 6, step: "Divide the dough into 3 equal balls." },
        { number: 7, step: "Cover the dough balls with oiled plastic and leave them to rise for 10 minutes." },
        { number: 8, step: "Roll each ball into a tear drop shape about 10 inches long." },
        { number: 9, step: "Place the naan on the hot baking tray." },
        { number: 10, step: "Bake for 5 minutes or until the top is slightly brown." },
        { number: 11, step: "Brush the naan with melted ghee or butter." }
        ],
        category: "Bread",
        img: "https://www.pakistanichefrecipes.com/wp-content/uploads/2019/04/garlic-naan.jpg",
        public: true,
        chef: "Shireen Anwar"
    }
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