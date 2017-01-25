// good explanations of how to work with factories (with parameters):
// http://stackoverflow.com/questions/24132368/passing-parameters-to-angularjs-http-factory?rq=1
// http://weblogs.asp.net/dwahlin/using-an-angularjs-factory-to-interact-with-a-restful-service

// doe voorspelling van merken obv titel
app.factory('Predictions', ['$http', function ($http) { 
    return function(productTitle){
          return $http.post('http://127.0.0.1:5000/api', {"title":productTitle});
    };
}]);

//haal url van logo op 
app.factory('Brandid', ['$http', function($http) {
    return function(id) {
        return $http.get('http://127.0.0.1:5000/partyid', {params: {"partyid":id}})
            .success(function(status) {
            //alert('success');
            })
            .error(function(status) {
            alert('error');
            });
        };
}]);
    