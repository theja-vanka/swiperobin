$(document).ready(function() {
    var krishna = new swiperobin();
    krishna.init();
    //console.log(krishna.defaults.forcedImageWidth);
});


var swiperobin = function() {
    data = {
        totalitems: $(".basecard").find('.mycard').length,
        container: $(".basecard").parents(".container-fluid"),
        itemsContainer: $(".basecard"),
        items: [],
        containerWidth: $(this.container).width(),
        containerHeight: $(this.container).height(),
    };
    defaults = {
        seperation: 0,
        seperationMultiplier: 100,
        horizontalOffset: 0,
        horizontalOffsetMultiplier: 1,
        sizeMultiplier: 0.8,
        opacityMultiplier: 0.9,
        flankingItems: 3,
        calculations: [],
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
    console.log(this);
    this.forceImageDimensionsIfEnabled();
}

swiperobin.prototype.forceImageDimensionsIfEnabled = function() {
    if (defaults.forcedImageWidth && defaults.forcedImageHeight) {
        data.container.find('div.mycard').each(function() {
            $(this).width(defaults.forcedImageWidth);
            $(this).height(defaults.forcedImageHeight);
        });
    }
}

swiperobin.prototype.preCalculatePositionProperties = function() {
    // The 0 index is the center item in the carousel
    var $firstItem = data.itemsContainer.find('div.mycard:first');

    data.calculations[0] = {
        distance: 0,
        offset: 0,
        opacity: 1
    }

    // Then, for each number of flanking items (plus one more, see below), we
    // perform the calcations based on our user options
    var horizonOffset = defaults.horizonOffset;
    var separation = defaults.separation;
    for (var i = 1; i <= defaults.flankingItems + 2; i++) {
        if (i > 1) {
            horizonOffset *= defaults.horizonOffsetMultiplier;
            separation *= defaults.separationMultiplier;
        }
        data.calculations[i] = {
            distance: data.calculations[i - 1].distance + separation,
            offset: data.calculations[i - 1].offset + horizonOffset,
            opacity: data.calculations[i - 1].opacity * options.opacityMultiplier
        }
    }
    // We performed 1 extra set of calculations above so that the items that
    // are moving out of sight (based on # of flanking items) gracefully animate there
    // However, we need them to animate to hidden, so we set the opacity to 0 for
    // that last item
    if (options.edgeFadeEnabled) {
        data.calculations[defaults.flankingItems + 1].opacity = 0;
    } else {
        data.calculations[defaults.flankingItems + 1] = {
            distance: 0,
            offset: 0,
            opacity: 0
        }
    }
}


swiperobin.prototype.setupCarousel = function() {
    // Fill in a data array with jQuery objects of all the images
    data.items = data.itemsContainer.find('div.mycard');
    for (var i = 0; i < data.totalItems; i++) {
        data.items[i] = $(data.items[i]);
    }

    // May need to set the horizon if it was set to auto
    if (options.horizon === 0) {
        if (options.orientation === 'horizontal') {
            options.horizon = data.containerHeight / 2;
        } else {
            options.horizon = data.containerWidth / 2;
        }
    }

    // Default all the items to the center position
    data.itemsContainer
        .css('position', 'relative')
        .find('div.mycard')
        .each(function() {
            // Figure out where the top and left positions for center should be
            var centerPosLeft, centerPosTop;
            if (options.orientation === 'horizontal') {
                centerPosLeft = (data.containerWidth / 2) - ($(this).data('original_width') / 2);
                centerPosTop = options.horizon - ($(this).data('original_height') / 2);
            } else {
                centerPosLeft = options.horizon - ($(this).data('original_width') / 2);
                centerPosTop = (data.containerHeight / 2) - ($(this).data('original_height') / 2);
            }
            $(this)
                // Apply positioning and layering to the images
                .css({
                    'left': centerPosLeft,
                    'top': centerPosTop,
                    'visibility': 'visible',
                    'position': 'absolute',
                    'z-index': 0,
                    'opacity': 0
                })
                // Give each image a data object so it remembers specific data about
                // it's original form
                .data({
                    top: centerPosTop,
                    left: centerPosLeft,
                    oldPosition: 0,
                    currentPosition: 0,
                    depth: 0,
                    opacity: 0
                })
                // The image has been setup... Now we can show it
                .show();
        });
}