/**
 * [promptMSG description]
 * @author 	wenlongZhao
 * @date     	2016-07-23
 * @describe 	[提示窗]
 */
$.extend({ 
	msgAlert:function(){
	    $.isAlert = true;
	    $.msgConfirm.apply(null,arguments);
	   	
	},
	msgConfirm:function(){
		this.msgTitle = arguments[0];
        this.msgCon = arguments[1];
        this.func = typeof arguments[2] == 'function' ?  arguments[2] : null;
        this.continerHTML = "<div id='msgContiner' class='msgContiner'>"+
    						"<div id='msgBox' class='msgBox'>"+
    						"<h1 class='msgTitle'>" + this.msgTitle + "</h1>" +
							"<span class='msgBoxClose' id='msgBoxClose'>×</span>"+
							"<div class='msgBoxContent'>" + this.msgCon + "</div>"+
							"<div class='msgButton'>"+
       					   	"<input type='button' value='确定' class='btn btnTure' id='btnTure' />"+
       					   	"<input type='button' value='取消' class='btn btnFalse' id='btnFalse' />"+
	       					"</div></div></div>";

	    $('body').append(this.continerHTML);
	    if($.isAlert == true) $('#btnFalse').remove();
	    $.isAlert = false;

	    

		this.boxPosition = function(){
			var sumHeight = $("#msgContiner").height();
			var sumWight = $("#msgContiner").width();
			var width = $('#msgBox').width();
			var height = $('#msgBox').height();
			$('#msgBox').css({'margin-top':(sumHeight/2)-(height/2)+'px','margin-left':(sumWight/2)-(width/2)+'px'});
		}
		this.boxMove = function(){
			var move;
			$("#msgBox").mousedown(function(e){ 
				move=true; 
				_x=e.pageX-parseInt($("#msgBox").css("left")); 
				_y=e.pageY-parseInt($("#msgBox").css("top")); 
			}); 
			$(document).mousemove(function(e){ 
				if(move){ 
					var x=e.pageX-_x;//控件左上角到屏幕左上角的相对位置 
					var y=e.pageY-_y; 
					$(".msgBox").css({"top":y,"left":x}); 
				} 
			}).mouseup(function(){ 
				this.moveBox = null;
				move=false; 
			}); 
		}

		var self = this;
		self.boxPosition();
		self.boxMove();

		$('body').on('click','#msgBoxClose',function(){
			self.close(false);
		});

		$('body').on('click','#btnTure',function(){
			self.close(true);
		});

		$('body').on('click','#btnFalse',function(){
			self.close(false);
		});

		this.close = function(s){
			$('#msgContiner').remove();
			if(self.func){
				self.func.call(null,s);
				self.func = null;
			}	
		}
	}
	  
});
 
		