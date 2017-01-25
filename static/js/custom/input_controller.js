
app.controller('myCtrl', ['$http','$scope', 'Predictions','Brandid', function($http,$scope,Predictions,Brandid) {
// Predictions (=factory) calls the Flask server to get 3 most likely brands for the product title given
// Brandid (=factory) calls the Flask server to get the url for the logo of the brand


	$scope.productTitle = "Gemey Paris Le colossal";
    
    $scope.doSearch = function () {    
        Predictions($scope.productTitle) //makes call to predictions_factory.js to get predictions for the product title
            .then(function (response) {
                   // alert(response.data.results);
                  $scope.predictions_data = response.data.results;
              }, function (error) {
                  $scope.predictions_data = 'Error' + error.message;
              });
    };
    
    $scope.brandidinfo = "test waarde";
    
    $scope.options = {
      showLines: false,
      responsive: false,
      scales: {
            xAxes: [{
                ticks: {
                    min: 0,
                    max: 1
                },
                gridLines: {
                    display: false
                },
                display: false
            }],
            yAxes: [{
                gridLines: {
                    display: false
                },
                display: false
            }]
       }
    };
       
    $scope.doSearch();
	
}]);
