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

const storageService = firebase.storage();
let storageRef = storageService.ref();
let selectedFile;

// following event listeners is used to work with buttons added to support image upload
// by someone adding a rating
document.querySelector(".file-select").addEventListener("change", function (e) {
        selectedFile = e.target.files[0];
    }
);

// following event listeners is used to work with buttons added to support image upload
// by someone adding a rating
document.querySelector(".file-submit").addEventListener("click", function (e) {
    //create a child directory called images, and place the file inside this directory
    const uploadTask = storageRef.child(`images/${selectedFile.name}`).put(selectedFile);
    uploadTask.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume

        // the downloadURL is critical to capture here
        // TODO: on image upload capture URL and save to firebase in the .image property so we can use it to access image later
        var downloadURL = uploadTask.snapshot.downloadURL;
        console.log(downloadURL);
    }, (error) => {
        // Handle unsuccessful uploads
        console.log(error);
    }, () => {
        // Do something once upload is complete
        console.log('success');
    });
});

const db = firebase.database();

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

function getTopX(recordsToReturn){
    const dishes = db.ref("dishes");
    const restaurants = db.ref("restaurants");

    // let topX = [];

    // get the top x dishes and then push them into the topX array (by dishId)
    dishes.orderByChild("avgRating").limitToLast(recordsToReturn).on("child_added", function(snapshot) {
        const keyValue = snapshot.ref.key;
        // topX.push(keyValue);

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
    $(".tile-div").prepend(
        `
            <div class="dish-tile" id="${dishId}" restaurant="${restaurantName}">
                <img class="dish-tile-img" src="${dishImage}">
                <div class="dish-tile-name">${dishName}</div>
                <div class="dish-tile-restaurant">${restaurantName}</div>
                <div class="dish-tile-rating">${avgRating}</div>
                <div class="dish-tile-price">${getPrice(dishPrice)}</div>
            </div>
        `
    )
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

function setValues(stepIncrease) {
    return function (event, ui) {
        var slider = $("#" + this.id);
        var currentValues = slider.slider("values");
        var step = slider.slider("option")["step"];
        // 2 - can be changed
        if (!(Math.abs(ui.values[0] - currentValues[0]) == stepIncrease * step || Math.abs(ui.values[1] - currentValues[1]) == stepIncrease * step)){
            return false;
        };
        slider.slider("values", ui.values);
        var currentValues = slider.slider("values");
        $("#" + this.id + "-values").html(currentValues[0] + ' - ' + currentValues[1]);
    };
};


$( ".slider-1-10" ).slider({
    range: true,
    min: 1,
    max: 10,
    step: 1,
    values: [1, 10],
    slide: setValues(1),
    create: function(event, ui) {
        var slider = $("#" + this.id);
        var currentValues = slider.slider("values");
        $("#" + this.id + "-values").html(currentValues[0] + ' - ' + currentValues[1]);
    }
});

$( ".slider-1-4" ).slider({
    range: true,
    min: 1,
    max: 4,
    step: 1,
    values: [1, 4],
    slide: setValues(1),
    create: function(event, ui) {
        var slider = $("#" + this.id);
        var currentValues = slider.slider("values");
        $("#" + this.id + "-values").html(currentValues[0] + ' ' + currentValues[1]);
    }
});



// when page loads
$(document).ready(function(){

    /* following line calls the function which adds test data.
        do not uncomment unless you want to add test data
        back to firebase
    */
    // createTestData();

    // get top 20 records by average rating
    getTopX(20);


});

$(".filter-icon").on("click", function () {
    $(".filter-modal").modal('show');
});

// on click of search button, determine if dish name contains search string
$("#search-btn").on("click", function(){

    // empty screen of existing results
    $(".tile-div").empty();

    // capture search string
    const searchInput = $("#search-input").val();
    console.log(searchInput);

    var dishes = db.ref('dishes');
    var restaurants = db.ref('restaurants');
    let matches = 0;

    // for each dish in order of avgRating...
    dishes.orderByChild("avgRating").on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            // if dish name contains search string, display results on screen
            if(childSnapshot.val().name.includes(searchInput)) {
                matches++;
                console.log(childSnapshot.val().name);
                const keyValue = childSnapshot.ref.key;

                dishes.child("/"+keyValue).once('value', function(dishesSnapshot) {
                    restaurants.child("/"+dishesSnapshot.val().restaurantId).once('value', function(restaurantSnapshot) {
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
            }; 
        });
        console.log(matches);
        // displays message if no search results retured
        if(matches===0) {
            noResults();
        }
    });
});

// returns message if no search results returned.
// this section requires some UI work
function noResults() {
    $(".tile-div").append(
        `
            <h2 class="text-center block pt-5">No dishes match your search</h2>
            <p><i>Try searching a generic name of a dish (e.g. pizza) or an ingredient (e.g. cheese)</i></p>
            <button class="btn btn-outline-success d-flex justify-content-center add-dish-btn" type="button">Rate a new dish!</button>
        `
    );
};

// returns name of restaurant when dish tile class (in list) is clicked
$(document).on("click", ".dish-tile", function(){
    // populate dish info from firebase

    // get restaurant data from Yelp - this bit of code will be moved to add/rate form eventually
    getRestaurant($(this).attr("restaurant"));
});

// get restaurant information from yelp
function getRestaurant(name) {
    console.log(name);

    const restaurantURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?` + $.param({
        term: name,
        location: "Atlanta, GA",
        categories: "restaurants",
        limit: 2,
    });

    $.ajax({
        url: restaurantURL,
        method: "GET",
        headers: {
            'Authorization': 'Bearer lC3zgwezYWCKbJZW03Yepl4A52o_fhrqd9a1x0_MapVxItu97aAHOUOGfsRzDJswOWzWlaHv0zvw8keaePumFEkXJWyOgcTcLg7ekQOQ9skybUd_wy02lE3hnQy0W3Yx',
        }
    }).then(function(response){
        console.log(response);
        const restaurants = response.businesses;
        for (var i in restaurants) {
            const id = restaurants[i].id;
            const price = restaurants[i].price;
            const rName = restaurants[i].name;
            const location = restaurants[i].location;
            const coordinates = restaurants[i].coordinates;
            const phone = restaurants[i].phone;

            console.log(id, price, rName, location, coordinates, phone);
            showRestOptions(rName, location);
        };
    });
};

// use this function to create radio button options for user to select correct restaurant from list of returned responses from Yelp
function showRestOptions(rName, location) {
    console.log(rName, location);
    // code radio buttons below - show on add rating for new dish page
    // use class rest-option for radio button options
};

$(".apply-filter").on("click", function (){
    // TODO:  query firebase for filtered data
});

$(document).on("click", ".rest-option-select", function () {
    // call selectRestaurant function - pass id
})

function selectRestaurant(response) {
    const dishes = db.ref("dishes");
    const restaurants = db.ref("restaurants");

    // select restaurant by ID
    // if id matches existing restaurant Id in firebase, do not add
    // else, push new restaurant to firebase. get response from ajax call?
    restaurants.on("value", function(snapshot) {
        console.log(snapshot.val());
        console.log('Hi');
        // wip
    });
};