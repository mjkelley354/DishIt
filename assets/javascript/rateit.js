let restName = "";
let address = "";
let city = "";
let state = "";
let zipCode = "";
let dishImage = "";
let dishName = "";
let phone = "";
let dishId = "";
let rateMe = false;

if ($("body").attr("data-title") === "index-page") { // functions run on load of index-page

    $(document).ready(() => {
        rateMe = false;
        localStorage.setItem("rateMe", rateMe);

    });
};

// if rate-btn clicked, the new dish page will open and autofill with restaurant name 
// (in local storage as an array of one, with rIndex = 0)
// and the same dish name

$(document).on("click", "#rate-btn", function () {
    dishId = ($(this).attr("dish-id-value"));
    let restaurantsArray = [];
    console.log(dishId);

    // TODO: auto-fill user responses if it exists
        
    const dishes = db.ref('dishes');
    const restaurants = db.ref('restaurants');
    
    dishes.child(dishId).once('value', function (dishesSnapshot) {
        restaurants.child("/" + dishesSnapshot.val().restaurantId).once('value', function (restaurantSnapshot) {

            dishImage = dishesSnapshot.val().image;
            dishName = dishesSnapshot.val().name;
            restName = restaurantSnapshot.val().name;
            address = restaurantSnapshot.val().address;
            city = restaurantSnapshot.val().city;
            state = restaurantSnapshot.val().state;
            zipCode = restaurantSnapshot.val().zipCode;
            phone = restaurantSnapshot.val().phone;

            restaurantsArray.push(restName);
            console.log(restName);
            console.log(restaurantsArray);
            console.log(restaurantSnapshot.val());
            console.log(rateMe);

            //window.location.href="newdish.html"

            /* localStorage.setItem("dishImage", dishImage);
            localStorage.setItem("dishName", dishName);
            localStorage.setItem("dishId", dishId);
            localStorage.setItem("restaurants", restaurantsArray);
            localStorage.setItem("rIndex", 0);
            localStorage.setItem("rAddress", address);
            localStorage.setItem("rCity", city);
            local.Storage.setItem("rState", state);
            localStorage.setItem("rZip", zipCode);
            localStorage.setItem("rPhone", phone);
            localStorage.setItem("rateMe", rateMe); */
        });
    });
});

if ($("body").attr("data-title") === "newdish-page") {
    $(document).ready(function () {
        console.log(restName);
        console.log(address);
        console.log(phone);        
    });
};


