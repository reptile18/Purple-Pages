$(document).ready(function () {
  var country = "us";
  //var searchTerm = "Torchwood"
  const apiKey = "2209a3031amsh75255ffc5be015dp160642jsn9d2a71de459c";

  $("#formSearchMovieTV").on("submit",function(event) {
    event.preventDefault();
    $("#cards").empty();
    searchMovieTV($("#inputSearch").val().trim());
  });

  function searchMovieTV(searchTerm) {
    console.log("did I get here?");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=" + searchTerm + "&country=" + country,
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
        "x-rapidapi-key": apiKey
      }
    }
    $.ajax(settings).then(function (response) {
      $("#resultsSection").removeClass("invisible");
      $("#echoSearchTerm").text(response.term);
      $("#countResults").text(response.results.length);
      $.each(response.results, function (index, result) {


        let header = $("<h5>").text(result.name);
        let headerDiv = $("<div>").addClass("card-divider").append(header);

        let image = $("<img>").attr("src", result.picture);
        let imageDiv = $("<div>").addClass("card-section").append(image);

        //let locationsDiv = $("<div>").addClass("card-section flex-container align-spaced");
        let locationsDiv = $("<div>").addClass("card-section grid-x grid-margin-x grid-margin-y");

        $.each(result.locations, function (index, location) {
          let icon = location.icon;
          let title = location.display_name;
          let link = location.url;

          let iconImg = $("<img>").attr("src", icon).addClass("locationIcon");
          let locationEl = $("<a>").addClass("cell small-6 large-4").attr("href", link).attr("title", title).html(iconImg);
          locationsDiv.append(locationEl);
        });

        let card = $("<div>").addClass("card cell large-6").append(headerDiv, imageDiv, locationsDiv);
        $("#cards").append(card);
      });
      console.log(response);
    });
  }
});