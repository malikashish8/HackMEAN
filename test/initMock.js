var fs = require('fs');
var mongoose = require('mongoose');
User = mongoose.model('User'),
  Post = mongoose.model('Post'),
  Comment = mongoose.model('Comment');
  _ = require('lodash');

exports.initMock = function(){

    fs.readFile("./test/mockdata.json",'utf8', function(err,mockData){
    mockData = JSON.parse(mockData);
    //catching all promise rejections since users requires unique name
    mockData.users.forEach(user => { new User(user).save().catch(() => {}); })
    mockData.posts.forEach(post => {
        User.find({}, 'username',function(err,all_users){
            post.author = _.sample(all_users).username;
            post.time = new Date();
            new Post(post).save();
        });
    })
    mockData.comments.forEach(comment => {
        User.find({}, 'username',function(err,all_users){
            comment.user=_.sample(all_users).username;
            comment.time = new Date();
            Post.find({},'_id',function(err,all_post_ids){
                comment.postId = _.sample(all_post_ids).id;
                new Comment(comment).save();
            })
        });
      });
});
}


