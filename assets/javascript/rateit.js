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
    console.log(dishId);
    rateMe = true;

    // TODO: auto-fill user responses if it exists
        
    const dishes = db.ref('dishes');
    const restaurants = db.ref('restaurants');
    
    dishes.child(dishId).once('value', function (dishesSnapshot) {
        restaurants.child("/" + dishesSnapshot.val().restaurantId).once('value', function (restaurantSnapshot) {

            dishImage = dishesSnapshot.val().image;
            dishName = dishesSnapshot.val().name;
            /* restName = restaurantSnapshot.val().name;
            address = restaurantSnapshot.val().address;
            city = restaurantSnapshot.val().city;
            state = restaurantSnapshot.val().state;
            zipCode = restaurantSnapshot.val().zipCode;
            phone = restaurantSnapshot.val().phone;

            restaurantsArray.push(restName); */
            
            const selectedDish = dishesSnapshot.val();
            const selectedRest = restaurantSnapshot.val();
            console.log(rateMe);
             //localStorage.setItem("dishImage", dishImage);
            //localStorage.setItem("dishName", dishName);
            //localStorage.setItem("dishId", dishId);
            localStorage.setItem("dishSnapshot", JSON.stringify(selectedDish));
            localStorage.setItem("restaurantSnapshot", JSON.stringify(selectedRest));
            localStorage.setItem("rateMe", rateMe);

            window.location.href="newdish.html"

           
        });
    });
});

if ($("body").attr("data-title") === "newdish-page") {
    $(document).ready(function () {

        const dishSnap = JSON.parse(localStorage.getItem("dishSnapshot"));
        const restSnap = JSON.parse(localStorage.getItem("restaurantSnapshot"));
        const rateMeStored = localStorage.getItem("rateMe");
        console.log(rateMeStored);
        populateFields(dishSnap, restSnap, rateMeStored);
    });
};

function populateFields(dishSnap, restSnap, rateMeStored) {
    if (rateMeStored === true) {
        console.log("do stuff here");
    }
}


