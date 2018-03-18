var angPost = angular.module('hackMean', []);

function mainController($scope, $http) {
    $scope.formData = {};

    $http.get('/post')
        .success(function(data) {
            $scope.posts = data;
        })
        .error(function(data){
            console.log('Error '+data);
        })
    $http.get('/user')
        .success(function(data) {
            $scope.users = data;
        })
    $http.get('/comment')
        .success(function(data) {
            $scope.comments = data;
            console.log(this);
        })
}