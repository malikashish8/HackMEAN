<<<<<<< HEAD
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
$("#loginForm").submit(function(event) {
    console.log("login attempt");
    $.post("/post",$("#loginForm").serialize())
    .done(alert("loggin in"))
    .fail(alert("login failed"));
});
=======
addSuccessMessage = function (data) {
  $('#success-message').css('visibility', 'visible');
  $('#success-message').html(data).fadeIn('slow');
  // $('#msg').html("data insert successfully").fadeIn('slow') //also show a success message
  $('#success-message').delay(1000).fadeOut('slow');
}
addErrorMessage = function (data) {
  $('#error-message').css('visibility', 'visible');
  $('#error-message').html(data).fadeIn('slow');
  // $('#msg').html("data insert successfully").fadeIn('slow') //also show a success message
  $('#error-message').delay(3000).fadeOut('slow');
}
openNewPostForm = function () {
  $('#newPostForm').css('visibility', 'visible');
}
closeNewPostForm = function () {
  $('#newPostForm').css('visibility', 'hidden');
}
>>>>>>> 0ef1f378c55112e6ed040ba134cbaac3e6e1f1c5
