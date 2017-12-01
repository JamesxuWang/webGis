define([], function() {
  var mapconfig = {};
  mapconfig.mapOptions = {
    rows: 256,
    cols: 256,
    logo: false,
    sliderStyle: "small",
    origin: {
      "x": -180,
      "y": 90
    },
    spatialReference: {
      "wkid": 4326
    },
    slider : false,
    lods: [
      {"level": 2,"resolution": 0.3515625,"scale": 147748796.52937502}, 
      {"level": 3,"resolution": 0.17578125,"scale": 73874398.264687508}, 
      {"level": 4,"resolution": 0.087890625,"scale": 36937199.132343754}, 
      {"level": 5,"resolution": 0.0439453125,"scale": 18468599.566171877}, 
      {"level": 6,"resolution": 0.02197265625,"scale": 9234299.7830859385}, 
      {"level": 7,"resolution": 0.010986328125,"scale": 4617149.8915429693}, 
      {"level": 8,"resolution": 0.0054931640625,"scale": 2308574.9457714846}, 
      {"level": 9,"resolution": 0.00274658203125,"scale": 1154287.4728857423}, 
      {"level": 10,"resolution": 0.001373291015625,"scale": 577143.73644287116}, 
      {"level": 11,"resolution": 0.0006866455078125,"scale": 288571.86822143558}, 
      {"level": 12,"resolution": 0.00034332275390625,"scale": 144285.93411071779}, 
      {"level": 13,"resolution": 0.000171661376953125,"scale": 72142.967055358895}, 
      {"level": 14,"resolution": 8.58306884765625e-005,"scale": 36071.483527679447}, 
      {"level": 15,"resolution": 4.291534423828125e-005,"scale": 18035.741763839724}, 
      {"level": 16,"resolution": 2.1457672119140625e-005,"scale": 9017.8708819198619}, 
      {"level": 17,"resolution": 1.0728836059570313e-005,"scale": 4508.9354409599309},
      {"level": 18, "resolution": 5.364423453814189E-6, "scale": 2254.47 },
      {"level": 19, "resolution": 2.6822117269070947E-6, "scale": 1127.235 },
      {"level": 20, "resolution": 1.3411058634535473E-6, "scale": 563.6175 }
    ]
  };

  mapconfig.initLevel =12;
  mapconfig.center = {
    x: 113.367920,
    y: 23.453170
  };
  mapconfig.initExtent = [113.10663,23.03993,113.436222,23.19340];
    
  mapconfig.baseLayers = [
  /*矢量地图*/
  {
    'type': 'WebTiledLayer',
    'layerName': '天地图矢量地图',
    'layerGroup': '矢量地图',
    'url': 'http://t${subDomain}.tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=tiles',
    "subDomains": ["0", "1", "2", "3", "4", "5", "6", "7"],
    "displayLevels": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15,16,17]
  }, {
    'type': 'WebTiledLayer',
    'layerName': '天地图矢量地图注记',
    'layerGroup': '矢量地图',
    'url': 'http://t${subDomain}.tianditu.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=tiles',
    "subDomains": ["0", "1", "2", "3", "4", "5", "6", "7"],
    "displayLevels": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15,16,17]
  }, {
    'type': 'WebTiledLayer',
    'layerName': '广东省矢量地图',
    'layerGroup': '矢量地图',
    'url': 'http://services.tianditugd.com:8080/2f9qgl/DLG_PAD/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=DLG_PAD&STYLE=DLG_PAD&TILEMATRIXSET=Matrix_0&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=image%2Ftile',
    "displayLevels": [15, 16, 17]
  }, {
    'type': 'WebTiledLayer',
    'layerName': '越秀区互联网矢量电子地图',
    'layerGroup': '矢量地图',
    'url': 'http://map.yuexiu.gov.cn:9010/DLG_PUB_440104/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=DLGGK&STYLE=DLGGK&TILEMATRIXSET=Matrix_0&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=image%2Ftile',
    "displayLevels": [18,19,20]
  }, {
    'type': 'WebTiledLayer',
    'layerName': '越秀区互联网矢量注记',
    'layerGroup': '矢量地图',
    'url': 'http://map.yuexiu.gov.cn:9010/DLGZJ_PUB_440104/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=DLG_ZJGK&STYLE=DLG_ZJGK&TILEMATRIXSET=Matrix_0&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=image%2Ftile',
    "displayLevels": [18,19,20]
  },
  /*影像地图*/
  {
    'type': 'WebTiledLayer',
    'layerName': '天地图影像地图',
    'layerGroup': '影像地图',
    'url': 'http://t${subDomain}.tianditu.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=tiles',
    "subDomains": ["0", "1", "2", "3", "4", "5", "6", "7"],
    "displayLevels": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
  }, {
    'type': 'WebTiledLayer',
    'layerName': '天地图影像地图注记',
    'layerGroup': '影像地图',
    'url': 'http://t${subDomain}.tianditu.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=tiles',
    "subDomains": ["0", "1", "2", "3", "4", "5", "6", "7"],
    "displayLevels": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
  }, {
    'type': 'WebTiledLayer',
    'layerName': '越秀区互联网影像电子地图',
    'layerGroup': '影像地图',
    'url': 'http://map.yuexiu.gov.cn:9010/DOM_PUB_440104/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=DOMGK&STYLE=DOMGK&TILEMATRIXSET=Matrix_0&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=image%2Ftile',
    "displayLevels": [18]
  }, {
    'type': 'WebTiledLayer',
    'layerName': '越秀区互联网影像道路',
    'layerGroup': '影像地图',
    'url': 'http://map.yuexiu.gov.cn:9010/DOMDL_PUB_440104/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=DOM_DLGK&STYLE=DOM_DLGK&TILEMATRIXSET=Matrix_0&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=image%2Ftile',
    "displayLevels": [18]
  }, {
    'type': 'WebTiledLayer',
    'layerName': '越秀区互联网影像地图注记',
    'layerGroup': '影像地图',
    'url': 'http://map.yuexiu.gov.cn:9010/DOMZJ_PUB_440104/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=DOM_ZJGK&STYLE=DOM_ZJGK&TILEMATRIXSET=Matrix_0&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=image%2Ftile',
    "displayLevels": [18]
  }      
];

  mapconfig.showSilde = "false";

  return mapconfig;
});
