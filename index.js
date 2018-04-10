$(document).ready(function() {
    var krishna = new swiperobin();
    krishna.init();
});


var swiperobin = function() {
    this.data = {
        itemsContainer: $(".basecard"),
        container: $(".basecard").parents(".container-fluid"),
        containerWidth : 0,
        containerHeight : 0,
        items: [],
        totalItems : 0,
        calculations: [],
        orientation : [],
        
        shallowCalculations: [],
        shallowCopyObject: {},
        shallowCenter: 0,
        difference: 0,
        maxDistance: 0,
        currentPosition: 0,
        leftMaxIndex: 0,
        rightMaxIndex: 0,
        temp: 0,
    }
    
    this.index = {
        0: 0
    }
    this.defaults = {
        startingItem: 0,
        seperation: 0, //in percentage
        sizeMultiplier: 0.8,
        opacityInitial: 1,
        opacityDifference: 0.1,
        perspective: 3000, //in pixels
        flankingItems: 3,
       
        //animation defaults
        speed: 700,
        animationEasing: 'linear',
        quickerForFurther: true,
        orientation: 'horizontal',
        activeClassName: 'active',
        forcedImageWidth: 152,
        forcedImageHeight: 206,
    }
}

swiperobin.prototype.init = function() {
    this.setOriginalItemDimensions();
    this.preCalculatePositionProperties();
    this.setupRobin();
    this.HandleClicks();
    this.reSize();
}

swiperobin.prototype.setOriginalItemDimensions = function() {

    this.data.items = this.data.container.find('div.mycard');
    this.data.totalItems = this.data.items.length;

    this.data.items.each(function() {
        if ($(this).attr('original_width') == undefined) 
        {
            $(this).attr('original_width', $(this).width());
        }
        if ($(this).attr('original_height') == undefined) {
            $(this).attr('original_height', $(this).height());
        }
    });
    if (this.defaults.forcedImageWidth && this.defaults.forcedImageHeight) {
        this.data.itemsContainer
            .width(this.defaults.forcedImageWidth)
            .height(this.defaults.forcedImageHeight);
    }
    
}

swiperobin.prototype.preCalculatePositionProperties = function() {
    // The 0 index is the center item in the carousel
    var Item = this.data.itemsContainer;
    Item.css({
        'margin': 'auto',
        'display': 'block',
        'position': 'relative',
        'perspective': this.defaults.perspective + 'px'
    });

    this.data.calculations = [{
        distance: 0,
        opacity: 1,
        scale: 1,
        zindex: 0,
    }];
    this.index[0] = 0;
    
    $(this.data.items[0]).attr("data-index", 0);
    this.data.orientation = [0];

    var flankdisplaycount = (this.defaults.flankingItems * 2);
    var opacity = this.defaults.opacityInitial;
    var scale = 1;
    var seperation = this.defaults.seperation;
    var j = 1;
    var calcDistance = 0;

    if ((flankdisplaycount + 1) > this.data.totalItems) {
        flankdisplaycount = this.data.totalItems - 1;
    }

    this.data.maxDistance = 100;

    for (var i = 1; i <= flankdisplaycount; i++, j = parseInt((i + 1) / 2)) {
        if (i % 2 == 1) 
        {
            opacity -= this.defaults.opacityDifference;
            scale *= this.defaults.sizeMultiplier;
            seperation += (75 / j);
            
            this.data.maxDistance += (scale * (75 / j));

            this.data.calculations.push({
                distance: seperation + '%',
                opacity: opacity,
                scale: scale,
                zindex: -j
            });
            this.index[i] = j;
            this.data.orientation.push(i);
        } else 
        {
            this.data.maxDistance += (scale * (75 / j));
            
            this.data.calculations.unshift({
                distance: -seperation + '%',
                opacity: opacity,
                scale: scale,
                zindex: -j
            });
            this.index[i] = -j;
            this.data.orientation.unshift(i);
        }

        $(this.data.items[i]).attr("data-index", i);
    }
    for (var i = flankdisplaycount + 1; i < this.data.totalItems; i++) {
        if (i % 2 == 1)
        {
            this.data.calculations.push({
                distance: 0,
                opacity: 0,
                scale: 0,
                zindex: -this.data.totalItems
            });
            this.index[i] = j;
            this.data.orientation.push(i);
        }
        else
        {
            this.data.calculations.unshift({
                distance: 0,
                opacity: 0,
                scale: 0,
                zindex: -this.data.totalItems
            });
            this.index[i] = -j;
            this.data.orientation.unshift(i);
        }
        $(this.data.items[i]).attr("data-index", i);
    }
    
    this.data.maxDistance = 100 + (seperation * 2);
    //console.log(this.data.maxDistance);
    //console.log("MaxWidth= " + this.data.maxDistance * 152 / 100);
}

swiperobin.prototype.setupRobin = function(subsequent) {
    var i = 0;

    if(typeof subsequent === 'undefined')
    {
        this.data.items.each(function() {
            $(this).css({
                left: 0
            });
        });
    }
    for(var i = 0; i < this.data.totalItems; i++)
    {
        //console.log(this.data.orientation[i], i, this.data.calculations[this.data.orientation[i]]);
        $(this.data.items[this.data.orientation[i]]).transition({
            position: 'absolute',
            height: 'inherit',
            width: 'inherit',
            left: this.data.calculations[i].distance,
            scale: this.data.calculations[i].scale,
            zIndex: this.data.calculations[i].zindex,
            opacity: this.data.calculations[i].opacity,
        }, this.defaults.speed);
    }
}

swiperobin.prototype.HandleClicks = function() 
{
    this.data.items.unbind().bind("click", this, function(e){
        var myPosition = $(this).attr("data-index");
        var myIndex = -1;
        var obj = e.data;
        for(var i = 0; i < obj.data.totalItems; i++)
        {
            if(myPosition == obj.data.orientation[i])
            {
                myIndex = i;
                break;
            }
        }
        if(myIndex >= 0)
        {
            var left = [];
            var right = [];
            var halfLength = parseInt((obj.data.totalItems-1)/2);
            if(myIndex > halfLength)
            {
                left = obj.data.orientation.slice(myIndex - halfLength);
                right = obj.data.orientation.slice(0, myIndex - halfLength);
            }
            else
            {
                left = obj.data.orientation.slice(obj.data.totalItems- halfLength + myIndex);
                right = obj.data.orientation.slice(0, obj.data.totalItems- halfLength + myIndex); 
            }
            obj.data.orientation = left.concat(right);
            obj.setupRobin(true);
        }
    });
};



swiperobin.prototype.reSize = function() {

    $(window).resize(function() {
        console.log($(window).width()); // New height

    });
}