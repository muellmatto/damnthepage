/**
 * 
 */

(function ()
{
	var app = angular.module('damniam', []);
    
	app.controller('TermineController', 
                   ['$http', function($http)
			                 {
                                var outer = this;
				                this.termine = [];
				                var url = 'http://api.bandsintown.com/artists/damniam/events.json?app_id=damniam_website&callback=JSON_CALLBACK';
				                $http.jsonp(url).success
                                    (function(data)
                                        {
			    	                        outer.termine = data;
			                             }
                                    ).error(function(data)
                                        {
			    	                        console.log("Fehler");
                                        }
                                    );
	
				
			                 }
                   ]
                  );

})();
