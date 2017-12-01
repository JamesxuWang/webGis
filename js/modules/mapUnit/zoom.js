/***/
define(
  [ 
  "dojo/_base/declare",
  "dojo/query",
  "echo/utils/EventBus",
  "dojo/NodeList-dom",
  "dojo/NodeList-manipulate"
  ],
  function(
    declare,
    query,
    EventBus
  ) {
    return declare("zoom", null, {
      eventHandlers:[],
      constructor:function(map){
        this.map = map;
        this.init();
      },

      init: function() {
        EventBus.on('ZOOM_IN_OR_ZOOM_OUT_STARTUP', this.startup, this);
        EventBus.on('All_WIDGETS_CLOSE',this.close,this);
        console.log("zoom init.");
      },

      startup:function(){
        var toolType = query('.tool-active').attr('id');
        if(toolType == 'fangda'){
          this.fangdaHandler();
        }else if(toolType == 'suoxiao'){
          this.suoxiaoHandler();
        }
      },

      fangdaHandler:function(){
        var maxZoom = this.map.getMaxZoom();
        var currentZoom = this.map.getZoom();
        if(currentZoom < maxZoom){
          this.map.setZoom(currentZoom + 1);
        }
      },

      suoxiaoHandler:function(){
        var minZoom = this.map.getMinZoom();
        var currentZoom = this.map.getZoom();
        if(currentZoom > minZoom){
          this.map.setZoom(currentZoom - 1);
        }
      },


      bindEvent: function() {
        /*绑定相应事件*/
        /*this.eventHandlers.push(on(query('#btnJjqwfxQuery'), 'click', this.getJjqwfxData.bind(this)));*/
      },

      hidden: function() {
        /*隐藏控件面板*/
        /*query('#jjqwfxTitle').style('display', 'none');*/
        /*依次清除地图资源，清除事件，清除其他资源*/
        this.cleanMapMarks();
        this.cleanEvent();
        this.cleanOthers();
      },

      cleanEvent: function() {
        for (var i = 0, handler; handler = this.eventHandlers[i++];) {
          handler.remove();
        }
      },
      cleanMapMarks: function() {
        /*清除地图资源*/
        /*if (this.jjqwfxLyr) {
          this.map.removeLayer(this.jjqwfxLyr);
        }*/
        
      },
      cleanOthers: function() {
      },

      close: function() {
        this.hidden();
      }

    }) // end return declare
}); //end define
