var app = angular.module('brandApp', ['chart.js']);

// ipv can {{ gebruik ik // omdat niet alleen Angular {{ gebruikt, maar Jinja templates ook
app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('//').endSymbol('//');
});

