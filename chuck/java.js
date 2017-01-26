$(document).ready(function () {
    $("#getQuote").click(function () {
        $.ajax({
            type: "GET",
            url: "http://api.icndb.com/jokes/random",
            success: function (data) {
                $(".QuoteText").html(data["value"]["joke"]);
            },
        });
    });
});


$(document).ready(function () {
    
    $("#QuoteCard").click(function () {
        var color = ["#E63946", "#CB429F", "#FCAB10", "#2B9EB3", "#5E5E5E"];
        var random = color[Math.floor(Math.random() * color.length)];
        while (random === $("#QuoteCard").css("background-color")) {
            random = color[Math.floor(Math.random() * color.length)];
        };
        $.ajax({
            url: "http://api.icndb.com/jokes/random",
            jsonp: "callback",
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                $(".parent").parent().fadeToggle(500, function () {
                    $(".QuoteText").html(data["value"]["joke"]).parent().css("background-color", random);
                    $(".parent").parent().fadeToggle(500);
                    $('#tweet').attr('href', 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + data["value"]["joke"] + '"'));
                });

            },
            xhrFields: {
                withCredentials: false
            }
        });
    });
});