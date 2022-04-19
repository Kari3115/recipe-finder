$(document).ready(function() {
  $.ajax("https://cq055i5m06.execute-api.us-east-1.amazonaws.com/recipes", {
    type: "GET"
  })
  .done(function (data, textStatus, jqXHR) {
    createGrid(data.Items);
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.log(jqXHR.responseText);
    alert("Server error. Try again later.");
  });
});

function createGrid(gridData) {
  new gridjs.Grid({
    columns: [
      {id: "name", name: "Name", width: "70%"},
      {id: "by", name: "Made By", width: "15%"},
      { 
        name: "Actions",
        width: "15%",
        formatter: (cell, row) => {
          return gridjs.h("button", {
            className: "btn btn-sm btn-info",
            onClick: () => populateRecipe(row.cells[0].data)
          }, "View Recipe");
        }
      }
    ],
    data: gridData,
    search: true,
    sort: true,
    pagination: {
      limit: 10
    },
    fixedHeader: true,
    resizable: true,
  }).render(document.getElementById("wrapper"));
}

function populateRecipe(name) {
  $.ajax("https://cq055i5m06.execute-api.us-east-1.amazonaws.com/recipes/" + name, {
    type: "GET"
  })
  .done(function (data, textStatus, jqXHR) {
    render(data.Item);
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.log(jqXHR.responseText);
    alert("Server error. Try again later.");
  });
}

function render(data) {
  name = `<h3 class="card-title">${data.name}</h3>`
  ingredients = "<h4>Ingredients</h4><ul>";
  data.ingredients.forEach(el => {
    ingredients += `<li>${el}</li>`
  });
  ingredients += "</ul>";
  directions = "<h4>Directions</h4><ol>";
  data.directions.forEach(el => {
    directions += `<li>${el}</li>`
  });
  directions += "</ol>";
  back = `<button class="btn btn-sm btn-light btn-outline-dark" onclick="backtoall()">Back to All Recipes</button>`;
  $("#rec").html(name + ingredients + directions + back);
  $("#all").hide();
  $("#rec").show();
}

function backtoall() {
  $("#rec").hide();
  $("#all").show();
}