function getCalendar(year, month) {
	
	var days = [];
	var d = new Date(year, month, 1, 0, 0, 0, 0); 
	var m = d.getMonth();
	
	for (var i=1; i<=31; i++) {
		// update date
		d.setDate(i);
		var type; // day type we or working
		var dow = d.getDay(); // day of week
		if ((dow == 0) || (dow == 6)) {
			type = "we"; // week end day
		} else {
			type = "full"; // working day
		}
		var m_ = d.getMonth();
		if (m_ == m) // same month
		{
			var newData = {
				"day": d.getDate(), // day of month
				"type" : type,
				"rate" : getRate(type)
			};
			days.push(newData);
		}
	}
	
	return days;
}

var months = [
	{"label": "Janvier", "index": 0},
    {"label": "F\u00E9vrier", "index": 1},
    {"label": "Mars", "index": 2},
    {"label": "Avril", "index": 3},
    {"label": "Mai", "index": 4},
    {"label": "Juin", "index": 5},
    {"label": "Juillet", "index": 6},
    {"label": "Aout", "index": 7},
    {"label": "Septembre", "index": 8},
    {"label": "Octobre", "index": 9},
    {"label": "Novembre", "index": 10},
    {"label": "Décembre", "index": 11}
];

var years = [2013, 2014, 2015, 2016];