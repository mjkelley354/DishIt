
/*******************************************************************************************/
// filter modal
/*******************************************************************************************/

// called when the apply filter button on the filter modal is clicked
$(".apply-filter").on("click", function () {
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
        if (!isInRange(getPriceAsNumber(dishArray[i].price), priceMin, priceMax)) {
            console.log("Price is out of range! min: " + priceMin + " max: " + priceMax + " actual: " + dishArray[i].price);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            console.log("Price is in range.");
        }
        if (!isInRange(dishArray[i].avgRating, ratingMin, ratingMax)) {
            console.log("Rating is out of range! min: " + ratingMin + " max: " + priceMax + " actual: " + dishArray[i].avgRating);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            console.log("Rating is in range.");
        }
        if (!isInRange(dishArray[i].avgSourScale, sourMin, sourMax)) {
            console.log("Sour scale is out of range! min: " + ratingMin + " max: " + priceMax + " actual: " + dishArray[i].avgSourScale);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            console.log("Sour scale  is in range.");
        }
        if (!isInRange(dishArray[i].avgSweetScale, sweetMin, sweetMax)) {
            console.log("Sweet scale is out of range! min: " + ratingMin + " max: " + priceMax + " actual: " + dishArray[i].avgSweetScale);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            console.log("Sweet scale is in range.");
        }
        if (!isInRange(dishArray[i].avgSpicyScale, spicyMin, spicyMax)) {
            console.log("Spicy scale is out of range! min: " + ratingMin + " max: " + priceMax + " actual: " + dishArray[i].avgSpicyScale);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            console.log("Spicy scale is in range.");
        }
        if (!isInRange(dishArray[i].avgSaltyScale, saltyMin, saltyMax)) {
            console.log("Salty scale is out of range! min: " + ratingMin + " max: " + priceMax + " actual: " + dishArray[i].avgSaltyScale);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            console.log("Salty scale is in range.");
        }
        if (!isInRange(dishArray[i].avgUmamiScale, umamiMin, umamiMax)) {
            console.log("Umami scale is out of range! min: " + ratingMin + " max: " + priceMax + " actual: " + dishArray[i].avgUmamiScale);
            $("tr[dish-id-value='" + dishArray[i].dishId +"']").hide();;
            continue;
        } else {
            console.log("Umami scale is in range.");
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