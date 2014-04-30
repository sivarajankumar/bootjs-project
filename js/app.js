'use strict';

angular.module('Project.services', ['firebase', 'pascalprecht.translate'])
	.factory('AuthenticationService', function($http, $firebaseSimpleLogin) {
		var dataRef = new Firebase("https://tsangularjs.firebaseio.com/ts");
		var loginObj = $firebaseSimpleLogin(dataRef);
		return {
			ref: dataRef,
			loginObj: loginObj,
			// login function
			login: function (credentials) {			
				loginObj.$login('password', {
   					email: credentials.email,
   					password: credentials.password
				}).then(function(user) {
				}, function(error) {
				});
	    	},
		    isAuthenticated: function () {
		      //return !!Session.user;
		      return !!loginObj.user;
		    },
		    getUser: function() {
		    	return loginObj.$getCurrentUser();
		    },
		    // logout function
		    logout: function() {
		    	//Session.destroy();
		    	loginObj.$logout();
		    }
		};
	})
	.run(function($rootScope, $location, AuthenticationService) {
		$rootScope.$on('$routeChangeStart', function(evt, next, current) {
			// If the user is NOT logged in
			if (! AuthenticationService.isAuthenticated()) {
				$location.path('/signin');
			//} else {
			//	$location.path('/');
			}
		});

		$rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
			$rootScope.loginObj = AuthenticationService.loginObj;
			$location.path('/');
		});
		$rootScope.$on("$firebaseSimpleLogin:logout", function(e, user) {
			$rootScope.loginObj = null;
			$location.path('/signin');
		});
	});

angular.module('Project', ['ngRoute', 'Project.services'])
	.config(function($routeProvider) {
		$routeProvider
			.when('/signin', {
				controller: 'LoginController',
				templateUrl: 'bootstrap/html/signin/index.html'
			})
			.when('/contact', {
				controller: 'ContactController',
				templateUrl: 'bootstrap/html/contact.html'
			})			
			.when('/', {
				controller: 'TimeSheetController',
				templateUrl: 'bootstrap/html/timesheet/timesheet.html'
			})
			.when('/invoice', {
				controller: 'InvoiceController',
				templateUrl: 'bootstrap/html/timesheet/invoice.html'
			})
			.when('/logout', {
				controller: 'LogoutController'
			})
			.otherwise({
				redirectTo:'/'
			});
	})
	.controller('LoginController', function($scope, AuthenticationService) {
		$scope.login = function(credentials) {
			AuthenticationService.login(credentials);
		};
	})
	.controller('LogoutController', function($scope, AuthenticationService) {
		AuthenticationService.logout();
	})
	.controller('ContactController', function($scope) {

	})
	.filter('euro', function() {
		return function(data) {
			var value = "" + data; // convert to string
			if (value.length > 3) {
				return value.charAt(0) + ' ' + value.substring(1) + ' €';	
			} else {
				return value + ' €';
			}
			
		}
	});