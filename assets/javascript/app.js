// Initialize Firebase ********************************************************************************
const config = {
    apiKey: "AIzaSyBBWDqlnV9uzhCOaKCR9TT1VAeESrSukRs",
    authDomain: "dish-it.firebaseapp.com",
    databaseURL: "https://dish-it.firebaseio.com",
    projectId: "dish-it",
    storageBucket: "dish-it.appspot.com",
    messagingSenderId: "378551873329"
};

firebase.initializeApp(config);

const db = firebase.database();
const storageService = firebase.storage();
const storageRef = storageService.ref();

// global variables
let selectedFile;
let userId = "";
let userName = "";
let userEmail = "";
let userCity = "";
let userState = "";
let dishArray = [];

// google map object
let map;
let mapPins = [];

// HOME PAGE *************************************************************************

if ($("body").attr("data-title") === "index-page") { // functions run on load of index-page

    $(document).ready(() => {
        //createTestData(); // do not uncomment unless you want to add test data back to firebase

        getTopX(20); // get top 20 records by average rating

        readLocalStorage(); // function to get user info from local storage

        //initMap();

    });
};

function readLocalStorage() {
    // get user info from localstorage if it exists
    userId = localStorage.getItem("dish-it-user-id");
    userName = localStorage.getItem("dish-it-user");
    userEmail = localStorage.getItem("dish-it-email");
    userCity = localStorage.getItem("dish-it-city");
    userState = localStorage.getItem("dish-it-state");

    // if we don't have data in local storage then user doesn't exists, so show the add user modal
    if (userId == null || userName == null || userEmail == null || userCity == null || userState == null) {
        $(".user-modal").modal('show');
    }
};

function getTopX(recordsToReturn) {
    const dishes = db.ref("dishes");
    const restaurants = db.ref("restaurants");

    $(".tile-div").append(
        `
            <div class="card card-body">
            <table class="table text-center">
                <tbody id="dish-list">
                </tbody>
            </table>
            </div>
        `
    );

    // get the top x dishes and then push them into the topX array (by dishId)
    dishes.orderByChild("avgRating").limitToLast(recordsToReturn).on("child_added", function (snapshot) {
        const keyValue = snapshot.ref.key;

        dishes.child("/" + keyValue).once("value", function (dishesSnapshot) {
            restaurants.child("/" + dishesSnapshot.val().restaurantId).once('value', function (restaurantSnapshot) {

                newDish(keyValue,
                    dishesSnapshot.val().name,
                    dishesSnapshot.val().restaurantId,
                    restaurantSnapshot.val().name,
                    dishesSnapshot.val().avgRating,
                    dishesSnapshot.val().avgSourScale,
                    dishesSnapshot.val().avgSweetScale,
                    dishesSnapshot.val().avgSpicyScale,
                    dishesSnapshot.val().avgSaltyScale,
                    dishesSnapshot.val().avgUmamiScale,
                    dishesSnapshot.val().image,
                    dishesSnapshot.val().price,
                    0,
                    0,
                    "",
                    "",
                );

                createTile(keyValue,
                    dishesSnapshot.val().name,
                    dishesSnapshot.val().restaurantId,
                    restaurantSnapshot.val().name,
                    dishesSnapshot.val().avgRating,
                    dishesSnapshot.val().image,
                    dishesSnapshot.val().price
                );

                const restaurantLatLong = {
                    lat: restaurantSnapshot.val().lat,
                    lng: restaurantSnapshot.val().long,
                };
                addToMap(restaurantSnapshot.val().name, restaurantLatLong);
            });
        });
    });
    console.log(dishArray);
};

function newDish(dishId, dishName, restaurantId, restaurantName, avgRating, avgSour, avgSweet, avgSpicy, avgSalty, avgUmami,
    imgUrl, price, lat, long, address, phone) {
    const theDish = {
        dishId: dishId,
        dishName: dishName,
        restaurantId: restaurantId,
        restaurantName: restaurantName,
        avgRating: avgRating,
        avgSour: avgSour,
        avgSweet: avgSweet,
        avgSpicy: avgSpicy,
        avgSalty: avgSpicy,
        avgUmami: avgUmami,
        imgUrl: imgUrl,
        price: price,
        lat: lat,
        long: long,
        address: address,
        phone: phone,
    }

    dishArray.push(theDish);
};

// use this to populate results on screen directly from firebase - using array will throw errors due to processing time
let i = 0;

function createTile(dishId, dishName, restaurantId, restaurantName, avgRating, dishImage, dishPrice) {
    $("tbody").prepend(
        `
            <tr class="dish-tile" id="heading${i}" dish-id-value="${dishId}" data-toggle="collapse" data-target="#collapse${i}">
                <td class="p-1">
                    <div class="dish-tile-img-box">
                        <img class="dish-tile-img" src="${dishImage}">
                    </div>        
                </td>
                <td class="align-middle">
                    <div class="row">
                        <h5 class="col-xs-12 col-md-6 m-0">${dishName}</h5>
                        <h5 class="col-xs-12 col-md-6 m-0">@${restaurantName}</h5>
                    </div>
                </td>
                <td class="align-middle rating-icons p-0">${getRating(avgRating)}<br><span style="color:black;">${getPrice(dishPrice)}</span>
                </td>
            </tr>
            <tr>
                <td colspan=5 class="collapse" id="collapse${i}">placeholder</td>
            </tr>
        `
    );
    i++;
};

// TODO: use this function later for populating filtered results
function createTiles(dishArray) {
    console.log("I'm creating tiles");
    console.log(dishArray);
    // FIX: this section below is not working to populate tiles after the search btn is clicked; disabled or now
    for (let i in dishArray) {
        console.log(dishArray[i].dishName);
        $("tbody").prepend(
            `
                <tr class="dish-tile" id="heading${i}" dish-id-value="${dishArray[i].dishId}" data-toggle="collapse" data-target="#collapse${i}">
                    <td><img class="dish-tile-img" src="assets/images"></td>
                    <td class="align-middle"><h6>${dishArray[i].dishName}<br>@${dishArray[i].restaurantName}</h6></td>
                    <td class="align-middle">${getRating(dishArray[i].avgRating)}<br>${getPrice(dishArray[i].dishPrice)}</td>
                </tr>
                <tr>
                    <td colspan=5 class="collapse" id="collapse${i}">placeholder</td>
                </tr>
            `
        );
    }
};

$(document).on("click", ".dish-tile", function () {

    console.log($(this));
    console.log($(this).attr("dish-id-value"));
    let dishId = ($(this).attr("dish-id-value"));
    let dataTargetId = ($(this).attr("data-target"));
    $(`${dataTargetId}`).empty();

    console.log(dishId);
    console.log(dataTargetId);
    $(".collapse").collapse('hide');

    var dishes = db.ref('dishes');
    var restaurants = db.ref('restaurants');

    let avgSaltyScale = "";
    let avgSourScale = "";
    let avgSpicyScale = "";
    let avgSweetScale = "";
    let avgUmamiScale = "";
    let name = "";
    let address = "";
    let city = "";
    let state = "";
    let zipCode = "";

    dishes.child("/" + dishId).once('value', function (dishesSnapshot) {
        restaurants.child("/" + dishesSnapshot.val().restaurantId).once('value', function (restaurantSnapshot) {

            avgSaltyScale = dishesSnapshot.val().avgSaltyScale;
            console.log("salty " + avgSaltyScale);
            avgSourScale = dishesSnapshot.val().avgSourScale;
            console.log("sour " + avgSourScale);
            avgSpicyScale = dishesSnapshot.val().avgSpicyScale;
            console.log("spicy " + avgSpicyScale);
            avgSweetScale = dishesSnapshot.val().avgSweetScale;
            console.log("sweet " + avgSweetScale);
            avgUmamiScale = dishesSnapshot.val().avgUmamiScale;
            console.log("umami " + avgUmamiScale);
            name = restaurantSnapshot.val().name;
            console.log("Restaurant Name " + name);
            address = restaurantSnapshot.val().address;
            console.log("Restaurant Address " + address);
            city = restaurantSnapshot.val().city;
            console.log("Restaurant City " + city);
            state = restaurantSnapshot.val().state;
            console.log("Restaurant State " + state);
            zipCode = restaurantSnapshot.val().zipCode;
            console.log("Restaurant Zip Code " + zipCode);
            $(`${dataTargetId}`).append(
                `<div class="card-body">
                    Salty: ${avgSaltyScale}
                     Sour: ${avgSourScale}
                     Spicy: ${avgSpicyScale}
                     Sweet: ${avgSweetScale}
                     Umami: ${avgUmamiScale}
                     Restaurant: ${name}
                     Address: ${address}
                     City: ${city}
                     State: ${state}
                     ZipCode: ${zipCode} </div>
                `
            );
        });
    });
});

function getPrice(price) {
    let priceValue = "";
    for (var i = 0; i < price; i++) {
        priceValue = priceValue.concat(`<i class="fas fa-dollar-sign"></i>`);
    };

    return priceValue;
}

function getRating(avgRating) {
    const stars = Math.floor(avgRating);
    let ratingValue = "";
    for (var i = 0; i < stars; i++) {
        ratingValue = ratingValue.concat('<i class="fas fa-star"></i>');
    }

    if (Math.round(avgRating * 2) / 2 - stars === 0.5) {
        ratingValue = ratingValue.concat(`<i class="fas fa-star-half"></i>`);
    }

    return ratingValue;
}

// FILTER FUNCTION ********************************************************************************

$(".filter-menu").on("click", function () {
    $(".filter-modal").modal('show');
    console.log('filter');
});

// SEARCH FUNCTION *********************************************************************************

// on click of search button, determine if dish name contains search string
$("#search-btn").on("click", function () {

    // empty screen of existing results
    $(".tile-div").empty();

    $(".tile-div").append(
        `
            <table class="w-100 rounded table text-center">
                <tbody id="dish-list">
                </tbody>
            </table>
        `
    );

    // capture search string
    const searchInput = $("#search-input").val();
    console.log(searchInput);

    var dishes = db.ref('dishes');
    var restaurants = db.ref('restaurants');
    let matches = 0;
    dishArray.length = 0;

    // for each dish in order of avgRating...
    dishes.orderByChild("avgRating").on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            // if dish name contains search string, display results on screen
            if (childSnapshot.val().name.includes(searchInput)) {
                matches++;

                console.log(childSnapshot.val().name);
                const keyValue = childSnapshot.ref.key;

                dishes.child("/" + keyValue).once('value', function (dishesSnapshot) {
                    restaurants.child("/" + dishesSnapshot.val().restaurantId).once('value', function (restaurantSnapshot) {

                        createTile(keyValue,
                            dishesSnapshot.val().name,
                            dishesSnapshot.val().restaurantId,
                            restaurantSnapshot.val().name,
                            dishesSnapshot.val().avgRating,
                            dishesSnapshot.val().image,
                            dishesSnapshot.val().price);

                        newDish(keyValue,
                            dishesSnapshot.val().name,
                            dishesSnapshot.val().restaurantId,
                            restaurantSnapshot.val().name,
                            dishesSnapshot.val().avgRating,
                            dishesSnapshot.val().avgSourScale,
                            dishesSnapshot.val().avgSweetScale,
                            dishesSnapshot.val().avgSpicyScale,
                            dishesSnapshot.val().avgSaltyScale,
                            dishesSnapshot.val().avgUmamiScale,
                            dishesSnapshot.val().image,
                            dishesSnapshot.val().price,
                            0,
                            0, "",
                            "",
                        );
                    });

                    const restaurantLatLong = {
                        lat: restaurantSnapshot.val().lat,
                        lng: restaurantSnapshot.val().long,
                    };
                    addToMap(restaurantSnapshot.val().name, restaurantLatLong);
                });
            };
        });
        console.log(matches);
        console.log(dishArray);
        // createTiles(dishArray); // this function is not working to populate screen
        // displays message if no search results returned
        if (matches === 0) {
            noResults();
        };
    });
});

// returns message if no search results returned.
// this section requires some UI work
function noResults() {
    $(".tile-div").append(
        `
            <h2 class="text-center block pt-5">No dishes match your search</h2>
            <p><i>Try searching a generic name of a dish (e.g. pizza) or an ingredient (e.g. cheese)</i></p>
            <div class="d-flex justify-content-center">
                <button class="btn btn-outline-success d-flex justify-content-center add-dish-btn" type="button">Rate a new dish!</button>
            </div>
        `
    );
};

$(".apply-filter").on("click", function () {
    // loop though each card
    $('.card').each(function (index, obj) {
        // if card properties not within filter criteria then hide card

    });
});

// USER DETAILS **************************************************************************
// save favorites to local storage
function saveFavorites() {
    localStorage.setItem("dish-it-user-id", userId);
    localStorage.setItem("dish-it-user", userName);
    localStorage.setItem("dish-it-email", userEmail);
    localStorage.setItem("dish-it-city", userCity);
    localStorage.setItem("dish-it-state", userState);
}

$(".save-user").on("click", function () {
    userName = $("#userName").val();
    userEmail = $("#userEmail").val();
    userCity = $("#userCity").val();
    userState = $("#userState").val();
    userId = writeUserData(userName, userEmail, userCity, userState);
    saveFavorites();
    $(".user-modal").modal('hide');
});

// MAP FUNCTIONS ***************************************************************************
$(".map-menu").on("click", function () {
    $(".map-modal").modal('show');
});

function addToMap(restaurauntName, position) {
    // add a marker
    let marker = new google.maps.Marker({
        position: position,
        map: map,
    });

    // add an info window which shows details of dish / restauraunt
    /* TODO: add additional content to "content" property with whatever we want to show on the infoWindow, content can take form of HTML
     */
    marker.info = new google.maps.InfoWindow({
        content: restaurauntName,
        map: map,
        position: position
    });

    // close the infoWindow as it will remain open by default
    marker.info.close();

    //add event listeners for mouseover and mouseout to show/hide the infoWindoow
    google.maps.event.addListener(marker, 'mouseover', function () {
        marker.info.open(map, marker);
    });
    google.maps.event.addListener(marker, 'mouseout', function () {
        marker.info.close();
    });
};

// initializes the map object
function initMap() {
    // The location of Atlanta
    console.log("initMap() triggered.");
    var atlanta = {
        lat: 33.753746,
        lng: -84.386330
    };

    map = new google.maps.Map(
        document.getElementById('map-canvas'), {
        center: atlanta,
        zoom: 10
    });

    // The marker, positioned at Atlanta
    //var marker = new google.maps.Marker({position: atlanta, map: map});
}

// resize the map to fit on the modal
$(".map-modal").on('show.bs.modal', function (event) {
    $("#location-map").css("width", "100%");
    $("#map_canvas").css("width", "100%");
});

// Trigger map resize event after modal shown
$(".map-modal").on('shown.bs.modal', function () {
    google.maps.event.trigger(map, "resize");
    myLatlng = new google.maps.LatLng(33.753746, -84.386330)
    map.setCenter(myLatlng);
});

// SLIDER SETTINGS ***********************************************************************
// changed all sliders to be on a scale of 1-5

function setValues(stepIncrease) {
    return function (event, ui) {
        var slider = $("#" + this.id);
        var currentValues = slider.slider("values");
        var step = slider.slider("option")["step"];
        // 2 - can be changed
        if (!(Math.abs(ui.values[0] - currentValues[0]) == stepIncrease * step || Math.abs(ui.values[1] - currentValues[1]) == stepIncrease * step)) {
            return false;
        };
        slider.slider("values", ui.values);
        var currentValues = slider.slider("values");
        $("#" + this.id + "-values").html(currentValues[0] + ' to ' + currentValues[1]);
    };
};

$(".slider-1-5").slider({
    range: true,
    min: 1,
    max: 5,
    step: 1,
    values: [1, 5],
    slide: setValues(1),
    create: function (event, ui) {
        var slider = $("#" + this.id);
        var currentValues = slider.slider("values");
        $("#" + this.id + "-values").html(currentValues[0] + ' to ' + currentValues[1]);
    }
});

// TEST DATA ************************************************************************
// create test data in firebase
function createTestData() {
    let larryId = writeUserData("Larry", "larry@gmail.com", "Atlanta", "Georgia");
    console.log("larryId: ", larryId);
    let moeId = writeUserData("Moe", "moe@gmail.com", "Atlanta", "Georgia");
    console.log("moeId: ", moeId);
    let curlyId = writeUserData("Curly", "curly@gmail.com", "Atlanta", "Georgia");
    console.log("curlyId: ", curlyId);

    let taqueriaDelSolId = writeRestaurantData("", "Taqueria del Sol", "", "Atlanta", "GA", "30033", 33.775990, -84.302140, "", "Mexican", 2);
    console.log("taqueriaDelSolId: ", taqueriaDelSolId);
    let sapporoId = writeRestaurantData("", "Sapori di Napoli", "", "Atlanta", "GA", "30033", 33.773480, -84.295350, "", "Italian", 2);
    console.log("sapporoId: ", sapporoId);
    let grindhouseId = writeRestaurantData("", "Grindhouse Killer Burgers", "", "Atlanta", "30033", "GA", 33.772710, -84.296090, "", "American", 2);
    console.log("grindhouseId: ", grindhouseId);

    let tacoId = writeDishData("beef taco supreme", taqueriaDelSolId, 2, 1, 1, 2, 2, 2, 5, "https://firebasestorage.googleapis.com/v0/b/dish-it.appspot.com/o/images%2Fbeef-tacos.jpg?alt=media&token=c0f7b553-373f-4f0d-bea7-22cd524c1fe5", 1);
    console.log("tacoId: ", tacoId);
    let cheesePizzaId = writeDishData("cheese pizza", sapporoId, 2, 1, 4, 2, 1, 2, 3.60, "https://firebasestorage.googleapis.com/v0/b/dish-it.appspot.com/o/images%2Fcheese-pizza.jpg?alt=media&token=ced316ad-ab07-4146-b6ea-04f7e400980b", 1);
    console.log("cheesePizzaId: ", cheesePizzaId);
    let cheeseburgerId = writeDishData("cheeseburger", grindhouseId, 2, 2, 3, 1, 1, 1, 4.24, "https://firebasestorage.googleapis.com/v0/b/dish-it.appspot.com/o/images%2Fcheeseburger.jpg?alt=media&token=bbbf89f2-1d7a-4246-aed5-0f3b51883302", 1);
    console.log("cheeseburgerId: ", cheeseburgerId);

    let tacoRating = writeRatingData(tacoId, larryId, "Awesome Tacos!", 1, 1, 2, 2, 1, 4, "https://firebasestorage.googleapis.com/v0/b/dish-it.appspot.com/o/images%2Fbeef-tacos.jpg?alt=media&token=c0f7b553-373f-4f0d-bea7-22cd524c1fe5");
    console.log("tacoRating: ", tacoRating);
    let pizzaRating = writeRatingData(cheesePizzaId, moeId, "Best Pizza in Decatur!!", 1, 2, 3, 1, 1, 5, "https://firebasestorage.googleapis.com/v0/b/dish-it.appspot.com/o/images%2Fcheese-pizza.jpg?alt=media&token=ced316ad-ab07-4146-b6ea-04f7e400980b");
    console.log("pizzaRating: ", pizzaRating);
    let burgerRating = writeRatingData(cheeseburgerId, curlyId, "Burgers are better than FarmBurger and shakes too!", 1, 2, 2, 2, 1, 4, "https://firebasestorage.googleapis.com/v0/b/dish-it.appspot.com/o/images%2Fcheeseburger.jpg?alt=media&token=bbbf89f2-1d7a-4246-aed5-0f3b51883302");
    console.log("burgerRating: ", burgerRating);
}

function writeUserData(name, email, city, state) {
    let insertedData = db.ref('users/').push({
        name,
        email,
        city,
        state,
    });
    return insertedData.getKey();
}

function writeRatingData(dishId, userId, text, sourScale, sweetScale, spicyScale,
    saltyScale, umamiScale, rating, image) {
    let insertedData = db.ref('ratings/').push({
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
    return insertedData.getKey();
}

function writeRestaurantData(yelpId, name, address, city, state, zipCode, lat, long, phone, cuisine, price) {
    let insertedData = db.ref('restaurants/').push({
        yelpId,
        name,
        address,
        city,
        state,
        zipCode,
        lat,
        long,
        phone,
        cuisine,
        price,
    });
    return insertedData.getKey();
}

function writeDishData(name, restaurantId, price, avgSourScale, avgSweetScale, avgSpicyScale,
    avgSaltyScale, avgUmamiScale, avgRating, image, numRatings) {
    let insertedData = db.ref('dishes/').push({
        name,
        restaurantId,
        price,
        avgSourScale,
        avgSweetScale,
        avgSpicyScale,
        avgSaltyScale,
        avgUmamiScale,
        avgRating,
        image,
        numRatings,
    });
    return insertedData.getKey();
}

// ADD NEW DISH PAGE ************************************************************************

if ($("body").attr("data-title") === "newdish-page") {
    $(document).ready(function () {

        // TODO: trying to auto-populate state field on newdish.html - the below does not work
        /* const states = ["AL", "AK", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IA", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NE", "NH", "NV", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
    
        for (var i; i < states.length; i++) {
            const state = states[i];
            $("#state-input").append(
                `
                    <option value="${states[i]}">${states[i]}</option>
                `
            )
        } */

    });
};

// SELECT LOCATION AND RESTAURANT ***************************************************

// click button to find restaurant city, state, and restaurant name. Use an API call to YELP.
let rNameInput = "";
$("#find-restaurant").on("click", function () {
    const location = $("#city-input").val().trim() + ", " + $("#state-input").val().trim();
    rNameInput = $("#restaurant-input").val().trim();

    // initiate ajax call to yelp
    // TURN THIS BACK ON FOR REAL DATA CALLS - USE TESTING DATA BELOW FOR DEVELOPMENT
    // getRestaurant(location, rNameInput);

    // USING THIS FOR TESTING - GETTING DATA FROM LOCAL STORAGE
    const restaurants = JSON.parse(localStorage.getItem("restaurants"));
    console.log(restaurants);
    $("#restaurant-results").empty()
    for (var i in restaurants) {
        showRestOptions(restaurants[i], i);
    }

    // show restaurant results section
    $("#restaurant-results-view").collapse("show");
});

// get restaurant information from yelp
let matchingRestaurants = [];

function getRestaurant(location, rName) {
    const restaurantURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?` + $.param({
        term: rName,
        location: location,
        categories: "restaurants",
        limit: 3,
    });

    $.ajax({
        url: restaurantURL,
        method: "GET",
        headers: {
            'Authorization': 'Bearer lC3zgwezYWCKbJZW03Yepl4A52o_fhrqd9a1x0_MapVxItu97aAHOUOGfsRzDJswOWzWlaHv0zvw8keaePumFEkXJWyOgcTcLg7ekQOQ9skybUd_wy02lE3hnQy0W3Yx',
        }
    }).then(function (response) {
        $("#restaurant-results").empty()
            .removeClass("errorMessage");

        console.log(response);
        const restaurants = response.businesses;

        // parse response into variables (some of these may not be needed here -- delete later)      
        let matches = 0;
        for (let i in restaurants) {

            // only capture restaurant name if search string is included in some part of restaurant's name
            const rName = restaurants[i].name;
            if (rName.toLowerCase().includes(rNameInput.toLowerCase())) {
                matches++;
                console.log(`${rName} matches ${rNameInput}`);
                showRestOptions(restaurants[i], i);

                /* const id = restaurants[i].id;
                const price = restaurants[i].price;
                const location = restaurants[i].location;
                const phone = restaurants[i].display_phone;
                const restaurantLatLong = {
                    lat: restaurants[i].coordinates.latitude, 
                    lng: restaurants[i].coordinates.longitude,
                }; */

                // QUESTION FOR MIKE: I think the map should be rendered from the list of dishes on the first page
                // addToMap(rName, restaurantLatLong);
            };
        };

        if (matches === 0) {
            $("#restaurant-results").empty()
                .addClass("errorMessage")
                .text("No matches found. Try a different search.");
        }
        /* else if (matches > 1) {
                   $("#restaurant-results").empty()
                       .removeClass("errorMessage");
                   $("#restaurant-results-view").collapse("show");
               } else {
                   // TODO: verify this section is working once yelp ajax is back online
                   // show name of singular matching restaurant and store to local storage
                   $("#restaurant-input").val(rName);
                   localStorage.setItem("restaurants", JSON.stringify(matchingRestaurants));
                   localStorage.setItem("rIndex", 0);
                   // TODO: disable location and restaurant fields from additional data entry
               }; */
    });
};

// function to create radio button options for user to select correct restaurant from list of returned responses from Yelp
function showRestOptions(restaurant, i) {
    console.log(restaurant, i);
    matchingRestaurants.push(restaurant);

    $("#restaurant-results").append(
        `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="r-option" id="r-option-${i}" 
                value="${restaurant.id}" index="${i}" r-name="${restaurant.name}" 
                address1="${restaurant.location.address1}"
                address2="${restaurant.location.city}, ${restaurant.location.state} ${restaurant.location.zip_code}"
                phone="${restaurant.display_phone}">
                <label class="form-check-label" for="r-option-${i}">
                    ${restaurant.name}: ${restaurant.location.address1}, ${restaurant.location.city}, ${restaurant.location.state} ${restaurant.location.zip_code}
                </label>
            </div>
        `
    );
};

// save matching restaurants to local storage with index of selected restaurant
$("#select-restaurant-btn").on("click", function () {
    const selected = $("input[name=r-option]:checked")
    console.log(selected);
    console.log(selected.attr("phone"));

    // save matching restaurants and index of selected restaurant to local storage
    // TURNED OFF FOR TESTING - TURN BACK ON WHEN DONE WITH DEVELOPMENT
    // localStorage.setItem("restaurants", JSON.stringify(matchingRestaurants));
    localStorage.setItem("rIndex", selected.attr("index"));

    // show selected restaurant name in restaurant-input field
    $("#restaurant-input").val(selected.attr("r-name"));
    $("#restaurant-results-view").collapse("hide");
    $("#restaurant-details-view").collapse("show");

    $("#address1-view").text(selected.attr("address1"));
    $("#address2-view").text(selected.attr("address2"));
    $("#phone-view").text(selected.attr("phone"));

    // TODO: disable input into location and restaurant name fields
    // TODO: add reset button to enable these fields again
});

// ENTER DISH NAME AND CHECK AND PRE-POPULATE WITH USER'S RATING IF AVAILABLE
// TODO: after xx seconds retrieve existing dish data if user has entered same dish restaurant info
$("#dish-name-input").change(function () {

    // wait 3 seconds to run next function
    // if city, state, restaurant, and dish name equal to user's existing rating, then retrieve rating and set values on form
    getDishRating();
    // else do nothing
})

function getDishRating() {
    // TODO: get user's dish rating from firebase and populate values on screen
};

// IMAGES ********************************************************************************
// following event listeners is used to work with buttons added to support image upload
// by someone adding a rating
$(".file-select").on("change", function (e) {
    selectedFile = e.target.files[0];
    console.log(selectedFile);
    $("#image-file-name").text(`File Name: ${selectedFile.name}`);
});

// following event listeners is used to work with buttons added to support image upload
// by someone adding a rating
let downloadURL = "";
$(".file-submit").on("click", function (e) {
    //create a child directory called images, and place the file inside this directory
    const uploadTask = storageRef.child(`images/${selectedFile.name}`).put(selectedFile);
    uploadTask.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume

        // the downloadURL is critical to capture here
        // on image upload capture URL and save to firebase in the .image property so we can use it to access image later
        downloadURL = uploadTask.snapshot.downloadURL;
        console.log(downloadURL);
    }, (error) => {
        // Handle unsuccessful uploads
        console.log(error);
    }, () => {
        // Do something once upload is complete
        console.log('success');
        console.log("photo");
        // show new picture in view area
        $("#new-image-view").attr("src", downloadURL);
    });
});

// DISH RATING AND FLAVOR PROFILE **********************************************

// sliders with single value selector for rating dishes
$(".slider-rate-1-5").slider({
    range: false,
    min: 1,
    max: 5,
    step: 1,
    value: 3,
    change: function (event, ui) {},
});

// CANCEL OR SUBMIT RESULTS AND CALCULATE AVERAGE ******************************

// return to homepage if cancel button is clicked
$("#cancel-dish-btn").on("click", function () {
    window.location.href = "index.html";
});

$("#add-dish-btn").on("click", function () {
    
    addRestaurant();
    
    const rating = $("#dish-rating").slider("value");
    const sour = $("#sour-rating").slider("value");
    const sweet = $("#sweet-rating").slider("value");
    const spicy = $("#spicy-rating").slider("value");
    const salty = $("#salty-rating").slider("value");
    const umami = $("#umami-rating").slider("value");
    const comment = $("#dish-comment").val();
    let dishId = "";
    console.log(downloadURL);
    console.log(rating, sour, sweet, spicy, salty, umami, comment);
    
    const dishRecords = db.ref("ratings");
        
    // dummy user settings
    // TODO: replace with retrieval of user info from local storage
    const userId = 2;
    const userCity = "Atlanta";
    const userState = "Georiga";
    const userEmail = "curly@gmail.com";
    const userName = "Curly";

    // determine if dish is already in firebase
    calculateRatingAvg();
    // TODO: Go to dish average rating page on home screen
});

function addRestaurant() {
    const restaurantRecords = db.ref("restaurants");

    let rExists = true;
    const rIndex = localStorage.getItem("rIndex");
    const restaurant = JSON.parse(localStorage.getItem("restaurants"));
    const yelpDataObject = restaurant[rIndex];
    const rId = yelpDataObject.id;
    const rName = yelpDataObject.name;
    const address = yelpDataObject.location.address1;
    const city = $("#city-input").val();
    const state = $("#state-input").val();
    const zip = yelpDataObject.location.zip_code;
    const lat = yelpDataObject.coordinates.latitude;
    const long = yelpDataObject.coordinates.longitude;
    const phone = yelpDataObject.display_phone;
    const cuisine = [];
    for (var i in yelpDataObject.categories) {
        cuisine.push(yelpDataObject.categories[i].title);
    }
    const price = yelpDataObject.price;

    restaurantRecords.once("value", function(restaurantSnapshot) {
        const rRecord = restaurantSnapshot.val();
        
        findRestaurant(rId, function() {
            console.log(rExists);
            loadRestaurant(rExists);
        });
        
        function loadRestaurant(rExists) {
            console.log("who's on first");
            console.log(rExists);
            if (rExists === false) {
                console.log("zero");
                restaurantRecords.push({
                    yelpId: rId,
                    name: rName,
                    address: address,
                    city: city,
                    state: state,
                    zipCode: zip,
                    lat: lat,
                    long: long,
                    phone: phone,
                    cuisine: cuisine,
                    price: price,
                }); 
            };
        };
        
        function findRestaurant(rId) {
            console.log(rId);
            console.log(rRecord);

            for (var i in rRecord) {
                restaurantRecords.orderByChild('yelpId').equalTo(rId).once('value', function(snap) {
                    console.log(snap.val());
                    if (snap.val() === null) {
                        rExists = false;
                    }
                });
            };
        };
    });
};

function calculateRatingAvg(num) {
    //TODO: calculate rating avg and store values in local storage for future calculation
    // if new rating, increase total number of ratings by one and calculate average
    // if updated rating, do not increase number of total ratings for dish, subtract old rating, and calculate with new rating
};