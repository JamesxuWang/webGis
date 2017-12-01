define(
  ["dojo/_base/declare",
    "dojo/query",
    "dojo/_base/lang",
    "dojo/NodeList-dom", "dojo/NodeList-manipulate"
  ],
  function(
    declare,
    query,
    lang) {

    return declare("BaseMapSwitch", null, {

      constructor: function(map, switchDiv) {
        this.map = map;
        this.switchDiv = switchDiv; //switch element must be an ul.
        this.init();
      },
      //end constructor

      init: function() {
        this.layerGroups = this.getBaseLayersGroups();
        //判断是否存在可用的图层组，如果没有或者只有一个，则隐藏DOM节点，并取消构建底图切换模块
        //                          如果有，则构建该模块
        if(this.isEmptyObj(this.layerGroups) == true)
        {
          $("#" + this.switchDiv).css("display", "none");
          return;
        }
        else
        {
          this.createSwitch(this.switchDiv);
        }
      },
      //end init

      isEmptyObj: function(targetObj){
        for(var _attr in targetObj)
        {
          return false;
        }
        return true;
      },

      getBaseLayersGroups: function() {
        var baseLayers = [];
        var layerGroups = {};
        var layerIds = this.map.layerIds;
        var layer;
        for (var i = 0, layerId; layerId = layerIds[i++];) {
          layer = this.map.getLayer(layerId);
          var layerGroup = layer.layerGroup
          if (layer.isBaseLayer) {
            if (!layerGroups[layerGroup]) {
              layerGroups[layerGroup] = [];
            }
            layerGroups[layerGroup].push(layer);
          }
        }
        return layerGroups;
      },

      createSwitch: function(switchDiv) {

        var switchDiv = "#" + switchDiv;
        var div = query(switchDiv);
        var btnDiv = switchDiv + "\ li";
        var html = [];


        // < li class = "left-mapswitch_0" id = "yueyangVec" > </li>
        var i = 0;
        for (var layerGroupKey in this.layerGroups) {
          html.push('<li class="left-mapswitch_');
          html.push(i);
          html.push('" id="');
          html.push(layerGroupKey);
          html.push('"></li>');
          i++;
        }

        div.html(html.join(''));

        var btn = query(btnDiv); //btn must reference after script rewrited DOM.
        btn.on("click", lang.hitch(this, function(evt) {
          this.switchBaseLayers(evt.target.id);
        }));

        /*切换到第一组*/
        var layer = this.map.getLayer(this.map.layerIds[0])
        this.switchBaseLayers(layer.layerGroup);
        if(i <= 1)
        {
          $(switchDiv).css("display", "none");
        }
      },
      //end createSwitch

      switchBaseLayers: function(layerGroupKey) {
          var toShowLayerGroupKey = layerGroupKey;
          for (var layerGroupKey in this.layerGroups) {
            var layerGroup = this.layerGroups[layerGroupKey];
            for (var i = 0, layer; layer = layerGroup[i++];) {
              layer.hide();
            }
          }

          var layerGroup = this.layerGroups[toShowLayerGroupKey];
          for (var i = 0, layer; layer = layerGroup[i++];) {
            layer.show();
          }

        }
        //end switch

    }); // end return declare

  }); //end define
