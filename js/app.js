
var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http, $timeout){

//call to our api to search wiki
$scope.getRoute = function(url){
	
	$scope.loading = true;

	$http.get('/wikiroute?wiki=' + url).then(function(response){

		$scope.url = ""; //clear out our input
		$scope.result = response.data;

		$scope.loading = false;
	})

}

})
