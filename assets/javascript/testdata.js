function createTestData() {
    let larryId = writeUserData("Larry", "larry@gmail.com", "Atlanta", "Georgia");
    console.log("larryId: ", larryId);
    let moeId = writeUserData("Moe", "moe@gmail.com", "Atlanta", "Georgia");
    console.log("moeId: ", moeId);
    let curlyId = writeUserData("Curly", "curly@gmail.com", "Atlanta", "Georgia");
    console.log("curlyId: ", curlyId);

    let taqueriaDelSolId = writeRestaurantData("123", "Taqueria del Sol", "433 N. McDonough St.", "Atlanta", "GA", "30033", 0, 0, "(404) 400-0509", "Mexican", 2);
    console.log("taqueriaDelSolId: ", taqueriaDelSolId);
    let sapporoId = writeRestaurantData("456", "Sapporo de Napoli", "", "Atlanta", "GA", "30033", 33.769805, -84.414581, "", "Italian", 2);
    console.log("sapporoId: ", sapporoId);
    let grindhouseId = writeRestaurantData("789", "Grindhouse Killer Burgers", "", "Atlanta", "GA", "30033", 0, 0, "", "American", 2);
    console.log("grindhouseId: ", grindhouseId);

    let tacoId = writeDishData("beef taco supreme", taqueriaDelSolId, "", 2, 1.5, 1, 2.4, 2, 2.76, 5, "https://firebasestorage.googleapis.com/v0/b/dish-it.appspot.com/o/images%2Fbeef-tacos.jpg?alt=media&token=c0f7b553-373f-4f0d-bea7-22cd524c1fe5", 1);
    console.log("tacoId: ", tacoId);
    let cheesePizzaId = writeDishData("cheese pizza", sapporoId, "", 2, 1, 4, 2, 1, 2, 3.60, "https://firebasestorage.googleapis.com/v0/b/dish-it.appspot.com/o/images%2Fcheese-pizza.jpg?alt=media&token=ced316ad-ab07-4146-b6ea-04f7e400980b", 1);
    console.log("cheesePizzaId: ", cheesePizzaId);
    let cheeseburgerId = writeDishData("cheeseburger", grindhouseId, "", 2, 2, 3, 1, 1, 1, 4.24, "https://firebasestorage.googleapis.com/v0/b/dish-it.appspot.com/o/images%2Fcheeseburger.jpg?alt=media&token=bbbf89f2-1d7a-4246-aed5-0f3b51883302", 1);
    console.log("cheeseburgerId: ", cheeseburgerId);

    let tacoRating = writeRatingData(tacoId, "beef taco supreme", "123", larryId, "Awesome Tacos!", 1.5, 1, 2.4, 2, 1.76, 4.23, "https://firebasestorage.googleapis.com/v0/b/dish-it.appspot.com/o/images%2Fbeef-tacos.jpg?alt=media&token=c0f7b553-373f-4f0d-bea7-22cd524c1fe5");
    console.log("tacoRating: ", tacoRating);
    let pizzaRating = writeRatingData(cheesePizzaId, "cheese pizza", "456", moeId, "Best Pizza in Decatur!!", 1, 2, 3, 1, 1, 5, "https://firebasestorage.googleapis.com/v0/b/dish-it.appspot.com/o/images%2Fcheese-pizza.jpg?alt=media&token=ced316ad-ab07-4146-b6ea-04f7e400980b");
    console.log("pizzaRating: ", pizzaRating);
    let burgerRating = writeRatingData(cheeseburgerId, "cheeseburger", "789", curlyId, "Burgers are better than FarmBurger and shakes too!", 1, 2, 2, 2, 1, 4, "https://firebasestorage.googleapis.com/v0/b/dish-it.appspot.com/o/images%2Fcheeseburger.jpg?alt=media&token=bbbf89f2-1d7a-4246-aed5-0f3b51883302");
    console.log("burgerRating: ", burgerRating);
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

function writeRatingData(dishId, dishName, yelpId, userId, text, sourScale, sweetScale, spicyScale,
    saltyScale, umamiScale, rating, image) {
    let insertedData = db.ref('ratings/').push({
        dishId,
        dishName,
        yelpId,
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

function writeDishData(name, restaurantId, price, avgSourScale, avgSweetScale, avgSpicyScale,
    avgSaltyScale, avgUmamiScale, avgRating, image, numRatings) {
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
        numRatings,
    });
    return insertedData.getKey();
}