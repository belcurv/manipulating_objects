/*jslint         browser : true, continue : true,
   devel : true,  indent : 4,      maxerr : 50,
  newcap : true,   nomen : true, plusplus : true,
  regexp : true,  sloppy : true,     vars : false,
   white : true
*/

(function () {
    'use strict';

    var app = angular.module('myApp', []);
    
    // =============================== SERVICES ===============================
    app.factory('testFactory', ['$http', '$q', function ($http, $q) {

        var url = 'data/data.csv',
            
            getStuff = function () {
                return $http.get(url).then(function (data) {
                    return Papa.parse(data.data, {
                        header: true,
                        dynamicTyping: true,
                        skipEmptyLines: true,
                        complete: function (results) {
                            // console.log('Papa results: ' + results.data);
                            return results.data;
                        }
                    });
                });
            };

        return {
            getStuff: getStuff
        };
        
    }]);
    

    // ============================= CONTROLLERS ==============================
    app.controller('mainController', ['$scope', 'testFactory', function ($scope, testFactory) {
        
        testFactory.getStuff().then(function (results) {
            
            var rawData = [],
                uniqueDates,
                formattedData = {};

            // bind input data to $scope object
            $scope.results = results.data;


            // ====================== begin type conversion =======================
            results.data.forEach(function (each) {
                rawData.push({
                    source: each.source, // stay a string
                    target: each.target, // stay a string
                    value: +each.value,  // conv to number
                    annum: each.annum    // stay a string
                    // annum: Date.parse(each.annum) // conv to js date
                });
            });
            // ======================= end type conversion ========================


            // ================== begin find unique array elements ================
            Array.prototype.contains = function (v) {
                var i;
                for (i = 0; i < this.length; i += 1) {
                    if (this[i] === v) {
                        return true;
                    }
                }
                return false;
            };

            Array.prototype.unique = function (myQuery) {
                var i,
                    arr = [];
                for (i = 0; i < this.length; i += 1) {
                    if (!arr.contains(this[i][myQuery])) {
                        arr.push(this[i][myQuery]);
                    }
                }
                return arr;
            };

            // find uniques and sort them
            uniqueDates = rawData.unique('annum').sort();
            // =================== end find unique array elements =================


            // ====================== begin build new object ======================
            //  loop over unique dates array
            uniqueDates.forEach(function (date) {

                // add main date objects to output object
                formattedData[date] = {};

                // loop over entire 'results' object
                results.data.forEach(function (element) {

                    // if main date object !have 'source' object, add one
                    if (!formattedData[date][element.source]) {
                        formattedData[date][element.source] = {};
                    }

                    // if results date property matches main loop's 'date' property...
                    // if (Date.parse(element.annum) === date) {   // if js dates
                    if (element.annum === date) {   // if date strings

                        // populate the source object with results target & value
                        formattedData[date][element.source][element.target] = element.value;

                    }

                });
            });


            // ====================== end build new object ========================

            // bind output data to $scope object
            $scope.formattedData = formattedData;
        });

   }]);

})();