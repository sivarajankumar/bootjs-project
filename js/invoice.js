function InvoiceController($scope, AuthenticationService, $firebase) {

	// firebase data
	$scope.ts = $firebase(AuthenticationService.ref);
	$scope.ts.$bind($scope, "ts");

	// get data (asynchronous)
	$scope.ts.$on('loaded', function() {
		// $scope.keys = $scope.ts.$getIndex(); // how to get indexes
		// update from firebase
		var data = $scope.getFireBaseData($scope.year, $scope.month);
		if (data != null) {
			$scope.days = $scope.ts[$scope.current].days;
		}
	});
	// billing
	$scope.tarif = 460;
	$scope.tva = 20;

	// TODO move to calendar.js
	$scope.months = months;
	
	// TODO move to calendar.js
	$scope.years = [2013, 2014, 2015, 2016];
	/**
	 * Initialize month and year to today.
	 */
	$scope.init = function() {
		
		var d = new Date();
		var monthIndex = d.getMonth();
		var yearIndex = $scope.years.indexOf(d.getFullYear());

		$scope.month = $scope.months[monthIndex];
		$scope.year = $scope.years[yearIndex];
		
		//$scope.emissionDate = d.getDay() + ' ' + $scope.months[d.getMonth()].label + ' ' + d.getFullYear();
		$scope.today = new Date();
		$scope.nCommande = 'S23DAC1401-0001';
	};
	
	/**
	 * Initialize controls change functions.
	 */
	$scope.change = function() {
		var data = $scope.getFireBaseData($scope.year, $scope.month);
		if (data == null) {
			// no corresponding data => generate new one
			var dataDays = getCalendar($scope.year, $scope.month.index);
			data = {
				"year"  : $scope.year,
				"month" : $scope.month,
				"days"  : dataDays
			};
			
			$scope.ts.$add(data);
			$scope.days = data.days;
			
		}
		// data is in $scope.count
		$scope.days = data.days;
	};

	/**
	 * return total days rate: day.rate aggregator.
	 */
	$scope.getTotal = function() {
		var total = 0;
		angular.forEach($scope.days, function(day) {
			total += day.rate;
		});
		return total;
	};

	$scope.factureNumber = function() {
		if ($scope.month.index < 10) {
			return $scope.year + '- 00'+ ($scope.month.index +1);
		} else {
			return $scope.year + '- 0'+ ($scope.month.index +1);
		};
	};
	
	/**
	 * return the data corresponding to the input year and month
	 */
	$scope.getFireBaseData = function(year, month) {
		var ret = null;
		var count = 0;
		angular.forEach($scope.ts, function(msg, key) {
			if (msg != null && msg.year == year && msg.month.index == month.index) {
				$scope.current = key;
				ret = msg;
				keepGoing = false;
			}
			count++;
		});
		return ret;
	};

};