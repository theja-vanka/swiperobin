$(document).ready(function() {
	var krishna = new swiperobin();
	krishna.init();
})

console.log('function start');

var swiperobin = function() {
     	this.totalitems = $(".basecard").find('.mycard').length;
     	this.check = $(".basecard").parents(".container-fluid");
     	this.wdt = $(this.check).width();
     	this.hgt = $(this.check).height();
     	console.log('Object created');
}

swiperobin.prototype.init = function() {
	console.log(this.totalitems);
}


    /* var totalitems = $(".basecard").find('.mycard').length;
     var check = $(".basecard").parents(".container-fluid");
     var wdt = $(check).width();
     var hgt = $(check).height();
     console.log('width : ' +wdt+ ' height : '+hgt);*/ 
