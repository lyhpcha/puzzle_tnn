document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
function onDeviceReady() {
    //結束程式，需要掛cordova.js
    $("#btn_exit").on("tap",function(){
        if (navigator.app) {
            navigator.app.exitApp();
        }
        else if (navigator.device) {
            navigator.device.exitApp();
        }
    });
//} //End onDeviceReady


$( document ).ready(function () {

    //-----拼圖初始設定值-----
	var g_divcolnum = 3;  //「欄」數量
	var g_divrownum = 3;  //「行」數量
	var g_divallnum = g_divcolnum * g_divrownum ; //Div的總數量，「欄」x「行」
    var g_emptybox = '#box' + g_divallnum ;	//空格div，最後一格
	var g_windowWidth = $('#game1').width() ;
	var g_windowHeight = $('#game1').height() ;
	var g_boxsize;
	var g_arraybox = [] ;
	var g_arrayrecord = [] ; //記錄目前拼圖的狀態
	var g_temptime = 0 ;
	var g_temptapnum = 0 ;
	var g_imgurl = 'images/a03.jpg';
	var g_size;
	var g_timer;
	var g_timer2;
	var g_gamestart = false;
	var g_arrayimg = [ 'images/a01.jpg','images/a02.jpg','images/a03.jpg' ] ; //圖片陣列
	//--------------------
	
	
	$(document).on('tap','#btn_3x3',function() { 
	    g_divcolnum = 3;  //「欄」數量
	    g_divrownum = 3;  //「行」數量
		g_divallnum = g_divcolnum * g_divrownum ;
		g_emptybox = '#box' + g_divallnum ;
		$("#puzzle_size").text("已選擇 3x3");
	});
	
	
	$(document).on('tap','#btn_4x4',function() { 
	    g_divcolnum = 4;  //「欄」數量
	    g_divrownum = 4;  //「行」數量
		g_divallnum = g_divcolnum * g_divrownum ;
		g_emptybox = '#box' + g_divallnum 
		$("#puzzle_size").text("已選擇 4x4");
	});
	
	
	$(document).on('tap','#btn_5x4',function() { 
	    g_divcolnum = 5;  //「欄」數量
	    g_divrownum = 4;  //「行」數量
		g_divallnum = g_divcolnum * g_divrownum ;
		g_emptybox = '#box' + g_divallnum 
		$("#puzzle_size").text("已選擇 5x4");
	});
	
	
	$(document).on('tap','#btn_5x5',function() { 
	    g_divcolnum = 5;  //「欄」數量
	    g_divrownum = 5;  //「行」數量
		g_divallnum = g_divcolnum * g_divrownum ;
		g_emptybox = '#box' + g_divallnum 
		$("#puzzle_size").text("已選擇 5x5");
	});
	
	
	$(document).on('tap','#btn_a01',function() { 
	    g_imgurl = g_arrayimg[0];
		$("#puzzle_img").text("已選擇 a1");
	});
	
	
	$(document).on('tap','#btn_a02',function() { 
	    g_imgurl = g_arrayimg[1];
		$("#puzzle_img").text("已選擇 a2");
	});
	
	
	$(document).on('tap','#btn_a03',function() { 
	    g_imgurl = g_arrayimg[2];
		$("#puzzle_img").text("已選擇 a3");
	});
	
		
	//回主選單
	$(document).on("tap","#btn_back1",function() {
	    _config();
		g_gamestart=false;
		_setrecord();  //記錄目前拼圖的狀態
	});	
	
		
	//按下「載入記錄」
	$(document).on('tap','#btn_record',function(){
	    _timer2();
	});
	
	
	//HOME頁上按下「遊戲」
	$(document).on('tap','#btn_game1',function() {
	    g_gamestart=false;
	    _puzzle();
		_config();
		//調整下方鈕按文字大小
		var btn_fontsize = (g_windowHeight - ( g_size * 3 + 150 )) / 140
		$("#btn_play").css("font-size",btn_fontsize + "em");
		$("#btn_restart").css("font-size",btn_fontsize +"em");
		$("#btn_back1").css("font-size",btn_fontsize + "em");
		$("#btn_marker").css("font-size",btn_fontsize + "em");
	});	
	
	
	//點選事件，有用到this，所以不能用function()，概念不一樣
    $(document).on('tap','.box',_play);
	
	
	//提示
	$(document).on('tap','#btn_marker',function() {
	    _marker();
	});
	

	//開始遊戲
	$(document).on('tap','#btn_play',function(){
	    g_gamestart=true;
	    _start();
		_setrecord();  //記錄目前拼圖的狀態
	});
	

	//重新開始 
	$(document).on('tap','#btn_restart',function(){	
	    _puzzle();
		_config();
		_delmarker();
		g_gamestart=false;
		_setrecord();  //記錄目前拼圖的狀態
	});
		
	
	//檢查是否已經切換到game1 Page完成。每0.5秒檢查一次
    function _timer2() {
	    g_timer2 = setTimeout(function() {
	                   var activePage = $("body").pagecontainer( "getActivePage" ).attr( 'id' );
		               if ( activePage == 'game1' ) {
		                   clearTimeout(g_timer2);
		                   _getrecord();
			            } else {
				            clearTimeout(g_timer2);
				            //呼叫自己，會不斷循環
				            _timer2();
			            }
		           },500);
		return g_timer2;
	}
	
	
	//產生原始拼圖函數
	function _puzzle() {
		//實際產生Div，圖片型別
		for (i=1; i < g_divallnum + 1 ; i++) {
			var a = a + '<div id="box' + i + '" class="box" data-box="' + i + '" data-check="' + i + '"></div>';
		}
		$('#box_area').html(a);
		
		//設定 box 的位置，限制最大只能是2048px以內
		var check_rowcol;
		if ( g_divcolnum < g_divrownum) {
		    check_rowcol = g_divrownum ;
		} else {
		    check_rowcol = g_divcolnum ;
		}
		if (g_windowWidth < g_windowHeight) {
			if (g_windowWidth >= 2048) {
				g_size =  Math.round((2048 - 50) / check_rowcol);
			} else {
				g_size =  Math.round((g_windowWidth - 50) / check_rowcol);
			}
			_boximg(g_size,g_imgurl); //設定box的位置及大小
		} else {
			if (g_windowHeight >= 2048) {
				g_size =  Math.round((2048 - 50-150) / check_rowcol); //多減100是因為有時間及步數
			} else {
				g_size =  Math.round((g_windowHeight - 50-150) / check_rowcol);
			}
			_boximg(g_size,g_imgurl); //設定box的位置及大小
		} 	
		
		//設定拼圖外框的div大小
		$('.box_area').css("width",(g_size * g_divcolnum ) + "px");
		$('.box_area').css("height",(g_size * g_divrownum) + "px");
		$('.box_area').css("margin-left", ((g_windowWidth -30 -(g_size * g_divcolnum))/2) + "px");
		//設定計時與步數的div大小
		$('#taptime').css("width",(g_size * g_divcolnum ) + "px");
		$('#taptime').css("margin-left", ((g_windowWidth -30 -(g_size * g_divcolnum))/2) + "px");
		$('#tap_num').css("font-size",(g_size /80) + "em");
		$('#play_time').css("font-size",(g_size/80 ) + "em");
	} //End _puzzle()    
	
	
	//初始值函數
	function _config() {
		clearTimeout(g_timer); //停止計時
		$('#play_time i').text('0');
		$('#tap_num i').text('0');
	    g_temptime = 0 ;
		g_temptapnum = 0 ;
		$('#btn_play').removeClass('ui-disabled'); //恢復「開始」鍵
	} //End _config
		
		
	//儲存拼圖狀態到Web Storage
    function _setrecord() {
	    var arrayrecord= [];
        for (i = 1; i <= g_divallnum; i++) {
		    var tt = '#box' + i ;
			arrayrecord[(i-1)] = $(tt).attr('data-check') ; //減1是因為陣列由0開始
		}
		localStorage.setItem('pu_record',JSON.stringify(arrayrecord));
		localStorage.setItem('pu_tapnum',g_temptapnum + 1);
		localStorage.setItem('pu_time',g_temptime + 1);
		localStorage.setItem('pu_img',g_imgurl);
		localStorage.setItem('pu_colnum',g_divcolnum);
		localStorage.setItem('pu_rownum',g_divrownum);
    } // End _setrecord	
	
	
	//讀取記錄並恢復拼圖狀態
	function _getrecord() {
	    var pu_record = JSON.parse(localStorage.getItem('pu_record')) ;
		
		//恢復時間、步數、圖片檔名、欄數、行數
		g_divrownum = localStorage.getItem('pu_rownum');
		g_divcolnum = localStorage.getItem('pu_colnum');
		g_divallnum = g_divcolnum * g_divrownum ;
		g_emptybox = '#box' + g_divallnum ;
		g_temptime = localStorage.getItem('pu_time');
		g_temptapnum = localStorage.getItem('pu_tapnum');
		g_imgurl = localStorage.getItem('pu_img');	
		
		//先預設完整拼圖再將記錄還原		
		_puzzle();		
		
		//判斷是否是已完成的拼圖
		var finish_check = 0;
		for (i = 1; i <= g_divallnum; i++) { 
		    if ( pu_record[i-1] == i ) {
			    finish_check = finish_check + 1;
			} else {
			    break;
			}
		}	
        
		//如果記錄的不是已完成的拼圖，則載入記錄
        if ( finish_check != g_divallnum ) {				
			for(var key in pu_record){ 
				var v_new = '#box' + (Number(key)+1)  ; //key-1是因為陣列索引從0開始
				var v_old = '#box' + pu_record[key] ;			
				var xold = $(v_old).offset().left ;
				var yold = $(v_old).offset().top ;
				var xnew = $(v_new).offset().left;
				var ynew = $(v_new).offset().top;
				
				$(v_new).animate({
					"left": (xold - $('#box_area').offset().left) +  "px",
					"top": (yold - $('#box_area').offset().top) + "px"
					}, 100);
				$(v_new).attr("data-check",	pu_record[key]);		
			}		
			
			//移除第九格div的圖形及重新套用css
			$(g_emptybox).removeClass('box')
						 .addClass('box_empty')
						 .css('background','');
			
			$(g_emptybox).removeClass('animated rotateIn'); //移除動畫
			
			$('#btn_play').addClass('ui-disabled'); //停止按鈕動作
			g_timer = _time(); //啟動計時器	
			g_gamestart = true;
		}
		
		//移除localStorage Item
		//localStorage.removeItem('pu_record');
	} //End _getrecord
		
					
	//提示
	function _marker() {
	    for (i = 1; i < g_divallnum; i++) {
		    var tt = '#box' + i ;
			$(tt).text($(tt).attr('data-box')) ; //減1是因為陣列由0開始
			//字型大小
			marker_fontsize = (g_size/70) ;
			$(tt).css({'font-size': marker_fontsize + 'em','color':'rgb(255,255,255)',
			           'text-shadow': '1px 1px 5px rgba(0,0,0,0.8),1px 1px 8px rgba(255,0,0,0.8)'});
		}
	}
	
	
	//取消提示
	function _delmarker() {
	    for (i = 1; i < g_divallnum; i++) {
		    var tt = '#box' + i ;
			$(tt).text('') ; //減1是因為陣列由0開始
			$(tt).removeClass("marker1");
		}
	}
		
				
	//box的大小及位置的函數（圖片）
	function _boximg(g_size,g_imgurl) {	
		//設定圖檔與尺寸
		$('.box').css('background','url(' + g_imgurl + ')')
		         .css('background-size',g_size * g_divcolnum + 'px ' + g_size * g_divrownum + 'px');
			
		//設定box的CSS大小
		$('.box').css("width",g_size + "px")
		         .css("height",g_size + "px");
		
		for ( i=1 ; i < g_divallnum+1 ; i++) {
		    var col_check = i % g_divcolnum; //判斷div是第幾個欄位，餘數1為第1欄；2為第2欄；0為第最後一欄
			if ( col_check == 0 ) {
			    col_check = g_divcolnum; //最後一欄
			}
			var row_check = Math.ceil(i/g_divcolnum); //判斷div是第幾個行列，商數1為第1行；2為第2行；依此類推
			
			//計算並設定各個div與圖片的位置
			var v_select = '#box' + i ;
			var v_top = ((row_check-1)* g_size) + "px" ;
			var v_left = ((col_check-1)* g_size) + "px" ;
			$(v_select).css("top",v_top)
		               .css("left",v_left)	
		               .css('background-position','-' + v_left + ' -' + v_top);				   
		}		
	} //End _boximg
	
		
	//交換空白div與點擊的div位置，也就是移動拼圖
	function _play() {
	    if (g_gamestart == true ) {
			var xa = $(this).offset().left; //被點擊div的x位置
			var ya = $(this).offset().top; //被點擊div的y位置
			var xb = $(g_emptybox).offset().left; //空白div的x位置
			var yb = $(g_emptybox).offset().top ; //空白div的y位置
			var d = Math.abs(xa-xb) + Math.abs(ya-yb) - g_size ; //判斷點擊的div是否與空白div並鄰
			var tt ;
			
			//等於0表示該div可以移動，非0表示div的週邊無空白div可供交換
			if ( d == 0 ) {
				var v_check0 = $(this).attr("data-check");
				var v_check1 = $(g_emptybox).attr("data-check");
				$(this).animate({
					"left": (xb - $('#box_area').offset().left) +  "px",
					"top": (yb - $('#box_area').offset().top) + "px"
					}, 100);
				$(this).attr("data-check",v_check1);
				$(g_emptybox).css({
					"left": (xa - $('#box_area').offset().left) + "px",
					"top": (ya - $('#box_area').offset().top) +  "px"
					});
				$(g_emptybox).attr("data-check",v_check0);
			}
			
			//增加步數
			g_temptapnum = Number($('#tap_num i').text());
			$('#tap_num i').text(g_temptapnum + 1) ;
			
			
			//判斷是否完成拼圖，以data-check與data-box是否一致判斷，全一致表示已完成
			for (i = 1; i < g_divallnum; i++) { 
				tt = '#box' + i ;
				if ( $(tt).attr('data-check') != $(tt).attr('data-box') ) {
					break; 
				}
				if (i == (g_divallnum -1 ) ) {
					_finish(); //執行完成拼圖的函數
				}
			}
        }			
	} //End _play
		
	
	//完成拼圖：停止拼圖移動、計時、步數，恢復第九格圖示，顯示成功畫面
	function _finish() {
	    //第九格動畫與恢復
		$(g_emptybox).removeClass('box_empty').addClass('box');
		$(g_emptybox).css('background','url(' + g_imgurl + ')')
		          .css('background-size',g_size * g_divcolnum + 'px ' + g_size * g_divrownum + 'px')
	              .css("top",(g_size * (g_divrownum -1)) + "px")
		          .css("left", (g_size * (g_divcolnum -1)) + "px")
		          .css('background-position', (-g_size) * (g_divcolnum -1) + 'px ' + (-g_size) * (g_divrownum -1) + 'px' );
				  
		$(g_emptybox).addClass('animated rotateIn'); //Animate.css動畫：https://github.com/daneden/animate.css		  
		$('#btn_play').removeClass('ui-disabled'); //恢復「開始」鍵
		clearTimeout(g_timer); //停止計時
		g_gamestart=false;
		_delmarker();
	} // End _finish
	
		
	//打亂拼圖
	function _start() {
	    _config();
		$('#btn_play').removeClass($.mobile.activeBtnClass);
		$('#btn_play').addClass('ui-disabled'); //停止按鈕動作
		g_timer = _time(); //啟動計時器
		
		//移除第九格div的圖形及重新套用css
		$(g_emptybox).removeClass('box')
		             .addClass('box_empty')
		             .css('background','');
		
	    $(g_emptybox).removeClass('animated rotateIn'); //移除動畫
		
		//亂數產生排列組合
		//直接以亂數產生陣列組合，很容易拼到最後會出現12345687，則永遠無法完成。
		//所以使用真實的移動來模擬過程，就不會出現12345687的情形。
		var maxNum = 4;
		var minNum = 1;
		var index9 = g_divallnum - 1;
		var i = 0 ;
		var dkey ,rkey ,rtmp1;
		var index9_check = true;
		var a_random = new Array() ;
		var a_randomkey = [-1,g_divcolnum,1,-g_divcolnum] ; //上下左右在陣列中的差值
		var j = 0 ;
		
		//預設原始陣列
		for ( j=0 ; j < g_divallnum ; j++ ) {
		    a_random[j]=j+1;
		}
		
		//模擬隨機走250步來打散陣列，所以可以恢復
		//判斷的方式是以空白div在陣列a_random中的位置，可以移動的方向為上下左右
        while ( i <= 150 ) {
		    index9_check = true;
		    rkey =  Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum; 			
			dkey = index9 + Number(a_randomkey[rkey-1]);
			//條件1，判斷是否是第1個或最後1個
			if ( dkey < 0 || dkey > (g_divallnum-1) ) {
			    index9_check = false;
			}
			//條件2，判斷是否為每列的第1個，第1個不能-1
			if ( index9 % g_divcolnum == 0 && Number(a_randomkey[rkey-1]) == -1) {
			    index9_check = false;
			}
			//條件3，判斷是為每列的最後一個，最後一個不能+1
			if ( dkey % g_divcolnum == 0 && Number(a_randomkey[rkey-1]) == 1) {
			    index9_check = false;
			}
			//通過三個條件者，才能進行交換
			if ( index9_check == true ) {
			    rtmp1 = a_random[index9] ;
				a_random[index9]= a_random[dkey];
				a_random[dkey] = rtmp1 ;		
                index9 = dkey;		
                i++;					
			}
		}

		//將最後一格（空白格）移回原位
		while ( index9 != (g_divallnum-1) ) {
		    dkey = index9 + g_divcolnum;
			if ( dkey > (g_divallnum-1) ) {
			    dkey = index9 + 1;
			}
			if ( dkey >=0 || dkey <= (g_divallnum-1) ) {
			    rtmp1 = a_random[index9] ;
				a_random[index9]= a_random[dkey];
				a_random[dkey] = rtmp1 ;		
                index9 = dkey;				
			}
        }	
		
		a_random.pop(); //移除最後一個陣列元素，就是第九格
		
		/*
		//測試陣列
		var a_random = new Array();
		a_random[0]=1;
	    a_random[1]=2;
	    a_random[2]=3;
		a_random[3]=5;
		a_random[4]=6;
		a_random[5]=8;
		a_random[6]=4;
		a_random[7]=7;		
		*/		
		
		//依亂數陣列內容來安排每個拼圖位置
		for(var key in a_random){ 
			var v_old = '#box' + (Number(key)+1)  ; //key+1是因為陣列索引從0開始
			var v_new = '#box' + a_random[key] ;
			var xold = $(v_old).offset().left ;
			var yold = $(v_old).offset().top ;
			var xnew = $(v_new).offset().left;
			var ynew = $(v_new).offset().top;
			$(v_new).animate({
			    "left": (xold - $('#box_area').offset().left) +  "px",
                "top": (yold - $('#box_area').offset().top) + "px"
                }, 100);
            $(v_new).attr("data-check",	(Number(key)+1));		
        }		
	} // End _start
		
				
	//計時器函數，每秒一次
	function _time() {
		return g_timer = setTimeout(function () {
				    g_temptime = Number(g_temptime) + 1;
				    $('#play_time i').text(g_temptime);
				    clearTimeout(g_timer);
				    //呼叫自己，會不斷循環
				    _time();
				}, 1000);
	} //End _time
	
	
//}); //End $(document).ready
	
