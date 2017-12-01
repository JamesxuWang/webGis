/*测面*/
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
    "echo/utils/EventBus",
    "dojo/on",
    "dojo/query", "dojo/NodeList-traverse"
  ],
  function(declare, lang, query, geodesicUtils, Units, Draw, webMercatorUtils, Geometry, Point, Graphic, SimpleMarkerSymbol,
    SimpleLineSymbol, TextSymbol, Color, SpatialReference, Polyline, GraphicsLayer, geometryEngine, Font, PictureMarkerSymbol, SimpleFillSymbol,
    EventBus,on,query) {
    return declare("area", null, {
      eventHandlers:[],
      clsBtnLayer:null,
      meaAreaLayer:null,
      clearSym:null,
      toolbar:null,
      geodesicWkid:[4326,4490],
      constructor: function(map) {
        this.map = map;
        console.log("module area add.");
        this.init();
      },

      init: function() {
        EventBus.on('AREA_STARTUP', this.startup, this);
        EventBus.on('All_WIDGETS_CLOSE',this.close,this);
        console.log("area init.");

      },
      //end init

      startup:function(){
        this.meaAreaLayer = new GraphicsLayer({
          id: "meaAreaLayer"
        });
        this.clsBtnLayer = new GraphicsLayer({
          id: "areaClsBtnLayer"
        });
        this.map.addLayer(this.meaAreaLayer);
        this.map.addLayer(this.clsBtnLayer);
        this.clearSym = new PictureMarkerSymbol("images/meaClear1.jpg", 14, 14).setOffset(117, 19);
        this.bindEvent();
        this.addToolbar();
      },

      addToolbar: function() {
        if(!this.toolbar){//防止重复生成
          this.toolbar = new Draw(this.map);
        }
        this.toolbar.activate(Draw.POLYGON);

        this.toolbarSignal = null;
        this.toolbarSignal = this.toolbar.on("draw-complete", lang.hitch(this, function(evt) {

          var geo = evt.geometry;
          if(!geometryEngine.isSimple(geo))
          {
              geo = geometryEngine.simplify(geo);
          }
          // var Area = geodesicUtils.geodesicAreas([geo], esri.Units.SQUARE_METERS);
          var wkid = this.map.spatialReference.wkid;
          var Area = 0;
          if(this.geodesicWkid.indexOf(wkid) == -1){
              Area = geometryEngine.planarArea(geo, "square-meters");
          }else{
              Area = geometryEngine.geodesicArea(geo, "square-meters");
          }
          //console.log(Area);
          // Area = Area[0].toFixed(2);

          var areaSym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              new Color([255, 0, 0]), 0.5), new Color([255, 255, 0, 0.25]));
          var areaGra = new Graphic(geo, areaSym)
          this.meaAreaLayer.add(areaGra);

          var last = geo.rings[0].length - 1;

          var meaResPt = new Point(geo.rings[0][last]);
          var meaResSym = new SimpleMarkerSymbol();
          meaResSym.setColor(new Color([255, 255, 255])).setOffset(30, 20).setSize(150).setPath("M0,65h150v24h-150z").setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([39, 40, 34]), 0.5));
          var meaResGra = new Graphic(meaResPt, meaResSym);
          this.meaAreaLayer.add(meaResGra);

          var meaResText = "";
          if(Area>=10000){
            meaResText = (Area/1000000).toFixed(2) + "平方千米";
          }else{
            meaResText = Area.toFixed(2) + "平方米";
          }

          var meaTextSym = new TextSymbol(meaResText);
          meaTextSym.setColor(new Color([255, 0, 0]));
          meaTextSym.setOffset(30, 15);
          var font = new Font();
          font.setSize("12px");
          meaTextSym.setFont(font);

          var meaTextGra = new Graphic(meaResPt, meaTextSym);

          this.meaAreaLayer.add(meaTextGra);

          // var clsBtnSym = new PictureMarkerSymbol("images/meaClear1.jpg", 14, 14).setOffset(117, 19);
          var clsBtnGra = new Graphic(meaResPt, this.clearSym);

          this.clsBtnLayer.add(clsBtnGra);

          query("#areaClsBtnLayer_layer").style("cursor", "pointer");

          this.toolbar.deactivate();
        }));
      },


      bindEvent: function() {
        /*绑定相应事件*/
        this.eventHandlers.push(on(this.clsBtnLayer,'click',lang.hitch(this,this.clsBtnLayerClickHandler)));
      },

      clsBtnLayerClickHandler:function(){
        this.meaAreaLayer.clear();
        this.clsBtnLayer.clear();
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
        if(this.clsBtnLayer){
          this.clsBtnLayer.clear;
          this.map.removeLayer(this.clsBtnLayer);
        }
        if(this.meaAreaLayer){
          this.meaAreaLayer.clear;
          this.map.removeLayer(this.meaAreaLayer);
        }
        if(this.toolbar){
          this.toolbar.deactivate();
        }
      },
      cleanOthers: function() {
        this.toolbar = null;
        this.clearSym = null;
      },

      close: function() {
        this.hidden();
      }

    });
  }
);