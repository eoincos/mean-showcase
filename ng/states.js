angular.module('theShowcase').config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

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
                    url: '/items/:id',
                    templateUrl: '/items.html',
                    controller: 'ItemsCtrl',
                    resolve: {
                        item: ['$stateParams', 'items', function ($stateParams, items) {
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

        $locationProvider.html5Mode(true);
    }]);
