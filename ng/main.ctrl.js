angular.module('theShowcase').controller('MainCtrl', [
    '$scope',
    'items',
    'auth',
    function ($scope, items, auth) {
        $scope.items = items.items;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addItem = function () {
            if (!$scope.title || $scope.title === '') {
                return;
            }
            items.create({
                title: $scope.title,
                link: $scope.link,
                author: auth.currentUser,
                image: $scope.image
            });
            $scope.title = '';
            $scope.link = '';
            $scope.image = '';
        };

        $scope.upvote = function(item) {
            items.upvote(item);
        };
        
	$scope.downvote = function(item) {
            items.downvote(item);
	};
    }]);
