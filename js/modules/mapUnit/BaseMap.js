define(
  ["dojo/_base/declare",
    "dojo/dom", "dojo/query", "dojo/on",
    "esri/map", "esri/toolbars/draw", "esri/geometry/Point",
    "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ArcGISTiledMapServiceLayer",
    "dojo/_base/lang", "esri/layers/FeatureLayer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
    "esri/renderers/SimpleRenderer", "esri/graphic", "esri/Color", "dojo/number", "dojo/dom-style", "esri/lang",
    "esri/tasks/QueryTask", "esri/tasks/query", "esri/geometry/normalizeUtils",
    "esri/layers/TileInfo", "esri/layers/WebTiledLayer",
    "dojo/NodeList-dom", "dojo/NodeList-manipulate"
  ],
  function(
    declare,
    dom, query, on,
    Map, Draw, Point,
    ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer,
    lang, FeatureLayer, SimpleFillSymbol, SimpleLineSymbol,
    SimpleRenderer, graphic, Color, number, domStyle, esriLang,
    QueryTask, Query, normalizeUtils,
    TileInfo, WebTiledLayer) {

    return declare("BaseMap", null, {
        layerNum: 0,

        constructor: function(map, mapCenter, mapLevel) {
          this.map = map;
          this.mapCenter = mapCenter;
          this.mapLevel = mapLevel;
          this.toolbar = new Draw(this.map);

          this.queryResObj = {};
          this.init();

        }, //end constructor

        init: function() {

            var tileInfo = new TileInfo({
              "rows": 256,
              "cols": 256,
              "compressionQuality": 0,
              "origin": {
                "x": -180,
                "y": 90
              },
              "spatialReference": {
                "wkid": 4326
              },
              "lods": [{
                "level": 2,
                "resolution": 0.3515625,
                "scale": 147748796.52937502
              }, {
                "level": 3,
                "resolution": 0.17578125,
                "scale": 73874398.264687508
              }, {
                "level": 4,
                "resolution": 0.087890625,
                "scale": 36937199.132343754
              }, {
                "level": 5,
                "resolution": 0.0439453125,
                "scale": 18468599.566171877
              }, {
                "level": 6,
                "resolution": 0.02197265625,
                "scale": 9234299.7830859385
              }, {
                "level": 7,
                "resolution": 0.010986328125,
                "scale": 4617149.8915429693
              }, {
                "level": 8,
                "resolution": 0.0054931640625,
                "scale": 2308574.9457714846
              }, {
                "level": 9,
                "resolution": 0.00274658203125,
                "scale": 1154287.4728857423
              }, {
                "level": 10,
                "resolution": 0.001373291015625,
                "scale": 577143.73644287116
              }, {
                "level": 11,
                "resolution": 0.0006866455078125,
                "scale": 288571.86822143558
              }, {
                "level": 12,
                "resolution": 0.00034332275390625,
                "scale": 144285.93411071779
              }, {
                "level": 13,
                "resolution": 0.000171661376953125,
                "scale": 72142.967055358895
              }, {
                "level": 14,
                "resolution": 8.58306884765625e-005,
                "scale": 36111.98186701241
              }, {
                "level": 15,
                "resolution": 4.291534423828125e-005,
                "scale": 18035.741763839724
              }, {
                "level": 16,
                "resolution": 2.1457672119140625e-005,
                "scale": 9017.8708819198619
              }, {
                "level": 17,
                "resolution": 1.0728836059570313e-005,
                "scale": 4508.9354409599309
              }]
            });

            this.imgMap = new WebTiledLayer("http://t${subDomain}.tianditu.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=tiles", {
              "subDomains": ["0", "1", "2", "3", "4", "5", "6", "7"],
              "tileInfo": tileInfo,
              "displayLevels": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
            });
            this.imgMap.attr("layerType", "影像地图");

            this.imgLayer = new WebTiledLayer("http://t${subDomain}.tianditu.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=tiles", {
              "subDomains": ["0", "1", "2", "3", "4", "5", "6", "7"],
              "tileInfo": tileInfo,
              "displayLevels": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
            });
            this.imgLayer.attr("layerType", "影像地图");
            // //省级影像
            // this.provinceImgLyr = new WebTiledLayer("http://services.tianditugd.com:8080/Btqmvf/gdimg201311/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=gdimg201311&STYLE=gdimg201311&TILEMATRIXSET=Matrix_0&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=image%2Ftile", {
            //   "tileInfo": tileInfo,
            //   "displayLevels": [2, 3, 4, 5, 6, 7, 8, 9,11, 12, 13, 15, 16, 17]
            // });
            // this.provinceImgLyr.attr("layerType", "影像地图");
            // //省级影像注记
            // this.provinceImgAnoLyr = new WebTiledLayer("http://services.tianditugd.com:8080/Btqmvf/gdimg201311_anno/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=gdimg201311_anno&STYLE=gdimg201311_anno&TILEMATRIXSET=Matrix_0&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=image%2Ftile", {
            //   "tileInfo": tileInfo,
            //   "displayLevels": [2, 3, 4, 5, 6, 7, 8, 9,11, 12, 13, 15, 16, 17]
            // });
            // this.provinceImgAnoLyr.attr("layerType", "影像地图");
            //天地图矢量
            this.vectorMap = new WebTiledLayer("http://t${subDomain}.tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=tiles", {
              "subDomains": ["0", "1", "2", "3", "4", "5", "6", "7"],
              "tileInfo": tileInfo,
              "displayLevels": [2, 3, 4, 5, 6, 7, 8, 9, 10, 14]
            });
            this.vectorMap.attr("layerType", "矢量地图");

            //天地图矢量注记
            this.vectorLayer = new WebTiledLayer("http://t${subDomain}.tianditu.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=tiles", {
              "subDomains": ["0", "1", "2", "3", "4", "5", "6", "7"],
              "tileInfo": tileInfo,
              "displayLevels": [2, 3, 4, 5, 6, 7, 8, 9, 10, 14]
            });
            this.vectorLayer.attr("layerType", "矢量地图");

            //省级矢量加注记
            this.provinceVecAndAnnoLyr = new WebTiledLayer("http://services.tianditugd.com:8080/2f9qgl/DLG_PAD/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=DLG_PAD&STYLE=DLG_PAD&TILEMATRIXSET=Matrix_0&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=image%2Ftile", {
              "tileInfo": tileInfo,
              "displayLevels": [11, 12, 13, 15, 16, 17]
            });
            this.provinceVecAndAnnoLyr.attr("layerType", "矢量地图");

            //省级矢量底图
            this.provinceVecLyr = new WebTiledLayer("http://services.tianditugd.com:8080/2f9qgl/DLG_PAD/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=DLG_PAD&STYLE=DLG_PAD&TILEMATRIXSET=Matrix_0&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=image%2Ftile", {
              "tileInfo": tileInfo,
              "displayLevels": [11, 12, 13]
            });
            this.provinceVecLyr.attr("layerType", "矢量地图");

            this.map.on("layer-add", lang.hitch(this, function() {
              this.layerNum++;
            }));

            this.map.on("layers-add", function(evt) {

              console.log("The layer is added.", layerNum, evt, evt.layer, evt.layer.tileInfo, evt.layer.initialExtent, evt.layer._url);

            });

            this.vecLayers = [this.vectorMap, this.vectorLayer, this.provinceVecAndAnnoLyr, this.provinceVecLyr];
            this.imgLayers = [this.imgMap, this.imgLayer, /**this.provinceImgLyr, this.provinceImgAnoLyr**/ ];

            this.map.addLayers(this.vecLayers);
            this.map.addLayers(this.imgLayers);

            this.centerPoint = new Point(this.mapCenter);

            this.map.centerAndZoom(this.centerPoint, this.mapLevel);

          } //end init


      }) // end return declare

  }); //end define
