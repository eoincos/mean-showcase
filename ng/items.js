angular.module('theShowcase').factory('items', ['$http', 'auth', function ($http, auth) {
        var o = {
            items: []
        };

        o.getAll = function () {
            return $http.get('/items').success(function (data) {
                angular.copy(data, o.items);
            });
        };

        o.create = function (item) {
            return $http.post('/items', item, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).success(function (data) {
                o.items.push(data);
            });
        };

        o.upvote = function (item) {
            return $http.put('/items/' + item._id + '/upvote', null, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            })
                    .success(function (data) {
                        item.upvotes += 1;
                    });
        };
        
        o.downvote = function(item) {
            return $http.put('/items/' + item._id + '/downvote', null, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            })
                    .success(function(data) {
                        item.upvotes -= 1;
                    });
        };

        o.get = function (id) {
            return $http.get('/items/' + id).then(function (res) {
                return res.data;
            });
        };

        o.addComment = function (id, comment) {
            return $http.post('/items/' + id + '/comments', comment, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            });
        };

        o.upvoteComment = function (item, comment) {
            return $http.put('/items/' + item._id + '/comments/' + comment._id + '/upvote', null, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            })
                    .success(function (data) {
                        comment.upvotes += 1;
                    });
        };

        o.downvoteComment = function(item, comment) {
            return $http.put('/items/' + item._id + '/comments/'+ comment._id + '/downvote', null, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            })
                    .success(function(data){
                        comment.upvotes -= 1;
                    });
        };
        
        return o;
    }]);
