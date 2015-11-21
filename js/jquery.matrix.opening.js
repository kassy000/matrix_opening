// JavaScript Document


;(function($) {
	$.fn.matrixOp = function( params ){
		
		var defaluts = {
			fontColor : '#0F0'
			,speed : 33
			,titleText : 'THE MATRIX'
			,titileWidth : 0.5
			,audio : false
			
		};
		
		
		//Extend paramators
		params = $.extend( defaluts, params );
		
		
		
		/* Elements
		----------------------------------------------------------------*/
		var element = this;
		//Create Element
		element.append('<div id="matrix-inner"></div>');
		
		
		
		//Form
		element.append('<div id="matrix-input"><form name="matrix"><input type="text" name="matrix-text" id="matrix-text" value="THE MATRIX" maxlength="20"><input type="button" id="matrix-run" value="Run!" /></form><p>Please type a title text and push run button.</p></div>');
		
		//Canvas
		$('#matrix-inner').append('<canvas id="matrix-bg"></canvas>').append('<div id="matrix-title"></div>');
		
		if(params.audio) element.append('<div id="matrix-audio"><audio id="audio" src="mp3/matrix_op.mp3" controls></audio></div>');
		
		
		/* Params
		----------------------------------------------------------------*/

		//Common
		var inner = $('#matrix-inner');
		var fontBlur = 20;
		var font = '"ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "メイリオ", Meiryo, Osaka, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif';
		var stageScale = 5;
		var stageScaleSpeed = 11000;
		var stageEaging = 'easeInExpo';
		
		//Background
		var bg = document.getElementById('matrix-bg');
		var bgDrawField = document.createElement("canvas");
		var bgFontSize = 12;
		var bgFontPadding = 4;
		
		
		var thickness = 3;
		var fadeSpeed = 0.05;
		var StartRandom = 1500;
		var width;
		var height;
		var culumn;
		var letters;

		//Title
		var title = $('#matrix-title');
		var titleWidth;
		var titleFontSize;
		var titleFontSpan;
		var drawTitleSpan = 950;
		var drawTitleDelay = 6200;
		var titleShowTime = 2500;
		var drawTitleTimer;
		var titleTextArr;
		var titleTextArrNum;
		var drawTitleInterval;
		var drawBgInterval;
		var drawBgAllow;
		var drawTitleNum;
		var titleGoal;
		var drawSpan;
		var titleLetters;
		var titleSuffle;
		
		var titleFontSizeList = [9,10,11,12,14,16,18,24,36];
		
		//Audio
		var audio
		if(params.audio) audio = document.getElementById("audio");
		
		
		 
		
		
		
		/* Init
		----------------------------------------------------------------*/
		var init = function(){
			
			inner.css({
				paddingRight : 1,
				transformOrigin : '50% 50%',
				position:'absolute',
				width:'100%',
				height : '100%',
				//overflow:'hidden'
			});
			
			//Background
			$(bg).css('position', 'absolute');
			bg.getContext('2d').fillStyle='#000';
			bg.getContext('2d').fillRect(0,0,width,height);
			
			bgDrawField.getContext('2d').fillStyle = params.fontColor;
			bgDrawField.getContext('2d').fillStyle= '#FFF';
			bgDrawField.getContext('2d').font  = bgFontSize * 2 + 'px ' + font;
			
			
			
			
			
			//Title
			$('#matrix-title').css('position', 'absolute');
			
			//Form
			$('#matrix-input').css({
				position : 'absolute'
				,top:0
				,left:0
				,zIndex : 1000
			});
			
			$('#matrix-input p').css('color' , '#FFF');
			
			$('#matrix-audio').css({
				position : 'absolute'
				,right:0
				,bottom : 0	
			})
		};
		
		init();
		
		
		
		/* Reset
		----------------------------------------------------------------*/
		var reset = function(){
			params.titleText = $('#matrix-text').val();
			
			inner.stop(true).animate({
				transform:'scale(1)'
				,paddingRight : 1
			},1);
			
			drawBgAllow = true;
			drawTitleNum = true;
			
			letters = Array(culumn).join(1).split('');
			letters.map(function(y_pos, index){
				letters[index] = -StartRandom * Math.random();
			});
			
			
			title.empty();
			
			titleLetters = new Array();
			titleSuffle = new Array();
			titleTextArr = params.titleText.split('');
			titleTextArrNum =  titleTextArr.length;
			
			drawSpan = drawTitleSpan / titleTextArr.length;
			var i = 0;
			while(i < titleTextArr.length){
				titleSuffle.push(i);
				i++;
			}
			
			
			var n = titleSuffle.length, t, i;
			while (n) {
			  i = Math.floor(Math.random() * n--);
			  t = titleSuffle[n];
			  titleSuffle[n] =titleSuffle[i];
			  titleSuffle[i] = t;
			}
			
			clearInterval(drawBgInterval);
			clearTimeout(drawTitleTimer);
			clearInterval(drawTitleInterval);
			
			if(params.audio){
				audio.pause();
				audio.currentTime = 0;	
			}

		};
		
		
		/* Run
		----------------------------------------------------------------*/
		
		var run = function(){
			reset();
			resize();
			element.exResize(function(){
				resize();
			});
			
			scale();
		
			drawBgInterval = setInterval(drawBg, params.speed);
			drawTitleTimer = setTimeout(function(){drawTitleStart()}, drawTitleDelay);
			if(params.audio) audio.play();
			
			$('#matrix-input').fadeTo(500,0.0);
			
		};
		
		/* End
		----------------------------------------------------------------*/
		
		var end = function(){
			reset();
			resize();
			$('#matrix-input').fadeTo(500,1.0);
			
		}
		
		/* Form
		----------------------------------------------------------------*/
		$('#matrix-text').attr("defaultValue", $('#matrix-text').val());
		$('#matrix-text').focus(function(){
			if($(this).val() == $(this).attr("defaultValue")){
				$(this).val('');
			}
		});
		
		$('#matrix-run').click(function(){
			run();
		});
		
		
		
		/* Resize
		----------------------------------------------------------------*/
		var resize = function(){
			
			//Common
			width = element.width();
			height = element.height();
			
			
			//BG
			bg.width = $(window).width();
			bg.height = $(window).height();
			bg.getContext('2d').fillStyle='#000';
			bg.getContext('2d').fillRect(0,0,width,height);
			
			bgDrawField.width = element.width();
			bgDrawField.height = element.height();
			
			culumn = Math.floor(width / (bgFontSize + bgFontPadding));
			
			var newLetters = Array(culumn).join(1).split('');
			newLetters.map(function(y_pos, index){
				newLetters[index] = -StartRandom * Math.random();
			});
			
			//配列の上書き
			letters = $.extend( newLetters, letters );
			//Title
			$('#matrix-title').width(width).height(height);
			titleWidth = $('#matrix-title').width() * params.titileWidth;

			titleFontSize = getClosestNum(Math.floor(titleWidth / titleTextArrNum / 2) , titleFontSizeList);
	
			titleFontSpan = titleFontSize / 4; 
			
			titleGoal = $('#matrix-title').height() / 2 - titleFontSize;

		};

		/* Scale
		----------------------------------------------------------------*/
		var scale = function(){
			//Scaling
			inner.animate({paddingRight:stageScale},{
				//1秒かけてアニメーション
				duration:stageScaleSpeed,
				//stepは、アニメーションが進むたびに呼ばれる
				easing : stageEaging,
				step:function(now){
					//nowに現在のpadding-rightの値が渡してもらえる
					//0から1に向かって変化していくnowを利用してscaleさせてみる
					$(this).css({transform:'scale(' + now  + ')'});
				}
			});
		}
		
		/* BG
		----------------------------------------------------------------*/
		var drawBg = function () {
			
			bgDrawField.getContext('2d').clearRect(0, 0, bgDrawField.width, bgDrawField.height);
			bg.getContext('2d').fillStyle='rgba(0,0,0,'+ fadeSpeed +')';
			
		  	bg.getContext('2d').fillRect(0,0,width,height);
			
			bgDrawField.getContext('2d').fillStyle= params.fontColor;
			bgDrawField.getContext('2d').font  = bgFontSize + 'px ' + font;
			
			letters.map(function(y_pos, index){
				if(letters[index] != null){
					var type = generateType();
					var x_pos = (bgFontSize + bgFontPadding) * index;
					
					bgDrawField.getContext('2d').fillText(type, x_pos, y_pos);
					if(drawBgAllow){
						letters[index] = (y_pos > $(window).height()) ? -(bgFontSize + bgFontPadding) : y_pos + bgFontSize;
					}else{
						if(y_pos > $(window).height()){
							letters[index] = null;
						}else{
							letters[index] = (y_pos > $(window).height()) ? -(bgFontSize + bgFontPadding) : y_pos + bgFontSize;
						}	
						
					}
				}
			});
			
			//Title
			bgDrawField.getContext('2d').font  = titleFontSize + 'px ' + font;

			
			titleLetters.map(function(y_pos, index){
				if(titleLetters[index] != null){
					var type = generateType();
					var x_pos = title.width() / 2 + (titleFontSize + titleFontSpan) * (titleSuffle[index] - titleTextArr.length / 2);
					bgDrawField.getContext('2d').font  = titleFontSize + 'px ' + font;
					bgDrawField.getContext('2d').fillText(type, x_pos, y_pos);
					
					
					if(y_pos < titleGoal){
						titleLetters[index] = y_pos + titleFontSize;
					}else{
						drawTitleLetter(titleSuffle[index]);
						titleLetters[index] = null;
					}
				}
			});
			
		  	bgDrawField.getContext('2d').shadowBlur = fontBlur;
		  	bgDrawField.getContext('2d').shadowColor = params.fontColor;
		  
			for(i=0; i < thickness; i++){
				bg.getContext('2d').drawImage(bgDrawField, 0, 0, bg.width,bg.height);
			}
		};
		
		


		
		
		/* Title
		----------------------------------------------------------------*/
		
		var drawTitleStart = function () {
			drawBgAllow = false;
			drawTitle();
			drawTitleInterval = setInterval(drawTitle, drawSpan);
		};
		
		var drawTitle = function () {
			titleLetters.push(1);
			if(titleTextArr.length == drawTitleNum){
				titleLetters.join(1);
				clearInterval(drawTitleInterval);
			}else {
				drawTitleNum++;	
			}
			
		};
		
		
		var drawTitleLetter = function (num){
			var titleType = titleTextArr[num];
			var newType = $('<span>');
			newType.text(titleType);
			var positionTop =  title.height() / 2 - titleFontSize;
			var positionLeft = title.width() / 2 + (titleFontSize + titleFontSpan) * (num - titleTextArr.length / 2);
			title.append(newType);
			
			newType.css({
				fontSize : titleFontSize + 'px',
				color : '#FFF',
				position : 'absolute',
				top : positionTop + 'px',
				left : positionLeft + 'px',
				display : 'block',
				width : titleFontSize + 'px',
				textAlign : 'center',
				textShadow : '0px 0px 10px ' + params.fontColor + ',0px 0px 10px ' + params.fontColor,
				transformOrigin:'50% 50%',
			});
			
			setTimeout(function(index){
				newType.animate({zIndex:1},{
					//1秒かけてアニメーション
					duration:300,
					//stepは、アニメーションが進むたびに呼ばれる
					step:function(now){
						var blur =  now * 2;
						var scale =  now + 1;
						var opacity =  1 - now;
						//nowに現在のpadding-rightの値が渡してもらえる
						//0から1に向かって変化していくnowを利用してscaleさせてみる
						$(this).css({
							'-webkit-filter': 'blur(' + blur + 'px)',
							'-moz-filter': 'blur(' + blur + 'px)',
							'-ms-filter': 'blur(' + blur + 'px)',
							'-o-filter': 'blur(' + blur + 'px)',
							filter: 'blur(' + blur + 'px)',
							transform : 'scaleX('+ scale +')',
							opacity : opacity,
						});
					},
					complete:function(){
						$(this).css('padding-left', 0);
						$(this).hide();
						if(index == titleTextArr.length - 1) setTimeout(function(){end()}, 2000);
					}
				});
			}, titleShowTime, num);			
		};
		
		/* Type
		----------------------------------------------------------------*/
		var  generateType = function(){
			var typeNum_1 = Math.floor(Math.random()*6) + 10;
			var typeNum_2 = Math.floor(Math.random() * 15);
			var code = '0x30' + typeNum_1.toString(16) + typeNum_2.toString(16);
			var type = String.fromCharCode(code);
			return type;
		};

		resize();

		
		function getClosestNum(num, ar){
		   //近似値を保持しておく変数
		   var closest;
		   //配列かどうか、要素があるか判定
		   if(Object.prototype.toString.call(ar) ==='[object Array]' && ar.length>0){
			 //まず配列の最初の要素を近似値として保持する
			 closest = ar[0];
			 //配列の要素を順次比較していく
			 for(var i=0;i<ar.length;i++){ 
				//この時点での近似値と、指定値の差異を絶対値で保持しておく
				var closestDiff = Math.abs(num - closest);
				//読み込んだ値と比較し、差異を絶対値で保持しておく
				var currentDiff = Math.abs(num - ar[i]);
				//新しく比較した値のほうが近かったら、近似値として保持しておく
				if(currentDiff < closestDiff){
					closest = ar[i];
				}
			  }
			 //ループが終わったら、近似値を返す
			  return closest;
			}
		 //配列じゃなかったらfalse
		 return false;
		}

	};

})(jQuery);



/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {

		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
 
 
 
(function($){
	var API = function(api){
		var api = $(api),api0 = api[0];
		for(var name in api0)
			(function(name){
				if($.isFunction( api0[name] ))
					api[ name ] = (/^get[^a-z]/.test(name)) ?
						function(){
							return api0[name].apply(api0,arguments);
						} : 
						function(){
							var arg = arguments;
							api.each(function(idx){
								var apix = api[idx];
								apix[name].apply(apix,arg);
							})
							return api;
						}
			})(name);
		return api;
	}

	$.ex = $.ex || {};
	$.ex.resize = function(idx , targets , option){
		if ($.isFunction(option)) {
			option = {callback : option};
		}
		var o = this,
		c = o.config = $.extend({} , $.ex.resize.defaults , option);
		c.targets = targets;
		c.target = c.watchTarget = c.targets.eq(idx);
		c.index = idx;

		//c.oldBrowser = $.browser.msie && ($.browser.version < 8.0 || !$.boxModel);
		c.oldBrowser = typeof window.addEventListener == "undefined" && typeof document.querySelectorAll == "undefined";

		c.key = { height : '', width : ''};
		if (c.contentsWatch) {
			o._createContentsWrapper();
		}
		c.currentSize = c.newSize = o.getSize();
		if (c.resizeWatch) o._resizeWatch();
	}
	$.extend($.ex.resize.prototype, {
		_createContentsWrapper : function(){
			var o = this, c = o.config;
			var style = c.oldBrowser ? 'zoom:1;display:inline' : 'display:inline-block';
			c.watchTarget = c.target.wrapInner('<div style="' + style + ';width:' + c.target.css('width') + '"/>').children();
			return o;
		},
		_resizeWatch : function(){
			var o = this, c = o.config;
			setTimeout(function(){
				if (c.contentsWatch) {
					if (c.watchTarget.prev().size() > 0 || c.watchTarget.next().size() > 0 || c.watchTarget.parent().get(0) != c.target.get(0)) {
						c.watchTarget.replaceWith(c.watchTarget.get(0).childNodes);
						o._createContentsWrapper();
					}
				}
				if (o._isResize()) {
					c.currentSize = c.newSize;
					c.callback.call(c.watchTarget.get(0),o);
				}
				o._resizeWatch();
			},c.resizeWatch);
		},
		_isResize : function () {
			var o = this, c = o.config;
			var ret = false;
			c.newSize = o.getSize();
			for (var i in c.key) {
				ret = ret || (c.newSize[i] != c.currentSize[i]);
			}
			return ret;
		},
		getTargets : function(){
			return this.config.targets;
		},
		getTarget : function(){
			return this.config.target;
		},
		getSize : function () {
			var o = this, c = o.config;
			if (c.contentsWatch) c.watchTarget.css('width','auto');
			var ret = {};
			for (var i in c.key) {
				ret[i] = c.watchTarget[i]();
			}
			if (c.contentsWatch) c.watchTarget.css('width',c.target.css('width'));
			return ret;
		}
	});
	$.ex.resize.defaults = {
		contentsWatch : false,
		resizeWatch : 100,
		callback : function(){}
	}
	$.fn.exResize = function(option){
		var targets = this,api = [];
		targets.each(function(idx) {
			var target = targets.eq(idx);
			var obj = target.data('ex-resize') || new $.ex.resize( idx , targets , option);
			api.push(obj);
			target.data('ex-resize',obj);
		});
		return option && option.api ? API(api) : targets;
	}
})(jQuery);
