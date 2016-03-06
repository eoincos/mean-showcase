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
                link: $scope.link
            });
            $scope.title = '';
            $scope.link = '';
        };

        $scope.upvote = function(item) {
            items.upvote(item);
        };
        
	$scope.downvote = function(item) {
            items.downvote(item);
	};
    }]);
