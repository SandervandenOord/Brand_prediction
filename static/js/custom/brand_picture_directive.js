// Directive om logo op te halen. 
// Deze roept Brandid (=factory) aan, wat een call doet om de url van het logo op te halen
// Gevonden url wordt toegevoegd aan de image template

app.directive('brandPicture', ['Brandid', function(Brandid) {
  return {
    restrict: 'E',
    scope: {
         title: '@'
    },
    link: function(scope) {
        Brandid(scope.title) //makes call to Brandid factory, deze zit in predictions_factory.js          
            .then(function (response) {
                    scope.result = "https://s.s-bol.com/imgbase0/" + response.data.PartyDetailList.partyDetails.properties.property[0].propertyValues.value; //dit verschrikkelijke geneste ding is de url van het logo van het merk    
                }, function (error) {
                    alert('error');
                    scope.result = 'Error' + error.message;
                }); 
    },
    template: '<img ng-src="//result//"></img>'
  };
}]);