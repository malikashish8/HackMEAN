addSuccessMessage = function(data) {
    $('#success-message').css('visibility', 'visible');
    $('#success-message').html(data).fadeIn('slow');
    //$('#msg').html("data insert successfully").fadeIn('slow') //also show a success message
    $('#success-message').delay(1000).fadeOut('slow');
}
addErrorMessage = function(data) {
    $('#error-message').css('visibility', 'visible');
    $('#error-message').html(data).fadeIn('slow');
    //$('#msg').html("data insert successfully").fadeIn('slow') //also show a success message
    $('#error-message').delay(3000).fadeOut('slow');
}
openNewPostForm = function() {
    $('#newPostForm').css('visibility', 'visible');
}
closeNewPostForm = function() {
    $('#newPostForm').css('visibility', 'hidden');
}