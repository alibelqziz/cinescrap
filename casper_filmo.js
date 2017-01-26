/*
 * CasperJS script for 
 * La Filmothèque du quartier latin
 * generates a JSON object
 */

 /*
  * VARIABLES INITIALZATION
  *
  */

var casper = require("casper").create({
	verbose: true,
  logLevel: 'info',
  pageSettings: {
  	loadImages: false,
  	loadPlugins: false,
  	userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
  },
  clientScripts: ["vendor/jquery.min.js", "vendor/lodash.js"]
});

var fs = require('fs'); // to allow creation of files at end of execution

var url = 'http://www.lafilmotheque.fr/programmation/';
var cinema = 'La Filmo';
var link =[];
var title =[];
var date =[];
var output = [];	
var attr = [];	

/*
 * FUNCTION SETTING
 *
 */
function getLink(){
	var link = $('.prog-list a');

	return _.map(link, function (e){
		return e.getAttribute('href');
	});
}

function getTitle(){
	var title = $('.prog-list h5');
	return _.map(title, function (e){
		return e.innerHTML;
	});
}

function getDate(){
	var date = $('.prog-list span');
	return _.map(date, function (e){
		return e.innerHTML;
	});
}

function replaceAttr() {
	for (var i = 0; i < attr.length; i++){
		var wed = ':1px;',
			thu = ':123px;',
			fri = ':245px;',
			sat = ':367px;',
			sun = ':489px;',
			mon = ':611px;',
			tue = ':733px;';
		if (attr[i].indexOf(mon) !== -1){
			attr[i] = 'Monday';
		} else if (attr[i].indexOf(tue) !== -1){
			attr[i] = 'Tuesday';
		} else if (attr[i].indexOf(wed) !== -1){
			attr[i] = 'Wednesday';
		} else if (attr[i].indexOf(thu) !== -1){
			attr[i] = 'Thursday';
		} else if (attr[i].indexOf(fri) !== -1){
			attr[i] = 'Friday';
		} else if (attr[i].indexOf(sat) !== -1){
			attr[i] = 'Saturday';
		} else {
			attr[i] = 'Sunday';
		}
	}
	return attr;
}

// Changing the CSS attribute into actual day of screening

function outputJson(){
	for (var j=0; j < title.length; j++) {
		output.push({
				Cinema : cinema,
				Titre : title[j],
				Lien : link[j],
				Jour : attri[j],
				Date : date[j*2] // to only get the hour and not duration of scrapped movie
			});
	}
	return JSON.stringify(output);
}

/*
 * SCRIPT INITIALIZATION
 *
 */
casper.start(url);

casper.then(function (){
	link = this.evaluate(getLink);
	console.log("Getting links");
});

casper.then(function(){
	title = this.evaluate(getTitle);
	console.log("Getting movie titles");
});

casper.then(function(){
	date = this.evaluate(getDate);
	console.log("Getting movie dates");
});

casper.then(function() {
    attr = this.getElementsAttribute('a.popup', 'style');
});

casper.run(function() {
	attri = replaceAttr();
	var data = outputJson();
	console.log(data); // testing the output JSON
	fs.write('filmotheque.json', data, 'w');
	this.echo("\nExecution terminated").echo(title.length + ' movies found').echo(date.length + ' hours found').echo(link.length + ' links found').echo(attr.length + " attributes found").exit();
});