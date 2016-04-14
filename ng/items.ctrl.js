angular.module('theShowcase').controller('ItemsCtrl', [
    '$scope',
    'items',
    'item',
    'auth',
    function ($scope, items, item, auth) {
        $scope.item = item;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addComment = function () {
            if ($scope.body === '') {
                return;
            }
            items.addComment(item._id, {
                body: $scope.body,
                author: auth.currentUser
            }).success(function (comment) {
                $scope.item.comments.push(comment);
            });
            $scope.body = '';
        };

        $scope.upvote = function (comment) {
            items.upvoteComment(item, comment);
        };

	$scope.downvote = function(comment) {
            items.downvoteComment(item, comment);
	};
    }]);
