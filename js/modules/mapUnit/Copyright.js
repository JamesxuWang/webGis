define([
    "dojo/_base/declare",
    'dojo/on',
    "esri/geometry/Extent",
    "dojo/NodeList-dom",
    "dojo/NodeList-manipulate",
  ],
  function(
    declare,
    on,
    Extent
  ) {
    return declare("Copyright", null, {
        constructor: function(map, config) {
            this.map = map;
            this.extentData = config.extentData;
            this.levelData = config.levelData;
            this.defaultText = config.defaultText;
            this.init();
        },

        init: function(){
            this.map.on("extent-change", (this.changeCopyrightText).bind(this));
            var html = '<div id="copyrightDiv" class="myCopyright" style="position: relative; max-height: 20px; width: auto; bottom: 30px; margin: 0 auto; padding: 5px 6px; border: none; border-radius: 10px; background-color: rgba(80,173,217,0.9); color: #fff; font-family: Microsoft Yahei; font-size: 12px;"></div>'  
            if($('.container').hasClass('myCopyright')){
                $('.myCopyright').remove();
            }
            $('body>.container').append(html);
            this.startup();
        },

        //调用后台接口
        startup: function(){
            $("#copyrightDiv").css("display", "table");
        },

        changeCopyrightText: function(event){
            // console.log(this.map.extent);
            var currentExtent = event.extent;
            for(var i in this.extentData)
            {
                var coordinates = this.extentData[i].extent;
                var extent = new Extent(coordinates[0], coordinates[1], coordinates[2], coordinates[3], this.map.spatialReference);
                if(extent.contains(currentExtent) == true)
                {
                    $("#copyrightDiv").html(this.extentData[i].text);
                    return;
                }
            }
    
            if(event.levelChange == true)
            {
                var okFlag = false;
                var currentLevel = this.map.getLevel();
                try
                {
                    for(var j in this.levelData)
                    {
                        if(this.levelData[j].level.indexOf(currentLevel) != -1)
                        {
                            $("#copyrightDiv").html(this.levelData[j].text);
                            okFlag = true;
                            break;
                        }
                    }
                    if(okFlag != true)
                    {
                        $("#copyrightDiv").html(this.defaultText);
                    }
                }
                catch(e)
                {
                    $("#copyrightDiv").html(this.defaultText);
                }
            }
        },
        
        close: function(){
          $("#copyrightDiv").css("display", "none");
        }
    });
});
