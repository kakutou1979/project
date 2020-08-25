/*
 * マスクイメージを埋込み
 */
$(function() {
	
	var strMas="<div style='width:100%;height:100%;position:fixed;left:0;top:0;text-align:center;background-color:white;opacity:0.6; z-index:99' id='mask'>"
		+"<img src='/resource?path=logoImgPath/wait.gif' style='vertical-align: middle;opacity:0.5;' width=20% height=20% id='maskImg'></img>"
		+"</div>";
	
	if(window.document.forms.length != 0){
		if(window.document.forms.length == 1){
			$(window.document.forms[0]).append(strMas);
		}else {
			$("#mainForm").append(strMas);
		}
		$("#mask").hide();
		$(".maskable").on("click",function(){
			displayMask();
		});
	}
	
	/*
	 * 数字項目のフォーカスアウトにフォマットする
	 */
	$(".numberFormat").on("blur", function() {
		$(this).val(format($(this).val()));

	});

	/*
	 * 数字項目のフォーカスインにコーマを削除する
	 */
	$(".numberFormat").on("focus", function() {
		$(this).val(deleteComma($(this).val()));
	});

	/*
	 * 数字項目のsubmitにコーマを削除する
	 */
	$("form").on("submit", function() {
		$(".numberFormat").each(function(){
			$(this).val(deleteComma($(this).val()));
		});
	});
	
	/*
	 * 数字項目の初期にフォマットする
	 */
	$(".numberFormat").each(function(){
		$(this).val(format($(this).val()));
	});
	
	/*
	 * ロゴアイコンタップでメニューに戻る
	 */
	$("#logoImg").on("click", function() {
		window.location.href = "../captrue";
	});
	
	/*
	 * ブラウザの戻る、進む使用禁止
	 */	
	history.pushState(null, null, "#");
	window.addEventListener('popstate', function(e) {
		alert("この操作は使用できません。ページ内の機能をご使用下さい。");
		history.pushState(null, null, "#");				
	});	
	


})
/*
 * マスクイメージを表示
 */
function displayMask(){
	var maskDiv=$("#mask");
	if(maskDiv[0]){
		maskDiv.width=window.innerWidth;
		maskDiv.height=window.innerHeight;
		let img=maskDiv[0].childNodes[0];
		img.style.marginTop=(window.innerHeight-img.height)/2+"px";
		maskDiv.show();
	}

}
/*
 * マスクイメージを非表示
 */
function hideMask(){
	var maskDiv=$("#mask");
	maskDiv.hide();
}
/*
 * 数字のフォマット
 */
function format(num) {
	if(num==undefined){
		return '';
	}
	var strNum = num + '';
	var splitedNum = [];
	splitedNum = strNum.split(".");
	strNum = splitedNum[0].replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
	if (splitedNum.length == 2) {
		strNum = strNum + "." + splitedNum[1];
	}
	return strNum;
}

/*
 * コーマの削除
 */
function deleteComma(num) {
	if(num==undefined){
		return '';
	}
	var strNum = num + '';
	if (num) {
		strNum = strNum.replace(/,/g, '');
	}
	return strNum;
}

/*
 * 指定のスケールで数字を判断する
 */
function checkNumber(num,int,scale,callerAlert){
	var errorFlg;
	if(num==undefined){
		return true;
	}
	num=num+'';
	if(num.length==0){
		return true;
	}
	if(isNaN(Number(num))){
		return false;
	}
	
	if(!scale){
		scale=0
	}
	var options=[];
	options[0]=int;
	options[1]=scale;
	nums=num.split('.');

	for(let i=0;i<nums.length;i++){
		if(nums[i].length > options[i]){
			errorFlg=true;
			break;
		}
	}

	return !errorFlg;
}
/*
 * 指定のスケールで数字を判断し、アラートする
 */
function checkNumberWithAlert(name,num,int,scale){
	if(!checkNumber(num,int,scale)){
		strNum="9".repeat(int);
		if(scale>0){
			strDigit="9".repeat(scale);
			strNum=strNum+"."+strDigit;
		}
		var errorMessage="「{0}」フィールドを数字（{1}）入力してください。".replace("{0}",name).replace("{1}",strNum);
		alert(errorMessage);
		return false;
	}else{
		return true;
	}

}

/*
 * 指定のスケールで数字を判断し、モジュール画面を表示
 */
function checkNumberWithModal(name,num,int,scale,modalId){
	if(!checkNumber(num,int,scale)){
		hideMask();
		strNum="9".repeat(int);
		if(scale>0){
			strDigit="9".repeat(scale);
			strNum=strNum+"."+strDigit;
		}
		var errorMessage="「{0}」フィールドを数字（{1}）入力してください。".replace("{0}",name).replace("{1}",strNum);
		$("#"+modalId+" > .modal-dialog > .modal-content > .modal-body > .form-group > label")[0].innerHTML=errorMessage;
		$("#"+modalId).modal("toggle");
		return false;
	}else{
		return true;
	}

}
// イメージをS3にアップロード
function putObject(objectname,objectUrl,callback){

	let transferData = new ImageData();
	transferData.imgDescription = objectname;
	transferData.imgUrl = objectUrl;
	var request = $.ajax({
		url : "/putObject",
		async : false,
		method : "POST",
		data : JSON.stringify(transferData),
		dataType : "mycustomtype",
		contentType : "application/json; charset=UTF-8",
		accepts: {
		    mycustomtype: "application/json"
		  },
		converters: {
		    'text mycustomtype': function(result) {
		      return result;
		    }
		}
	});
	request.done(function(url) {
		sessionStorage[objectname] = url;
		if(callback){
			callback();
		}
	});
	request.fail(function(jqXHR, textStatus) {
		alert("putObject failed:   "+JSON.stringify(jqXHR));
	});

}

//イメージをS3にアップロード
function putObjectWithAsync(objectname,objectUrl,callback){

	let transferData = new ImageData();
	transferData.imgDescription = objectname;
	transferData.imgUrl = objectUrl;
	var request = $.ajax({
		url : "/putObject",
		method : "POST",
		data : JSON.stringify(transferData),
		dataType : "mycustomtype",
		contentType : "application/json; charset=UTF-8",
		accepts: {
		    mycustomtype: "application/json"
		  },
		converters: {
		    'text mycustomtype': function(result) {
		      return result;
		    }
		}
	});
	request.done(function(url) {
		sessionStorage[objectname] = url;
		if(callback){
			callback();
		}
	});
	request.fail(function(jqXHR, textStatus) {
		alert("putObject failed:   "+JSON.stringify(jqXHR));
	});

}

/*
 * 座標
 */
function Point() {
	this.x;
	this.y;
}

/*
 * イメージ
 */
function ImageData() {
	this.imgUrl;
	this.imgDescription;
}

function imageSrc() {
	var divWidth = 64;
	var divHeight = 64;
	$("img[name^='logoImg']").each(function() {
		 var imgWidth = $(this)[0].width;
		 var imgHeight = $(this)[0].height;
		 var scaleWidth = imgWidth / divWidth;
		 var scaleHeight = imgHeight / divHeight;
		 if(scaleWidth > scaleHeight){
			 $(this)[0].width = imgWidth / scaleWidth;
			 $(this)[0].height = imgHeight / scaleWidth;
		 } else {
			 $(this)[0].width = imgWidth / scaleHeight;
			 $(this)[0].height = imgHeight / scaleHeight;
		 }
	});
}
