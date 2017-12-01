/*菜单*/
define([
    "dojo/_base/declare",
    "echo/utils/EventBus",
    "dojo/query",
    "dojo/NodeList-dom",
    "dojo/domReady!"
  ],
  function(declare, EventBus, query) {
    return declare("menu", null, {
      constructor: function(config) {
        this.config = config;
        this.init();
      },
      startup: function() {
        this.bindEvent();
      },
      init: function() {
        this.startup();
      },
      bindEvent: function() {
        /*添加菜单点击事件*/

        //菜单样式
        this.runChlidMenuMoudle();

        //放大
        query('#fangda').on('click', (function() {
          this.runMoudle('ZOOM_IN_OR_ZOOM_OUT_STARTUP','fangda')
        }).bind(this));

        //缩小
        query('#suoxiao').on('click', (function() { 
          this.runMoudle('ZOOM_IN_OR_ZOOM_OUT_STARTUP','suoxiao')
        }).bind(this));

        // 测距
        query('#distance').on('click', (function() { 
          this.runMoudle('DISTANCE_STARTUP')
        }).bind(this));
        
        //测面
        query('#area').on('click', (function() { 
          this.runMoudle('AREA_STARTUP')
        }).bind(this));
        
        //测绘
        query('#tagging').on('click', (function() { 
          this.runMoudle('TAGGING_STARTUP')
        }).bind(this));

        $("#attrQueryBtn").on("click", (function(event){
          this.runMoudle("ATTRMANAGER_WIDGET_START_UP");
        }).bind(this));

        $('#commonTool').on('click',function(){
          $('#toolMap').show();
        });
        if($('#USERNAME').val() !=''){
          $('#username').show();
          $('#login').hide();
          $('#username').html($('#USERNAME').val()+"<a class='user-logout' title='注销' href='./logOut'></a>");
        }
        

      },

      //打开模块通用方法
      runMoudle: function(modulesStartup) {
        EventBus.emit('All_WIDGETS_CLOSE');
        EventBus.emit(modulesStartup);
      },

      //打开右菜单工具条并设置选中状态样式方法
      runRightMenuMoudle: function(modulesStartup,menuId) {
        if(menuId != "#rightMenuClean"){//如果功能为清除，则不添加点击样式
          $(menuId).addClass('draw-active');//添加点击后样式
        }
        $(menuId).siblings().each(function(){//删除其同级节点的点击状态样式
          $(this).removeClass('draw-active');
        });
        EventBus.emit('All_WIDGETS_CLOSE');
        if(modulesStartup){
          EventBus.emit(modulesStartup);
        }
      },
      // 二级菜单
      runChlidMenuMoudle:function(){
        $('#ulMenuTop li').on('click',function(){
          $(this).addClass("nav-active").siblings().removeClass('nav-active')
        });
        query('#toolMap ul li').on('click',function(){
          $(this).addClass('tool-active').siblings().removeClass('tool-active');
        })
      },
      //打开右菜单工具条并设置选中状态样式，打开子菜单
      runTopMenuMoudle: function(modulesStartup,menuId) {
        //如果子菜单存在则显示子菜单背景，否则此处不做处理，直接打开模块
        query("#ulTopMenu>li").removeClass("nav-active");
        query(menuId).addClass("nav-active");
        EventBus.emit('All_WIDGETS_CLOSE');
        if(modulesStartup){
          EventBus.emit(modulesStartup);
        }
      }
    });
  });
