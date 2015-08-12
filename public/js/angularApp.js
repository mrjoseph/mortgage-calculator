
/*
TODO: 
1. Build a object from the form
	A. validate form fields
	B. Format form fields

2. Ajax the form data to the node server
	A. Return data if resutls exits
	B. Return error if no resutls are returned
		1. Ask the user to widern the search

3. return json from the node server
4. Render the data to the dom
	A. Apply the mortgage calculation function
 */


//Register app module
var App = angular.module('zooplaApp',[]);

/**
 * Share skopes across controllers
 * @param  {Object} $rootScope){	var            mem                [description]
 * @param  {[type]} get:function(key){			return mem[key];		}	}} [description]
 * @return {[type]}                              [description]
 */
App.factory('store',function(){

	//Store our data to be watched 
	var data = {};

	//Return two functions to get and set our data between controllers
	return{
		//Gets a copy of data
		get:function(){
		  return data.obj;
		},
		//Sets up out data object
		set:function(o){
		  data.obj = o;
		}
	};
});


App.factory('ajaxFactory',['$http',
	function($http){

		"use strict";

		var obj = {};
		
		obj.getJson = function(data){
			if(typeof data.area == 'undefined'){
				data.area = '';
			}
			if(typeof data.postcode == 'undefined'){
				data.postcode = '';
			}
			return $http.post('/send', data);

		};
		return obj;
	}
]);


/**
 * Returns a array of numbers used to build my option list
 * @param  {Object} ){	'use strict';	var  obj [description]
 * @return function          [description]
 */
App.factory('optionSelect',function(num){
	'use strict';

	var obj = {};

	obj.getNumber = function(num){
		return new Array(num);
	};
	return obj;
});

App.filter('round',function(){
  return function(item){
    return Math.round(item);
  };
});

App.filter('toLocaleString',function(){
  return function(item){
    return parseInt(item,10).toLocaleString();
  };
});

//controller
App.controller('zooplaFormSubmitCtrl',['$scope','$element','ajaxFactory','store',

	function($scope,$element,ajaxFactory,store){
	
		$scope.formData = {};
		
		$scope.master = {};

		$scope.ajaxData = {};

		var calculate;

		/**
		 * Create a simple select dropdown list
		 * @param  {[type]} start [Start the list from a given number]
		 * @param  {[type]} count [max number of list items]
		 * @return {[type]}       [returns an array of numbers]
		 */
	    $scope.numberList = function(start,count){
	        var arr = [];
	        for(var i = start; i < count; i ++){
	            i.toString();
	            arr.push(i+'');
	        }
	        return arr;
	    };

		$scope.submit = function(){

			$scope.master = angular.copy($scope.formData);

			//Remove the £ and , before submitting
			var obj = $scope.master;	

			//Create a new calculate object passing in the form data
			calculate  = new Calculate(obj);

			// remove the '£' and ',' before we collect the form data.
			// I may move this into it's on function so I can remove the characters on other events.
			for(prop in obj){
				if(/£|,/g.test(obj[prop]) ){
					obj[prop] = obj[prop].replace(/£|,/g,'');
				}
			}

			//Get the JSON 
			ajaxFactory.getJson(obj).success(function(data, status, headers, config){
				$scope.ajaxData = data;

				angular.forEach($scope.ajaxData.listing,function(elem){
				    //Grab the price from the zoopla object
				    //and calculate the monthly replayments
				    elem.repayments_deposit = calculate.init(elem.price);
				});
			}).
			error(function(data, status, headers, config) {
				console.log(data); 
		  	});
		};

		//We are watching for changes to 'ajaxData'. If it changes we save the object to our store factory
		//where we have a resultsContainer waiting for any updates 
		$scope.$watch('ajaxData',function(newVal,oldVal){
		  if(newVal !== oldVal){
		    store.set(newVal);
		  }  
		});

		/**
		 * Format the fields with the '£' and ','
		 * @param  {[object]} $event [event]
		 */
		$scope.format = function($event){
			var elem = $event.target;

	        var valu;
	        if(elem.value.length){
	            //reformat the number
	            valu = elem.value.replace(/£/g,'').replace(/,/g,'');

	            //save the value to a data object
	            elem.data = valu;

	            //format the value adding ',' and '£'
	            valu = parseInt(valu,10).toLocaleString();
	            elem.value = '£'+ valu;
	        }
	    };

	    /**
	     * Only allow numbers 
	     * @param  {[type]} $event [event]
	     */
	    $scope.onlyNumber = function($event){

	    	// Allow only backspace and delete and tab
	    	if ($.inArray($event.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
	    	             // Allow: Ctrl+A
	    	             ($event.keyCode == 65 && $event.ctrlKey === true) ||
	    	             // Allow: home, end, left, right, down, up
	    	             ($event.keyCode >= 35 && $event.keyCode <= 40)) {
	    	                 // let it happen, don't do anything
	    	             return;
		         }
		        // Ensure that it is a number and stop the keypress
		        if (($event.shiftKey || ($event.keyCode < 48 || $event.keyCode > 57)) && ($event.keyCode < 96 || $event.keyCode > 105)) {
		            $event.preventDefault();
		        }
	    };


	    $scope.disabledFieldChecker = function($event){
	        var arr = $event.target.parentNode.parentNode.getElementsByTagName("input");
	        var i;
	        for(i=0;i<arr.length;i++){

	            if(arr[i].value.length >= 1){
	                arr[i].disabled = false;
	            } else {
	                arr[i].disabled = true;
	                arr[i].value = '';
	                
	            }
	            if (arr[0].value.length === 0 && arr[1].value.length === 0 ){
	                arr[i].disabled = false;
	            }
	        }
		};
	}
]);

App.controller('resultsContainer',['$scope','store',function($scope,store){

	$scope.$watch(function(){
  		return store.get();
	},function(newVal,oldVal){
	  	if(newVal !== oldVal){
	    	$scope.ajaxData = newVal;
	  	}
	});  
}]);

