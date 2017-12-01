define([], function() {
    var config = {};

    /*后台运维管理地址*/
    // var ywglUrl = "http://localhost:8080/szjm_gtzy_ywgl";

    /*arcgis rest services路径*/
    var arcgisServicesUrl = "http://172.16.50.98:6080/arcgis/rest/services/yuexiu";

    /*代理文件地址:*/
    config.proxyUrl = "/proxy/proxy.jsp?";

    config.AttrQueryWidget = {
        mapServerURL: arcgisServicesUrl + '/ajd/MapServer/0',
    }
    //版权设定
    config.Copyright = {
      /*默认显示的版权*/
      defaultText: "GS(2015)2583号 数据来源：国家地理信息公共服务平台",
      /*特定地图范围下的版权*/
      extentData: [{
          extent: [111.81224077219032, 22.797710401294722, 112.28121965402626, 23.000957471607222],
          text: "GS(2015)2583号 数据来源：国家地理信息公共服务平台"
      }],
      /*特定级别下的版权，优先度比地图范围的版权低*/
      levelData: [{
          level: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15],
          text: "GS(2015)2583号 数据来源：国家地理信息公共服务平台"
      }, {
          level: [16, 17, 18, 19, 20],
          text: "自定义图层"
      }]
    };
    config.AttrManagerWidget = {       
    }

    config.Warning = {
    }

    return config;
});
