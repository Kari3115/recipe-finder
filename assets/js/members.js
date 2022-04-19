$(document).ready(function() {
  $("#username").text(localStorage.getItem("username"));
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
  $("#create").click(function() {
    render("Create");
  });
  $("#logout").click(function() {
    localStorage.clear();
    $(location).attr("href", "login.html");
  });
});

function createGrid(gridData) {
  new gridjs.Grid({
    columns: [
      {id: "name", name: "Name", width: "85%"},
      { 
        name: "Actions",
        width: "15%",
        formatter: (cell, row) => {
          return [
            gridjs.h("button", 
              {
                className: "btn btn-sm btn-info me-1", 
                onClick: () => updateRecipe(row.cells[0].data)
              }, 
            "Update"),
            gridjs.h("button", 
              {
                className: "btn btn-sm btn-danger", 
                onClick: () => { if(confirm("Are you sure?")) deleteRecipe(row.cells[0].data); }
              }, 
            "Delete")
          ];
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

function updateRecipe(name) {
  $.ajax("https://cq055i5m06.execute-api.us-east-1.amazonaws.com/recipes/" + name, {
    type: "GET"
  })
  .done(function (data, textStatus, jqXHR) {
    render("Update", data.Item);
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.log(jqXHR.responseText);
    alert("Server error. Try again later.");
  });
}

function deleteRecipe(name) {
  $.ajax("https://cq055i5m06.execute-api.us-east-1.amazonaws.com/recipes/" + name, {
    type: "DELETE"
  })
  .done(function (data, textStatus, jqXHR) {
    alert("Successfully Deleted Recipe. Refreshing..");
    location.reload();
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.log(jqXHR.responseText);
    alert("Server error. Try again later.");
  });
}

function insertRecipe(mode) {
  name = $("#name").val();
  ingredients = $("#ingredients").val().split("\n");
  directions = $("#directions").val().split("\n");
  by = "demouser";
  formData = {
    "name": name,
    "ingredients": ingredients,
    "directions": directions,
    "by": localStorage.getItem("username")
  }

  if (mode == "Update") {
    $.ajax("https://cq055i5m06.execute-api.us-east-1.amazonaws.com/recipes/" + $("#ogname").val(), {
      type: "DELETE"
    })
    .done(function (data, textStatus, jqXHR) {
      insert(formData, mode);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
      alert("Server error. Try again later.");
    });
  }
  else
    insert(formData, mode);
  event.preventDefault();
}

function insert(data, mode) {
  $.ajax("https://cq055i5m06.execute-api.us-east-1.amazonaws.com/recipes", {
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(data)
  })
  .done(function (data, textStatus, jqXHR) {
    alert(`Successfully ${mode}d Recipe. Refreshing..`);
    location.reload();
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.log(jqXHR.responseText);
    alert("Server error. Try again later.");
  });
}

function render(mode, data = null) {
  title = `<form onsubmit="insertRecipe('${mode}')"><h3 class="card-title">${mode} Recipe:</h3>`;
  name = `<div class="mb-3"><h4>Name</h4><input type="text" class="form-control" id="name" placeholder="Recipe Name"`;
  if (mode == "Update")
    name += `value="${data.name}"`;
  name += `required></div>`

  hidden = `<input type="hidden" id="ogname"`
  if (mode == "Update")
    hidden += `value="${data.name}"`;
  hidden += `>`;

  ingredients = `<div class="mb-3"><h4>Ingredients</h4><h6 class="text-muted">(Add ingredient using the enter key)</h6>`;
  ingredients += `<textarea class="form-control" rows="5" id="ingredients" required>`
  if (mode == "Update")
    ingredients += data.ingredients.join("\n");
  ingredients += "</textarea></div>";

  directions = `<div class="mb-3"><h4>Directions</h4><h6 class="text-muted">(Add direction using the enter key)</h6>`;
  directions += `<textarea class="form-control" rows="3" id="directions" required>`
  if (mode == "Update")
    directions += data.directions.join("\n");
  directions += "</textarea></div>";

  buttons = `<div class="mb-3">`;
  buttons += `<button class="btn btn-sm btn-info">${mode} Recipe</button>`;
  buttons += `<button type="button" class="btn btn-sm btn-light btn-outline-dark float-end" onclick="backtoall()">`
  buttons += `Back to All Recipes</button></form>`;

  $("#rec").html(title + name + hidden + ingredients + directions + buttons);
  $("#all").hide();
  $("#rec").show();
}

function backtoall() {
  $("#rec").hide();
  $("#all").show();
}