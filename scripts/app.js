var app = angular.module('app', ['ngRoute', 'ngResource'])

    .config(['$routeProvider', function ($routerProvider) {
        $routerProvider
            .when('/home', {
                templateUrl: 'templates/list.html',
                controller: 'HomeCtrl'
            })
            .when('/edit/:id', {
                templateUrl: 'templates/edit.html',
                controller: 'EditCtrl'
            })
            .when('/create/', {
                templateUrl: 'templates/create.html',
                controller: 'CreateCtrl'
            })
            .when('/addForecast/', {
                templateUrl: 'templates/addForecast.html',
                controller: 'AddForecastCtrl'
            })
            .when('/view/:id', {
                templateUrl: 'templates/view.html',
                controller: 'ViewCtrl'
            })
            .otherwise({redirectTo: '/home'});
    }])

    .controller('HomeCtrl', ['$scope', 'Cities', '$route', function ($scope, Cities, $route) {
        Cities.get(function (data) {
            $scope.cities = data.response;
        })

        $scope.remove = function (id) {
            Cities.delete({id: id}).$promise.then(function (data) {
                if (data.response) {
                    $route.reload();
                }
            })
        }
    }])

    .controller('CreateCtrl', ['$scope', 'Cities', function ($scope, Cities) {
        $scope.settings = {
            pageTitle: "Agregar ciudad",
            action: "Agregar"
        };

        $scope.city = {
            id: "",
            name: ""
        };

        $scope.submit = function () {
            Cities.save({city: $scope.city}).$promise.then(function (data) {
                if (data.response) {
                    angular.copy({}, $scope.city);
                    $scope.settings.success = "La ciudad ha sido creada correctamente!";
                }
            })
        }
    }])

    .controller('EditCtrl', ['$scope', 'Cities', '$routeParams', function ($scope, Cities, $routeParams) {
        $scope.settings = {
            pageTitle: "Editar ciudad",
            action: "Editar"
        };

        var id = $routeParams.id;

        Cities.get({id: id}, function (data) {
            $scope.city = data.response;
        });

        $scope.submit = function () {
            Cities.update({city: $scope.city}, function (data) {
                $scope.settings.success = "La ciudad ha sido editada correctamente!";
            });
        }
    }])

    .controller('AddForecastCtrl', ['$scope', 'Forecast', 'Cities', '$route', function ($scope, Forecast, Cities, $route) {
        Cities.get(function (data) {
            $scope.cities = data.response;
        })

        $scope.settings = {
            pageTitle: "Agregar pronóstico a una ciudad",
            action: "Agregar"
        };

        $scope.forecast = {
            forecast: "",
            date: "",
            id_city: ""
        };

        $scope.submit = function () {
            Forecast.save({forecast: $scope.forecast}).$promise.then(function (data) {
                if (data.response) {
                    angular.copy({}, $scope.forecast);
                    $scope.settings.success = "El pronóstico ha sido agregado correctamente!";
                }
            })
        }
    }])

    .controller('ViewCtrl', ['$scope', 'Forecast', 'Cities', '$routeParams', '$route', function ($scope, Forecast, Cities, $routeParams, $route) {
        var id = $routeParams.id;

        Cities.get({id: id}, function (data) {
            $scope.city = data.response;
        });

        Forecast.get({id: id}, function (data) {
            console.log(data.response);
            $scope.forecast = data.response;
        })

        $scope.remove = function (id) {
            Forecast.delete({id: id}).$promise.then(function (data) {
                if (data.response) {
                    $route.reload();
                }
            })
        }
    }])

    .factory('Cities', ['$resource', function ($resource) {
        return $resource('http://localhost/projects/ci_api/cities/:id', {id: "@_id"}, {
            update: {method: "PUT", params: {id: "@_id"}}
        })
    }])

    .factory('Forecast', ['$resource', function ($resource) {
        return $resource('http://localhost/projects/ci_api/forecasts/:id', {id: "@_id"}, {
            update: {method: "PUT", params: {id: "@_id"}}
        })
    }])