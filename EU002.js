$(function() {
	displayMask();
    var canvas = $("#mycanvas")[0];
    ctx = canvas.getContext('2d');
    var pointFlg = 0;
    var initScale;
    canvas.addEventListener('touchstart', onTouchStart, false);
    canvas.addEventListener('touchmove', onTouchMove, false);
    canvas.addEventListener('touchend', onTouchEnd, false);
    
	winWidth = $(window).width();
	winHeight = $(window).height();
	headerWidth = $("#header").width();
	headerHeight = $("#header").height();
	footerWidth = $("#footer").width();
	footerHeight = $("#footer").height();
	sidebarWidth = $("#sidebarMenu").width();
	sidebarHeight = $("#sidebarMenu").height();
	rotateDivWidth = $("#rotateDiv").width();
	rotateDivHeight = $("#rotateDiv").height();
	
	//-----------------
	var Orientation = 1;
	//-----------------

    pointLength=[];
    var tempImg = $("#tempImage");
    var img = new Image();    
    var initImg = new Image();
    tempImg[0].src = "E:\\nature-4.jpg";
    tempImg[0].onload = function(){
        img.src = "E:\\nature-4.jpg";
		img.onload = function() {
	        //-----------------
			EXIF.getData(img, function() {
				    EXIF.getAllTags(this); 				    
				    Orientation = EXIF.getTag(this, 'Orientation');
				});
			//-----------------
			Orientation = 1;
			
            canvas.width=tempImg[0].width;
            canvas.height=tempImg[0].height;
            sessionStorage["imw"] = tempImg[0].width;
    		sessionStorage["imh"] = tempImg[0].height;
    		
//			if (canvas.height > (winHeight - headerHeight - footerHeight)) {
//				canvas.height = winHeight - headerHeight - footerHeight - 45;
//			}
//			if (canvas.width > (winWidth - sidebarWidth - rotateDivWidth)) {
//				canvas.width = winWidth - sidebarWidth - rotateDivWidth;
//			}
//            scalex = canvas.width / img.width;
//            scaley = canvas.height / img.height;            
//            scale = (scalex-scaley)<0?scalex:scaley;
//            if (scale > 1) {
//            	scale = 1;
//            }
            tempImg.remove();
            
        	//-----------------
			if(Orientation != "" && Orientation != 1){
				switch(Orientation){
				 	case 6:
				 		rotateImg(this,'left',canvas,true);
				 		break;
				 	case 8:
				 		rotateImg(this,'right',canvas,true);
				 		break;
				 	case 3:
						rotateImg(this,'right',canvas,true);
						rotateImg(this,'right',canvas,true);
						break;
				}		
			} else {
				rotateImg(this,'',canvas,false);
			}
			//-----------------        	
			ctx.resetTransform();
        	//scale = 1;
            ctx.save();
            $(canvas).show();
            hideMask();
            initImg.src = canvas.toDataURL("'image/jpeg'");
            img = initImg;
        };
    };
    var changeFlg = false;
    $("#point").bind("click", function(event) {
    	
    	if(!changeFlg){
    		document.getElementById("point").innerHTML="敷地頂点初期化";
    		changeFlg = true;
    		pointstart=true;
    	} else {
    		document.getElementById("point").innerHTML="敷地頂点指示";
    		changeFlg = false;
    		pointstart=false;
        	ctx.scale(1, 1);
            ctx.clearRect(0,0,initImg.width,initImg.height);
            ctx.drawImage(initImg, 0, 0);
    	}
    	
        pointlist=[];
        ratio = 0;
        $("#setWidth").val("");
        $("#hidSetWidth").val("");
        selectlineNo = 0;
        pointFlg = 0;
    });
    $("#stroke").bind("click", function(event) {
        if(!pointstart&&pointlist.length>=2){
            return false;
        }
        
        drawAllLine();
        $("#myMessageDialog")[0].innerHTML="メッセージ";
		$("#messageLabel")[0].innerHTML="敷地頂点を移動調整出来ます。敷地辺をタップして長さを指示して下さい。";
		$("#messageDialog").modal("toggle");
    });
    
    $("#rotate").on("click",function(){
    	if (pointlist != undefined && pointlist.length > 0){
    		return;
    	}
    	//ctx.clearRect(0, 0, canvas.width, canvas.height);
    	alert();
    	ctx.save();
    	ctx.scale(scale, scale);
    	ctx.rotate(180*Math.PI/180);
        ctx.drawImage(img, -img.width, -img.height);
        img=new Image();
        img.src=canvas.toDataURL("'image/jpeg'");
    	ctx.resetTransform();
    });
    
    function drawAllLine(){
        ctx.beginPath();
        ctx.lineCap="round";
        for(i=0;i<pointlist.length;i++){
            if(i==0){
                ctx.moveTo(pointlist[i].x,pointlist[i].y);
            }else{
                ctx.lineTo(pointlist[i].x,pointlist[i].y);
                if(i==pointlist.length-1){
                    ctx.lineTo(pointlist[0].x,pointlist[0].y);
                }
            }
        }
        ctx.stroke();
        pointstart=false;
        pointFlg = 1;
        ctx.save();
    }
    
    function draw (e) {
        ctx.font="100px";
        ctx.textAlign="center";
        ctx.textBaseline="middle";   	
        if(pointlist.length<2){
            return false;
        }
        var pointx=e.changedTouches[0].clientX - box.left;
        var pointy=e.changedTouches[0].clientY - box.top;

        var selectFlg = 0;
    	ctx.scale(1, 1);
    	ctx.clearRect(0,0,img.width,img.height);
    	ctx.drawImage(img, 0, 0);
     	drawAllRound();
        for(i=0;i<pointlist.length;i++){
            pointlistSel=[];
            ctx.beginPath();
	        var distance;
            var centerPoint = {};
    	        if (i+1 <pointlist.length) {
                    ctx.moveTo(pointlist[i].x,pointlist[i].y);
                    ctx.lineTo(pointlist[i+1].x,pointlist[i+1].y);
    	        } else if (i+1 == pointlist.length) {
                    ctx.moveTo(pointlist[i].x,pointlist[i].y);
                    ctx.lineTo(pointlist[0].x,pointlist[0].y);
    	        }
                ctx.closePath();
                ctx.stroke();
        }
        
		var leftpointx = 0;
		var rightpointx = 0;
		var leftpointy = 0;
		var rightpointy = 0;			
        for(i=0;i<pointlist.length;i++){
        	
        	if (i+1 == pointlist.length) {
				leftpointx = pointlist[i].x;
				rightpointx = pointlist[0].x;
				leftpointy = pointlist[i].y;
				rightpointy = pointlist[0].y;
        	
        	} else {
				leftpointx = pointlist[i].x;
				rightpointx = pointlist[i + 1].x;
				leftpointy = pointlist[i].y;
				rightpointy = pointlist[i + 1].y;
        	}
        	
    		if ((pointx >= leftpointx && pointx <= rightpointx) || (pointx <= leftpointx && pointx >= rightpointx)) {
    			if (leftpointy > rightpointy) {
    				if ((pointy >= (rightpointy - 10)  && pointy <=  (leftpointy)) || 
    				    (pointy >= (rightpointy)  && pointy <=  (leftpointy + 10))) {
		            	selectlineNo = i;
		            	selectFlg = 1;
		                $('#myModal').modal({
		                  keyboard: false,
		                  backdrop: false
		                });
    				}
    			} else if (leftpointy < rightpointy) {
    				if ((pointy >= (leftpointy - 10)  && pointy <=  (rightpointy)) || 
    				    (pointy >= (leftpointy)  && pointy <=  (rightpointy + 10))) {
		            	selectlineNo = i;
		            	selectFlg = 1;
		                $('#myModal').modal({
		                  keyboard: false,
		                  backdrop: false
		                });
    				}
    			} else {
    				if (pointy >= (leftpointy - 10) || pointy <= (leftpointy + 10)) {
		            	selectlineNo = i;
		            	selectFlg = 1;
		                $('#myModal').modal({
		                  keyboard: false,
		                  backdrop: false
		                });
    				}
    			
    			}
    		}
    		
    		if ((pointy >= leftpointy && pointy <= rightpointy) || (pointy <= leftpointy && pointy >= rightpointy)) {
    			if (leftpointx > rightpointx) {
    				if ((pointx >= (rightpointx - 10)  && pointx <=  (leftpointx)) || 
    				    (pointx >= (rightpointx)  && pointx <=  (leftpointx + 10))) {
		            	selectlineNo = i;
		            	selectFlg = 1;
		                $('#myModal').modal({
		                  keyboard: false,
		                  backdrop: false
		                });
    				}
    			} else if (leftpointx < rightpointx) {
    				if ((pointx >= (leftpointx - 10)  && pointx <=  (rightpointx)) || 
    				    (pointx >= (leftpointx)  && pointx <=  (rightpointx + 10))) {
		            	selectlineNo = i;
		            	selectFlg = 1;
		                $('#myModal').modal({
		                  keyboard: false,
		                  backdrop: false
		                });
    				}
    			} else {
    				if (pointx >= (leftpointx - 10) || pointx <= (leftpointx + 10)) {
		            	selectlineNo = i;
		            	selectFlg = 1;
		                $('#myModal').modal({
		                  keyboard: false,
		                  backdrop: false
		                });
    				}
    			
    			}
    		}
        
            if (i+1 == pointlist.length || selectFlg==1) {
            	return false;
            }
        }
        pointstart=false;
        pointFlg = 1;
     }
    
     $("#save").click(function () {
         var setWidth = $("#setWidth").val();
         if(checkNumberWithAlert("長さ",setWidth,3,3)==false){
        	 return;
         }
         $('#myModal').modal('hide');
         if(setWidth==0){
        	 $("#setWidth").val("");
        	 $("#hidSetWidth").val("");
        	 setWidth = "";
         }
         $("#hidSetWidth").val(setWidth);
     	ctx.scale(1, 1);
     	ctx.clearRect(0,0,img.width,img.height);
    	ctx.drawImage(img, 0, 0);
     	drawAllRound();
     	drawAllLineLength(setWidth);
     });
     $("#close").click(function () {
         var setWidth = $("#hidSetWidth").val();
         $("#setWidth").val(setWidth);
     });
     
    var fns = [draw];
    var down_flag = 0;
    var initFlag = 0;
    var pointListNo = 0;
    var startX = 0;
    var startY = 0;
    function onTouchStart(event) {
        event.preventDefault();
        
        down_flag = 0;
        pointListNo = 0;
        startX = 0;
        startY = 0;
        box = canvas.getBoundingClientRect();

        selectX = (event.touches[0].clientX - box.left) * canvas.width / box.width;
        selectY = (event.touches[0].clientY - box.top) * canvas.height / box.height;
        
       if(pointstart==false){
         for (i=0;i<pointlist.length;i++) {
           drawRound(ctx,pointlist[i].x,pointlist[i].y);
           var scope = (pointlist[i].x-selectX/scale)*(pointlist[i].x-selectX/scale) + (pointlist[i].y-selectY/scale)*(pointlist[i].y-selectY/scale);
            if(scope < (25/scale)*(25/scale)){
            	down_flag = 1;
            	startX = pointlist[i].x;
            	startY = pointlist[i].y;
            	initFlag = 1;
            	pointListNo = i;
        	}
         }

       }else if(pointstart==true){
           var point =new Point();
           point.x=selectX/scale;
           point.y=selectY/scale;
           drawRound(ctx,selectX/scale,selectY/scale);
           pointlist.push(point);
       }
    }
    function onTouchMove(event) {
		event.preventDefault();
        if(down_flag==1){
    	 try
    	    {
    			last1X=(event.touches[0].clientX - box.left) * canvas.width / box.width;
    			last1Y=(event.touches[0].clientY - box.top) * canvas.height / box.height;
    			if(initFlag==1){
    				initFlag=0;
    			}
            	var pointEnd =new Point();
            	pointEnd.x=last1X/scale;
            	pointEnd.y=last1Y/scale;
            	pointlist[pointListNo]=pointEnd;
            	ctx.scale(1, 1);
            	ctx.clearRect(0,0,img.width,img.height);
            	ctx.drawImage(img, 0, 0);
            	drawAllRound();
            	
            	if ($("#setWidth").val() != null && $("#setWidth").val() != 0) {
                	if (ratio != 0) {
                		changeAllLine();
                	} else {
                		drawAllLineLength($("#setWidth").val());	
                	}
            	} else {
                	drawAllLine();
            	}
    	    }
    	    catch(err){
    	        alert(err.description);
    	    }
        }
    }
     
    function onTouchEnd(event){
        if(down_flag==1){
        	endX = (event.changedTouches[0].clientX - box.left) * canvas.width / box.width
        	endY = (event.changedTouches[0].clientY - box.top) * canvas.height / box.height
        	var pointEnd =new Point();
        	pointEnd.x=endX/scale;
        	pointEnd.y=endY/scale;
        	pointlist[pointListNo]=pointEnd;
        	ctx.scale(1, 1);
        	ctx.clearRect(0,0,img.width,img.height);
        	ctx.drawImage(img, 0, 0);
        	drawAllRound();
        	if (ratio != 0) {
        		changeAllLine();
        	} else {
            	drawAllLine();
        	}
        }
        
        
        if(pointstart==false){
            
             if (down_flag==0){
                for(var i = fns.length;i--;) {
                  fns[i](event);
                }
             }

         	ctx.scale(1, 1);
         	ctx.clearRect(0,0,img.width,img.height);
        	ctx.drawImage(img, 0, 0);
         	drawAllRound();
        	if (ratio != 0) {
        		changeAllLine();
        	} else {
            	drawAllLine();
        	}
          }
    }

    function drawRound(ctx,x,y){
        ctx.beginPath();
        ctx.lineWidth = 5.0/scale;
        ctx.strokeStyle = "#CC0000";
        ctx.arc(x, y, 25/scale, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
    
    function drawAllRound(){

    	for (i=0;i<pointlist.length;i++) {
    		ctx.beginPath();
    		ctx.lineWidth = 5.0/scale;
    		ctx.strokeStyle = "#CC0000";
    		ctx.arc(pointlist[i].x, pointlist[i].y, 25/scale, 0, 2 * Math.PI);
    		ctx.stroke();
            ctx.closePath();
    	}
    }
    
    function drawLine(ctx,startX,startY,endX,endY){
        ctx.beginPath();
        ctx.lineCap="round";
        ctx.moveTo(startX,startY);
        ctx.lineTo(endX,endY);
        ctx.stroke();
    }
    
    
    

    function drawAllLineLength(setWidth){
        ctx.beginPath();
        ctx.lineCap="round";
        
        ratio=0;
        if (pointlist != null && pointlist.length >1){
	        if (selectlineNo+1 <pointlist.length) {
		        distance = Math.pow((pointlist[selectlineNo].x - pointlist[selectlineNo+1].x),2) + Math.pow((pointlist[selectlineNo].y - pointlist[selectlineNo+1].y),2);    
		        distance = Math.sqrt(distance); 
	        } else if (selectlineNo+1 == pointlist.length) {
		        distance = Math.pow((pointlist[selectlineNo].x - pointlist[0].x),2) + Math.pow((pointlist[selectlineNo].y - pointlist[0].y),2);    
		        distance = Math.sqrt(distance); 
	        }
	       ratio = setWidth/distance;
        }

        for(i=0;i<pointlist.length;i++){
            var centerPoint = {};
            var font=30/scale+"px Georgia";
      		ctx.font=font;
     		ctx.textAlign="center";
     		ctx.textBaseline="middle";
     		ctx.fillStyle = "blue";
            if (i+1 <pointlist.length) {
           	 ctx.moveTo(pointlist[i].x,pointlist[i].y);
           	 ctx.lineTo(pointlist[i+1].x,pointlist[i+1].y);
           	 distance = Math.pow((pointlist[i].x - pointlist[i+1].x),2) + Math.pow((pointlist[i].y - pointlist[i+1].y),2);    
           	 distance = Math.sqrt(distance); 
           	 centerPoint.x = (pointlist[i].x + pointlist[i+1].x)/2;
           	 centerPoint.y = (pointlist[i].y + pointlist[i+1].y)/2;

            } else if (i+1 == pointlist.length) {
           	 ctx.moveTo(pointlist[i].x,pointlist[i].y);
           	 ctx.lineTo(pointlist[0].x,pointlist[0].y);
           	 distance = Math.pow((pointlist[i].x - pointlist[0].x),2) + Math.pow((pointlist[i].y - pointlist[0].y),2);    
           	 distance = Math.sqrt(distance); 
           	 centerPoint.x = (pointlist[i].x + pointlist[0].x)/2;
           	 centerPoint.y = (pointlist[i].y + pointlist[0].y)/2;

            }
        	if( setWidth == "" ){
        		ctx.fillText("",centerPoint.x-40/scale, centerPoint.y-20/scale);
        	}else{
        		ctx.fillText(parseFloat((distance * ratio).toFixed(3)),centerPoint.x-40/scale, centerPoint.y-20/scale);	
        	}
        }
 		ctx.stroke();
 		ctx.closePath();
    }
    
    
    function changeAllLine(){
        ctx.beginPath();
        ctx.lineCap="round";
        
        for(i=0;i<pointlist.length;i++){
            var centerPoint = {};
            var font=30/scale+"px Georgia";
      		ctx.font=font;
     		ctx.textAlign="center";
     		ctx.textBaseline="middle";
     		ctx.fillStyle = "blue";
            if (i+1 <pointlist.length) {
           	 ctx.moveTo(pointlist[i].x,pointlist[i].y);
           	 ctx.lineTo(pointlist[i+1].x,pointlist[i+1].y);
           	 distance = Math.pow((pointlist[i].x - pointlist[i+1].x),2) + Math.pow((pointlist[i].y - pointlist[i+1].y),2);    
           	 distance = Math.sqrt(distance); 
           	 centerPoint.x = (pointlist[i].x + pointlist[i+1].x)/2;
           	 centerPoint.y = (pointlist[i].y + pointlist[i+1].y)/2;

            } else if (i+1 == pointlist.length) {
           	 ctx.moveTo(pointlist[i].x,pointlist[i].y);
           	 ctx.lineTo(pointlist[0].x,pointlist[0].y);
           	 distance = Math.pow((pointlist[i].x - pointlist[0].x),2) + Math.pow((pointlist[i].y - pointlist[0].y),2);    
           	 distance = Math.sqrt(distance); 
           	 centerPoint.x = (pointlist[i].x + pointlist[0].x)/2;
           	 centerPoint.y = (pointlist[i].y + pointlist[0].y)/2;

            }
      		ctx.fillText(parseFloat((distance * ratio).toFixed(3)),centerPoint.x-40/scale, centerPoint.y-20/scale);
        }
 		ctx.stroke();
 		ctx.closePath();
    }

    $("#confirm").bind("click", function(event) {
    	if(pointlist==undefined||pointlist.length == 0){
    		$("#myMessageDialog")[0].innerHTML="エラーメッセージ";
    		$("#messageLabel")[0].innerHTML="敷地辺をタップして長さを指示して下さい。";
    		$("#messageDialog").modal("toggle");
    		hideMask();
    		return;
    	}
    	if($("#setWidth").val() == "" || $("#setWidth").val() == 0){
    		$("#myMessageDialog")[0].innerHTML="エラーメッセージ";
    		$("#messageLabel")[0].innerHTML="敷地辺をタップして長さを指示して下さい。";
    		$("#messageDialog").modal("toggle");
    		hideMask();
    		return;
    	}
        var form = $("#mainForm");
        $("#ulimg").val(canvas.toDataURL("'image/jpeg'"));
        $("#points").val(JSON.stringify(pointlist));
        $("#canvas_width").val(canvas.getBoundingClientRect().left);
        $("#canvas_height").val(canvas.getBoundingClientRect().top);
        $("#scale").val(scale);
        sessionStorage["ratio"]=ratio/scale;
        sessionStorage["scale"] = scale;
        putObjectWithAsync("justifyIm", canvas.toDataURL("'image/jpeg'"),()=>{
            pointlist.forEach(point=>{point.x=point.x*scale;point.y=point.y*scale});
            sessionStorage["points"]=JSON.stringify(pointlist);
            form.attr("action", "./confirm");
            form.submit();
        });
    });
});


function getLineLengthList ()
{    
	
	if (pointlist.length>1) {
	    for(i=0;i<pointlist.length;i++){
	    	
	        var distance;
	        if (i+1 <pointlist.length) {
		        distance = Math.pow((pointlist[i].x - pointlist[i+1].x),2) + Math.pow((pointlist[i].y - pointlist[i+1].y),2);    
		        distance = Math.sqrt(distance); 
	        } else if (i+1 == pointlist.length) {
		        distance = Math.pow((pointlist[i].x - pointlist[0].x),2) + Math.pow((pointlist[i].y - pointlist[0].y),2);    
		        distance = Math.sqrt(distance); 
	        }
	        pointLength.push(distance);
	    }
	}  
}

function rotateImg(img, direction,canvas,rotate) {
    var min_step = 0;  
    var max_step = 3;
    if (img == null) return;
    var height = canvas.height;  
    var width = canvas.width;
    
//    alert("height = " + height);
//    alert("width = " + width);
//    
//    alert("img.height = " + img.height);
//    alert("img.width = " + img.width);

//    
//    var centerPosx = canvas.width / 2;
//    var centerPosy = canvas.height / 2;
//    
//    alert("centerPosx = " + centerPosx);
//    alert("centerPosy = " + centerPosy);
    
    var step = 2;  
    if (step == null) {  
        step = min_step;  
    }  
    if (direction == 'right') {  
        step++;
        step > max_step && (step = min_step);  
    } else {  
        step--;  
        step < min_step && (step = max_step);  
    }
    var degree = step * 90 * Math.PI / 180;
    
    if (!rotate) {
    	step = min_step;
    }
    
    switch (step) {
	    case 0:  
	        canvas.width = width;  
	        canvas.height = height;
	        break;  
	    case 1:  
	        canvas.width = height;  
	        canvas.height = width;
	        break;  
	    case 2:  
	        canvas.width = width;  
	        canvas.height = height;
	        break;  
	    case 3:  
	        canvas.width = height;  
	        canvas.height = width;
	        break;  
    }    
	if (canvas.height > (winHeight - headerHeight - footerHeight)) {
		canvas.height = winHeight - headerHeight - footerHeight - 45;
	}
	if (canvas.width > (winWidth - sidebarWidth - rotateDivWidth)) {
		canvas.width = winWidth - sidebarWidth - rotateDivWidth;
	}
    scalex = canvas.width / img.width;
    scaley = canvas.height / img.height;            
    scale = (scalex-scaley) < 0 ? scalex : scaley;    
    if (scale > 1) {
    	scale = 1;
    } else if (scale < 0.14) {
    	scale = 0.14;
    }

    ctx.scale(scale, scale);    
    switch (step) {
        case 0:
            ctx.drawImage(img, 0, 0);  
            break;  
        case 1:
            ctx.rotate(degree);  
            ctx.drawImage(img, 0, -img.height);            
            break;  
        case 2:
            ctx.rotate(degree);  
            ctx.drawImage(img, -img.width, -img.height);  
            break;  
        case 3:
            ctx.rotate(degree);  
            ctx.drawImage(img, -img.width, 0);  
            break;  
    }
}

var scalex;
var scaley;
var scale;
var pointstart;
var pointlist;
var selectlineNo;
var ratio = 0;
var ctx;
var winWidth;
var winHeight;
var headerWidth;
var headerHeight;
var footerWidth;
var footerHeight;
var sidebarWidth;
var sidebarHeight;
var rotateDivWidth;
var rotateDivHeight;