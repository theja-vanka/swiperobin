$(document).ready(function() {
    var krishna = new swiperobin();
    krishna.init();
});


var swiperobin = function() {
    this.data = {
        itemsContainer: $(".basecard"),
        container: $(".basecard").parents(".container-fluid"),
        containerWidth: 0,
        containerHeight: 0,
        items: [],
        totalItems: 0,
        calculations: [],
        orientation: [],
        maxDistance: 0,
        cordstart: 0,
        cordend: 0,
        preview: 0,
        touchflag: 0,
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
        forcedImageWidth: 150,
        forcedImageHeight: 206,
    }
}

swiperobin.prototype.init = function() {
    this.setOriginalItemDimensions();
    this.preCalculatePositionProperties();
    this.setupRobin();
    this.HandleClicks();
    this.HandleDrag();
    this.reSize();
}

swiperobin.prototype.setOriginalItemDimensions = function() {

    this.data.items = this.data.container.find('div.mycard');
    this.data.totalItems = this.data.items.length;

    this.data.items.each(function() {
        if ($(this).attr('original_width') == undefined) {
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
    var midpoint = $(window).width() / 2;
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
        cover: midpoint
    }];
    this.index[0] = 0;

    $(this.data.items[0]).attr("data-index", 0);
    this.data.orientation = [0];

    var flankdisplaycount = (this.defaults.flankingItems * 2);
    var opacity = this.defaults.opacityInitial;
    var scale = 1;
    var seperation = this.defaults.seperation;
    var cover = seperation / 2;
    var j = 1;
    var calcDistance = 0;
    if ((flankdisplaycount + 1) > this.data.totalItems) {
        flankdisplaycount = this.data.totalItems - 1;
    }


    for (var i = 1; i <= flankdisplaycount; i++, j = parseInt((i + 1) / 2)) {
        if (i % 2 == 1) {
            opacity -= this.defaults.opacityDifference;
            scale *= this.defaults.sizeMultiplier;
            seperation += (75 / j);
            cover = ((this.defaults.forcedImageWidth / 2) + (this.defaults.forcedImageWidth * seperation / 100) - (((1 - scale) / 2) * this.defaults.forcedImageWidth));

            this.data.calculations.push({
                distance: seperation + '%',
                opacity: opacity,
                scale: scale,
                zindex: -j,
                cover: (midpoint + cover),
            });
            this.index[i] = j;
            this.data.orientation.push(i);
        } else {

            this.data.calculations.unshift({
                distance: -seperation + '%',
                opacity: opacity,
                scale: scale,
                zindex: -j,
                cover: (midpoint - cover),
            });
            this.index[i] = -j;
            this.data.orientation.unshift(i);
        }

        $(this.data.items[i]).attr("data-index", i);
    }
    for (var i = flankdisplaycount + 1; i < this.data.totalItems; i++) {
        if (i % 2 == 1) {
            this.data.calculations.push({
                distance: 0,
                opacity: 0,
                scale: 0,
                zindex: -this.data.totalItems,
                cover: 0,
            });
            this.index[i] = j;
            this.data.orientation.push(i);
        } else {
            this.data.calculations.unshift({
                distance: 0,
                opacity: 0,
                scale: 0,
                zindex: -this.data.totalItems,
                cover: 0
            });
            this.index[i] = -j;
            this.data.orientation.unshift(i);
        }
        $(this.data.items[i]).attr("data-index", i);
    }

}

swiperobin.prototype.setupRobin = function(subsequent) {
    var i = 0;
    var middle = (this.data.calculations.length - 1) / 2;
    var mmax = middle + this.defaults.flankingItems;
    //console.log(mmax);

    if (typeof subsequent === 'undefined') {
        this.data.items.each(function() {
            $(this).css({
                left: 0
            });
        });
    }
    for (var i = 0; i < this.data.totalItems; i++) {
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
    this.data.maxDistance = this.defaults.forcedImageWidth + (((this.defaults.forcedImageWidth * parseInt(this.data.calculations[mmax].distance) / 100) - (((1 - this.data.calculations[mmax].scale) / 2) * this.defaults.forcedImageWidth)) * 2);
    //console.log(this.data.maxDistance);
}

swiperobin.prototype.HandleClicks = function() {
    //console.log(this.data.orientation);
    this.data.items.unbind().bind("click", this, function(e) {
        var myPosition = $(this).attr("data-index");
        var myIndex = -1;
        var obj = e.data;
        for (var i = 0; i < obj.data.totalItems; i++) {
            if (myPosition == obj.data.orientation[i]) {
                myIndex = i;
                console.log(myIndex);
                break;
            }
        }
        if (myIndex >= 0) {
            var left = [];
            var right = [];
            var halfLength = parseInt((obj.data.totalItems - 1) / 2);
            if (myIndex > halfLength) {
                left = obj.data.orientation.slice(myIndex - halfLength);
                right = obj.data.orientation.slice(0, myIndex - halfLength);
            } else {
                left = obj.data.orientation.slice(obj.data.totalItems - halfLength + myIndex);
                right = obj.data.orientation.slice(0, obj.data.totalItems - halfLength + myIndex);
            }
            obj.data.orientation = left.concat(right);
            //console.log(obj.data.orientation);
            obj.setupRobin(true);
        }
    });
};


swiperobin.prototype.HandleDrag = function() {
    var obj = this.data;
    for (var i = 0; i < this.data.totalItems; i++) {
        this.data.items[i].addEventListener("dragstart", function(e) {
            //obj.preview = this.cloneNode(true);
            //obj.preview.style.backgroundColor = "red";
            //obj.preview.style.display = "none"; /* or visibility: hidden, or any of the above */
            //document.body.appendChild(obj.preview);
            e.dataTransfer.setData("text/plain", "hi");
            //e.dataTransfer.setDragImage(obj.preview, 0, 0);

            obj.cordstart = e.clientX;
            console.log(obj.cordstart);

        }, false);
        this.data.items[i].addEventListener("mousemove", function(e) {

        }, false);
        this.data.items[i].addEventListener("dragend", function(e) {

            obj.cordend = e.clientX;
            //document.body.removeChild(obj.preview);
            if (obj.cordstart > obj.cordend) {
                //console.log('left swipe');
            } else {
                //console.log('right swipe');
            }

        }, false);
        this.data.items[i].addEventListener("touchstart", function(e) {

            obj.cordstart = e.touches[0].clientX;
            //console.log('touch start');
        });
        this.data.items[i].addEventListener("touchmove", function(e) {
            obj.cordend = e.touches[0].clientX;
        });
        this.data.items[i].addEventListener("touchend", function(e) {
            //console.log(obj.cordstart,obj.cordend);
            myIndex = -1;
            var left = [];
            var right = [];
            if (obj.cordend < (obj.cordstart - 50))
                myIndex = 5;
            else if (obj.cordend > (obj.cordstart + 50))
                myIndex = 3;
            else {

            }
            var halfLength = parseInt((obj.totalItems - 1) / 2);
            if (myIndex > halfLength) {
                left = obj.orientation.slice(myIndex - halfLength);
                right = obj.orientation.slice(0, myIndex - halfLength);
            } else {
                left = obj.orientation.slice(obj.totalItems - halfLength + myIndex);
                right = obj.orientation.slice(0, obj.totalItems - halfLength + myIndex);
            }
            obj.orientation = left.concat(right);
            //console.log(obj.orientation);
            this.setupRobin(true);
        }.bind(this));
    }
}


swiperobin.prototype.reSize = function() {
    var middle = (this.data.calculations.length - 1) / 2;
    var maxsize = this.data.maxDistance;
    var obj = this.data.calculations;
    var flank = this.defaults.flankingItems;
    var set = this;
    $(window).on("resize", this ,function() {
             if( $(window).width() < maxsize + 10){
                for(i = middle-flank, j = flank; i <= middle+flank; i++ , j--)
                {
                    if(i < middle)
                    {
                        obj[i].distance = parseInt(obj[i].distance)+j + "%";
                    }
                    else if(i > middle)
                    {
                        obj[i].distance = parseInt(obj[i].distance)+j + "%";
                    }
                    else {}
                }
                set.setupRobin(true);
                maxsize -=9;
            }
    });
}