
/**
 * [format description]
 * @author 	wenlongZhao
 * @date     	2016-08-05
 * @describe 	[时间处理]
 */
Date.prototype.format = function (patten) {
    if (!patten) return this.toString();
    var list = { "y+": this.getFullYear(), "M+": repair(this.getMonth() + 1), "d+": repair(this.getDate()), "[Hh]+": repair(this.getHours()), "m+": repair(this.getMinutes()), "s+": repair(this.getSeconds()), "S+": repair(this.getMilliseconds()) };
    for (var p in list) {
        var reg = new RegExp("(" + p + ")");
        if (reg.test(patten)) {
            patten = patten.replace(RegExp.$1,  list[p]);
        }
    }
    return patten;
}

Date.prototype.beforeSeconds = function(seconds){
	var second = this.getTime() - 1000*seconds;
	this.freshDate(second);
}

Date.prototype.beforeSeconds = function(seconds){
	var second = this.getTime() + 1000*seconds;
	this.freshDate(second);
}

Date.prototype.beforeDays = function(days){
	var second = this.getTime() - 1000*60*60*24*days;
	this.freshDate(second);

}

Date.prototype.afterDays = function(days){
	var second = this.getTime() + 1000*60*60*24*days;
	this.freshDate(second);

}

Date.prototype.beforeMinutes = function(minutes){
	var second =  this.getTime() - (1000*60)*minutes;
	this.freshDate(second);
}

Date.prototype.afterMinutes = function(minutes){
	var second =  this.getTime() + (1000*60)*minutes;
	this.freshDate(second);
}

Date.prototype.beforeHours = function(minutes){
	var second =  this.getTime() - (1000*60*60)*minutes;
	this.freshDate(second);
}

Date.prototype.afterHours = function(minutes){
	var second =  this.getTime() + (1000*60*60)*minutes;
	this.freshDate(second);
}

Date.prototype.beforeMonths = function(months){
	this.monthHander(months).beforeHander();
	var second = this.getTime();
	this.freshDate(second);
}

Date.prototype.afterMonths = function(months){
	this.monthHander(months).afterHander();
	var second = this.getTime();
	this.freshDate(second);
}

Date.prototype.beforeYears = function(years){
	this.yearHander(years).beforeHander();
	var second = this.getTime();
	this.freshDate(second);
}

Date.prototype.afterYears = function(years){
	this.yearHander(years).afterHander();
	var second = this.getTime();
	this.freshDate(second);
}

Date.prototype.freshDate = function(s){
	this.setTime(s);
	return this;
} 

Date.prototype.monthHander = function(months){
	var yy,mm,dd;
	var self = this;
	yy = self.getFullYear();
	mm = self.getMonth()+1;
	dd = self.getDate();
	var year = Math.floor(months/12);
	var month = months%12;

	return {
		beforeHander: function(){
			yy = yy - year;
			var number = mm - month;
			if(month != 0){
				if(number<=0){
					yy -= 1;
					mm = 12+number;
				}else{
					mm -= number;
				}
			}
			//特殊日期处理
			if(yy%4 >0 && mm == 2 && dd == 29 ){
				dd = 28;
			}
			if((mm ==4 || mm == 6 || mm ==  mm ==9 || mm == 11) && dd == 31){
				dd = 30;
			}
			//重新设置日期
			self.setFullYear(yy);
			self.setMonth(mm-1);
			self.setDate(dd);
		},
		afterHander: function(){
			yy = yy + year;
			var number = 12 - mm - month;
			if(month != 0){
				if(number <=0 ){
					yy += 1;
					mm = Math.abs(number);
				}else{
					mm += month;
				}
			}
			//特殊日期处理
			if(yy%4 >0 && mm == 2 && dd == 29 ){
				dd = 28;
			}
			if((mm ==4 || mm == 6 || mm ==  mm ==9 || mm == 11) && dd == 31){
				dd = 30;
			}
			//重新设置日期
			self.setFullYear(yy);
			self.setMonth(mm-1);
			self.setDate(dd);
		}
	}		
}

Date.prototype.yearHander = function(years){
	var yy,mm,dd;
	var self = this;
	yy = self.getFullYear();
	mm = self.getMonth()+1;
	dd = self.getDate();

	return{
		beforeHander: function(){
			yy -= years;
			if(yy%4 > 0 && mm == 2 && dd == 29 ){
				dd = 28;
			}
				
			self.setFullYear(yy);
			self.setMonth(mm-1);
			self.setDate(dd);
		},
		afterHander:function(){
			yy += years;
			if(yy%4 > 0 && mm == 2 && dd == 29 ){
				dd = 28;
			}
			self.setFullYear(yy);
			self.setMonth(mm-1);
			self.setDate(dd);
		}
	}
}

function repair(number){
	return  number < 10 ? number = '0'+number : number = number; 
}