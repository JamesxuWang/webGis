define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/query',
  'echo/base/EventHandler',
  'dojox/uuid/generateRandomUuid',
  'dojo/NodeList-dom',
  'dojo/NodeList-manipulate'
], function(declare, lang, query, EventHandler, generateRandomUuid) {
  return declare("Pager", [EventHandler], {
    eventTypes: {
      "pagechange": "pagechange"
    }, //事件类型，用作枚举事件类型，代替字符串输入，输入错误时可得到浏览器警告
    page: 0, //当前页数
    pageCount: 1, //总页数
    pageSize: 10, //每页记录数
    totalSize: 10, //总记录数
    container: null, //所属容器
    btnPre: null, //上一页按钮
    btnNext: null, //下一页按钮
    pageSelector: null, //页码选择器
    constructor: function(targetId, pageSize, totalSize) {
      if (targetId == null || targetId.trim() == '') {
        throw new Error("未知的控件ID");
      }

      targetId = targetId.indexOf('#') > -1 ? targetId : '#' + targetId; //检测是否带#

      this.container = query(targetId);
      if (this.container.length == 0) {
        throw new Error('未找到：' + targetId);
      }

      this.page = 0;
      this.pageCount = 1;
      this.pageSize = pageSize == null ? 10 : pageSize; //每页记录数
      this.totalSize = totalSize == null ? 10 : totalSize; //总记录数

      if (pageSize || totalSize) {
        this.setPageCount();
      }

    },
    setTotalSize: function(totalSize) {
      this.totalSize = totalSize == -1 ? this.totalSize : totalSize;
      this.setPageCount();
    },
    setPageSize: function(pageSize) {
      this.pageSize = pageSize == -1 ? this.pageSize : pageSize;
      this.setPageCount();
    },
    setTotalSizeAndPageSize: function(totalSize, pageSize) { //设置总页数，设置每页条数，一般用于重新查询，重新设置每页条数
      this.totalSize = totalSize == -1 ? this.totalSize : totalSize;
      this.pageSize = pageSize == -1 ? this.pageSize : pageSize;
      this.setPageCount();
    },
    setPageCount: function() { //设置总页数，设置每页条数，一般用于重新查询，重新设置每页条数

      if (this.totalSize % this.pageSize > 0) {
        this.pageCount = Math.floor(this.totalSize / this.pageSize) + 1;
      } else {
        this.pageCount = this.totalSize / this.pageSize;
      }
      this.render();
    },
    render: function() {
      var containerHtml = [];
      var preId = generateRandomUuid();
      var selId = generateRandomUuid();
      var nextId = generateRandomUuid();
      containerHtml.push('<div class="pagePre public" id="' + preId + '">上一页</div>');
      containerHtml.push('<select id="' + selId + '" class="pag-select">');

      for (var i = 1; i < this.pageCount + 1; i++) {
        containerHtml.push('<option value ="' + i + '">' + i + '</option>');
      }
      containerHtml.push('</select>');


      containerHtml.push('/ &nbsp;' + this.pageCount);
      containerHtml.push('<div class="pageNext public" id="' + nextId + '">下一页</div>');

      this.container.html(containerHtml.join(''));

      this.btnPre = query('#' + preId);
      this.btnNext = query("#" + nextId);
      this.pageSelector = query("#" + selId);
      this.pageSelector[0].selectedIndex = this.page;

      this.bindControlEvent();
    },
    bindControlEvent: function() {
      if (this.page > 0) {
        this.btnPre.on("click", lang.hitch(this, this.toPrePage));
      }
      if (this.page < this.pageCount - 1) {
        this.btnNext.on("click", lang.hitch(this, this.toNextPage));
      }
      this.pageSelector.on('change', lang.hitch(this, function() {
        this.toPage(this.pageSelector[0].selectedIndex);
      }));
    },
    run: function() {
      this.emit(this.eventTypes.pagechange, 0);
      this.render();
    },
    toNextPage: function() {
      this.toPage(this.page + 1);
    },
    toPrePage: function() {
      this.toPage(this.page - 1);
    },
    toPage: function(page) {
      this.page = page;
      this.emit(this.eventTypes.pagechange, page);
      this.render();
    }
  });
});
