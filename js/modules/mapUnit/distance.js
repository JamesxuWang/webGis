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
    "esri/symbols/Font",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "echo/utils/EventBus"
  ],
  function(
    declare,
    lang, 
    query, 
    geodesicUtils, 
    Units, 
    Draw, 
    webMercatorUtils, 
    Geometry, 
    Point, 
    Graphic, 
    SimpleMarkerSymbol,
    SimpleLineSymbol, 
    TextSymbol, 
    Color, 
    SpatialReference, 
    Polyline, 
    GraphicsLayer, 
    Font, 
    PictureMarkerSymbol, 
    SimpleFillSymbol,
    EventBus
    ) {
    return declare("distance", null, {
      attr: "attr",

      constructor: function(map, id) {

        this.map = map;

        this.meaLineLayer = new GraphicsLayer();
        this.clsBtnLayer = new GraphicsLayer({
          id: "distanceClsBtnLayer"
        });

        this.map.addLayer(this.meaLineLayer);
        this.map.addLayer(this.clsBtnLayer);

        this.clearSym = new PictureMarkerSymbol("images/meaClear1.jpg", 20, 20).setOffset(80, 20);
        console.log("distance init add.");
        this.init();
      },
      init: function() {
        EventBus.on('DISTANCE_STARTUP', this.addToolbar, this);
        EventBus.on('All_WIDGETS_CLOSE',this.close,this);
        console.log("distance init.");
      },
      addToolbar: function() {

        this.toolbar = new Draw(this.map);
        this.toolbar.activate(Draw.POLYLINE);
        this.map.hideZoomSlider();
        this.meaLineLayer.clear();
        this.clsBtnLayer.clear();

        var stCoord = null;
        var edCoord = null;
        var accDistance = 0;


        var drawSignal = this.map.on("click", lang.hitch(this, function(evt) {

          var meaPt = new Point(evt.mapPoint.x, evt.mapPoint.y);
          var meaSym = new SimpleMarkerSymbol().setSize(10);
          var meaGra = new Graphic(meaPt, meaSym);

          var bagSym = new SimpleMarkerSymbol().setSize(75).setOffset(30, 20).setColor(new Color([23, 137, 238, 0.8])).setPath("M30,65h75v20h-75z");
          var font = new Font().setSize("11pt");
          var valueSym = new TextSymbol().setOffset(30, 15).setColor(new Color([255, 0, 0])).setFont(font);

          this.meaLineLayer.add(meaGra);





          if (stCoord) {
            edCoord = [];
            edCoord[0] = evt.mapPoint.x;
            edCoord[1] = evt.mapPoint.y;
            accDistance = (accDistance * 1000 + secDistance(stCoord, edCoord) * 1000) / 1000;
            var value = accDistance + "米";
            stCoord = edCoord;

            var bagGra = new Graphic(meaPt, bagSym);
            this.meaLineLayer.add(bagGra);

            valueSym.setText(value);
            var valueGra = new Graphic(meaPt, valueSym);
            this.meaLineLayer.add(valueGra);

          } else {
            stCoord = [];
            stCoord[0] = evt.mapPoint.x;
            stCoord[1] = evt.mapPoint.y;
            accDistance = 0;
          }

          function secDistance(stCoord, edCoord) {
            var secLine = new Polyline([stCoord, edCoord]);
            var secDistance = geodesicUtils.geodesicLengths([secLine], Units.METERS);
            secDistance = parseFloat(secDistance[0].toFixed(2));
            return secDistance;
          }


        }));


        this.toolbar.on("draw-complete", lang.hitch(this, function(evt) {

          var sr = new SpatialReference({
            wkid: 102113
          });
          var geo = evt.geometry;

          var meaGeo = geo;
          var meaDistance = geodesicUtils.geodesicLengths([meaGeo], Units.METERS);

          var meaLineSym = new SimpleLineSymbol().setColor(new Color([255, 0, 0, 1]));
          var meaLineGra = new Graphic(geo, meaLineSym);

          this.meaLineLayer.add(meaLineGra);
          var last = evt.geometry.paths[0].length - 1;
          var location = evt.geometry.paths[0][last];
          var clearPt = new Point(location);
          var clearGra = new Graphic(clearPt, this.clearSym);

          this.clsBtnLayer.add(clearGra);

          query("#distanceClsBtnLayer_layer").style("cursor", "pointer");

          var closeSignal = this.clsBtnLayer.on("click", lang.hitch(this,
            function(evt) {
              if ([evt.graphic.geometry.x, evt.graphic.geometry.y].toString() == location.toString()) {
                this.meaLineLayer.clear();
                this.meaLineLayer.clear();
                this.clsBtnLayer.clear();
                closeSignal.remove();
              }
            }
          ));

          this.toolbar.deactivate();
          this.map.showZoomSlider();
          drawSignal.remove();
        }));
      },
      close:function(){
        if(this.meaLineLayer){
          this.meaLineLayer.clear();
        }
        if (this.clsBtnLayer) {
          this.clsBtnLayer.clear();
        }
        if(this.toolbar){
          this.toolbar.deactivate();
        }
        this.toolbar = null;
      }
    });
  }
);
