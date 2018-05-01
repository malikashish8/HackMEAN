addSuccessMessage = function(data) {
    var append = false;
    if($('#success-message').css('display') !== 'none')
        append = true;
    $('#success-message').css('display', '');
    $('#success-message').html(data).fadeIn('fast');
    $('#success-message').delay(1000).fadeOut('fast');
}
addErrorMessage = function(data) {
    $('#error-message').css('visibility', 'visible');
    $('#error-message').html(data).fadeIn('fast');
    $('#error-message').delay(1000).fadeOut('fast');
}
openNewPostForm = function() {
    $('#newPostForm').css('visibility', 'visible');
    $('#mainContainer').css('filter', 'blur(2px)');
    $('#newPostForm').css('filter', 'blur(0px)');
}
closeNewPostForm = function() {
    $('#newPostForm').css('visibility', 'hidden');
    $('#mainContainer').css('filter', 'blur(0px)')
    $('#newPostTitle').html('');
    $('#newPostBody').html('');
}