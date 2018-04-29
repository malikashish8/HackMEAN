addSuccessMessage = function(data) {
    $('#success-message').html(data).fadeIn('slow');
    //$('#msg').html("data insert successfully").fadeIn('slow') //also show a success message
    $('#success-message').delay(5000).fadeOut('slow');
}
addErrorMessage = function(data) {
    $('#error-message').html(data).fadeIn('slow');
    //$('#msg').html("data insert successfully").fadeIn('slow') //also show a success message
    $('#error-message').delay(5000).fadeOut('slow');
}