var channels = ["ESL_SC2", "OgamingSC2", "freecodecamp", "storbeck", "habathcx", "RobotCaleb"];


var channelTemplateOffline = "" +
'<a href="https://www.twitch.tv/{{display_name}}">' +
'<div class="row channel offlineChannel">' +
'<div class="col-sm-3 col-xs-4 channellogo">' +
'<img class="img-responsive" src="{{logo}}" alt="">' +
'</div>' +                           
'<div class="col-sm-9 col-xs-8 channelDetails">' +
'<p class="channelName">{{display_name}}</p>' +
'<p class="channelStream offline">Offline</p>' +
'</div>' +
'</div>' +
'</a>';

function truncateString(str, num) {
  if (num >= str.length) {
    return str;
  }
  else if (num <= 3) {
    return str.substr(0,num) + "...";
  }
  else {
    return str.substr(0,num - 3) + "  ...";
  }
}

channels.forEach(function (channel, index) {
    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/channels/'+channel,
        headers: {
            'Client-ID': '7k5b5nz2o4hki5beczpsmg3m37ajf59'
        },
        success: function (data) {
            renderChannels(data);
        }
    });

});

function renderChannels(data) {
    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/streams/' + data.display_name,
        headers: {
            'Client-ID': '7k5b5nz2o4hki5beczpsmg3m37ajf59'
        },
        success: function (streamData) {
            if (streamData.stream != null) {
                $(".channels").append('<a href="https://www.twitch.tv/'+ data.display_name +'"> <div class="row channel onlineChannel"><div class="col-sm-3 col-xs-4 channellogo"><img class="img-responsive" src="'+ data.logo +'" alt=""></div><div class="col-sm-9 col-xs-8 channelDetails"><p class="channelName">'+data.display_name+'</p><p class="channelStream online">'+truncateString(data.status, 35)+'</p></div></div></a>');
                
            } else {
                $(".channels").append(Mustache.render(channelTemplateOffline, data));
            }
        }
    });
};


$(function() {
    $(".allBtn").on('click', function() {
        $(".onlineChannel").show();
        $(".offlineChannel").show();
    });
    $(".onlineBtn").on('click', function() {
        $(".onlineChannel").show();
        $(".offlineChannel").hide();
    });
    $(".offlineBtn").on('click', function() {
        $(".onlineChannel").hide();
        $(".offlineChannel").show();
    });
});