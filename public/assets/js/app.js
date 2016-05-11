var acmeApp = angular.module('acmeApp', ['ngResource', 'ngRoute']);

//this factory checks for a guid, and if there is one tells the routing to let the user see more than just login
acmeApp.factory('logged', function($rootScope){
  //create an empty object for the factory to return values
 var logged = {}
 //get the guid
 var guid= localStorage.getItem('guid');
 //if there is a token, return true for site unlock
 if(guid != null){
     logged.token = guid;
   }

 return logged;
});

//this module locks down any routes not marked as public access unless there is a guid present in the logged factory.
angular.module('acmeApp').run(function($rootScope, $location, $route, logged) {
    //tell route provider which routes are public
    var routesOpenToPublic = [];
    angular.forEach($route.routes, function(route, path) {
        // push route onto routesOpenToPublic if it has a truthy publicAccess value
        route.publicAccess && (routesOpenToPublic.push(path));
    });

    //allow user to use non-public routes only if token present
    $rootScope.$on('$routeChangeStart', function(event, nextLoc, currentLoc) {

        var closedToPublic = (-1 === routesOpenToPublic.indexOf($location.path()));
        if(closedToPublic && logged.token == undefined) {
            $location.path('/login');
        };
    });
});


//routing config
acmeApp.config(function($routeProvider, $locationProvider, $httpProvider){

  //check to see if user is logged
  var loginCheck = function($q, $timeout, $http, $location, $rootScope){
    //init promise
    var deferred = $q.defer();

    //ajax call to check
    $http.get('/loggedin').then(function successCallback(user){
      //authenticated
      if(user !== '0')
        deferred.resolve();
      //not authenticated
      else{
        $rootScope.message = 'Please log in';
        deferred.reject();
        $location.path('/login');
      }
    });
    return deferred.promise;
  };
  //interceptor for unauthorized access based on ajax error
  $httpProvider.interceptors.push(function($q, $location){
    return {
      response: function(response){
        return response;
      },
      responseError: function(response){
        if (response.status === 401)
          $location.path('/login');
        return $q.reject(response);
      }
    };
  });

  //define routes
  $routeProvider
    .when('/', {
      templateUrl: '/views/login.html',
      controller: 'loginController',
      publicAccess: true
    })
    .when('/profile', {
      templateUrl: '/views/profile.html',
      controller: 'profileController',
      // publicAccess: true,
    })
    .when('/edit', {
      templateUrl: '/views/edit.html',
      controller: 'editController',
      resolve: {
        loggedin: loginCheck
      }
    })
    .otherwise({
      redirectTo: '/'
    });

})//end of config
.run(function($rootScope, $http, $location){

  //make logout available globally
  $rootScope.logout = function(){
    $rootScope.message = 'Logged Out';
    $http.post('/logout');
    localStorage.clear();
    $location.path('/');
  };
});
