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
        rightItemsCount: 0,
        index: 0
    };
    defaults = {
        startingItem: 0,
        seperation: 0,
        sizeMultiplier: 0.8,
        opacityInitial: 1,
        opacityDifference: 0.1,
        perspective: 3000, //in pixels
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
    this.setupRobin();
    this.rotateRobin();
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
    var Item = data.itemsContainer;
    Item.css({
        'margin': 'auto',
        'display': 'block',
        'position': 'relative',
        'perspective': defaults.perspective+'px'
    });

    data.calculations[0] = {
        distance: 0,
        opacity: 1,
        scale: 1,
        index: 0,
        zindex: 0,
    }

    var flankdisplaycount = (defaults.flankingItems * 2);
    var itemWidth = $('.basecard').find('div.mycard:first').width();
    var seperationMultiplier = itemWidth / (defaults.flankingItems + 1);
    var opacity = defaults.opacityInitial;
    var scale = 1;
    var seperation = itemWidth / 2;
    var x = 0;

    if (flankdisplaycount + 1 > data.totalItems) {
        flankdisplaycount = data.totalItems - 1;
    }

    for (var i = 1, j = 1; i <= flankdisplaycount; i++, j = parseInt((i + 1) / 2)) {
        if (i % 2 == 1) {
            x = x + seperation;
            opacity -= defaults.opacityDifference;
            scale *= defaults.sizeMultiplier;
            data.calculations[i] = {
                distance: x,
                opacity: opacity,
                scale: scale,
                index: j,
                zindex: -j
            }
        } else {
            data.calculations[i] = {
                distance: -x,
                opacity: opacity,
                scale: scale,
                index: -j,
                zindex: -j
            }
        }
    }
    for (var i = flankdisplaycount + 1; i < data.totalItems; i++) {
        data.calculations[i] = {
            distance: 0,
            opacity: 0,
            scale: 1,
            index: 0,
            zindex: -data.totalItems
        }
    }
    //console.log(data.calculations);
}

swiperobin.prototype.setupRobin = function() {
    var i = 0;
    data.itemsContainer.find('.mycard').each(function() {

        $(this).animate({
            left: data.calculations[i].distance,
            position: 'absolute',
            height: 'inherit',
            width: 'inherit',
            opacity: data.calculations[i].opacity,
        }, "slow");
        $(this).css({
            transform: 'scale(' + data.calculations[i].scale + ')',
            zIndex: data.calculations[i].zindex
        });
        i++;
    });
}

swiperobin.prototype.rotateRobin = function() {
    var mycard = document.querySelectorAll("div.basecard .mycard");
    for(var i =0; i<data.totalItems; i++)
    {(function(posi) {
        mycard[i].onclick = function() {
            //console.log(posi);
            data.index = posi;
            console.log(posi);
        }
    })(i);
    }
}
