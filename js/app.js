
var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http, $timeout){


$scope.getRoute = function(url){
	$scope.loading = true;
	$http.get('/wikiroute?wiki=' + url).then(function(response){

		$scope.url = "";
		$scope.result = response.data;
		$scope.loading = false;
	})

}

})
