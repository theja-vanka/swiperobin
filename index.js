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
        shallowCalculations: [],
        shallowCopyObject: {},
        scaleHeight: 0,
        scaleWidth: 0,
        shallowCenter: 0,
        difference: 0,
        currentPosition: 0,
        containerWidth: $(this.container).width(),
        containerHeight: $(this.container).height(),
        leftMaxIndex: 0,
        rightMaxIndex: 0,
        temp: 0,
    };
    index = {
        0: 0
    }
    defaults = {
        startingItem: 0,
        seperation: 0, //in percentage
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
    //console.log('Object created');
    //console.log(defaults.forcedImageWidth);
}

swiperobin.prototype.init = function() {
    this.setOriginalItemDimensions();
    this.preCalculatePositionProperties();
    this.setupRobin();
    this.locatePosition();
    this.reSize();
}

swiperobin.prototype.setOriginalItemDimensions = function() {
    //console.log('setting dimenstions');
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

        data.scaleHeight = data.container.find('div.basecard').height();
        data.scaleWidth = data.container.find('div.basecard').width();
    }
}

swiperobin.prototype.reSize = function() {
    var pos = this.findKey(index, 3);

    //console.log(pos);
    $(window).resize(function() {
        console.log('resize called');
    });
}

swiperobin.prototype.preCalculatePositionProperties = function() {
    // The 0 index is the center item in the carousel
    var Item = data.itemsContainer;
    Item.css({
        'margin': 'auto',
        'display': 'block',
        'position': 'relative',
        'perspective': defaults.perspective + 'px'
    });

    data.calculations[0] = {
        distance: 0,
        opacity: 1,
        top: 0,
        height: data.scaleHeight,
        width: data.scaleWidth,
        zindex: 0,
    }
    index[0] = 0;

    var flankdisplaycount = (defaults.flankingItems * 2);
    var opacity = defaults.opacityInitial;
    var seperation = defaults.seperation;
    var j = 1;
    var sHeight = data.scaleHeight;
    var sWidth = data.scaleWidth;
    var stop = 0;

    if (flankdisplaycount + 1 > data.totalItems) {
        flankdisplaycount = data.totalItems - 1;
    }

    for (var i = 1; i <= flankdisplaycount; i++, j = parseInt((i + 1) / 2)) {
        if (i % 2 == 1) {
            opacity -= defaults.opacityDifference;
            //scale *= defaults.sizeMultiplier;
            sHeight *= defaults.sizeMultiplier;
            sWidth *= defaults.sizeMultiplier;
            stop = (data.scaleHeight - sHeight)/2;
            seperation += (150 / j);
            data.calculations[i] = {
                distance: seperation + 'px',
                direction: 'left',
                opacity: opacity,
                height: sHeight,
                width: sWidth,
                top: stop,
                zindex: -j
            }
            index[i] = j;
        } else {
            data.calculations[i] = {
                distance: seperation + 'px',
                direction: 'right',
                opacity: opacity,
                height: sHeight,
                width: sWidth,
                top: stop,
                zindex: -j
            }
            index[i] = -j;
        }
    }
    for (var i = flankdisplaycount + 1; i < data.totalItems; i++) {
        data.calculations[i] = {
            distance: 0,
            direction: 'right',
            opacity: 0,
            height: 0,
            width: 0,
            top: stop,
            zindex: -data.totalItems
        }
        if (i % 2 == 1)
            index[i] = j;
        else
            index[i] = -j;
    }
    //console.log(index);
    this.shallowCopy();
}
swiperobin.prototype.shallowCopy = function() {

    //console.log(data.itemsContainer.find('.mycard'));
    var point = 0;
    for (var i = this.keyMin(); i <= this.keyMax(); i++) {
        data.temp = this.findKey(index, i);
        data.shallowCopyObject[point] = data.itemsContainer.find('.mycard').eq(data.temp);
        data.shallowCalculations[point++] = data.calculations[data.temp];
    }
    //console.log(data.itemsContainer.find('.mycard'));
    //console.log(data.calculations);
    //console.log(data.shallowCalculations[1].distance);
    //console.log(data.shallowCenter);
}


swiperobin.prototype.setupRobin = function() {
    var i = 0;
    data.itemsContainer.find('.mycard').each(function() {
        if(data.calculations[i].direction == 'left'){
        $(this).animate({
            left: data.calculations[i].distance,
            position: 'absolute',
            height: data.calculations[i].height,
            width: data.calculations[i].width,
            top: data.calculations[i].top,
            opacity: data.calculations[i].opacity,
        }, "slow");
        $(this).css({
            //transform: 'scale(' + data.calculations[i].scale + ')',
            zIndex: data.calculations[i].zindex
        });
    }
    else{
        $(this).animate({
            right: data.calculations[i].distance,
            position: 'absolute',
            height: data.calculations[i].height,
            width: data.calculations[i].width,
            top: data.calculations[i].top,
            opacity: data.calculations[i].opacity,
        }, "slow");
        $(this).css({
            //transform: 'scale(' + data.calculations[i].scale + ')',
            zIndex: data.calculations[i].zindex
        });
    } 
        i++;
    });
}

swiperobin.prototype.locatePosition = function() {
    var mycard = document.querySelectorAll("div.basecard .mycard");
    for (var i = 0; i < data.totalItems; i++) {
        (function(posi) {
            mycard[i].onclick = function() {
                data.currentPosition = posi;
                swiperobin.prototype.rotateRobin();
            }
        })(i);
    }
    //console.log(index);
}

swiperobin.prototype.rotateRobin = function() {
    data.difference = index[data.currentPosition];
    this.animateRobin();
}

swiperobin.prototype.animateRobin = function() {
    this.indexShift();
    var i = 0;
    data.shallowCenter = (data.totalItems+data.shallowCenter - data.difference)%data.totalItems;
    console.log(data.shallowCenter);
    for (var x in data.shallowCopyObject) {
        i = (data.totalItems+data.shallowCenter+parseInt(x))%data.totalItems;
            data.shallowCopyObject[x].animate({
                left: data.shallowCalculations[i].distance,
                position: 'absolute',
                height: 'inherit',
                width: 'inherit',
                opacity: data.shallowCalculations[i].opacity,
            },defaults.speed, defaults.animationEasing,
            data.shallowCopyObject[x].css({
                transform: 'scale(' + data.shallowCalculations[i].scale + ')',
                zIndex: data.shallowCalculations[i].zindex
            }));

    }

}

swiperobin.prototype.indexShift = function() {
    var min = this.keyMin();
    var max = this.keyMax();
    for (var i = 0; i < data.totalItems; i++) {
        index[i] = index[i] - data.difference;
        if (index[i] < min) {
            index[i] = index[i] + 1;
            index[i] = index[i] * -1;
        }
        if (index[i] > max) {
            index[i] = index[i] - 1;
            index[i] = index[i] * -1;
        }
    }
}




swiperobin.prototype.findKey = function(obj, value) {
    var key = null;
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (obj[prop] === value) {
                key = prop;
            }
        }
    }
    return key;
}


swiperobin.prototype.keyMax = function() {
    var max = 0;
    for (var i = 1; i < data.totalItems; i++) {
        max = Object.keys(index).reduce(function(a, b) {
            return index[i] > index[max] ? i : max
        });
    }
    return (index[max]);
}
//Function Min
swiperobin.prototype.keyMin = function() {
    var min = 0;
    for (var i = 1; i < data.totalItems; i++) {
        min = Object.keys(index).reduce(function(a, b) {
            return index[i] < index[min] ? i : min
        });
    }
    return (index[min]);
}