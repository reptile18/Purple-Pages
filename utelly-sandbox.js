$(document).ready(function () {
  var country = "us";
  //var searchTerm = "Torchwood"
  const utelly_apiKey = "2209a3031amsh75255ffc5be015dp160642jsn9d2a71de459c";
  const omdb_apikey = "trilogy"; // "8cca386c" // not active yet
  var popup = new Foundation.Reveal($("#sectionMovieInfo"));

  $("#formSearchMovieTV").on("submit",function(event) {
    event.preventDefault();
    $("#inputSearch").prop("disabled",true);
    $("#buttonSearch").prop("disabled",true);
    $("#cards").empty();
    searchMovieTV($("#inputSearch").val().trim());
  });

  function searchMovieTV(searchTerm) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=" + searchTerm + "&country=" + country,
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
        "x-rapidapi-key": utelly_apiKey
      }
    }
    $.ajax(settings).then(function (response) {
      $("#resultsSection").removeClass("invisible");
      $("#inputSearch").prop("disabled",false);
      $("#buttonSearch").prop("disabled",false);
      $("#echoSearchTerm").text(response.term);
      $("#countResults").text(response.results.length);
      $.each(response.results, function (index, result) {

        let titleLink = $("<a>").attr("href","#").text(result.name).attr("data-imdb-id",result.external_ids.imdb.id).click(onTitleClick).attr("data-open","sectionMovieInfo").addClass("entertainmentTitle");
        let header = $("<h5>").append(titleLink);
        
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

  function onTitleClick(event) {
    console.log("click");
    var modal = $("#sectionMovieInfo");
    modal.empty();
    $.ajax({
      url: "https://www.omdbapi.com/?apikey=8cca386c&i=" + $(this).data("imdb-id"),
      method: "get"
    }).done(function(response) {
      var yearSpan = $("<small>").text("("+response.Year+")");
      var titleDiv = $("<h2>").text(response.Title).append(yearSpan).addClass("cell");

      var rating = $("<span>").text(response.Rated).addClass("cell label secondary small-2 marginalizedLabel");
      var runtime = $("<span>").text(response.Runtime).addClass("cell label secondary small-2 marginalizedLabel");
      var glanceList = $("<div>").append(rating,runtime).addClass("cell grid-x align-center");
      $.each(response.Genre.split(", "),(element,item)=>{
        console.log(item);
        let genreType = $("<span>").text(item).addClass("cell label secondary small-2 marginalizedLabel");
        glanceList.append(genreType);
      });
      /*response.Genre.split(", ").forEach(element => {
        let genreType = $("<span>").text(element).addClass("badge");
        glanceList.add(genreType);
      });*/

      var starsDiv = $("<div>").text("Starring: " + response.Actors);
      var plotP = $("<p>").text(response.Plot).addClass("lead");
      var plotCallout = $("<div>").addClass("cell callout secondary").append(plotP);
      var posterDiv = $("<img>").attr("src",response.Poster).addClass("moviePoster");

      var times = $("<span>").attr("aria-hidden","true").html("&times;");
      var closeButton = $("<button>").addClass("close-button").attr("aria-label","close modal").attr("type","button").append(times).attr("data-close","");

      var contents = $("<div>").addClass("grid-y grid-margin-y align-center").append(closeButton,titleDiv,posterDiv,glanceList,starsDiv,plotCallout);
      modal.append(contents);
      
      //var popup = new Foundation.Reveal($("#sectionMovieInfo"));
      popup.open();

      //$("#sectionMovieInfo").foundation('open'); // <---- from documentation... doesn't work
    });
  }
});