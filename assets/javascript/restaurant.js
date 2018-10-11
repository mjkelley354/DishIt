if ($("body").attr("data-title") === "newdish-page") {
    $(document).ready(function () {

        // TODO: trying to auto-populate state field on newdish.html - the below does not work
        const states = ["AL", "AK", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IA", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NE", "NH", "NV", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
        let option = '';

        for (let i = 0; i< states.length; i++) {
            if (states[i] === "GA") {
                option += `<option selected value="${states[i]}">${states[i]}</option>`;
            } else {
                option += `<option value="${states[i]}">${states[i]}</option>`;
            }
        };
        $("#state-input").append(option);
    });
};

let rNameInput = "";
$("#find-restaurant").on("click", function () {
    const location = $("#city-input").val().trim() + ", " + $("#state-input").val().trim();
    rNameInput = $("#restaurant-input").val().trim();

    // initiate ajax call to yelp
    // TURN THIS BACK ON FOR REAL DATA CALLS - USE TESTING DATA BELOW FOR DEVELOPMENT
    getRestaurant(location, rNameInput);

    // USING THIS FOR TESTING - GETTING DATA FROM LOCAL STORAGE
    /* const restaurants = JSON.parse(localStorage.getItem("restaurants"));
    console.log(restaurants);
    $("#restaurant-results").empty()
    for (var i in restaurants) {
        showRestOptions(restaurants[i], i);
    } */

    // show restaurant results section
    $("#restaurant-results-view").collapse("show");
});

let matchingRestaurants = [];

function getRestaurant(location, rName) {
    const restaurantURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?` + $.param({
        term: rName,
        location: location,
        categories: "restaurants",
        limit: 5,
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
    localStorage.setItem("restaurants", JSON.stringify(matchingRestaurants));

    localStorage.setItem("rIndex", selected.attr("index"));

    // show selected restaurant name in restaurant-input field
    $("#restaurant-input").val(selected.attr("r-name"));
    $("#restaurant-results-view").collapse("hide");
    $("#restaurant-details-view").collapse("show");

    $("#address1-view").text(selected.attr("address1"));
    $("#address2-view").text(selected.attr("address2"));
    $("#phone-view").text(selected.attr("phone"));

    $(".dish-div").collapse("show");

});