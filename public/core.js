var angPost = angular.module('hackMean', []);

function mainController($scope, $http) {
    $scope.formData = {};

    $http.get('/post')
        .success(function(data) {
            $scope.posts = data;
            console.log(data);
        })
        .error(function(data){
            console.log('Error '+data);
        })
}