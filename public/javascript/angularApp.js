var app = angular.module('theShowcase', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'MainCtrl',
                    resolve: {
                        postPromise: ['items', function (items) {
                                return items.getAll();
                            }]
                    }
                })
                .state('items', {
                    url: '/items/{id}',
                    templateUrl: '/items.html',
                    controller: 'ItemsCtrl',
                    resolve: {
                        post: ['$stateParams', 'items', function ($stateParams, items) {
                                return items.get($stateParams.id);
                            }]
                    }
                })
                .state('login', {
                    url: '/login',
                    templateUrl: '/login.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                            if (auth.isLoggedIn()) {
                                $state.go('home');
                            }
                        }]
                })
                .state('register', {
                    url: '/register',
                    templateUrl: '/register.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                            if (auth.isLoggedIn()) {
                                $state.go('home');
                            }
                        }]
                });

        $urlRouterProvider.otherwise('home');

    }]);

app.factory('items', ['$http', 'auth', function ($http, auth) {
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

        return o;
    }]);

app.factory('auth', ['$http', '$window', function ($http, $window) {
        var auth = {};

        auth.saveToken = function (token) {
            $window.localStorage['the-showcase-token'] = token;
        };

        auth.getToken = function () {
            return $window.localStorage['the-showcase-token'];
        };

        auth.isLoggedIn = function () {
            var token = auth.getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        auth.currentUser = function () {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        auth.register = function (user) {
            return $http.post('/register', user).success(function (data) {
                auth.saveToken(data.token);
            });
        };

        auth.logIn = function (user) {
            return $http.post('/login', user).success(function (data) {
                auth.saveToken(data.token);
            });
        };

        auth.logOut = function () {
            $window.localStorage.removeItem('flapper-news-token');
        };

        return auth;
    }]);

app.controller('MainCtrl', [
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

        $scope.incrementUpvotes = function (item) {
            items.upvote(item);
        };
    }]);

app.controller('ItemsCtrl', [
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
                author: 'user'
            }).success(function (comment) {
                $scope.item.comments.push(comment);
            });
            $scope.body = '';
        };

        $scope.incrementUpvotes = function (comment) {
            items.upvoteComment(item, comment);
        };
    }]);

app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    function ($scope, $state, auth) {
        $scope.user = {};

        $scope.register = function () {
            auth.register($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $state.go('home');
            });
        };

        $scope.logIn = function () {
            auth.logIn($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $state.go('home');
            });
        };
    }]);

app.controller('NavCtrl', [
    '$scope',
    'auth',
    function ($scope, auth) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }]);