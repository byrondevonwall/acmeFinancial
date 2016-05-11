acmeApp.controller('loginController', function($scope, $rootScope, $http, $location){
  $scope.login = function(){
    //empty obj for formData
    $scope.user = {};
    console.log($scope.user.email, $scope.user.password);
    console.log($('#user-email').val(), $('#user-pass').val());
    //log in
    $http.post('/login', {
      email: $('#user-email').val(),
      password: $('#user-pass').val()
    }).then(function successCallback(user){
      //auth success
      console.log(user.data.guid);
      localStorage.setItem('guid', user.data.guid)
      $rootScope.message = 'Authentication successful!';
      $location.path('/profile');

    }, function errorCallback(res){
      //auth failed
      console.log(res);

      $rootScope.message = 'Authentication failed';
      $location.path('/login');
    });
  };
});
