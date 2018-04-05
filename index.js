$(document).ready(function() {
    var krishna = new swiperobin();
    krishna.init();
    //console.log(krishna.defaults.forcedImageWidth);
});


var swiperobin = function() {
    data = {
        totalItems: $(".basecard").find('.mycard').length,
        container: $(".basecard").parents(".container-fluid"),
        itemsContainer: $(".basecard"),
        items: [],
        calculations: [],
        containerWidth: $(this.container).width(),
        containerHeight: $(this.container).height(),
        leftItemsCount: 0,
        rightItemsCount: 0
    };
    defaults = {
        startingItem: 0,
        seperation: 0,
        seperationMultiplier: 0.75,
        sizeMultiplier: 0.8,
        opacityInitial: 1,
        opacityDifference: 0.1,
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
    console.log('Object created');
    //console.log(defaults.forcedImageWidth);
}

swiperobin.prototype.init = function() {
    this.setOriginalItemDimensions();
    this.preCalculatePositionProperties();
}

swiperobin.prototype.setOriginalItemDimensions = function() {
    console.log('setting dimenstions');
    data.container.find('div.mycard').each(function() {
        if ($(this).data('original_width') == undefined || defaults.forcedImageWidth > 0) {
            $(this).data('original_width', $(this).width());
        }
        if ($(this).data('original_height') == undefined || defaults.forcedImageHeight > 0) {
            $(this).data('original_height', $(this).height());
        }
    });
    this.forceImageDimensionsIfEnabled();
}

swiperobin.prototype.forceImageDimensionsIfEnabled = function() {
    if (defaults.forcedImageWidth && defaults.forcedImageHeight) {
        data.container.find('div.basecard')
            .width(defaults.forcedImageWidth)
            .height(defaults.forcedImageHeight);

        /* data.container.find('div.basecard').each(function() {
             $(this).width(defaults.forcedImageWidth);
             $(this).height(defaults.forcedImageHeight);
         });*/
    }
}

swiperobin.prototype.preCalculatePositionProperties = function() {
    // The 0 index is the center item in the carousel
    var firstItem = data.itemsContainer;
    firstItem.css({
        'margin': 'auto',
        'display': 'block',
        'position': 'relative'
    });

    data.calculations[0] = {
        distance: 0,
        opacity: 1,
        scale: 1,
        index: 0,
    }

    var flankdisplaycount = (defaults.flankingItems * 2) + 1;
    var seperation = defaults.seperation;
    var opacity = defaults.opacityInitial;

    if (data.totalItems >= flankdisplaycount) {
        for (var i = 1, j = 1; i <= flankdisplaycount; i++, parseInt((j + 1) / 2)) {
            if (i % 2 == 1) {
                data.calculations[i] = {
                    distance: seperation,
                    opacity: opacity,
                    scale: 1,
                    index: j
                }
            }
            else {
            	data.calculation[i] = {
            		distance: seperation,
            		opacity: opacity,
            		scale: 1,
            		index: j
            	}
            	seperation *= defaults.separationMultiplier;
                opacity -= defaults.opacityDifference;
            }
        }
    }

}

swiperobin.prototype.assignValues = function() {

}