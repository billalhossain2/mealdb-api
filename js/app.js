const cardsContainer = document.getElementById("cards-container");
const loadMoreBtn = document.getElementById("load-more-btn");
const searchField = document.getElementById("search-field");
const searchBtn = document.getElementById("search-btn");
const loadDetailsModal = document.getElementById("loadDetailsModal");

//Show dynamic message to UI based on api
const showMsg = (status) => {
  switch (status) {
    case "LOADING":
      {
        cardsContainer.innerHTML = `<img height="300px" src="img/Loadin-spinner.gif" alt="Loading spinner....">`;
      }
      break;
    case "RESPONSE_ERROR":
      {
        cardsContainer.innerHTML = `<h4 class='error-msg'>Meal not found! Please search with another name<h4>`;
      }
      break;
    case "NETWORK_ERROR":
      {
        cardsContainer.innerHTML = `<h4 class='error-msg'>Please check your internet connection!<h4>`;
      }
      break;
    case "SUCCESS":
      {
        cardsContainer.innerHTML = "";
      }
      break;
    default: {
    }
  }
};

let restMeals = null;
const loadMealsApi = async (mealName) => {
  const API_URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
  showMsg("LOADING")
  try {
    const data = await (await fetch(API_URL)).json();
  if (data.meals) {
    showMsg("SUCCESS")
    displayMeals(data.meals);
  } else {
    showMsg("RESPONSE_ERROR")
  }
  } catch (error) {
    showMsg("NETWORK_ERROR")
  }
};

const getSingleMealApi = async mealId => {
  const SINGTLE_MEAL_API = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  const singleMeal = await (await fetch(SINGTLE_MEAL_API)).json();
  displayMealDetails(singleMeal.meals[0]);
}

loadMoreBtn.addEventListener("click", () => {
  displayMeals(restMeals);
});

searchBtn.addEventListener("click", (ev) => {
  ev.preventDefault();
  cardsContainer.innerHTML = "";
  loadMoreBtn.classList.add("d-none");
  const searchedValue = searchField.value;
  loadMealsApi(searchedValue);
});

const modalBody = document.getElementById("modal-body")
const loadDetailsModalLabel = document.getElementById("loadDetailsModalLabel")
//Display meal details to Modal
const displayMealDetails = singleMeal => {
  const {strCategory, strArea, strInstructions, strYoutube} = singleMeal;
   loadDetailsModalLabel.innerText = singleMeal.strMeal;
   modalBody.innerHTML = `
   <p><span>Catagory : </span><span>${strCategory}</span></p>
   <p><span>Area : </span><span>${strArea}</span></p>
   <p><span>Instruction : </span><span>${strInstructions.slice(0, 300)}</span></p>
   <p><span>Youtube : </span><span>${strYoutube || "Not found!"}</span></p>
   `;
}

const displayMeals = (meals) => {
  //load 6 meals each time based on condition
  if (meals.length > 6) {
    restMeals = meals.slice(6);
    meals = meals.slice(0, 6);
    loadMoreBtn.classList.remove("d-none");
  } else {
    loadMoreBtn.classList.add("d-none");
  }
  meals.forEach((meal) => {
    const { strMealThumb, strMeal, strInstructions, idMeal } = meal;
    cardsContainer.innerHTML += `
        <div class="card mb-3" style="max-width: 340px;">
            <div class="row g-0">
              <div class="col-md-4">
                <img src="${strMealThumb}" class="img-fluid rounded-start h-100" alt="...">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${strMeal}</h5>
                  <p class="card-text">${strInstructions.slice(0, 150)}</p>
                  <p class="card-text"><small onclick="getSingleMealApi('${idMeal}')" class="view-detils" data-bs-toggle="modal" data-bs-target="#loadDetailsModal">View Details</small></p>
                </div>
              </div>
            </div>
          </div>
        `;
  });
};

loadMealsApi("beef");
