$(document).ready(function (){
	$("#usuario").focus();
	
	$("#entrar").click(function (){
		$("#entrar").attr("disabled","true");
		if($("#usuario").val().trim().length == 0 || $("#clave").val().trim().length == 0){
			alert("Debe ingresar usuario y contraseña");
			$("#entrar").removeAttr("disabled");
			return false;	
		}
		var url = $("#base_url").val()+"Login/ValidarLogin/";
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'usuario': $("#usuario").val().trim(),
				'clave': $("#clave").val().trim()
			},
			dataType: 'json',
			success: function (data){
				if(data == 0){
					alert("Usuario y/o clave incorreta");
					$("#entrar").removeAttr("disabled");
					return false;
				}
				location.href = $("#base_url").val()+'Mapa/';
			}
		});
		return false;
	});
});