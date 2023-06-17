# Culinary Explorer
This is a recipe app that aims to make cultural recipes and holidays accessible to users. The app provides a simple and user-friendly interface for discovering recipes from various cultures and staying informed about cultural holidays around the world. 


## Getting Started

To get started with the app, follow these steps:

1. Clone the repository
2. Open the terminal and navigate to the "finalwork-recipeapp" directory.
3. Install the required npm packages by running the command: `npm install`.
4. Register for the following APIs to obtain API keys:
   - [Spoonacular Food API](https://spoonacular.com/food-api)
   - [Calendarific API](https://calendarific.com/api-documentation)
5. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/u/0/) and link a web app to it (click on '</>').
- Copy the Firebase configuration code that looks like this:
     ```
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
       measurementId: "YOUR_MEASUREMENT_ID"
     };
     ```
6. Create a `.env` file in the project root and add the following information:
```
RECIPES_API_KEY={Spoonacular api key}
FIREBASE_API_KEY={Firebase api key}
FIREBASE_AUTH_DOMAIN={Firebase authDomain}
FIREBASE_PROJECT_ID={Firebase projectId}
FIREBASE_STORAGE_BUCKET={Firebase storageBucket}
FIREBASE_MESSAGING_SENDER_ID={Firebase messagingSenderId}
FIREBASE_APP_ID={Firebase appId}
FIREBASE_MEASUREMENT_ID={Firebase measurementId}
HOLIDAYS_API_KEY={Calendarific api key}
```

7. Go back to Firebase and open Cloud Firestore. Create a database.
8. Update the Firestore security rules by changing "false" to "true" in the "rules" section.
9. Create the following collections in the "data" section:
- **countries**: Add the countries from which you want to retrieve holidays.
  - Each document should contain the fields "country" (name of the country) and "countryCode" (2-letter country code).
  - Refer to the [list of supported countries](https://calendarific.com/supported-countries).
- **cultures**: Define the filters for cultures.
  - Each document should contain the field "culture".
  - Refer to the [list of accepted cultures](https://spoonacular.com/food-api/docs#Cuisines).
- **dishTypes**: Define the filters for dish types.
  - Each document should contain the field "dishType".
  - Refer to the [list of accepted dish types](https://spoonacular.com/food-api/docs#Meal-Types).
- **didyouknows**: Store interesting facts about cultural eating habits.
  - Each document should contain the field "didYouKnow".
  - You can gather information from various sources, such as:
    - [Kuali](https://www.kuali.com/kitchen-inspirations/7-interesting-eating-habits-from-different-cultures/)
    - [ParentCircle](https://www.parentcircle.com/interesting-food-customs-around-the-world/article)

10. Once all the steps are completed, the app should be ready to run. To start the app:
 - If using an Android emulator or a device connected to your computer, run the command: `npm run android`.
 - If using a device not connected to your computer, follow these steps:
   - Download and open the [Expo Go App](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - Run the command: `npm start`.
   - Scan the QR code using the camera in Expo Go.

Feel free to explore the app and enjoy discovering cultural recipes and holidays!