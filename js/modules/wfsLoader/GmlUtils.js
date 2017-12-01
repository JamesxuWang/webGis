define(["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/query",
    "esri/geometry/Point",
    "esri/graphic",
    "esri/geometry/Polygon",
    "esri/geometry/Polyline",
    "esri/SpatialReference",
    "esri/symbols/SimpleFillSymbol",
    "esri/geometry/webMercatorUtils",
    "dojo/NodeList-dom",
    "dojo/NodeList-manipulate"
  ],
  function(declare, lang, query, Point, Graphic, Polygon,Polyline,SpatialReference, SimpleFillSymbol, webMercatorUtils) {
    return declare("GmlUtils", null, {
      generateFeaturesByXml: function(xml, layername) {
        var features = [];
        if (xml.childNodes[0].tagName == "wfs:FeatureCollection") {
          if (xml.childNodes[0].childNodes.length == 0) {
            return features;
          }
          var featuresNode = [];
          if (xml.childNodes[0].childNodes[0].tagName == "gml:featureMembers") {
            featuresNode = xml.childNodes[0].childNodes[0].childNodes;
          } else if (xml.childNodes[0].childNodes[1].tagName == "gml:featureMember") {
            featuresNode = xml.childNodes[0].childNodes[1].childNodes;
          }
          var featuresNodeLength = featuresNode.length;
          if (featuresNodeLength == 0) {
            features;
          }
          var feature = null;
          var attr;
          var featureAttributes;
          var highlightSymbol = new SimpleFillSymbol({
            "type": "esriSFS",
            "style": "esriSFSSolid",
            "color": [255, 0, 0, 51],
            "outline": {
              "type": "esriSLS",
              "style": "esriSLSSolid",
              "color": [255, 0, 0, 208],
              "width": 1
            }
          });
          for (var i = 0; i < featuresNodeLength; i++) {
            feature = featuresNode[i];
            featureAttributes = feature.childNodes;
            feature = new Graphic();
            attr = {};
            var featureAttributesLength = featureAttributes.length;
            var featureAttribute;
            for (var j = 0; j < featureAttributesLength; j++) {
              featureAttribute = featureAttributes[j];
              if (featureAttribute.tagName.toLocaleUpperCase() == (layername + ':' + 'THE_GEOM').toLocaleUpperCase()) {
                //geometry handle
                var geoType = featureAttribute.childNodes[0].tagName.toLocaleUpperCase();
                if (geoType == "GML:POINT") {
                  //point
                  var pointCoor = featureAttribute.childNodes[0].childNodes[0].textContent.split(" ");
                  var x = pointCoor[0];
                  var y = pointCoor[1];
                  var meaPt = new Point(x, y);
                  feature.setGeometry(meaPt);
                } else if (geoType == "GML:MULTISURFACE") {
                  var multiSurface = featureAttribute.firstChild;
                  //var surfaceMemberLength = multiSurface.childNodes.length;
                  if (multiSurface.childNodes.length > 1) {
                    
                  } else {
                    var posList = multiSurface.firstChild.firstChild.firstChild.firstChild.firstChild.textContent;
                    var posListArr = posList.split(' ');
                    var posListArrLength = posListArr.length;
                    var coordinates = [];
                    for (var k = 0; k < posListArr.length; k += 2) {
                      var coordinate = [];
                      coordinate.push(Number(posListArr[k + 1])); //x
                      coordinate.push(Number(posListArr[k])); //y
                      coordinates.push(coordinate);
                    }
                    feature.setGeometry(new Polygon(coordinates));
                  }
                  //MULTISURFACE
                } else if (geoType == "GML:MULTIPOLYGON") {                  
                  var multiSurface = featureAttribute.firstChild;
                  if (multiSurface.childNodes.length > 1) {

                  } else {
                    var posList = multiSurface.firstChild.firstChild.firstChild.firstChild.firstChild.textContent;
                    var posListArr = posList.split(' ');
                    var posListArrLength = posListArr.length;
                    var coordinates = [];
                    for (var k = 0; k < posListArr.length; k ++) {
                      var coordinate = [];
                      var pointArr = posListArr[k].split(',')
                      coordinate.push(Number(pointArr[0])); //x
                      coordinate.push(Number(pointArr[1])); //y
                      coordinates.push(coordinate);
                    }
                    feature.setGeometry(new Polygon(coordinates));
                  }
                }else{
                  //other
                }
              } else {
                //attribute handle
                attr[featureAttribute.tagName.split(":")[1]] = featureAttribute.textContent;
              }
            }
            feature.setAttributes(attr);
            feature.setSymbol(highlightSymbol);

            features.push(feature);
          };
          return features;
        } else {
          //查询异常
          return null;
        }
      },

      //处理方法2
      generateFeaturesByXmlSecond: function(xml, layername,ind) {
        var features = [];
        if (xml.childNodes[0].tagName == "wfs:FeatureCollection") {
          if (xml.childNodes[0].childNodes.length == 0) {
            return features;
          }

          var featuresNode = [];
          featuresNode = xml.childNodes[0].childNodes;
          var featuresNodeLength = featuresNode.length;
          if (featuresNodeLength == 0) {
            features;
          }
          
          var feature = null;
          var attr;
          var featureAttributes;
          var highlightSymbol = new SimpleFillSymbol({
            "type": "esriSFS",
            "style": "esriSFSSolid",
            "color": [255, 0, 0, 51],
            "outline": {
              "type": "esriSLS",
              "style": "esriSLSSolid",
              "color": [255, 0, 0, 208],
              "width": 1
            }
          });
          for (var i = 0; i < featuresNodeLength; i++) {
            if (!(featuresNode[i].tagName == "gml:featureMember")) {
              continue;
            }
            feature = featuresNode[i];
            // 注意，feature.childNodes参数不一样  remove 下次再试
                        
            featureAttributes = feature.childNodes[ind].childNodes;
            feature = new Graphic();
            attr = {};
            var featureAttributesLength = featureAttributes.length;
            var featureAttribute;
            for (var j = 0; j < featureAttributesLength; j++) {
              featureAttribute = featureAttributes[j];
              if(featureAttribute.nodeName == '#text') {continue;} 
              if (featureAttribute.tagName.toLocaleUpperCase() == ('GEOMETRY').toLocaleUpperCase()) {
                //geometry handle
                for (var z = 0; z < featureAttribute.childNodes.length; z++) {
                  if(featureAttribute.childNodes[z].nodeName == '#text') {continue;}                 
                  var geoType = featureAttribute.childNodes[z].tagName.toLocaleUpperCase();
                  if (geoType == "GML:POINT") {
                    //point
                    var multiSurface = featureAttribute.lastElementChild;
                    if (multiSurface) {
                      var pointCoor = multiSurface.textContent;
                      pointCoor = pointCoor.replace(/[\r\n]/g,"");//去掉回车换行
                      pointCoor = $.trim(pointCoor);       
                      var pointCoor = pointCoor.split(pointCoor.replace(/\d|\./g,''));
                      // if(pointCoor.indexOf(',') != -1){
                      //   pointCoor = pointCoor.split(',');
                      // }else if(pointCoor.indexOf(' ') != -1){
                      //   pointCoor = pointCoor.split(' ');
                      // }
                      // 加东西来判断XY顺序
                      var x = Number(pointCoor[1]);
                      var y = Number(pointCoor[0]);
                      
                      var meaPt = new Point(x, y);
                      feature.setGeometry(meaPt);
                    } 
                    
                  } else if (geoType == "GML:LINESTRING") {
                    var multiSurface = featureAttribute.lastElementChild;
                    if (multiSurface) {
                      var posList = multiSurface.textContent;
                      posList = posList.replace(/[\r\n]/g,"");//去掉回车换行
                      posList = $.trim(posList);
                      var posListArr = posList.split(/\ +/g);
                      var posListArrLength = posListArr.length;
                      var coordinates = [];
                      for (var k = 0; k < posListArr.length; k+=2) {
                        // var pointCoor = posListArr[k].split(",");
                        var meaPt = new Point(posListArr[k+1], posListArr[k]);
                        coordinates.push(meaPt);
                      }
                      var polyline = new Polyline(new SpatialReference({wkid:4326}));
                      polyline.addPath(coordinates);
                      feature.setGeometry(polyline);
                    }
                  } else if(geoType == "GML:POLYGON"){
                    var multiSurface = featureAttribute.lastElementChild;
                    var posList = $(multiSurface).find("posList");
                    if(posList.length > 0)
                    {
                      posList = posList[0].innerHTML;
                      posList = posList.replace(/[\r\n]/g,"");//去掉回车换行
                      posList = $.trim(posList);
                      var posListArr = posList.split(/\ +/g);
                      var posListArrLength = posListArr.length;
                      var coordinatesArr = [];
                      for(var k = 0; k < posListArrLength; k+=2) {
                        coordinatesArr.push([posListArr[k+1], posListArr[k]]);
                      }
                      // var polygon = new Polygon(new SpatialReference({wkid:4326}));
                      // polygon.addRing(coordinatesArr);
                      var polygon = new Polygon(coordinatesArr);
                      feature.setGeometry(polygon);
                    }
                  } else if (geoType == "GML:MULTIPOLYGON") {                  
                    var multiSurface = featureAttribute.firstChild;
                    if (multiSurface.childNodes.length > 1) {

                    } else {
                      var posList = multiSurface.firstChild.firstChild.firstChild.firstChild.firstChild.textContent;
                      var posListArr = posList.split(' ');
                      var posListArrLength = posListArr.length;
                      var coordinates = [];
                      for (var k = 0; k < posListArr.length; k ++) {
                        var coordinate = [];
                        var pointArr = posListArr[k].split(',')
                        coordinate.push(Number(pointArr[0])); //x
                        coordinate.push(Number(pointArr[1])); //y
                        coordinates.push(coordinate);
                      }
                      feature.setGeometry(new Polygon(coordinates));
                    }
                  }else if(geoType == "GML:MULTILINESTRING"){
                    var multiSurface = featureAttribute.lastElementChild;
                    if (multiSurface) {
                      var posList = multiSurface.textContent;
                      posList = posList.replace(/[\r\n]/g,"");//去掉回车换行
                      posList = $.trim(posList);
                      var posListArr = posList.split(/\ +/g);
                      var posListArrLength = posListArr.length;
                      var coordinates = [];
                      for (var k = 0; k < posListArr.length; k+=2) {
                        // var pointCoor = posListArr[k].split(",");
                        var meaPt = new Point(posListArr[k+1], posListArr[k]);
                        coordinates.push(meaPt);
                      }
                      var polyline = new Polyline(new SpatialReference({wkid:4326}));
                      polyline.addPath(coordinates);
                      feature.setGeometry(polyline);
                    } 
                  }
                }//for
              } else {
                //attribute handle
                if(featureAttribute.tagName.split(":")[1]){
                  attr[featureAttribute.tagName.split(":")[1]] = featureAttribute.textContent;
                }else{
                  attr[featureAttribute.tagName] = featureAttribute.textContent;
                }
                
              }
            }
            feature.setAttributes(attr);
            feature.setSymbol(highlightSymbol);

            features.push(feature);
          };
          return features;
        } else {
          //查询异常
          return null;
        }
      },

      //空间查询处理方法
      generateFeaturesByXmlSpace: function(xml, layername) {
        var features = [];
        if (xml.childNodes[0].tagName == "wfs:FeatureCollection") {
          if (xml.childNodes[0].childNodes.length == 0) {
            return features;
          }

          var featuresNode = [];
          featuresNode = xml.childNodes[0].childNodes;
          var featuresNodeLength = featuresNode.length;
          if (featuresNodeLength == 0) {
            features;
          }
          
          var feature = null;
          var attr;
          var featureAttributes;
          var highlightSymbol = new SimpleFillSymbol({
            "type": "esriSFS",
            "style": "esriSFSSolid",
            "color": [255, 0, 0, 51],
            "outline": {
              "type": "esriSLS",
              "style": "esriSLSSolid",
              "color": [255, 0, 0, 208],
              "width": 1
            }
          });
          for (var i = 0; i < featuresNodeLength; i++) {
            if (!(featuresNode[i].tagName == "gml:featureMember")) {continue;}
            feature = featuresNode[i];
            //feature.childNodes需要打印出来看！！！！请注意
            featureAttributes = feature.childNodes[1].childNodes;
            feature = new Graphic();
            attr = {};
            var featureAttributesLength = featureAttributes.length;
            var featureAttribute;
            for (var j = 0; j < featureAttributesLength; j++) {
              featureAttribute = featureAttributes[j];
              if (featureAttribute.tagName.toLocaleUpperCase() == ('GEOMETRY').toLocaleUpperCase()) {
                //geometry handle
                var geoType = featureAttribute.childNodes[0].tagName.toLocaleUpperCase();
                if (geoType == "GML:POINT") {
                  //point
                  var multiSurface = featureAttribute.lastElementChild;
                  if (multiSurface) {
                    var pointCoor = multiSurface.textContent;
                    pointCoor = pointCoor.replace(/[\r\n]/g,"");//去掉回车换行
                    pointCoor = $.trim(pointCoor);
                    var pointCoor = pointCoor.split(',');
                    var x = Number(pointCoor[0]);
                    var y = Number(pointCoor[1]);
                    
                    var meaPt = new Point(x, y);
                    feature.setGeometry(meaPt);
                  } 
                } else if (geoType == "GML:LINESTRING") {
                  var multiSurface = featureAttribute.lastElementChild;
                  if (multiSurface) {
                    var posList = multiSurface.textContent;
                    posList = posList.replace(/[\r\n]/g,"");//去掉回车换行
                    posList = $.trim(posList);
                    var posListArr = posList.split(/\ +/g);
                    var coordinates = [];
                    for (var k = 0; k < posListArr.length; k++) {
                      var pointCoor = posListArr[k].split(",");
                      var meaPt = new Point(pointCoor[0], pointCoor[1]);
                      coordinates.push(meaPt);
                    }
                    var polyline = new Polyline(new SpatialReference({wkid:4326}));
                    polyline.addPath(coordinates);
                    feature.setGeometry(polyline);
                  }
                  //MULTISURFACE
                } else if (geoType == "GML:MULTIPOLYGON") {                  
                  var multiSurface = featureAttribute.firstChild;
                  if (multiSurface.childNodes.length > 1) {

                  } else {
                    var posList = multiSurface.firstChild.firstChild.firstChild.firstChild.firstChild.textContent;
                    var posListArr = posList.split(' ');
                    var posListArrLength = posListArr.length;
                    var coordinates = [];
                    for (var k = 0; k < posListArr.length; k ++) {
                      var coordinate = [];
                      var pointArr = posListArr[k].split(',')
                      coordinate.push(Number(pointArr[0])); //x
                      coordinate.push(Number(pointArr[1])); //y
                      coordinates.push(coordinate);
                    }
                    feature.setGeometry(new Polygon(coordinates));
                  }
                }else if(geoType == "GML:MULTILINESTRING"){
                  var multiSurface = featureAttribute.lastElementChild;
                  if (multiSurface) {
                    var posList = multiSurface.textContent;
                    posList = posList.replace(/[\r\n]/g,"");//去掉回车换行
                    posList = $.trim(posList);
                    var posListArr = posList.split(/\ +/g);
                    var coordinates = [];
                    for (var k = 0; k < posListArr.length; k++) {
                      var pointCoor = posListArr[k].split(",");
                      var meaPt = new Point(pointCoor[0], pointCoor[1]);
                      coordinates.push(meaPt);
                    }
                    var polyline = new Polyline(new SpatialReference({wkid:4326}));
                    polyline.addPath(coordinates);
                    feature.setGeometry(polyline);
                  } 
                }
              } else {
                //attribute handle
                if(featureAttribute.tagName.split(":")[1]){
                  attr[featureAttribute.tagName.split(":")[1]] = featureAttribute.textContent;
                }else{
                  attr[featureAttribute.tagName] = featureAttribute.textContent;
                }
                
              }
            }
            feature.setAttributes(attr);
            feature.setSymbol(highlightSymbol);

            features.push(feature);
          };
          return features;
        } else {
          //查询异常
          return null;
        }
      }
    })
  });
