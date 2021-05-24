// JavaScript Document

$(document).ready(function(e) {
	
	if($("#chck-rememberme").is(':checked')){
		//alert('checado');
		if(window.localStorage.getItem("key")){
			var value = window.localStorage.getItem("key");
			var senn  = window.localStorage.getItem("pass");
			$("#txt-email").val(value);	
			$('#txt-password').val(senn);
		}
	}
			 
});

$(document).on('submit','form[id="login"]',function(){
	var params = $(this.elements).serialize();
		$("body").append('<div class="kc_fab_overlay"></div>');				
		$.ajax({
				type: 'POST',
				async:false, 
				dataType: "json",	
				url: this.action,
				data: params,	
				success: function(data){

					
					if(data[0].acesso == 'ok'){						   
					    window.localStorage.setItem("key", ""+$('#txt-email').val()+"");
						window.localStorage.setItem("pass", ""+$('#txt-password').val()+"");	
											
						window.location.href = "tpl/admin.html";
					}else{
						alert('Acesso invalido, Rever o seu usuario e senha de acesso!');
						$(".kc_fab_overlay").remove();
					}											
				
				},
				error: function(data){
					alert('Sem acesso a rede,Inciar o gerenciador!');
					$(".kc_fab_overlay").remove();
				}
			});
	     return false;
	
});

$(document).on('submit','#registrar',function(){
	
	if($("#nome").val() == ""){
		alert("Digite um nome !");
		return false;
	}
	
	if($("#email").val() == ""){
		alert("Digite um E-Mail !");
		return false;
	}
	if($("#password").val() == ""){
		alert("Informe uma senha!");
		return false;
	}
	
	if($("#codrepre").val() == ""){
		alert("Informe seu codigo de representante!");
		return false;
	}
	var params = $(this.elements).serialize();
	$("body").append('<div class="kc_fab_overlay"></div>');	
	$.ajax({
		type: 'POST',
		async:false, 
		dataType: "json",	
		url: this.action,
		data: params,	
		success: function(data){
			$(".kc_fab_overlay").remove();
			$("#nome").val('');	
			$("#email").val('');
			$("#password").val('');
			$("#codrepre").val('');
			alert(data[0].msg);
		},
		error: function(data){
			alert('Sem acesso a rede,Inciar o gerenciador!');
			$(".kc_fab_overlay").remove();
		}
	});
	return false;
});

function fechar(){
	navigator.app.exitApp();
}