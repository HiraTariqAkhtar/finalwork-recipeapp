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
}