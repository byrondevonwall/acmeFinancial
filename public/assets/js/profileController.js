acmeApp.controller('profileController', function($scope, $http, $location){
  //get logged users guid out of localStorage
  var guid = localStorage.getItem('guid');
  // console.log(guid);

  //use guid to get user data
  $http.get('/users/'+guid).then(function successCallback(user){
    // console.log(user.data);
    //populate page with user data
    $scope.user = user.data;
    // console.log($scope.user);
  }, function errorCallback(res){
    console.log(res);
    //if error, go back to login
    $location.path('/login');
  });

  $scope.edit = function(){
    $location.path('/edit');
  }

});//end controller
