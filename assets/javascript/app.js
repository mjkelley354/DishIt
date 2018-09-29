// Initialize Firebase
const config = {
    apiKey: "AIzaSyBBWDqlnV9uzhCOaKCR9TT1VAeESrSukRs",
    authDomain: "dish-it.firebaseapp.com",
    databaseURL: "https://dish-it.firebaseio.com",
    projectId: "dish-it",
    storageBucket: "dish-it.appspot.com",
    messagingSenderId: "378551873329"
};

firebase.initializeApp(config);

database = firebase.database();


// create test data in firebase
function createTestData() {
    database.ref("/users").push({
        name: "Larry",
        id: 0
    });
    database.ref("/users").push({
        name: "Moe",
        id: 1
    });
    database.ref("/users").push({
        name: "Curly",
        id: 2
    });
    database.ref("/restaurants").push({
        name: "Taqueria del Sol",
        id: 0
    });
    database.ref("/dishes").push({
        name: "taco",
        id: 0,
        restaurant: 0,
        cuisine: "Mexican",
        cost: 2,
        image: ""
    });
    database.ref("/ratings").push({
        text: "Awesome Tacos!",
        id: 0,
        userId: 0,
        dishId: 0,
        rating: 4,
        sourScale: 1,
        sweetScale: 1,
        spicyScale: 2,
        saltyScale: 2,
        image: ""
    });
    database.ref("/restaurants").push({
        name: "Sapporo de Napoli",
        id: 1
    });
    database.ref("/dishes").push({
        name: "pizza",
        id: 1,
        restaurant: 1,
        cuisine: "Italian",
        cost: 2,
        image: ""
    });
    database.ref("/ratings").push({
        text: "Best Pizza in Decatur!!",
        id: 1,
        userId: 1,
        dishId: 1,
        rating: 5,
        sourScale: 1,
        sweetScale: 2,
        spicyScale: 3,
        saltyScale: 1,
        image: ""
    });
    database.ref("/restaurants").push({
        name: "Grindhouse Killer Burgers",
        id: 2
    });
    database.ref("/dishes").push({
        name: "burger",
        id: 2,
        restaurant: 2,
        cuisine: "American",
        cost: 2,
        image: ""
    });
    database.ref("/ratings").push({
        text: "Burgers are better than FarmBurger and shakes too!",
        id: 3,
        userId: 3,
        dishId: 3,
        rating: 4,
        sourScale: 1,
        sweetScale: 2,
        spicyScale: 2,
        saltyScale: 2,
        image: ""
});
}


// when page loads
$(document).ready(function(){

    /* following line calls the function which adds test data.
        do not uncomment unless you want to add test data
        back to firebase
    */
    //  createTestData();
});

