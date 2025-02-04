function nl2br(str, is_xhtml) {
  if (typeof str === "undefined" || str === null) {
    return "";
  }
  var breakTag = is_xhtml || typeof is_xhtml === "undefined" ? "<br />" : "<br>";
  return (str + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + breakTag + "$2");
}

function displayMeals(meals) {
  $("#results").html("");

  for (const meal of meals) {
    let html = `<h2>${meal.strMeal}</h2>
    <div><img src="${meal.strMealThumb}" alt="${meal.strMeal}"></div>`;

    if (meal.strIngredient1) {
      html += "<h3>Ingredients</h3>";
      html += "<ul>";

      for (let i = 1; i < 20; i++) {
        const keyIngredient = `strIngredient${i}`;
        const keyMeasure = `strMeasure${i}`;
        if (meal[keyIngredient]) {
          html += `<li>${meal[keyMeasure]} ${meal[keyIngredient]}</li>`;
        }
      }
      html += "</ul>";
    }

    if (meal.strInstructions) {
      html += `<h3>Instructions</h3><p>${nl2br(meal.strInstructions)}</p>`;
    }

    if (meal.strSource) {
      html += `<div><a href="${meal.strSource}">Source</a></div>`;
    }

    if (meals.length > 1) {
      html += `<div><a href="#" class="meal" data-id="${meal.idMeal}">View meal</a></div>`;
    }

    $("#results").append(html).show();
  }

  if (meals.length > 1) {
    $(".meal").on("click", function (e) {
      e.preventDefault();
      const id = $(this).data("id");

      $.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .done(function (data) {
          console.log(data);
          displayMeals(data.meals);
          $("#results").get(0).scrollIntoView({ behavior: "smooth" });
        })
        .fail(function (error) {
          console.log(error);
          alert(error.statusText);
        });
    });
  }
}

$("#random").on("click", function (e) {
  e.preventDefault();

  $.get("https://www.themealdb.com/api/json/v1/1/random.php")
    .done(function (data) {
      console.log(data);
      displayMeals(data.meals);
    })
    .fail(function (error) {
      console.log(error);
      alert(error.statusText);
    });
});

$("#areas-select").on("change", function (e) {
  e.preventDefault();

  const area = $("#areas-select").val();

  $.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    .done(function (data) {
      console.log(data);
      displayMeals(data.meals);
    })
    .fail(function (error) {
      console.log(error);
      alert(error.statusText);
    });
});

$(document).ready(function () {
  $.get("https://www.themealdb.com/api/json/v1/1/list.php?a=list").done(function (data) {
    const areas = data.meals;
    for (const area of areas) {
      $("#areas-select").append(`<option value="${area.strArea}">${area.strArea}</option>`);
    }
  });
});
