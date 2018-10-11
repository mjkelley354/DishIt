
/*******************************************************************************************/
// filter modal
/*******************************************************************************************/

// called when the apply filter button on the filter modal is clicked
$(".apply-filter").on("click", function () {
    console.log(dishArray);
    const priceMin = $("#slider-price-range").slider("values")[0];
    const priceMax = $("#slider-price-range").slider("values")[1];
    const ratingMin = $("#slider-rating-range").slider("values")[0];
    const ratingMax = $("#slider-rating-range").slider("values")[1];
    const sourMin = $("#slider-sour-range").slider("values")[0];
    const sourMax = $("#slider-sour-range").slider("values")[1];
    const sweetMin = $("#slider-sweet-range").slider("values")[0];
    const sweetMax = $("#slider-sweet-range").slider("values")[1];
    const spicyMin = $("#slider-spicy-range").slider("values")[0];
    const spicyMax = $("#slider-spicy-range").slider("values")[1];
    const saltyMin = $("#slider-salty-range").slider("values")[0];
    const saltyMax = $("#slider-salty-range").slider("values")[1];
    const umamiMin = $("#slider-umami-range").slider("values")[0];
    const umamiMax = $("#slider-umami-range").slider("values")[1];

    for (let i = 0; i < dishArray.length; i++) {
        //console.log("dishName: ", dishArray[i].dishName, " restaurant: ", dishArray[i].restaurantName);
        //console.log("Price Scale - min: " + priceMin + " max: " + priceMax + " actual: " + dishArray[i].price);
        if (dishArray[i].price != 0 && dishArray[i].price != null && !isInRange(dishArray[i].price, priceMin, priceMax)) {
            //console.log("Hiding tr for dishId: ", dishArray[i].dishId);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            //console.log("Price is in range.");
        }
        //console.log("Rating Scale - min: " + ratingMin + " max: " + priceMax + " actual: " + dishArray[i].avgRating);
        if (dishArray[i].avgRating != 0 && dishArray[i].avgRating != null && !isInRange(dishArray[i].avgRating, ratingMin, ratingMax)) {
            //console.log("Hiding tr for dishId: ", dishArray[i].dishId);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            //console.log("Rating is in range.");
        }
        //console.log("Sour scale - min: " + ratingMin + " max: " + priceMax + " actual: " + dishArray[i].avgSour);
        if (dishArray[i].avgSour != 0 && dishArray[i].avgSour != null && !isInRange(dishArray[i].avgSour, sourMin, sourMax)) {
            //console.log("Hiding tr for dishId: ", dishArray[i].dishId);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            //console.log("Sour scale  is in range.");
        }
        //console.log("Sweet scale - min: " + ratingMin + " max: " + priceMax + " actual: " + dishArray[i].avgSweet);
        if (dishArray[i].avgSweet != 0 && dishArray[i].avgSweet != null && !isInRange(dishArray[i].avgSweet, sweetMin, sweetMax)) {
            //console.log("Hiding tr for dishId: ", dishArray[i].dishId);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            //console.log("Sweet scale is in range.");
        }
        //console.log("Spicy scale - min: " + ratingMin + " max: " + priceMax + " actual: " + dishArray[i].avgSpicy);
        if (dishArray[i].avgSpicy != 0 && dishArray[i].avgSpicy != null && !isInRange(dishArray[i].avgSpicy, spicyMin, spicyMax)) {
            //console.log("Hiding tr for dishId: ", dishArray[i].dishId);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            //console.log("Spicy scale is in range.");
        }
        //console.log("Salty scale - min: " + ratingMin + " max: " + priceMax + " actual: " + dishArray[i].avgSalty)
        if (dishArray[i].avgSalty != 0 && dishArray[i].avgSalty != null && !isInRange(dishArray[i].avgSalty, saltyMin, saltyMax)) {;
            //console.log("Hiding tr for dishId: ", dishArray[i].dishId);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            //console.log("Salty scale is in range.");
        }
        //console.log("Umami scale - min: " + ratingMin + " max: " + priceMax + " actual: " + dishArray[i].avgUmami);
        if (dishArray[i].avgUmami != 0 && dishArray[i].avgUmami != null && !isInRange(dishArray[i].avgUmami, umamiMin, umamiMax)) {
            //console.log("Hiding tr for dishId: ", dishArray[i].dishId);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            //console.log("Umami scale is in range.");
        }
    }

    // TODO:  fix the following as it does not currently work!
    // let allRowsHidden = true;
    // let table = document.getElementById('dish-list');
    // let rowLength = table.rows.length;
    // for (let i = 0; i < rowLength; i++){
    //     if($(table.rows[i]).is(":hidden") == false) {
    //         allRowsHidden = false;
    //     }
    // }
    //
    // if (allRowsHidden == true){
    //     $("#restaurant-results").empty()
    //         .addClass("errorMessage")
    //         .text("No matches found. Try a different search.");
    // }

    // TODO:  Hide the map marker if we are hiding the dish via a filter

    $(".filter-modal").modal('hide');
});

function getPriceAsNumber(price) {
    let numericPrice = 0;
    switch (price){
        case "$":
            numericPrice = 1;
            break;
        case "$$":
            numericPrice = 2;
            break;
        case "$$$":
            numericPrice = 3;
            break;
        case "$$$$":
            numericPrice = 4;
            break;
        case "$$$$$":
            numericPrice = 5;
            break;
    }
}

function isInRange(testValue, minValue, maxValue) {
    console.log("testValue: ", testValue, " minValue: ", minValue, " maxValue: ", maxValue)
    let inRange = false;
    if (testValue >= minValue && testValue <= maxValue) {
        inRange = true;
    }
    return inRange;
}


// called when the remove filter button on the filter modal is clicked
$(".remove-filter").on("click", function () {

    // set all sliders back to min = 1, max = 5
    $("#slider-price-range").slider('values',0,1);
    $("#slider-price-range").slider('values',1,5);
    $("#slider-rating-range").slider('values',0,1);
    $("#slider-rating-range").slider('values',1,5);
    $("#slider-sour-range").slider('values',0,1);
    $("#slider-sour-range").slider('values',1,5);
    $("#slider-sweet-range").slider('values',0,1);
    $("#slider-sweet-range").slider('values',1,5);
    $("#slider-spicy-range").slider('values',0,1);
    $("#slider-spicy-range").slider('values',1,5);
    $("#slider-salty-range").slider('values',0,1);
    $("#slider-salty-range").slider('values',1,5);
    $("#slider-umami-range").slider('values',0,1);
    $("#slider-umami-range").slider('values',1,5);

    let table = document.getElementById('dish-list');
    let rowLength = table.rows.length;
    for (let i = 0; i < rowLength; i++){
        $(table.rows[i]).show();
    }

    $(".filter-modal").modal('hide');
});

/*******************************************************************************************/
// user modal
/*******************************************************************************************/
$(".save-user").on("click", function () {
    userName = $("#userName").val();
    userEmail = $("#userEmail").val();
    userCity = $("#userCity").val();
    userState = $("#userState").val();
    userId = writeUserData(userName, userEmail, userCity, userState);
    saveFavorites();
    $(".user-modal").modal('hide');
});

function saveFavorites() {
    localStorage.setItem("dish-it-user-id", userId);
    localStorage.setItem("dish-it-user", userName);
    localStorage.setItem("dish-it-email", userEmail);
    localStorage.setItem("dish-it-city", userCity);
    localStorage.setItem("dish-it-state", userState);
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



/*******************************************************************************************/
// map modal
/*******************************************************************************************/

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