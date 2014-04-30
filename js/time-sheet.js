function TimeSheetController($scope, AuthenticationService, $firebase) {

	// get all data
	$scope.ts = $firebase(AuthenticationService.ref);
	$scope.ts.$bind($scope, "ts");
	
	// get data (asynchronous)
	$scope.ts.$on('loaded', function() {
		$scope.change();
	});

	// load moths and years array	
	$scope.months = months;
	$scope.years = years;

	/**
	 * Initialize month and year to today.
	 */
	$scope.init = function() {
		
		var d = new Date();
		$scope.monthIndex = d.getMonth();
		$scope.yearIndex = $scope.years.indexOf(d.getFullYear());

		$scope.month = $scope.months[$scope.monthIndex];
		$scope.year = $scope.years[$scope.yearIndex];
	};
	
	/**
	 * Initialize controls change functions.
	 */
	$scope.change = function() {
		$scope.data = $scope.getFireBaseData($scope.year, $scope.month);
		if ($scope.data == null) {
			// no corresponding data => generate new one
			var dataDays = getCalendar($scope.year, $scope.month.index);
			$scope.data = {
				"year" : $scope.year,
				"month" : $scope.month,
				"days" : dataDays,
				"validated" : "false"
			};
			$scope.ts.$add($scope.data);
		} else if ($scope.data.validated == null) {
			// append new field
			$scope.data["validated"] = "false";
		}
	};

	/**
	 * return total days rate: day.rate aggregator.
	 */
	$scope.getTotal = function() {
		var total = 0;
		angular.forEach($scope.data.days, function(day) {
			total += day.rate;
		});
		return total;
	};
	
	/**
	 * return total rate of non-working days -from day.rate)
	 */
	$scope.getTotalOff = function() {
		var total = 0;
		angular.forEach($scope.data.days, function(day) {
			if (day.type == "half") {
				total += 0.5;
			} else if (day.type == "none") {
				total += 1.0;
			} else if (day.type == "full") {
				// 0
			}
		});
		return total;
	};

	/**
	 * Lifecycle to change the rate of a day.
	 * we -> |
	 * full -> none -> half -> full
	 */
	$scope.changeType = function(day) {
		if ($scope.data.validated == 'true') {
			return;
		}
		if (day.type == "we") {
			return;
		}
		if (day.type == "full") {
			day.type = "none";
		} else if (day.type == "none") {
			day.type = "half";
		} else if (day.type == "half") {
			day.type = "full";
		}
		day.rate = getRate(day.type);
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
	
	/**
	 * On control save click.
	 */
	$scope.save = function() {
		$scope.ts.$set($scope.ts);
	};

	/**
	 * Validate and close time sheet.
	 */
	$scope.validate = function() {
		$scope.data.validated = "true";
		$scope.save();
	};
};