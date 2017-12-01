
/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright 2015 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});


/*
 * [promptMSG description]
 * @author 	wenlongZhao
 * @date     	2016-07-23
 * @describe 	[滚动条]
 */

$.extend({ 
	  onScroll:function(){
	  	this.parentBox = arguments[0]; //父类容器dom
	  	this.chlidBox = arguments[1]; //子容器dom
	  	this.speed = 20; //鼠标滚动速度
	  	
	  	this.isScroll = function(){
	  		this.p_heigth = $(this.parentBox).height();
	  		this.c_heigth = $(this.chlidBox).height();
	  		var padding_top = parseInt($(this.parentBox).css('padding-top'));
	  		var padding_bottom =  parseInt($(this.parentBox).css('padding-bottom'));
	  		this.p_heigth += padding_top + padding_bottom; 
	  		if(this.p_heigth < this.c_heigth){
	  			this.createSrcoll();
	  		} 
	  	}

	  	this.createSrcoll = function(){
	  		var srcollBox = "<div class='scrollBox'><span class='scrollSlide'></span></div>";
	  		$(this.parentBox).append(srcollBox);

	  		var width =  $(this.parentBox).width()-$('.scrollBox').width()-1;
	  		$(this.chlidBox).width(width);

	  		this.silde_heigth =  parseInt(this.p_heigth/this.c_heigth*this.p_heigth);
	  		$(".scrollSlide").height(this.silde_heigth);

	  		$(".scrollSlide").attr("onselectstart","return false").css({
				"user-select": "none" //jq添加css3属性时，不用额外添加浏览器前缀标识，jq会根据不同浏览器自动添加后缀，应用规则！
			})

	  		this.boxMove();	
	  		this.mousewheel();	
	  	}

	  	this.boxMove = function(){
			var self = this;
			this.bbb = $(".scrollSlide").on('mousedown', function(e){
				self.move = true; 
				_y = e.pageY - parseInt($(".scrollSlide").css("top")); 
				e.stopPropagation();
			}).on('mouseout',function(e){
				self.move = false; 
			}).on('mouseover',function(e){
				self.move = false;
			}); 

			$(document).on('mousemove',function(e){ 
				if(self.move){ 
					var y=e.pageY-_y; 
					self.sildeMove(y);
				} 
			}).on('mouseup',function(e){ 
				self.move = false; 
			});

			$('.scrollBox').on('mousedown', function(e){
				e.preventDefault()
					var _y = $('.scrollBox').offset().top;
					var y =e.pageY;
					var	is_y = y - _y  - self.silde_heigth;
						y = is_y < 0 ? y-_y : is_y; 
					self.sildeMove(y);
			});
		}

		this.mousewheel = function(){
			var self = this;
			this.scroll_heigth = 0;
			$(this.parentBox).on('mousewheel',function(e){
				if(e.deltaY < 0){
					self.scroll_heigth += self.speed;
				}else{
					self.scroll_heigth -= self.speed;
				}
				self.sildeMove(self.scroll_heigth);
				//e.stopPropagation();
			});
		}

		this.sildeMove = function(y){
			this.scroll_heigth = y;
			if(y<0){
				y = 0;
				this.scroll_heigth = 0;
			}
			if((y+this.silde_heigth)>this.p_heigth){
				y = this.p_heigth - this.silde_heigth;
				this.scroll_heigth = this.p_heigth - this.silde_heigth;
			}
			var box_y = (this.c_heigth/this.p_heigth*y).toFixed(2);
			$(this.chlidBox).css({"margin-top":-box_y+"px"});
			$(".scrollSlide").css({"top":y}); 
		}

	  	this.isScroll();
	  }
});
 
		