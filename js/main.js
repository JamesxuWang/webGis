require([
    "esri/map",
    "esri/geometry/Point",
    "dojo/on",
    "dojo/dom",
    "dojo/query",
    "esri/layers/TiledMapServiceLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/dijit/Scalebar",
    "config/config",
    "config/mapconfig",
    'modules/menu',
    "modules/mapUnit/BaseMap",
    "modules/mapUnit/BaseMapSwitch",
    "modules/mapUnit/area",
    "modules/mapUnit/distance",
    "modules/mapUnit/tagging",
    "modules/mapUnit/yingyan",
    "modules/mapUnit/zoom",
    "modules/mapUnit/Copyright",
    "modules/layInit/layInit",
    "echo/utils/EventBus",
    "echo/viewer/mapmanager",
    "dojo/i18n!esri/nls/jsapi",
    "dojo/NodeList-traverse",
    "dojo/domReady!"
  ],
  function(
    Map,
    Point,
    on,
    dom,
    query,
    TiledMapServiceLayer,
    ArcGISTiledMapServiceLayer,
    ArcGISDynamicMapServiceLayer,
    Scalebar,
    config,
    mapconfig,
    menu,
    BaseMap,
    BaseMapSwitch,
    area,
    distance,
    tagging,
    yingyan,
    zoom,
    Copyright,
    layInit,
    EventBus,
    mapmanager,
    bundle
  ) {

    esriConfig.defaults.io.proxyUrl = config.proxyUrl;
    esriConfig.defaults.io.alwaysUseProxy = false;

    var mapmanager = new mapmanager('mapDiv', mapconfig);
    var map = mapmanager.getMap();

    var baseMapSwitch = new BaseMapSwitch(map, "switchBaseMap");

    //菜单控制
    var menu = new menu();
    var zoom = new zoom(map); /*放大缩小*/
    var area = new area(map); /*测面模块*/
    var distance = new distance(map); /*测距模块*/
    var tagging = new tagging(map); /*标注*/
    var yingyan = new yingyan(map); /*鹰眼模块*/    
    var copyright = new Copyright(map, config.Copyright);/*版权控件*/
    var layInit = new layInit(map,config.layui);    /*layui初始化*/

    /*添加比例尺控件*/
    bundle.widgets.scalebar.mi = "英里";
    bundle.widgets.scalebar.m = "米";
    bundle.widgets.scalebar.km = "公里";
    bundle.widgets.scalebar.ft = "英尺";
    var scalebar = new Scalebar({
        map: map,
        scalebarUnit: "dual"
    });


    EventBus.emit('YINGYAN_STARTUP'); /*打开鹰眼模块*/

  });
