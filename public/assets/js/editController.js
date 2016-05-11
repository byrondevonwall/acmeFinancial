acmeApp.controller('editController', function($scope, $http, $location){
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

  $scope.save = function(){
    console.log({
      age: $scope.user.age, eyeColor: $scope.user.eyeColor, company: $scope.user.company, email: $scope.user.email, phone: $scope.user.phone, address: $scope.user.address, name:{first: $scope.user.name.first, last: $scope.user.name.last}});


    $http.put('/users/'+guid, {
      age: $scope.user.age, eyeColor: $scope.user.eyeColor, company: $scope.user.company, email: $scope.user.email, phone: $scope.user.phone, address: $scope.user.address, name:{first: $scope.user.name.first, last: $scope.user.name.last}
    }).then(function successCallback(res){
      $location.path('/profile');
    }, function errorCallback(res){
      console.log(res);
      $location.path('/edit');
    });
  }

});//end controller
