// ENTER DISH NAME AND CHECK AND PRE-POPULATE WITH USER'S RATING IF AVAILABLE
// TODO: after xx seconds retrieve existing dish data if user has entered same dish restaurant info
$("#dish-name-input").change(function () {
    const dishInput = $("#dish-name-input").val().trim();
    event.preventDefault();

    // wait 3 seconds to run next function
    // TODO: add functionality to auto title case stringgit 
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
let downloadURL = "";

$(".file-select").on("change", function (e) {
    selectedFile = e.target.files[0];
    console.log(selectedFile);
    $("#image-file-name").text(`File Name: ${selectedFile.name}`);

    // previous activated by clicking submit button
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

});

let rIndex = "";
let rStorage = "";
let yelpDataObject = "";
let yelpId = "";
let rPrice = "";
let rIdFirebase = "";

// add new restaurant if it does not already exist in firebase storage
const restaurantRecords = db.ref("restaurants");

function addRestaurant() {

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
    rPrice = changePriceToNum(yelpDataObject.price);

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

function changePriceToNum(price) {
    switch(price) {
        case "$": return 1;
            break;
        case "$$": return 2;
            break;
        case "$$$": return 3;
            break;
        case "$$$$": return 4;
            break;
    };
};

// add dish to firebase if it does not exist for that restaurant
let dishIdFirebase = "";
let dishExists = false;
let dName = "";
let comments = [];
const dishRecords = db.ref("dishes");

function addDish() {
    dName = $("#dish-name-input").val().trim();

    let matches = 0;
    dishRecords.orderByChild("name").equalTo(dName).once("value", function(dishSnapshot){
        // console.log(dishSnapshot.val());
        // console.log(downloadURL);
        if (dishSnapshot.val() === null) {
            dishIdFirebase = writeDishData(dName, rIdFirebase, rPrice, 0, 0, 0, 0, 0, 0, downloadURL, comments, 0);
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
                dishIdFirebase = writeDishData(dName, rIdFirebase, rPrice, 0, 0, 0, 0, 0, 0, downloadURL, comments, 0);
            };
        };
    });
};

// add ratings for the dish by user
const ratingsRecords = db.ref("ratings");
let ratingIdFirebase = "";
let rating = "";
let sour = "";
let sweet = "";
let spicy = "";
let salty = "";
let umami = "";
let comment = "";
let timestamp;
function addRating() {

    rating = $("#dish-rating").slider("value");
    sour = $("#sour-rating").slider("value");
    sweet = $("#sweet-rating").slider("value");
    spicy = $("#spicy-rating").slider("value");
    salty = $("#salty-rating").slider("value");
    umami = $("#umami-rating").slider("value");
    comment = $("#dish-comment").val();
    timestamp = moment().format("MMM D YYYY hh:mm A z");

    // retrieve user details
    const userId = localStorage.getItem("dish-it-user-id");

    let matches = 0;
    ratingsRecords.orderByChild("userId").equalTo(userId).once("value", function(ratingSnapshot){
        if (ratingSnapshot.val() === null) {
            // with comment field
            //ratingId = writeRatingData(dishIdFirebase,dName,yelpId,rIdFirebase,userId,sour,sweet,spicy,salty,umami,rating,downloadURL,comment,timestamp);
            ratingId = writeRatingData(dishIdFirebase,dName,yelpId,rIdFirebase,userId,sour,sweet,spicy,salty,umami,rating,downloadURL,timestamp);
        } else {
            ratingSnapshot.forEach(function(childSnapshot){
                const dishRating = childSnapshot.val();
                // console.log(dishRating);
                if (dishRating.dishId === dishIdFirebase) {
                    ratingIdFirebase = childSnapshot.ref.key;
                    matches++;
                };
            });
            if (matches === 0 ) {
                // with comment field
                // ratingId = writeRatingData(dishIdFirebase,dName,yelpId,rIdFirebase,userId,sour,sweet,spicy,salty,umami,rating,downloadURL,comment,timestamp);
                ratingId = writeRatingData(dishIdFirebase,dName,yelpId,rIdFirebase,userId,sour,sweet,spicy,salty,umami,rating,downloadURL,timestamp);
            };
        };
        calculateRatingAvg();
    });
};

function calculateRatingAvg() {
    console.log(downloadURL);
    console.log(timestamp);

    const dishAvg = dishRecords.child(dishIdFirebase);

    dishAvg.once("value", function(dishSnapshot){
        let numRatings = dishSnapshot.val().numRatings;
        numRatings++;

        // retrieve average values    
        let avgRating = dishSnapshot.val().avgRating;
        let avgSalty = dishSnapshot.val().avgSaltyScale;
        let avgSour = dishSnapshot.val().avgSourScale;
        let avgSpicy = dishSnapshot.val().avgSpicyScale;
        let avgSweet = dishSnapshot.val().avgSweetScale;
        let avgUmami = dishSnapshot.val().avgUmamiScale;
        
        console.log(avgRating);

        // calculate averages
        avgRating = (avgRating + rating)/numRatings;
        avgSalty = (avgSalty + salty)/numRatings;
        avgSour = (avgSour + sour)/numRatings;
        avgSpicy = (avgSpicy + spicy)/numRatings;
        avgSweet = (avgSweet + sweet)/numRatings;
        avgUmami = (avgUmami + umami)/numRatings;
        
        console.log(avgRating);
        console.log(numRatings);
        console.log(downloadURL);

        dishAvg.update({
            avgRating: avgRating,
            avgSaltyScale: avgSalty,
            avgSourScale: avgSour,
            avgSpicyScale: avgSpicy,
            avgSweetScale: avgSweet,
            avgUmamiScale: avgUmami,
            //comments: comments,
            image: downloadURL,
            numRatings: numRatings,
        });

    });
    window.location.href="index.html";
};

// WRITE INFORMATION TO FIREBASE ******************************************************

// removing comment field from next to last field
function writeRatingData(dishId, dishName, yelpId, rIdFirebase, userId, sourScale, sweetScale, spicyScale,
    saltyScale, umamiScale, rating, image, timestamp) {
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
        image,
        // text,
        timestamp,
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

// removed comments field (next to last) for time being
function writeDishData(name, restaurantId, price, avgSourScale, avgSweetScale, avgSpicyScale,
    avgSaltyScale, avgUmamiScale, avgRating, image, comments, numRatings) {
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
        comments,
        numRatings,
    });
    return insertedData.getKey();
}