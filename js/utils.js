function getRate(type) {
	if (type == "we") {
		return 0;
	} else if (type == "full") {
		return 1;
	} else if (type == "none") {
		return 0;
	} else if (type == "half") {
		return 0.5;
	}
};

var month = new Array();
month[0]="Janvier";
month[1]="Février";
month[2]="Mars";
month[3]="Avril";
month[4]="Mai";
month[5]="Juin";
month[6]="Juillet";
month[7]="Aout";
month[8]="Septembre";
month[9]="Octobre";
month[10]="Novembre";
month[11]="Decembre";

function getMonthLabel(m) {
	return month[m];
} 