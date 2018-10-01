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
    writeUserData(0, "Larry", "larry@gmail.com", "30030");
    writeUserData(1, "Moe", "moe@gmail.com", "30030");
    writeUserData(2, "Curly", "curly@gmail.com", "30030");

    writeRestaurantData(0, "", "Taqueria del Sol", "30030", "Mexican");
    writeRestaurantData(1, "", "Sapporo de Napoli", "30030", "Italian");
    writeRestaurantData(2, "", "Grindhouse Killer Burgers", "30030", "American");

    writeDishData(0, "taco", 0, 2, 1, 1, 2, 2, 2, 5, "");
    writeDishData(1, "pizza", 1, 2, 1, 4, 2, 1, 2, 3, "");
    writeDishData(2, "burger", 2, 2, 2, 3, 1, 1, 1, 4, "");

    writeRatingData(0, 0, 0, "Awesome Tacos!", 1, 1, 2, 2, 1, 4, "");
    writeRatingData(1, 1, 1, "Best Pizza in Decatur!!", 1, 2, 3, 1, 1, 5, "");
    writeRatingData(2, 2, 2, "Burgers are better than FarmBurger and shakes too!", 1, 2, 2, 2, 1, 4, "");
}

function writeUserData(userId, name, email, zipCode) {
    firebase.database().ref('users/' + userId).set({
        name: name,
        email: email,
        zipCode : zipCode
    });
}

function writeRatingData(ratingId, dishId, userId, text, sourScale, sweetScale, spicyScale,
                       saltyScale, umamiScale, rating, image) {
    firebase.database().ref('ratings/' + ratingId).set({
        dishId: dishId,
        userId: userId,
        text: text,
        sourScale: sourScale,
        sweetScale: sweetScale,
        spicyScale: spicyScale,
        saltyScale: saltyScale,
        umamiScale: umamiScale,
        rating: rating,
        image: image
    });
}

function writeRestaurantData(restaurantId, zumatoId, name, zipCode, cuisine) {
    firebase.database().ref('restaurants/' + restaurantId).set({
        zumatoId: zumatoId,
        name: name,
        zipCode : zipCode,
        cuisine: cuisine
    });
}

function writeDishData(dishId, name, restaurantId, price, avgSourScale, avgSweetScale, avgSpicyScale,
                        avgSaltyScale, avgUmamiScale, avgRating, image) {
    firebase.database().ref('dishes/' + dishId).set({
        name: name,
        restaurantId: restaurantId,
        price: price,
        avgSourScale: avgSourScale,
        avgSweetScale: avgSweetScale,
        avgSpicyScale: avgSpicyScale,
        avgSaltyScale: avgSaltyScale,
        avgUmamiScale: avgUmamiScale,
        avgRating: avgRating,
        image: image
    });
}

function getTopX(recordsToReturn){
    let dishes = firebase.database().ref("dishes");
    let restaurants = firebase.database().ref("restaurants");

    let topX = [];

    // get the top x dishes and then push them into the topX array (by dishId)
    dishes.orderByChild("avgRating").limitToLast(recordsToReturn).on("child_added", function(snapshot) {
        topX.push(snapshot.ref.key);
        console.log(snapshot.ref.key);
        let keyValue = snapshot.ref.key;

        dishes.child("/" + keyValue).once("value", function(dishesSnapshot) {
            restaurants.child("/" + dishesSnapshot.val().restaurantId).once('value', function(restaurantSnapshot) {

                /*console.log("dishId: ", keyValue);
                console.log("dishName: ", dishesSnapshot.val().name);
                console.log("restaurantId: ", dishesSnapshot.val().restaurantId);
                console.log("restaurantName: ", restaurantSnapshot.val().name);
                console.log("image: ", dishesSnapshot.val().image);
                console.log("cost: ", dishesSnapshot.val().price);*/

                createTile(keyValue,
                    dishesSnapshot.val().name,
                    dishesSnapshot.val().restaurantId,
                    restaurantSnapshot.val().name,
                    dishesSnapshot.val().avgRating, 
                    dishesSnapshot.val().image,
                    dishesSnapshot.val().price);

            });
        });
    });
}

function createTile(dishId, dishName, restaurantId, restaurantName, avgRating, dishImage, dishPrice) {
    let newTile = $("<div>")
        .attr("class", "dish-tile")
        .attr("id", dishId);

    let image = $("<img>")
        .attr("class", "dish-tile-img")
        .attr("src", dishImage);
    newTile.append(image);

    let name = $("<div>")
        .attr("class", "dish-tile-name")
        .text(dishName);
    newTile.append(name);

    let restaurant = $("<div>")
        .attr("class", "dish-tile-restaurant")
        .text(restaurantName);
    newTile.append(restaurant);

    let rating = $("<div>")
        .attr("class", "dish-tile-rating")
        .text(avgRating);
    newTile.append(rating);

    let price = $("<div>")
        .attr("class", "dish-tile-price")
        .text(getPrice(dishPrice));
    newTile.append(price);

    $(".tile-div").append(newTile);
}

function getPrice(price) {
    let ratingValue = "";

    switch (price) {
        case 1:
            ratingValue = "$";
            break;
        case 2:
            ratingValue = "$$";
            break;
        case 3:
            ratingValue = "$$$";
            break;
        case 4:
            ratingValue = "$$$$";
            break;
        default:
            break;
    };
    return ratingValue;
}

// when page loads
$(document).ready(function(){

    /* following line calls the function which adds test data.
        do not uncomment unless you want to add test data
        back to firebase
    */
    //createTestData();

    // get top 20 records by average rating
    getTopX(20);


});

