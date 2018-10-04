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

db = firebase.database();


// create test data in firebase
function createTestData() {
    writeUserData(0, "Larry", "larry@gmail.com", "Atlanta", "Georgia");
    writeUserData(1, "Moe", "moe@gmail.com", "Atlanta", "Georgia");
    writeUserData(2, "Curly", "curly@gmail.com", "Atlanta", "Georgia");

    writeRestaurantData(0, "", "Taqueria del Sol", "", "", "Atlanta", "30033", "Mexican");
    writeRestaurantData(1, "", "Sapporo de Napoli", "", "", "Atlanta", "30033", "Italian");
    writeRestaurantData(2, "", "Grindhouse Killer Burgers", "", "", "Atlanta", "30033", "American");

    writeDishData(0, "beef taco supreme", 0, 2, 1, 1, 2, 2, 2, 5, "");
    writeDishData(1, "cheese pizza", 1, 2, 1, 4, 2, 1, 2, 3, "");
    writeDishData(2, "cheeseburger", 2, 2, 2, 3, 1, 1, 1, 4, "");

    writeRatingData(0, 0, 0, "Awesome Tacos!", 1, 1, 2, 2, 1, 4, "");
    writeRatingData(1, 1, 1, "Best Pizza in Decatur!!", 1, 2, 3, 1, 1, 5, "");
    writeRatingData(2, 2, 2, "Burgers are better than FarmBurger and shakes too!", 1, 2, 2, 2, 1, 4, "");
}

function writeUserData(userId, name, email, city, state) {
    db.ref('users/' + userId).set({
        name,
        email,
        city,
        state,
    });
}

function writeRatingData(ratingId, dishId, userId, text, sourScale, sweetScale, spicyScale,
    saltyScale, umamiScale, rating, image) {
    db.ref('ratings/' + ratingId).set({
        dishId,
        userId,
        text,
        sourScale,
        sweetScale,
        spicyScale,
        saltyScale,
        umamiScale,
        rating,
        image
    });
}

function writeRestaurantData(restaurantId, zumatoId, name, address, locality, city, zipCode, cuisine) {
    db.ref('restaurants/' + restaurantId).set({
        zumatoId,
        name,
        address,
        locality,
        city,
        zipCode,
        cuisine
    });
}

function writeDishData(dishId, name, restaurantId, price, avgSourScale, avgSweetScale, avgSpicyScale,
    avgSaltyScale, avgUmamiScale, avgRating, image) {
    db.ref('dishes/' + dishId).set({
        name,
        restaurantId,
        price,
        avgSourScale,
        avgSweetScale,
        avgSpicyScale,
        avgSaltyScale,
        avgUmamiScale,
        avgRating,
        image
    });
}

function getTopX(recordsToReturn) {
    let dishes = db.ref("dishes");
    let restaurants = db.ref("restaurants");

    // let topX = [];

    // get the top x dishes and then push them into the topX array (by dishId)
    dishes.orderByChild("avgRating").limitToLast(recordsToReturn).on("child_added", function (snapshot) {
        console.log(snapshot.ref.key);
        const keyValue = snapshot.ref.key;
        // topX.push(keyValue);

        dishes.child("/" + keyValue).once("value", function (dishesSnapshot) {
            restaurants.child("/" + dishesSnapshot.val().restaurantId).once('value', function (restaurantSnapshot) {

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

let i = 1;
    let newId =``;
    let expandedToggle = "true";
function createTile(dishId, dishName, restaurantId, restaurantName, avgRating, dishImage, dishPrice) {

    console.log(i);
    console.log(expandedToggle);

    switch (i) {
        case 1: 
        newId = "One";
        break;
        case 2: 
        newId = "Two";
        break;
        case 3:
        newId = "Three";
        break;
        case 4:
        newId = "Four";
        break;
        case 5:
        newId = "Five";
        break;
        case 6:
        newId = "Six";
        break;
        default:
        break;
    } 
        console.log(newId);
        var accordionDiv = (`accordion${i}`);
        var divId = (`collapse${newId}`);
        var headId = (`heading${newId}`);
        var targetDiv = (`#collapse${newId}`);
        console.log(divId);
        console.log(headId);
        console.log (targetDiv);
        console.log("accordion", accordionDiv);

    $(".tile-div").prepend(
`
<div class="${accordionDiv}" id="accordionExample">

    <div class="card">
        <div class="card-header" id="headingOne">
            <h5 class="mb-0">
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="${targetDiv}"
                    aria-expanded="${expandedToggle}" aria-controls="${divId}">
                    <div class="dish-tile" id="${dishId}" restaurant="${restaurantName}">
                        <img class="dish-tile-img" src="${dishImage}">
                        <span class="dish-tile-name">&nbsp &nbsp ${dishName}</span>
                        <span class="dish-tile-restaurant">&nbsp &nbsp &nbsp &nbsp ${restaurantName}</span>
                        <span class="dish-tile-rating">&nbsp &nbsp &nbsp &nbsp ${avgRating}</span>
                        <span class="dish-tile-price">&nbsp &nbsp &nbsp &nbsp ${getPrice(dishPrice)}</span>
                    </div>
                </button>
            </h5>
        </div>

        <div id="${divId}" " class=" collapse show" aria-labelledby="${headId}" data-parent="#accordionExample">
            <div class="card-body">
                Dish Data Here
            </div>
        </div>
    </div>
</div>
`
    )
i++
expandedToggle = "false";
console.log(expandedToggle);
console.log("after prepend " + i);
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
$(document).ready(function () {

    /* following line calls the function which adds test data.
        do not uncomment unless you want to add test data
        back to firebase
    */
    // createTestData();

    // get top 20 records by average rating
    getTopX(20);


});

// on click of search button, determine if dish name contains search string
$("#search-btn").on("click", function () {

    // empty screen of existing results
    $(".tile-div").empty();

    // capture search string
    const searchInput = $("#search-input").val();
    console.log(searchInput);

    var dishes = db.ref('dishes');
    var restaurants = db.ref('restaurants');

    // for each dish in order of avgRating...
    dishes.orderByChild("avgRating").on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            // if dish name contains search string, display results on screen
            if (childSnapshot.val().name.includes(searchInput)) {
                console.log(childSnapshot.val().name);
                const keyValue = childSnapshot.ref.key;

                dishes.child("/" + keyValue).once('value', function (dishesSnapshot) {
                    restaurants.child("/" + dishesSnapshot.val().restaurantId).once('value', function (restaurantSnapshot) {
                        /* console.log("dishId: ", keyValue);
                        console.log("dishName: ", dishesSnapshot.val().name);
                        console.log("restaurantId: ", dishesSnapshot.val().restaurantId);
                        console.log("restaurantName: ", restaurantSnapshot.val().name);
                        console.log("image: ", dishesSnapshot.val().image);
                        console.log("cost: ", dishesSnapshot.val().price); */

                        createTile(keyValue,
                            dishesSnapshot.val().name,
                            dishesSnapshot.val().restaurantId,
                            restaurantSnapshot.val().name,
                            dishesSnapshot.val().avgRating,
                            dishesSnapshot.val().image,
                            dishesSnapshot.val().price);
                    });
                });
            } else {
                // add message if no search results are found and show button to add new rating for dish
            };
        });
    });

    // temporary spot for ajax call to Zomato APi to test query retrieval
    // Atlanta, GA: id - 288, country_id = 216, state_id = 78
    const cityURL = "https://developers.zomato.com/api/v2.1/cities?q=atlanta&count=5&apikey=15f74e22d1ba3367c6e02399a5e343f4";

    $.ajax({
        url: cityURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    });

    // searching for restaurants using Atlanta city_id (288) and string ("leon") in restaurant name
    const restaurantURL = "https://developers.zomato.com/api/v2.1/search?entity_id=288&q=leon&count=3&apikey=15f74e22d1ba3367c6e02399a5e343f4";

    $.ajax({
        url: restaurantURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    });

});