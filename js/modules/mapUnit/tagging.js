define(["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/query",
    "esri/geometry/geodesicUtils",
    "esri/units",
    "esri/toolbars/draw",
    "esri/geometry/webMercatorUtils",
    "esri/geometry/Geometry",
    "esri/geometry/Point",
    "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/TextSymbol",
    "esri/Color",
    "esri/SpatialReference",
    "esri/geometry/Polyline",
    "esri/layers/GraphicsLayer",
    "esri/geometry/geometryEngine",
    "esri/symbols/Font",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "dojo/query",
    "echo/utils/EventBus",
    "js/modules/poltDraw/DrawExt.js", 
    "dojo/NodeList-traverse"
  ],
  function(declare, lang, query, geodesicUtils, Units, Draw, webMercatorUtils, Geometry, Point, Graphic, SimpleMarkerSymbol,
    SimpleLineSymbol, TextSymbol, Color, SpatialReference, Polyline, GraphicsLayer, geometryEngine, Font, PictureMarkerSymbol, SimpleFillSymbol,
    query,EventBus,DrawExt) {
    return declare("tagging", null, {
      attr: "tagging",
      emerArr: [],
      constructor: function(map) {
        this.map = map;
        this.rightSignal = null;
        this.topSignal = null;

        this.emerlayer = new GraphicsLayer();
        this.init();
      },

      init:function(){
        EventBus.on('TAGGING_STARTUP', this.initHide, this);
        EventBus.on('All_WIDGETS_CLOSE',this.close,this);
        console.log("tagging init.");
        this.draw_ext = new DrawExt(this.map);
        this.draw = new Draw(this.map);     
      },
      initHide:function(){
        $('#drawEmergency').show();
        this.eventBind(); 
      },
      getDrawType:function(){
        var self = this;
        $('.drawEmergency ul li').unbind('click').on('click',function(evt){
          $(this).addClass('erem-active').siblings().removeClass('erem-active');
          if(self.drawComplete) self.drawComplete.remove();
          self.draw_type = $(this).attr('name');
          self.evt = evt;
          self.drawStyle();     
        });
      },
      getColor:function(){
        var self = this;
        $('#drawEmergency .color a').unbind('click').on('click',function(){
          $(this).addClass('erem-active').siblings().removeClass('erem-active');
          self.draw.deactivate();
          self.draw_img =  $(this).attr('img');
          self.draw_img = "images/"+ self.draw_img + ".png";
          self.draw_color = $(this).attr('color').split(',');
        });
         $('#drawEmergency .color a:first').click();      
      },
      getText:function(){
        this.draw_text = $('#content').val();
      },
      drawStyle:function(){

        this.getText();
        var colorArr  = this.draw_color;
        if(colorArr.length <=4 ) colorArr.push(0.8);           
        this.publicSymboy = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, 
                      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, 
                      new Color(this.draw_color), 1), 
                      new Color(colorArr));

        this.pictureSymboy = new PictureMarkerSymbol(this.draw_img,20, 20).setOffset(0, 0);

        this.textSymboy = new TextSymbol(this.draw_text, new Font("14pt",'','',Font.WEIGHT_BOLD), new Color(this.draw_color));

        this.drawHander();
      },
      drawHander:function(){
        switch(this.draw_type){
          case "TAILED":
          this.tailedDraw();
          break;

          case "TEXT":
          this.symbolDraw('POINT',this.textSymboy);
          break;

          case "POINT":
          this.symbolDraw(this.draw_type,this.pictureSymboy);
          break;

          default:
          this.symbolDraw(this.draw_type,this.publicSymboy);
          break;
        }
      },
      tailedDraw:function(){
        var self = this;
        var tool = this.evt.target.id.toLowerCase();
        this.map.disableMapNavigation();
        this.draw_ext.activate(tool);
        this.draw.deactivate();
        this.drawComplete = this.draw_ext.on('draw-end',function(evt){
          self.draw_ext.deactivate(); 
           this.map.enableMapNavigation();
          var graphic = new Graphic(evt.geometry,self.publicSymboy);
          self.addMap(graphic);
        });
      },
      symbolDraw:function(type,symbol){
        var self = this;
        this.draw.activate(Draw[type]);
        this.draw_ext.deactivate();
        this.drawComplete = self.draw.on("draw-complete",function(evt) {
          self.draw.deactivate();
          var graphic = new Graphic(evt.geometry,symbol);
          self.addMap(graphic);
        });
      },
      addMap:function(graphic){
        this.emerArr.push(graphic);
        this.emerlayer.add(graphic);
        this.map.addLayer(this.emerlayer);
      },
      eventBind:function(){
        this.getColor();
        this.getDrawType();
        this.backHander();
        this.clearLayer();
      },
      backHander:function(){
        var self = this;
        $('#drawEmergency .back').on('click',function(){
          var len = self.emerArr.length;
          if(self.emerArr.length <=0 ) return false;
          self.emerlayer.remove(self.emerArr[len-1]);
          self.emerArr.splice(len-1,1);
        })
      },
      clearLayer:function(){
        var self = this;
        $('#drawEmergency .clear').on('click',function(){
          self.emerlayer.clear();
          self.emerArr = [];
        })
      },
      close:function(){
        $('#drawEmergency').hide();
        if(this.emerlayer){
          this.emerlayer.clear();
        }
      }  
    });
  }
);