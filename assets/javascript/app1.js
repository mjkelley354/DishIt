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
let filteredArray = [];

// google map object
let map;
let mapPins = [];

// HOME PAGE *************************************************************************

if ($("body").attr("data-title") === "index-page") { // functions run on load of index-page

    $(document).ready(() => {
        // createTestData(); // do not uncomment unless you want to add test data back to firebase
        getTopX(20); // get top 20 records by average rating
        readLocalStorage(); // function to get user info from local storage

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
                    restaurantSnapshot.val().lat,
                    restaurantSnapshot.val().long,
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

/* // TODO: use this function later for populating filtered results
function createTiles(dishArray) {
    //console.log("I'm creating tiles");
    //console.log(dishArray);
    // FIX: this section below is not working to populate tiles after the search btn is clicked; disabled or now
    for (let i in dishArray) {
        //console.log(dishArray[i].dishName);
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
}; */

$(document).on("click", ".dish-tile", function () {

    //console.log($(this));
    //console.log($(this).attr("dish-id-value"));
    let dishId = ($(this).attr("dish-id-value"));
    let dataTargetId = ($(this).attr("data-target"));
    $(`${dataTargetId}`).empty();

    //console.log(dishId);
    //console.log(dataTargetId);
    $(".collapse").collapse('hide');

    var dishes = db.ref('dishes');
    var restaurants = db.ref('restaurants');
    let avgSaltyScale = "";
    let avgSourScale = "";
    let avgSpicyScale = "";
    let avgSweetScale = "";
    let avgUmamiScale = "";
    let restName = "";
    let address = "";
    let city = "";
    let state = "";
    let zipCode = "";
    let dishImage = "";
    let dishName = "";
    let phone = "";

    dishes.child("/" + dishId).once('value', function (dishesSnapshot) {
        restaurants.child("/" + dishesSnapshot.val().restaurantId).once('value', function (restaurantSnapshot) {

            avgSaltyScale = dishesSnapshot.val().avgSaltyScale;
            avgSourScale = dishesSnapshot.val().avgSourScale;
            avgSpicyScale = dishesSnapshot.val().avgSpicyScale;
            avgSweetScale = dishesSnapshot.val().avgSweetScale;
            avgUmamiScale = dishesSnapshot.val().avgUmamiScale;
            dishImage = dishesSnapshot.val().image;
            dishName = dishesSnapshot.val().name;
            restName = restaurantSnapshot.val().name;
            address = restaurantSnapshot.val().address;
            city = restaurantSnapshot.val().city;
            state = restaurantSnapshot.val().state;
            zipCode = restaurantSnapshot.val().zipCode;
            phone = restaurantSnapshot.val().phone;

            $(`${dataTargetId}`).append(
                `
                    <div class="row dish-details-row">
                        <div class="col-md-6">
                            <div class="card-body"> 
                                <b>Salty: </b>${getScale(avgSaltyScale, "fas fa-cubes")}
                                <br>
                                <b>Sour:</b> ${getScale(avgSourScale, "fas fa-lemon")}
                                <br>
                                <b>Spicy:</b> ${getScale(avgSpicyScale, "fab fa-hotjar")}
                                <br>
                                <b>Sweet:</b> ${getScale(avgSweetScale, "fas fa-cookie-bite")}
                                <br>
                                <b>Umami:</b> ${getScale(avgUmamiScale, "fas fa-crow")}
                            </div>
                        </div>
                        <div class="col-md-6">
                            <b>${restName}</b>
                            <br>
                            <i>${address}</i>
                            <br>
                            <i>${city}
                            ${state}
                            ${zipCode}</i>
                            <br>
                            ${phone}
                        </div>
                    </div>
                `
            );
        });
    });
});

function getScale(avgScaleValue, fontAwesomeIcon) {
    const flavor = Math.floor(avgScaleValue);
    let scaleValue = "";
    for (var i = 0; i < flavor; i++) {
        scaleValue = scaleValue.concat(`<i class="${fontAwesomeIcon}"></i>`);
    }

    if (Math.round(avgScaleValue * 2) / 2 - flavor === 1) {
        scaleValue = scaleValue.concat(`<i class="${fontAwesomeIcon}"></i>`);
    }

    if (Math.round(avgScaleValue * 2) / 2 - flavor === .5) {
        scaleValue = scaleValue.concat(`&#189`);
    }
    return scaleValue;

}

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

    $(".tile-div").append(`
        <div class="card card-body">
        <table class="table text-center">
            <tbody id="dish-list">
            </tbody>
        </table>
        </div>
`);

    // capture search string
    const searchInput = $("#search-input").val();
    //console.log(searchInput);

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
                //console.log(childSnapshot.val().name);
                const keyValue = childSnapshot.ref.key;
                dishes.child("/" + keyValue).once('value', function (dishesSnapshot) {
                    restaurants.child("/" + dishesSnapshot.val().restaurantId).once('value', function (restaurantSnapshot) {

                        createTile(keyValue,
                            dishesSnapshot.val().name,
                            dishesSnapshot.val().restaurantId,
                            restaurantSnapshot.val().name,
                            dishesSnapshot.val().avgRating,
                            dishesSnapshot.val().image,
                            dishesSnapshot.val().price
                        );

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
                            restaurantSnapshot.val().lat,
                            restaurantSnapshot.val().long,
                            "",
                            "",
                        );
                        const restaurantLatLong = {
                            lat: restaurantSnapshot.val().lat,
                            lng: restaurantSnapshot.val().long,
                        };
                    });
                });
            };
        });
        //console.log(matches);
        // console.log(dishArray);
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
            <div class="card card-body" id="no-results-view">
                <h2 class="text-center block pt-5">No dishes match your search</h2>
                <p class="text-center"><i>Try searching a generic name of a dish (e.g. pizza) or an ingredient (e.g. cheese)</i></p>
                <div class="d-flex justify-content-center">
                    <button class="btn btn-outline-dark d-flex justify-content-center" id="new-dish-btn" type="button">Rate a new dish!</button>
                </div>
            </div>
        `
    );
};

$(document).on("click", "#new-dish-btn", function () {
    window.location.href = "newdish.html";
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
    //TODO: add additional content to "content" property with whatever we want to show on the infoWindow, content can take form of HTML

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
    //console.log("initMap() triggered.");
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
};

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