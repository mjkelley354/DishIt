let rateMe = false;
let restName = "";
let address = "";
let city = "";
let state = "";
let zipCode = "";
let dishImage = "";
let dishName = "";
let phone = "";
let dishId = "";

// if rate-btn clicked, the new dish page will open and autofill with restaurant name 
// (in local storage as an array of one, with rIndex = 0)
// and the same dish name

$(document).on("click", "#rate-btn", function () {
    dishId = ($(this).attr("dish-id-value"));
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

            console.log(restName);
            window.location.href="newdish.html"
        });
    });

    pageInit();
});

function pageInit() {
    if ($("body").attr("data-title") === "newdish-page") {
        $(document).ready(function () {
            // enter code for autofilling new dish page here
    
        });
    };
}
