var angPost = angular.module('hackMean', []);

function mainController ($scope, $http) {
  $scope.formData = {};

  $http.get('/post')
    .success(function (data) {
      $scope.posts = data;
    })
    .error(function (data) {
      console.log('Error ' + data);
    })

  $http.get('/user')
    .success(function (data) {
      $scope.users = data;
    })
  $http.get('/comment')
    .success(function (data) {
      $scope.comments = data;
    })
  $scope.deletePost = function (postId) {
    console.log('Deleting Post: ' + postId);
    $http.delete('/post/' + postId).success(function (data) {
      console.log('Post Delete Success ' + data);
      mainController($scope, $http);
      addSuccessMessage(data.message);
    }).error(function (data) {
      addErrorMessage(data.message);
    })
  }
  $scope.deleteComment = function (commentId) {
    console.log('Deleting Comment: ' + commentId);
    $http.delete('/comment/' + commentId).success(function (data) {
      console.log('Comment Delete Success ' + data);
      mainController($scope, $http);
      addSuccessMessage(data.message);
    }).error(data => {
      addErrorMessage(data);
    })
  }
  $scope.submitNewPost = function (form) {
    var title = (document.getElementById('newPostTitle').value);
    var body = (document.getElementById('newPostBody').value);
    $http.post('/post', { title: title, body: body }).success(data => {
      console.log('New post created')
    }).error(err => {
      console.log(err);
    })
  }
  $scope.login = function () {
    var username = (document.getElementById('username').value);
    var password = (document.getElementById('password').value);
    $http.post('/login', { username: username, password: password }).success(data => {
      if (data.user !== undefined) {
        addSuccessMessage(data.message);
        // add login logic

        $scope.loggedIn = true;
      } else if (data.message !== undefined) {
        console.log('Data: ' + data);
        addErrorMessage(data.message);
      } else {
        addErrorMessage('Connection failed!');
        console.log('no data');
      }
    })
  }
}
