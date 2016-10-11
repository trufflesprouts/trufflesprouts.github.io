$(function () {
    var $friends = $('#friendsList');
    var $name = $('#name');
    var $age = $('#age');
    
    function addFriend(friend) {
        $friends.append('<li>Name: '+ friend.name +'<br/>Age: ' + friend.age + '<button class="remove" data-id="' + friend.id + '"> X </button></li>');
    }
    
    $.ajax( {
       type: 'GET',
        url: 'http://rest.learncode.academy/api/John/friends',
        success: function(friends) {
            $.each(friends, function(i, friend){
                addFriend(friend);
            });
        },
        error: function() {
            alert('error fetching date' + error);
        }
        
    });
    $('#add-friend').on('click', function(){
        var friend = {
            name: $name.val(),
            age: $age.val()
        };
        $.ajax({
            type: 'POST',
            url: 'http://rest.learncode.academy/api/John/friends',
            data: friend,
            success: function(newFriend) {
                addFriend(newFriend);
            }
        })
    });
    
    $friends.delegate('.remove','click', function(){
        var $li = $(this).closest('li');
        $.ajax({
            type: 'DELETE',
            url: 'http://rest.learncode.academy/api/John/friends/' + $(this).attr('data-id'),
            success: function() {
                $li.remove();
            }
        })
    });
    
});