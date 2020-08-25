$(function() {
	$("#camera").bind("change", function(event) {		
		onTake('camera');
	});
	$("#file").bind("change", function(event) {		
		onTake('file');
	});
	$("#btn_camera").bind("click", function(event) {
		$("#camera").click();
	});
	$("#btn_file").bind("click", function(event) {
		$("#file").click();
	});
	$("#btn_history").bind("click", function(event) {
		//var form = $("#take_picture");
		alert("1");
		//form.attr("action", "./user/history");
		alert("2");
		//form.submit();
	});
	$("#btn_manage").bind("click", function(event) {
		var form = $("#take_picture");
		form.attr("action", "./admin/manage");
		form.submit();
	});
})
function onTake(controlName) {	
	displayMask();
	var file = document.getElementById(controlName).files[0];
	var reader = new FileReader();
	reader.onload = function(event) {
		
		putObject("im", event.target.result);
		document.forms[0].submit();
	}
	reader.readAsDataURL(file);

}