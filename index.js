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

    var flankdisplaycount = (defaults.flankingItems * 2);
    var seperation = $('.basecard').find('div.mycard:first').width();
    var opacity = defaults.opacityInitial;
    var scale = 1;
    var x = 0;

    if (data.totalItems >= flankdisplaycount) {
        for (var i = 1, j = 1; i <= flankdisplaycount; i++, j = parseInt((i + 1) / 2)) {
            if (i % 2 == 1) {
                seperation = x + (seperation * defaults.seperationMultiplier);
                opacity -= defaults.opacityDifference;
                scale *= defaults.sizeMultiplier;
                data.calculations[i] = {
                    distance: seperation,
                    opacity: opacity,
                    scale: scale,
                    index: j
                }
                x = seperation;
            } else {
                data.calculations[i] = {
                    distance: -seperation,
                    opacity: opacity,
                    scale: scale,
                    index: -j
                }
            }
        }
    }
    console.log(data.calculations);
}

swiperobin.prototype.assignValues = function() {

}