/**
 * 
 * @authors huangfang
 * @date    2016-05-25 17:29:08
 * @describe 鹰眼功能模块
 */
 define(
[
	"dojo/_base/declare",
	"dojo/query",
	"echo/utils/EventBus",
	"echo/viewer/yingyan/OverviewMap",
    "dojo/NodeList-dom",
    "dojo/domReady!"
],
function(
	declare,
	query,
	EventBus,
	OverviewMap
){
	return declare('yingyan',null,{
		eventHandlers:[],
		baseLayers:[],
		/**
		 * 修改Arcgis原生鹰眼功能，使得可以显示多个图层
		 * @name yingyan
		 * @grammar yingyan(map, attachTo)
		 * @param {Arcgis Map Object} map 鹰眼功能关联的地图对象
		 * @param {String} attachTo 可选参数 鹰眼功能在地图的位置，
		 *							候选值有"top-left"，"top-right", "bottom-left", "bottom-right"，
		 *							当不提供或者输入的值不属于候选值时，将默认设置为"bottom-right".
		 */
		constructor:function(map, attachTo){
			this.map = map;
			(!attachTo) ? this.attachTo = "bottom-right" : 
				((["top-left","top-right","bottom-left","bottom-right"]).indexOf(attachTo) == -1) ? this.attachTo = "bottom-right" : this.attachTo = attachTo;
			this.init();
		},

		init:function(){
			EventBus.on('YINGYAN_STARTUP',this.startup,this);
		},

		startup: function(){
			var layerIds = this.map.layerIds;
			for(var i=0; i<layerIds.length; i++){
				this.baseLayers.push(this.map.getLayer(layerIds[i]));
			}
			if(this.baseLayers.length > 0){
				var overViewMap = new OverviewMap({
					map: this.map,
					attachTo: this.attachTo,
					color:"#D84E13",
					opacity: .40,
					baseLayers: this.baseLayers
				});
				overViewMap.startup();
			}
			this.bindEvent();
		},

		bindEvent: function() {

		},

		cleanMapMarks: function() {},
		cleanEvent: function() {
			for (var i = 0, handler; handler = this.eventHandlers[i++];) {
				handler.remove();
			}
		},
		cleanOthers: function() {},
		hidden: function() {
			this.cleanMapMarks();
			this.cleanEvent();
			this.cleanOthers();
		},
		close: function() {
			this.hidden();
		}
	});

});

