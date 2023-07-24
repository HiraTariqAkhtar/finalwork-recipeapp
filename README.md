# Desi Delights
<img src="./assets/recipeApp/icon.png" alt="App Logo" width="200">

This is a recipe app that aims to make Pakistani recipes, places and holidays accessible to users. The app provides a simple and user-friendly interface for discovering Pakistani recipes, restaurants and supermarkets and staying informed about Pakistani holidays. 

**Note**: The app is primarily designed for Android smartphones. Some features may not work properly when running the app on an iPhone.

## Installation

To get started with the app, run the following commands in your terminal:

1. Clone the repository: `git clone https://github.com/HiraTariqAkhtar/finalwork-recipeapp.git`
2. Navigate to the "finalwork-recipeapp" directory: `cd finalwork-recipeapp`
3. Install the required npm packages: `npm install`.
  
## Retrieve data

1. Register for the following APIs to obtain API keys:
  - [Calendarific API](https://calendarific.com/api-documentation)
  - [Location API](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/quick-start.html)
2. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/u/0/) and link a web app to it (click on '</>').
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
3. Create a `.env` file in the project root and add the following information:
    ```
    FIREBASE_API_KEY={Firebase api key}
    FIREBASE_AUTH_DOMAIN={Firebase authDomain}
    FIREBASE_PROJECT_ID={Firebase projectId}
    FIREBASE_STORAGE_BUCKET={Firebase storageBucket}
    FIREBASE_MESSAGING_SENDER_ID={Firebase messagingSenderId}
    FIREBASE_APP_ID={Firebase appId}
    FIREBASE_MEASUREMENT_ID={Firebase measurementId}
    HOLIDAYS_API_KEY={Calendarific api key}
    LOCATION_API_KEY={HERE geocoding api key}
    ```

## Running the application
After completing all these steps, the app should be run-ready. All you need to do now is start the app on your smartphone or an emulator/simulator.

There are 2 ways to do this:
- Start the app on an Android emulator / iOS simulator or on your smartphone connected to your computer:
  - Run the command `npm run android` / `npm run ios`

- Start the app on a smartphone not connected to your computer:
  - Download the Expo Go app:
    - [Expo Go for Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
    - [Expo Go for iOS](https://apps.apple.com/us/app/expo-go/id982107779)
  - Run the command `npm start`
  - Scan the QR code or manually enter the URL
     - QR:
       - Android: using the camera in Expo Go
       - iOS: using the Camera app
         - **Note**: If the QR code is not recognized, manually enter the URL.
     - URL: 
       - Click on "Enter URL manually" and enter the URL that appears just below the QR code.
