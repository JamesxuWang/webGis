define(["dojo/_base/declare", "echo/utils/EventBus", "dojo/domReady!"], function(declare,EventBus) {
    return declare("layuiInit", null, {
        constructor: function(map, config) {
            this.map = map;
            this.config = config;
            this.slideStatus = true;
            this.init();

        },
        init: function() {            
            EventBus.on("LAYUI-START", this.startup, this);
            EventBus.on("All_WIDGETS_CLOSE", this.close, this);
            this.initLayUi();
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this;
            $("#mapElseSlideBtn").on("click", (function(event) {
                if (this.slideStatus) {
                    $("#mapElse").animate({
                        left: '-339px'
                    }, 300);
                    $("#mapDiv").animate({
                        left: '0px'
                    }, 300);
                    $(event.currentTarget).text("»");
                } else {
                    $("#mapElse").animate({
                        left: '0px'
                    }, 300);
                    $("#mapDiv").animate({
                        left: '340px'
                    }, 300);
                    $(event.currentTarget).text("«");
                }
                this.slideStatus = !this.slideStatus;
            }).bind(this));
        },
        initLayUi: function() {           
		    layui.use('element', function(){
		      var element = layui.element; 
		      var device = layui.device('myapp');
		      console.log(device);  
		      //dosomething!!!!
		    });
        },        
        startup: function() {
            this.slideStatus = true;
        },
        close: function() {
            $("#mapDiv").css({
                left: '340px'
            });
        }    
    });
});
