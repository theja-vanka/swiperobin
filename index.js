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
        deepCalculations: [],
        deepCopyObject: {},
        deepCenter: [],
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
        scale: 1,
        zindex: 0,
    }
    index[0] = 0;

    var flankdisplaycount = (defaults.flankingItems * 2);
    var opacity = defaults.opacityInitial;
    var scale = 1;
    var seperation = defaults.seperation;
    var j = 1;

    if (flankdisplaycount + 1 > data.totalItems) {
        flankdisplaycount = data.totalItems - 1;
    }

    for (var i = 1; i <= flankdisplaycount; i++, j = parseInt((i + 1) / 2)) {
        if (i % 2 == 1) {
            opacity -= defaults.opacityDifference;
            scale *= defaults.sizeMultiplier;
            seperation += (75 / j);
            data.calculations[i] = {
                distance: seperation + '%',
                opacity: opacity,
                scale: scale,
                zindex: -j
            }
            index[i] = j;
        } else {
            data.calculations[i] = {
                distance: -seperation + '%',
                opacity: opacity,
                scale: scale,
                zindex: -j
            }
            index[i] = -j;
        }
    }
    for (var i = flankdisplaycount + 1; i < data.totalItems; i++) {
        data.calculations[i] = {
            distance: 0,
            opacity: 0,
            scale: 1,
            zindex: -data.totalItems
        }
        if (i % 2 == 1)
            index[i] = j;
        else
            index[i] = -j;
    }
    //console.log(index);
    this.deepCopy();
}
swiperobin.prototype.deepCopy = function() {

    //console.log(data.itemsContainer.find('.mycard'));
    var point = 0;
    for (var i = this.keyMin(); i <= this.keyMax(); i++) {
        data.temp = this.findKey(index, i);
        data.deepCopyObject[point] = data.itemsContainer.find('.mycard').eq(data.temp);
        data.deepCalculations[point++] = data.calculations[data.temp];
    }
    //console.log(data.itemsContainer.find('.mycard'));
    //console.log(data.calculations);
    //console.log(data.deepCalculations[1].distance);
    data.deepCenter = parseInt(data.totalItems / 2);
    //console.log(data.deepCenter);
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
    //console.log(data.difference);
    if (data.difference > 0) {
        //this.animateBackward();
    }
    if (data.difference < 0) {
        this.animateForward();
    }
}

swiperobin.prototype.animateBackward = function() {
    console.log('AnimateBackward');
    this.indexShift();
    data.deepCenter = data.deepCenter;
    var i = data.deepCenter;
    data.itemsContainer.find('.mycard').each(function() {
        if (i < data.totalItems) {

            $(this).animate({
                left: data.deepCalculations[i].distance,
                position: 'absolute',
                height: 'inherit',
                width: 'inherit',
                opacity: data.deepCalculations[i].opacity,
            }, "slow");
            $(this).css({
                transform: 'scale(' + data.deepCalculations[i].scale + ')',
                zIndex: data.deepCalculations[i].zindex
            });
        } else {
            i = 0;
        }

        i++;
    });

}

swiperobin.prototype.animateForward = function() {
    console.log('AnimateFroward');
    this.indexShift();
    data.deepCopy = data.deepCenter + data.difference;
    var i = data.deepCenter;
    for (var x in data.deepCopyObject) {
        if (i < data.totalItems) {
            //console.log(data.deepCalculations[1].distance);
            data.deepCopyObject[x].animate({
                left: data.deepCalculations[i].distance,
                position: 'absolute',
                height: 'inherit',
                width: 'inherit',
                opacity: data.deepCalculations[i].opacity,
            }, "slow");
            data.deepCopyObject[x].css({
                transform: 'scale(' + data.deepCalculations[i].scale + ')',
                zIndex: data.deepCalculations[i].zindex
            });
        } else {
            i = 0;
        }
        i++;
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