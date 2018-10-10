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
                //console.log(`${rName} matches ${rNameInput}`);
                showRestOptions(restaurants[i], i);
            };
        };

        if (matches === 0) {
            $("#restaurant-results").empty()
                .addClass("errorMessage")
                .text("No matches found. Try a different search.");
        };
    });
};

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
});

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
    change: function (event, ui) { },
});

// CANCEL OR SUBMIT RESULTS AND CALCULATE AVERAGE ******************************
// return to homepage if cancel button is clicked
$("#cancel-dish-btn").on("click", function () {
    window.location.href = "index.html";
});

// TODO: fix functionality if time
/* $("#reset-dish-btn").on("click", function () {
    $("#add-dish-form").trigger("reset");
}); */

$("#add-dish-btn").on("click", function () {
    
    addRestaurant();
    addDish();
    addRating();

    // determine if dish is already in firebase
    calculateRatingAvg();
    // TODO: Go to dish average rating page on home screen
});

let rIndex = "";
let rStorage = "";
let yelpDataObject = "";
let yelpId = "";
let rPrice = "";
let rIdFirebase = "";

// add new restaurant if it does not already exist in firebase storage
function addRestaurant() {
    const restaurantRecords = db.ref("restaurants");

    rIndex = localStorage.getItem("rIndex");
    rStorage = JSON.parse(localStorage.getItem("restaurants"));
    yelpDataObject = rStorage[rIndex];
    yelpId = yelpDataObject.id;
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
    rPrice = yelpDataObject.price;
    console.log(rPrice);

    restaurantRecords.orderByChild('yelpId').equalTo(yelpId).once('value', function(snap) {
    if (snap.val() === null) {
                rIdFirebase = writeRestaurantData(yelpId, rName, address, city, state, zip, lat, long, phone, cuisine, rPrice);
            } else {
                snap.forEach(function(childSnapshot) {
                    rIdFirebase = childSnapshot.ref.key;
                    console.log(rIdFirebase);
                });
            };
    }); 
};

// add dish to firebase if it does not exist for that restaurant
let dishIdFirebase = "";
let dishExists = false;
function addDish() {
    const dishRecords = db.ref("dishes");

    const dName = $("#dish-name-input").val();
    console.log(dName);

    let matches = 0;
    dishRecords.orderByChild("name").equalTo(dName).once("value", function(dishSnapshot){
        // console.log(dishSnapshot.val());
        // console.log(downloadURL);
        if (dishSnapshot.val() === null) {
            dishIdFirebase = writeDishData(dName, rIdFirebase, rPrice, 0, 0, 0, 0, 0, 0, downloadURL, 0);
        } else {
            dishSnapshot.forEach(function(childSnapshot){
                // console.log(childSnapshot.val());
                if (childSnapshot.val().restaurantId === rIdFirebase) {
                    dishIdFirebase = childSnapshot.ref.key;
                    matches++;
                    dishExists = true;
                };
            });
            // console.log("outside", matches);
            if (matches === 0) {
                dishIdFirebase = writeDishData(dName, rIdFirebase, rPrice, 0, 0, 0, 0, 0, 0, downloadURL, 0);
            };
        };
    });
};

// add ratings for the dish by user
let ratingIdFirebase = "";
function addRating() {
    const ratingsRecords = db.ref("ratings");
    const dName = $("#dish-name-input").val();

    const rating = $("#dish-rating").slider("value");
    const sour = $("#sour-rating").slider("value");
    const sweet = $("#sweet-rating").slider("value");
    const spicy = $("#spicy-rating").slider("value");
    const salty = $("#salty-rating").slider("value");
    const umami = $("#umami-rating").slider("value");
    const comment = $("#dish-comment").val();
    /* console.log(downloadURL);
    console.log(rating, sour, sweet, spicy, salty, umami, comment);
    console.log(dishIdFirebase);
    console.log(rIdFirebase); */

    // retrieve user details
    const userId = localStorage.getItem("dish-it-user-id");

    let matches = 0;
    ratingsRecords.orderByChild("userId").equalTo(userId).once("value", function(ratingSnapshot){
        if (ratingSnapshot.val() === null) {
            ratingId = writeRatingData(dishIdFirebase,dName,yelpId,rIdFirebase,userId,sour,sweet,spicy,salty,umami,rating,downloadURL,comment);
        } else {
            ratingSnapshot.forEach(function(childSnapshot){
                const dishRating = childSnapshot.val();
                console.log(dishRating);
                if (dishRating.dishId === dishIdFirebase) {
                    ratingIdFirebase = childSnapshot.ref.key;
                    matches++;
                };
            });
            if (matches === 0 ) {
                ratingId = writeRatingData(dishIdFirebase,dName,yelpId,rIdFirebase,userId,sour,sweet,spicy,salty,umami,rating,downloadURL,comment);
            };
        };
    });
};

function calculateRatingAvg(num) {

    // average rating

    //db.ref('dishes').orderByChild('')
    //TODO: calculate rating avg and store values in local storage for future calculation
    // if new rating, increase total number of ratings by one and calculate average
    // if updated rating, do not increase number of total ratings for dish, subtract old rating, and calculate with new rating
};

// WRITE INFORMATION TO FIREBASE ******************************************************

function writeRatingData(dishId, dishName, yelpId, rIdFirebase, userId, sourScale, sweetScale, spicyScale,
    saltyScale, umamiScale, rating, image, text) {
    let insertedData = db.ref('ratings/').push({
        dishId,
        dishName,
        yelpId,
        rIdFirebase,
        userId,
        sourScale,
        sweetScale,
        spicyScale,
        saltyScale,
        umamiScale,
        rating,
        text,
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
        yelpId,
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