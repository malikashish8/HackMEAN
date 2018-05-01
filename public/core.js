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
        })
    $scope.deletePost = function(post) {
        var postId = post._id;
        $http.delete('/post/'+ postId).success(function(data){
            console.log("Post Delete Success "+data);
            $scope.posts.splice($scope.posts.indexOf(post), 1);
            addSuccessMessage(data.message);
        }).error(function(data){
            addErrorMessage(data.message);
        }) 
    }
    $scope.deleteComment = function(comment) {
        var commentId = comment._id;
        console.log("Deleting Comment: "+commentId);
        $http.delete('/comment/'+commentId).success(function(data){
            console.log("Comment Delete Success "+data);
            $scope.comments.splice($scope.comments.indexOf(comment), 1);
            addSuccessMessage(data.message);
        }).error(data => {
            addErrorMessage(data);
        })
    }
    $scope.submitNewPost = function(form) {
        var title = (document.getElementById("newPostTitle").value);
        var body = (document.getElementById("newPostBody").value);
        var newPost = {title: title, body: body, user: $scope.users[0].username};
        $http.post('/post', newPost).success((data) => {
            console.log("New post created "+data);
            $scope.posts.push(data.post);
            closeNewPostForm();
            addSuccessMessage(data.message);
        }).error(err =>{
            addErrorMessage(err);
        })
    }


}