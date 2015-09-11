$( document ).ready(function () {

	var windowWidth = $('#game1').width() ;
	var windowHeight = $('#game1').height() ;
	var boxsize;
	var a_box = [] ;
	var temp_time = 0 ;
	var temp_tapnum = 0 ;
	var imgurl = 'images/a02.jpg';
	var v_size;
	var timer;
	
	//設定 box 的位置，因為圖片最大只有420，所以最大限制在420px以內
	if (windowWidth < windowHeight) {
		if (windowWidth >= 420) {
			v_size =  Math.round((420 - 20) / 3);
		} else {
			v_size =  Math.round((windowWidth - 20) / 3);
		}
		//設定box的位置及大小
		_box(v_size,imgurl);
	} else {
		if (windowHeight >= 420) {
			v_size =  Math.round((420 - 20) / 3);
		} else {
			v_size =  Math.round((windowHeight - 20) / 3);
		}
		//設定box的位置及大小
		_box(v_size,imgurl);
	} 	

	//設定外框的css大小
	$('.box_area').css("width",windowWidth + "px");
	$('.box_area').css("height",windowHeight + "px");
	$('.box_area').css("margin-left", ((windowWidth - 20 - (v_size * 3))/2) + "px");
	
	//點選事件
    $(document).on('tap','.box',_play);

	//開始遊戲
	$(document).on('tap','#btn_play',function(){
	    _start();
	});

	//重新開始 
	$(document).on('tap','#btn_restart',function(){	
	    location.reload();	
	});
	
	//初始值函數
	function _config() {
	    //停止計時
		clearTimeout(timer);
		$('#play_time i').text('0');
		$('#tap_num i').text('0');
	    temp_time = 0 ;
		temp_tapnum = 0 ;
	}
		
	//box的大小及位置的函數
	function _box(v_size,imgurl) {	
		//設定圖檔與尺寸
		$('.box').css('background','url(' + imgurl + ')')
		         .css('background-size',v_size * 3 + 'px ' + v_size *3 + 'px');
			
		//設定box的CSS大小
		$('.box').css("width",v_size + "px")
		         .css("height",v_size + "px");
		
		$('#box1').css("top",0)
		          .css("left",0)	
		          .css('background-position','0 0');				  

		$('#box2').css("top",0)
		          .css("left",v_size + "px" )
		          .css('background-position', (-v_size) + 'px 0px' );

		$('#box3').css("top",0)
		          .css("left",(v_size * 2) + "px" )
		          .css('background-position', (-v_size) * 2 + 'px 0px' );	

		$('#box4').css("top",v_size + "px")
		          .css("left",0 )	
		          .css('background-position','0px ' + (-v_size) + 'px' );			  

		$('#box5').css("top",v_size + "px")
		          .css("left",v_size + "px" )	
		          .css('background-position', (-v_size) + 'px ' + (-v_size) + 'px' );

		$('#box6').css("top",v_size + "px")
		          .css("left",(v_size * 2) + "px" )
		          .css('background-position', (-v_size) * 2 + 'px ' + (-v_size) + 'px' );
		
		$('#box7').css("top",(v_size * 2) + "px")
		          .css("left",0 )
		          .css('background-position', '0px ' + (-v_size) * 2 + 'px' );
		
		$('#box8').css("top",(v_size * 2) + "px")
		          .css("left",v_size + "px")
		          .css('background-position', (-v_size) + 'px ' + (-v_size) * 2 + 'px' );
		
		$('#box9').css("top",(v_size * 2) + "px")
		          .css("left", (v_size * 2) + "px")
		          .css('background-position', (-v_size) * 2 + 'px ' + (-v_size) * 2 + 'px' );
		
	} //End _box
	
	function _play() {
	    var xa = $(this).offset().left;
		var ya = $(this).offset().top;
		var xb = $('#box9').offset().left;
		var yb = $('#box9').offset().top ;
		var d = Math.abs(xa-xb) + Math.abs(ya-yb) - v_size ;
		if ( d == 0 ) {
		    var v_check0 = $(this).attr("data-check");
			var v_check1 = $("#box9").attr("data-check");
		    $(this).animate({
                "left": (xb - $('#box_area').offset().left) +  "px",
                "top": (yb - $('#box_area').offset().top) + "px"
                }, 100);
			$(this).attr("data-check",v_check1);
            $("#box9").css({
                "left": (xa - $('#box_area').offset().left) + "px",
                "top": (ya - $('#box_area').offset().top) +  "px"
                });
			$('#box9').attr("data-check",v_check0);
		}
		
		//增加步數
		temp_tapnum = Number($('#tap_num i').text());
		$('#tap_num i').text(temp_tapnum + 1) ;
		
		//判斷是否完成拼圖，以data-check與data-box是否一致判斷，全一致表示已完成
		for (i = 1; i < 9; i++) { 
            var tt = '#box' + i ;
			if ( $(tt).attr('data-check') != $(tt).attr('data-box') ) {
			    break;
			}
			if (i == 8 ) {
			    _finish();
			}
        }		
	} //End _play
	
	//完成拼圖：停止拼圖移動、計時、步數，恢復第九格圖示，顯示成功畫面
	function _finish() {
	    //第九格動畫與恢復
		$('#box9').removeClass('box_empty').addClass('box');
		$('#box9').css('background','url(' + imgurl + ')')
		          .css('background-size',v_size * 3 + 'px ' + v_size *3 + 'px')
	              .css("top",(v_size * 2) + "px")
		          .css("left", (v_size * 2) + "px")
		          .css('background-position', (-v_size) * 2 + 'px ' + (-v_size) * 2 + 'px' );
				  
		//Animate.css動畫：https://github.com/daneden/animate.css
		$('#box9').addClass('animated rotateIn');
				  
		$('#btn_play').removeClass('ui-disabled');
		//停止計時
		clearTimeout(timer);
	}

	function _start() {
	    //初始值
	    _config();
	    //停止按鈕動作
		$('#btn_play').addClass('ui-disabled');
		//啟動計時器
		timer = _time();
		
		//移除第九格div的圖形及重新套用css
		$('#box9').removeClass('box')
		          .addClass('box_empty')
		          .css('background','');
		
		//亂數產生排列組合
		//直接以亂數產生陣列組合，很容易拼到最後會出現12345687，則永遠無法完成。
		//所以使用真實的移動來模擬過程，就不會出現12345687的情形。
		var maxNum = 4;
		var minNum = 1;
		var index9 = 8;
		var i = 0 ;
		var dkey ,rkey ,rtmp1;
		var a_random = [1,2,3,4,5,6,7,8,9] ;
		var a_randomkey = [-1,3,1,-3] ;
        while ( i < 50 ) {
		    rkey =  Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum; 			
			dkey = index9 + Number(a_randomkey[rkey-1]);
			if ( dkey >=0 && dkey <= 8 ) {
			    rtmp1 = a_random[index9] ;
				a_random[index9]= a_random[dkey];
				a_random[dkey] = rtmp1 ;		
                index9 = dkey;		
                i++;				
			}
		}
		//將第9格移回原位
		while ( index9 != 8 ) {
		    dkey = index9 + 3;
			if ( dkey > 8 ) {
			    dkey = index9 + 1;
			}
			if ( dkey >=0 || dkey <= 8 ) {
			    rtmp1 = a_random[index9] ;
				a_random[index9]= a_random[dkey];
				a_random[dkey] = rtmp1 ;		
                index9 = dkey;				
			}
        }	
		//移除最後一個元素，就是第九格
		a_random.pop();
        console.log(a_random,'a_random');
		
		/*
		//--------------------------------------------------------
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
		//---------------------------------------------------------
		*/		
		
		//依亂數陣列內容來安排拼圖位置
		for(var key in a_random){ 
		    //重設div位置，key+1是因為陣列索引從0開始
			var v_old = '#box' + (Number(key)+1)  ;
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
		return timer = setTimeout(function () {
				temp_time = temp_time + 1;
				$('#play_time i').text(temp_time);
				clearTimeout(timer);
				//呼叫自己，會不斷循環
				_time();
				}, 1000);
	} //End _time

});
	
