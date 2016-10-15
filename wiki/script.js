var firstSearch = true;
$(function () {
    console.log("Loaded Page");
    //setup before functions
    var typingTimer; //timer identifier
    var doneTypingInterval = 700; //time in ms, 5 second for example
    var $input = $('#searchInput');

    //on keyup, start the countdown
    $input.on('keyup', function (e) {
        if (e.which == 8 || e.which >= 48 && e.which <= 57 || e.which >= 65 && e.which <= 90 || e.which >= 97 && e.which <= 122) {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(getSearchResults, doneTypingInterval);
        }
    });

    //on keydown, clear the countdown 
    $input.on('keydown', function (e) {
        if (e.which == 8 || e.which >= 48 && e.which <= 57 || e.which >= 65 && e.which <= 90 || e.which >= 97 && e.which <= 122) {
            clearTimeout(typingTimer);
        }
    });
    
    $($input).submit(function(){
      getSearchResults();
    });
});

function getSearchResults() {
    if (firstSearch) {
        $('#wikiLogo').addClass('hide');
        $('#lucky').addClass('hide');
        $('.topContainer').css({
            "top": "60px"
        });
        firstSearch = false;
    }
        
    $('.resultList').empty();
    var sInput = $('#searchInput').val();
    console.log(sInput);
    $.ajax({
        url: '//en.wikipedia.org/w/api.php',
        data: {
            action: 'query',
            list: 'search',
            srsearch: sInput,
            format: 'json',
            srlimit: 10
        },
        dataType: 'jsonp',
        success: function (rData) {
            $('#resultTitle').empty();
            for (var i = 0; i < 10; i++) {
                renderResults(rData, i);
                $('.resultList').css("opacity", "1");
            };
        }
    });
};


function renderResults(resultsData, i) {
    $.ajax({
        url: '//en.wikipedia.org/w/api.php',
        data: {
            action: 'query',
            titles: resultsData.query.search[i].title,
            prop: 'extracts',
            exintro: '',
            format: 'json'
        },
        dataType: 'jsonp',
        success: function (idData) {
            var pageId = Object.keys(idData.query.pages);
            $('.resultList').append('<a href="https://en.wikipedia.org/?curid=' + pageId + '"><div class="result"><h3 id="resultTitle">' + resultsData.query.search[i].title + '</h3><p id="resultSnippet">' + idData.query.pages[pageId].extract + '</p></div></a>');
        }
    });
};