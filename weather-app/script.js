$(document).ready(function () {
    var date = new Date();
    var current_hour = date.getHours();
    var current_minute = date.getMinutes();
    var latitude, longitude;
    var tempMetric;
    var tempImperial;
    var shownTemp;
    var weahterDes;

    var day;
    switch (new Date().getDay()) {
    case 0:
        day = "Sunday";
        break;
    case 1:
        day = "Monday";
        break;
    case 2:
        day = "Tuesday";
        break;
    case 3:
        day = "Wednesday";
        break;
    case 4:
        day = "Thursday";
        break;
    case 5:
        day = "Friday";
        break;
    case 6:
        day = "Saturday";
    }

    function titleCase(str) {
        var wordArray = str.toLowerCase().split(' ');
        for (var i = 0; i < wordArray.length; i++) {
            var wordControl = wordArray[i].split('');
            wordControl[0] = wordControl[0].toUpperCase();
            wordControl = wordControl.join('');
            wordArray[i] = wordControl;
        }
        wordArray = wordArray.join(' ');
        return wordArray;
    }

    function renderPage(data, tempreture) {
        if (current_hour > 6 && current_hour < 18) {
            $(".card").css({
                'background-color': 'yellow',
                'opacity': '1',
                'color': 'black'
            });
            var weatherIcon = 'wi wi-owm-day-' + data.weather[0].id;
            $('#icon').addClass(weatherIcon);

        } else {
            $(".card").css({
                'background-color': '#293b5b',
                'opacity': '1',
                'color' : 'white'
            });
            var weatherIcon = 'wi wi-owm-night-' + data.weather[0].id;
            $('#icon').addClass(weatherIcon);
        }
        $("#city").html(data["name"]);
        shownTemp = tempreture;
        weahterDes = titleCase(data["weather"][0]["description"]) + ", ";
        $(".weatherDescription").html(weahterDes + shownTemp + "°");
        var t = "AM";
        if (current_hour > 12) {
            t = "PM";
            current_hour -= 12;
        }
        $(".date").html(day + " " + current_hour + ":" + current_minute + " " + t);
        $(".wait").css({
            'display': 'none'
        });
    };

    $('.card').on('click', function () {
        if (shownTemp == tempMetric) {
            shownTemp = tempImperial;
        } else {
            shownTemp = tempMetric;
        }
        $(".weatherDescription").html(weahterDes + shownTemp + "°");
    });

    $(document).ready(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handle_geolocation_query, handle_errors);
        } else {
            $(".wait").html('Device probably not ready.');
        }
    });

    function handle_errors(error) {
      $(".wait").html('Problem Fetching Location.');
    };

    function handle_geolocation_query(position) {
        latitude = Math.floor(position.coords.latitude);
        longitude = Math.floor(position.coords.longitude);
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid=d969f5064e8a93cd6c941ad205c38384&units=metric",
            success: function (data) {
                tempMetric = Math.floor(data["main"]["temp"]);
                tempImperial = Math.floor(tempMetric * 9 / 5 + 32);
                renderPage(data, tempMetric);
            },
        });
    };
});
