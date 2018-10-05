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


const db = firebase.database();


const storageService = firebase.storage();
let storageRef = storageService.ref();
let selectedFile;

let userName = "";
let userEmail = "";
let userCity = "";
let userState = "";

// google map object
let map;
let mapPins = [];

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
        $("#" + this.id + "-values").html(currentValues[0] + ' to ' + currentValues[1]);
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
        $("#" + this.id + "-values").html(currentValues[0] + ' to ' + currentValues[1]);
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
        $("#" + this.id + "-values").html(currentValues[0] + ' to ' + currentValues[1]);
    }
});



// when page loads
$(document).ready(function () {

    /* following line calls the function which adds test data.
        do not uncomment unless you want to add test data
        back to firebase
    */
    // createTestData();

    // get top 20 records by average rating
    getTopX(20);

    readLocalStorage();

});

function readLocalStorage() {
    // get user info from localstorage if it exists
    userName = localStorage.getItem("dish-it-user");
    userEmail = localStorage.getItem("dish-it-email");
    userCity = localStorage.getItem("dish-it-city");
    userState = localStorage.getItem("dish-it-state");

    // if we don't have data in local storage then user doesn't exists, so show the add user modal
    if (userName == null || userEmail == null || userCity == null || userState == null) {
        $(".user-modal").modal('show');
    }
}

$(".filter-icon").on("click", function () {
    $(".filter-modal").modal('show');
});

$(".map-icon").on("click", function () {
    $(".map-modal").modal('show');
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
    let matches = 0;

    // for each dish in order of avgRating...
    dishes.orderByChild("avgRating").on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            // if dish name contains search string, display results on screen
              if(childSnapshot.val().name.includes(searchInput)) {
                matches++;
                
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

            var restaurantLatLong = {lat: coordinates.latitude, lng: coordinates.longitude};
            addToMap(rName, restaurantLatLong);


            console.log(id, price, rName, location, coordinates, phone);
            showRestOptions(rName, location);
        };
    });
};

function addToMap(restaurauntName, position){
    // add a marker and an infowindow to map
    // TODO: figure out how to hide the info window if you aren't on mouseover
    var marker = new google.maps.Marker({position: position, map: map});
    var infowindow =  new google.maps.InfoWindow({
        content: restaurauntName,
        map: map,
        position: position
    });
}

// use this function to create radio button options for user to select correct restaurant from list of returned responses from Yelp
function showRestOptions(rName, location) {
    console.log(rName, location);
    // code radio buttons below - show on add rating for new dish page
    // use class rest-option for radio button options
};
$(".apply-filter").on("click", function (){
    // loop though each card
    $('.card').each(function(index, obj){
        // if card properties not within filter criteria then hide card

    });
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


// save favorites to local storage
function saveFavorites(){
    localStorage.setItem("dish-it-user", userName);
    localStorage.setItem("dish-it-email", userEmail);
    localStorage.setItem("dish-it-city", userCity);
    localStorage.setItem("dish-it-state", userState);
}

$(".save-user").on("click", function() {
    // TODO: capture the data from the form on the modal into the global user variables and then save to firebase
    saveFavorites();
    //writeUserData(x, y, z....);
});

// initializes the map object
function initMap() {
    // The location of Atlanta
    var atlanta = {lat: 33.753746, lng: -84.386330};
    // The map, centered at Atlanta
    map = new google.maps.Map(
        document.getElementById('map_canvas'), {zoom: 10, center: atlanta});
    // The marker, positioned at Atlanta
    //var marker = new google.maps.Marker({position: atlanta, map: map});


}

// resize the map to fit on the modal
$(".map-modal").on('show.bs.modal', function(event) {
    $("#location-map").css("width", "100%");
    $("#map_canvas").css("width", "100%");
});

// Trigger map resize event after modal shown
$(".map-modal").on('shown.bs.modal', function() {
    google.maps.event.trigger(map, "resize");
    myLatlng = new google.maps.LatLng(33.753746, -84.386330)
    map.setCenter(myLatlng);
});

