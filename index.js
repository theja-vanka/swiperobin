$(document).ready(function() {
	var krishna = new swiperobin();
	krishna.init();
	console.log();
});


var swiperobin = function() {
	 data = {
		totalitems : $(".basecard").find('.mycard').length,
     	container : $(".basecard").parents(".container-fluid"),
     	cWidth : $(this.container).width(),
     	cHeight : $(this.container).height(),
	};
	//console.log('Object created');
}

swiperobin.prototype.init = function() {
	console.log(data.totalitems);
	this.setOriginalItemDimensions();
}

swiperobin.prototype.setOriginalItemDimensions = function() {
	console.log('setting dimenstions');
	data.container.find('div.mycard').each(function() {
		if($(this).data('original_width') == undefined || defaults.forcedImageWidth > 0)
		{
			$(this).data('original_width', $(this).width());
		}
		if($(this).data('original_height') == undefined || defaults.forcedImageHeight > 0) 
		{
            $(this).data('original_height', $(this).height());
        }
	});
}

swiperobin.prototype.defaults = {
	
	// appearance defaults
	seperation: 0,
	seperationMultiplier: 100,
	horizontalOffset: 0,
	horizontalOffsetMultiplier: 1,
	sizeMultiplier: 0.8,
	opacityMultiplier: 0.9,
	flankingItems: 3,
	//animation defaults
	speed: 500,
	animationEasing: 'linear',
	quickerForFurther: true,
	orientation: 'horizontal',
	activeClassName: 'active',
	forcedImageWidth: 152,
	forcedImageHeight: 206,
}

