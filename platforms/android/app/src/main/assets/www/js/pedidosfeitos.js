// JavaScript Document
//fresh na pagina 
$(function(){
	PullToRefresh.init({
		mainElement: '.header',
		distIgnore: 50,
		shouldPullToRefresh: function(){
          return document.querySelector('#shouldptr').checked;
        },
		onRefresh: function(){
			// What do you want to do when the user does the pull-to-refresh gesture
			//window.location.reload(); 						
			
			VerificaRestricoesLiberadas();
		}
	});
});	
$(document).ready(function(e) {
	 
    $.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/lista-pedidosfeitos-exec.php",
		 beforeSend: function(){	
			$.mobile.loading( 'show', {
				text: 'Aguarde Listando pedidos!',
				textVisible: true,
				theme: 'b',
				html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde Listando pedidos!</div>"
			});	
 		 },	
		 data:{act:"listar"},
		 dataType:"json",
		 success: function(data){
							
			var html = "";
			var totproduto = 0;
			var total      = 0;
			var vltotal 	 = 0;
			var vltotaldesc  = 0;
			var vltotalfinal = 0;
			var vtotal_desc  = 0;
			var vldesconto   = 0;
			var descontovalor= 0;
			var tot_valorped = 0; 

		   if(data.length > 0){
			for (var i = 0; i < data.length; i++) {
				
					var ls = listapedidosfeitos(data[i].nump);
					
						
					vldesconto    = convertevalores(ls.valor_desconto);
					vltotal 	  = parseFloat(ls.somtotal2);
					var vltotal2 	  = convertevalores(ls.somtotal);
					vltotaldesc   = ls.somtotaldesconto;
					vtotal_desc   = convertevalores(ls.vtotal_desc);
					descontovalor = vltotal2 * (vldesconto / 100);


					var valor_desconto_final = parseFloat(descontovalor) + parseFloat(vtotal_desc);

					vltotalfinal = vltotal - valor_desconto_final;												
					
					var disp = "hide";
					if(data[i].cor == 'danger'){
						var disp = "";
					}
								
				
				html += '<li class="ui-li-has-alt ui-li-has-thumb ui-first-child" data-id="'+data[i].nump+'">'+
							'<a href="#" data-ajax="false" class="ui-btn">'+								
								'<img src="../img/pedult.png" width="103" style="margin-top: 27px;"/>'+
									'<h2 class="text-'+data[i].cor+'">'+data[i].status+' | '+data[i].nnump+' - '+data[i].nome+'</h2>'+
									'<p><strong>Emissão:'+data[i].datap+'<BR/>Entrega  :'+data[i].dte+'</strong></p>'+
									'<p style="color:#1565c0;font-size: 0.8em;"><strong>[TOTAL: R$ '+number_format(vltotal,2,',','.')+']<br/> [TOTAL DESCONTO : R$ '+number_format(valor_desconto_final,2,',','.')+']<br/> [TOTAL FINAL: R$ '+number_format(vltotalfinal,2,',','.')+']</strong></p>'+									
									'<p style="width:10%;"><strong>Obs: '+data[i].obs+' </strong></p>'+
							'</a>'+							
							'<a href="javascript:void(0)" data-id="'+data[i].nump+'" class="ui-btn ui-icon-plus ui-btn-a '+disp+'" id="listrestricoes" data-ajax="false" style="right: 2.5em;background: #e8133b;text-shadow: none;"><span class="ui-li-count label-danger">'+data[i].contador+'</span></a>'+
							'<a href="javascript:void(0)" id="'+data[i].nump+'" class="listaped ui-btn ui-btn-icon-notext ui-icon-plus ui-btn-a" data-ajax="false" title="Detalhe"></a>'+
						'</li>';
																	
				total = parseFloat(total) + parseFloat(totproduto);
				tot_valorped = parseFloat(tot_valorped) + parseFloat(vltotalfinal);
				//alert(valor_desconto_final);
			}
			$(".semitem").remove();
			 }else{
				 
				var htm = '<div align="center" class="semitem"><img src="../img/semitem.png" /><br/><h3>Aqui não há pedido disponivel Clique em “+” para adicionar um novo Pedido.</h3></div>'; 
				
				$('.ui-content').append(htm); 
			 }
			
			
			$(".valtotal").html(number_format(tot_valorped,2,',','.'));
			$(".counttotal").html(data.length);
			$('#pedidofeitos').html(html); 			
			$(".s-card-btn-count").html(data.length);
			$.mobile.loading("hide");
		},
		error: function(jqXHR, exception){
			alert('erro não detectado [1].\n' + jqXHR.responseText);
			if (jqXHR.status === 0) {
			alert('Não conectar.\n Verifique Rede.');
			} else if (jqXHR.status == 404) {
				alert('A página solicitada não foi encontrado. [404]');
			} else if (jqXHR.status == 500) {
				alert('Erro do Servidor Interno [500].');
			} else if (exception === 'parsererror') {
				alert('JSON solicitada falhou analisar.');
			} else if (exception === 'timeout') {
				alert('Time out error.');
			} else if (exception === 'abort') {
				alert('Solicitação Ajax abortado.');
			} else {
				alert('erro não detectado.\n' + jqXHR.responseText);
			}	
		}	
	});
	
	
	
});


function listapedidosfeitos(nump){
		var retorno;
		$.ajax({
		 type: 'POST',
		 cache:false,
		 async:false, 
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/lista-pedidosfeitos-exec.php",
		 data:{act:"detalhe",nump:nump},
		 dataType:"json",
		 success: function(data){
			
			retorno = data;				
						 				
			
		},
		error: function(jqXHR, exception){
			alert('erro não detectado [2].\n' + jqXHR.responseText);			
			if (jqXHR.status === 0) {
			alert('Não conectar.\n Verifique Rede.');
			} else if (jqXHR.status == 404) {
				alert('A página solicitada não foi encontrado. [404]');
			} else if (jqXHR.status == 500) {
				alert('Erro do Servidor Interno [500].');
			} else if (exception === 'parsererror') {
				alert('JSON solicitada falhou analisar.');
			} else if (exception === 'timeout') {
				alert('Time out error.');
			} else if (exception === 'abort') {
				alert('Solicitação Ajax abortado.');
			} else {
				alert('erro não detectado.\n' + jqXHR.responseText);
			}	
		}	
	});	
	return retorno;
}

$(document).ready(function(e) {
    $forms = $('form[id="filtro"]');	
    
	$forms.bind('submit', function(){		
		
		var params = $(this.elements).serialize();

		$('#pedidofeitos').html('');
		$.ajax({
				type: 'POST',
				cache:false,
				dataType: "json",	
				url: ""+caminhoURL+"/PROJETOS/webservice_pedido/php/lista-pedidosfeitos-exec.php",
				data: params,
				 beforeSend: function(){
					 $.mobile.loading( 'show', {
						text: 'Fazendo a busca..',
						textVisible: true,
						theme: 'b',
						html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Fazendo a busca..</div>"
					});
			 	},	
				success: function(data){

				var html = "";
				var totproduto = 0;
				var total      = 0;
				var vltotal 	 = 0;
				var vltotaldesc  = 0;
				var vltotalfinal = 0;
				var vtotal_desc  = 0;
				var vldesconto   = 0;
				var descontovalor= 0;
				var tot_valorped = 0; 

				for (var i = 0; i < data.length; i++) {
					
					var ls = listapedidosfeitos(data[i].nump);
					
						
					vldesconto    = convertevalores(ls.valor_desconto);
					vltotal 	  = parseFloat(ls.somtotal2);
					var vltotal2 	  = convertevalores(ls.somtotal);
					vltotaldesc   = ls.somtotaldesconto;
					vtotal_desc   = convertevalores(ls.vtotal_desc);
					descontovalor = vltotal2 * (vldesconto / 100);


					var valor_desconto_final = parseFloat(descontovalor) + parseFloat(vtotal_desc);

					vltotalfinal = vltotal - valor_desconto_final;					

					var disp = "hide";
					if(data[i].cor == 'danger'){
						var disp = "";
					}
								
				
				html += '<li class="ui-li-has-alt ui-li-has-thumb ui-first-child" data-id="'+data[i].nump+'">'+
							'<a href="#" data-ajax="false" class="ui-btn">'+								
								'<img src="../img/pedult.png" width="103" style="margin-top: 27px;"/>'+
									'<h2 class="text-'+data[i].cor+'">'+data[i].status+' | '+data[i].nnump+' - '+data[i].nome+'</h2>'+
									'<p><strong>Emissão:'+data[i].datap+'<BR/>Entrega  :'+data[i].dte+'</strong></p>'+
									'<p style="color:#1565c0;font-size: 0.8em;"><strong>[TOTAL: R$ '+number_format(vltotal,2,',','.')+']<br/> [TOTAL DESCONTO : R$ '+number_format(valor_desconto_final,2,',','.')+']<br/> [TOTAL FINAL: R$ '+number_format(vltotalfinal,2,',','.')+']</strong></p>'+									
									'<p><strong>Obs: '+data[i].obs+' </strong></p>'+
							'</a>'+							
							'<a href="javascript:void(0)" data-id="'+data[i].nump+'" class="ui-btn ui-icon-plus ui-btn-a '+disp+'" id="listrestricoes" data-ajax="false" style="right: 2.5em;background: #e8133b;text-shadow: none;"><span class="ui-li-count label-danger">'+data[i].contador+'</span></a>'+
							'<a href="javascript:void(0)" id="'+data[i].nump+'" class="listaped ui-btn ui-btn-icon-notext ui-icon-plus ui-btn-a" data-ajax="false" title="Detalhe"></a>'+
						'</li>';
																	
				total = parseFloat(total) + parseFloat(totproduto);
				tot_valorped = parseFloat(tot_valorped) + parseFloat(vltotalfinal);
														
					
					
				}
			
			$(".valtotal").html(number_format(tot_valorped,2,',','.'));
			$(".counttotal").html(data.length);
			
			$('#pedidofeitos').html(html); 
			//$("#pedidofeitos").collapsibleset().trigger('create');
			$(".s-card-btn-count").html(data.length);
			
			$.mobile.loading("hide");
					
			$(".filter-icon").css({
			  '-webkit-transform': 'rotate(-0deg)',
			  '-moz-transform': 'rotate(-0deg)',
			  '-ms-transform': 'rotate(-0deg)',
			  '-o-transform': 'rotate(-0deg)',
			  'transform': 'rotate(-0deg)',
			});		
			$(".view-more").addClass("abre");
			$(".view-more").removeClass("fecha");
			$(".ftrdata").slideUp();		
			$(".semitem").remove();		
			},
			error: function(jqXHR,data){
				alert('erro não detectado [3].\n' + jqXHR.responseText);	
			}
		});
	     return false;
    });
});

function deletarpedido(cod){
	
		var conf = confirm("Deseja Realmente Exluir esse Pedido ?");

		if(conf == true){
			$.ajax({
				type: 'POST',
				cache: false,
				dataType: "json",	
				url: ""+caminhoURL+"/PROJETOS/webservice_pedido/php/sincronizar-exec.php",
				beforeSend: function(){	
					$.mobile.loading( 'show', {
						text: 'Aguarde enquanto envio a solicitação de exclusão!',
						textVisible: true,
						theme: 'b',
						html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde enquanto envio a solicitação de exclusão!</div>"
					});	
				},	
				data: {act:"verificaexclusão",nump:cod},	
				success: function(data){
														
						if(data[0].numpand != ''){												
							RetornoDeletarPed(data[0].numpand,data[0].nump);
						}else{
							alert(data[0].nump+' - '+data[0].msg);
							window.location.href = "../tpl/lista-pedidosfeitos.html";
						}
						
						
				},
				error: function(data){
					alert('erro não detectado [4].\n' + jqXHR.responseText);	
				}
			});
		}

		return false;
			
}

function emailpedido(cod){
	
	var nreta = $('#pedidofeitos li[data-id="'+cod+'"]').find('a h2').html().split('|')[1].split('-')[0];
	
	console.log(nreta);
	if(nreta.trim() == ""){
		alert("Esse pedido não foi enviado para a empresa!");
	}else{

		var dados = DadosEmail(nreta);
		var conf = $.confirm({
			title: 'Enviar Pedido por E-Mail!',
			content: '<form id="frmenvemail" name="frmenvemail"><input type="hidden" name="nreta" value="'+nreta+'"/><input type="hidden" name="nomecli" value="'+dados[0].nome+'"/><div data-role="ui-field-contain"><label for="textinput-1"><strong>E-Mail:</strong></label><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="email" id="cliemail" name="cliemail" value="'+dados[0].email+'" /></div></div><button type="submit" class="ui-btn ui-shadow" data-ajax="false">Enviar E-Mail</button></form>',
			type: 'green',
			typeAnimated: true,
			buttons: {							
				tryAgain: {
					text: 'Fechar',
					btnClass: 'btn-red',
					action: function(){
						conf.close();
					}
				}
			}
		});
		
	}
	
}

function DadosEmail(cod){
	var ret = [];
	$.ajax({
		type: 'POST',
		async:false,
		dataType: "json",	
		url: ""+caminhoURL+"/PROJETOS/webservice_pedido/php/lista-pedidosfeitos-exec.php",		
		data: {act:"dadosemail",id:cod},	
		success: function(data){		
			ret = data;
		},
		error: function(jqXHR, exception){
			alert('erro não detectado [7].\n' + jqXHR.responseText);						
		}	
	});
	return ret;
}

$(document).on('submit','form[id="frmenvemail"]',function(){

	var Formemail = document.forms.frmenvemail
	var email     = Formemail.cliemail.value;
	var nreta     = Formemail.nreta.value;
	var nomecli   = Formemail.nomecli.value;
	var empresa   = $("#empresa").val();	
	var array 	  = [];

	array.push({
		'email':email,
		'nreta':nreta,
		'nomecli':nomecli,
	});			
	
	$.ajax({
		type: 'POST',
		cache: false,
		dataType: "json",	
		url: "http://api.prodapro.com.br/pedidos/"+empresa+"/php/PdfPedido-exec.php",
		beforeSend: function(){	
			$.mobile.loading( 'show', {
				text: 'Aguarde enquanto envio do e-mail!',
				textVisible: true,
				theme: 'b',
				html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde enviando e-mail!</div>"
			});	
		},	
		data: {act:"pdf2",ids:array},	
		success: function(data){
			$.mobile.loading("hide");
			$.confirm({
				title: '',
				content: '<div align="center"><strong>'+data[0].msg+'</strong></div><div align="center"><img src="../img/envemail.png" /></div>',
				type: 'green',
				typeAnimated: true,
				buttons: {
					tryAgain: {
						text: 'Fechar',
						btnClass: 'btn-red',
						action: function(){
						}
					}
				}
			});

			
		},
		error: function(jqXHR, exception){
			alert('erro não detectado [5].\n' + jqXHR.responseText);
			if (jqXHR.status === 0) {
			alert('Servidor indisponível no momento. tente novamente!');
			} else if (jqXHR.status == 404) {
				alert('A página solicitada não foi encontrado. [404]');
			} else if (jqXHR.status == 500) {
				alert('Erro do Servidor Interno [500].');
			} else if (exception === 'parsererror') {
				alert('JSON solicitada falhou analisar.');
			} else if (exception === 'timeout') {
				alert('Time out error.');
			} else if (exception === 'abort') {
				alert('Solicitação Ajax abortado.');
			} else {
				alert('erro não detectado.\n' + jqXHR.responseText);
			}	
			
		}	
	});

	return false;

});


function RetornoDeletarPed(cod,np){
	
	var empresa = $("#empresa").val();
	
	$.ajax({
			type: 'POST',
			cache: false,
			dataType: "json",	
			url: "http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
			beforeSend: function(){	
				$.mobile.loading( 'show', {
					text: 'Aguarde enquanto envio a solicitação de exclusão!',
					textVisible: true,
					theme: 'b',
					html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde enquanto envio a solicitação de exclusão!</div>"
				});	
			},	
			data: {act:"excluir",nump:cod},	
			success: function(data){
		
				DeletarPedidoRetorno(data,np);
			},
			error: function(jqXHR, exception){
				alert('erro não detectado [5].\n' + jqXHR.responseText);
				if (jqXHR.status === 0) {
				alert('Servidor indisponível no momento. tente novamente!');
				} else if (jqXHR.status == 404) {
					alert('A página solicitada não foi encontrado. [404]');
				} else if (jqXHR.status == 500) {
					alert('Erro do Servidor Interno [500].');
				} else if (exception === 'parsererror') {
					alert('JSON solicitada falhou analisar.');
				} else if (exception === 'timeout') {
					alert('Time out error.');
				} else if (exception === 'abort') {
					alert('Solicitação Ajax abortado.');
				} else {
					alert('erro não detectado.\n' + jqXHR.responseText);
				}	
				
			}	
		});
		return false;

}
function DeletarPedidoRetorno(data,numpd){

	$.ajax({
			type: 'POST',
			cache: false,
			dataType: "json",	
			url: ""+caminhoURL+"/PROJETOS/webservice_pedido/php/sincronizar-exec.php",
			beforeSend: function(){	
				$.mobile.loading( 'show', {
					text: 'Aguarde enquanto envio a solicitação de exclusão!',
					textVisible: true,
					theme: 'b',
					html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde enquanto envio a solicitação de exclusão!</div>"
				});	
			},	
			data: {act:"excluir",arr:data,nump:numpd},	
			success: function(data){
																		
				alert(data[0].nump+' - '+data[0].msg);
				window.location.href = "../tpl/lista-pedidosfeitos.html";
									
					
			},
			error: function(jqXHR,data){
				alert('erro não detectado [6].\n' + jqXHR.responseText);	
			}
		});
		return false;

}
$(document).on('click','.editp',function(){	
	
	
	$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
		 data:{act:"alterar",id:$(this).attr('id')},
		 dataType:"json",
		 success: function(data){
							
			if(data[0].adicionado == 'ok'){
				window.location.href = '../tpl/lista-produtoclientealt.html';
			}
			
		},
		error: function(jqXHR, exception){
			alert('erro não detectado [7].\n' + jqXHR.responseText);	
			if (jqXHR.status === 0) {
			alert('Não conectar.\n Verifique Rede.');
			} else if (jqXHR.status == 404) {
				alert('A página solicitada não foi encontrado. [404]');
			} else if (jqXHR.status == 500) {
				alert('Erro do Servidor Interno [500].');
			} else if (exception === 'parsererror') {
				alert('JSON solicitada falhou analisar.');
			} else if (exception === 'timeout') {
				alert('Time out error.');
			} else if (exception === 'abort') {
				alert('Solicitação Ajax abortado.');
			} else {
				alert('erro não detectado.\n' + jqXHR.responseText);
			}	
		}	
	});	
	
});
$(document).ready(function(e) {
    /*$("#filtdtemissao").hide();
	$("#filtdtentrega").hide();
	$("#filtstatus").hide();*/	
});
$(document).on('change','#select-native-1',function(){	
	
	
	if($(this).val() == 1){
		$("input[name='radio-choice-b']").removeAttr("checked");
		$("#dtinient").val('');
		$("#dtfinent").val('');
		$("#filtdtemissao").show();
		$("#filtdtentrega").hide();
		$("#filtstatus").hide();		
		
		
	}else if($(this).val() == 2){
		$("input[name='radio-choice-b']").removeAttr("checked");
		$("#dtfin").val('');
		$("#dtini").val('');
		$("#filtdtemissao").hide();
		$("#filtstatus").hide();
		$("#filtdtentrega").show();
		
	}else if($(this).val() == 3){
		$("#dtinient").val('');
		$("#dtfinent").val('');
		$("#dtfin").val('');
		$("#dtini").val('');
		$("#filtdtemissao").hide();
		$("#filtdtentrega").hide();
		$("#filtstatus").show();
		
	}else{
		$("input[name='radio-choice-b']").removeAttr("checked");
		$("#dtinient").val('');
		$("#dtfinent").val('');
		$("#dtfin").val('');
		$("#dtini").val('');
		$("#filtdtemissao").hide();
		$("#filtdtentrega").hide();
		$("#filtstatus").hide();
	
	}
	
});

$(document).on('change','input[name="radio-filtrarpor"]',function(){
	var fil = $(this).val();

	if(fil == 1){
		$("#filtdtemissao").show();
		$("#filtdtentrega").addClass('hide');
		$("#filtdtemissao").removeClass('hide');
	}else if(fil == 2){
		$("#filtdtentrega").show();
		$("#filtdtemissao").addClass('hide');
		$("#filtdtentrega").removeClass('hide');
	}else{
		$("#filtdtentrega").addClass('hide');
		$("#filtdtentrega").addClass('hide');
	}

});

$(document).on('click','.listaped',function(){
	//alert($(this).attr('id'));
		
		//$(this).parents('li').removeClass('selected');
	 	
		var codigo		 = $(this).attr('id');
		var ls     		 = listapedidosfeitos($(this).attr('id'));
		var html   		 = "";
		var html2  		 = "";
		var bthtm   	 = "";
		var vltotal 	 = 0;
		var vltotaldesc  = 0;
		var vltotalfinal = 0;
		var vtotal_desc  = 0;
		var vldesconto   = 0;
		var descontovalor= 0;
		var bloqueio = ls.detalhe[0].status == 1 ? 'editp':'disabled';
					
		
		bthtm +=/*'<div class="s-card-text"><a href="#" class="s-card-botao-print ui-shadow " data-id="'+$(this).attr('id')+'"></a>IMPRIMIR</div>'+*/
			  '<div class="s-card-text"><a href="#" class="s-card-botao-edit ui-shadow '+bloqueio+' " id="'+$(this).attr('id')+'"></a>Editar</div>'+
			  '<div class="s-card-text"><a href="#" class="s-card-botao-email ui-shadow" onClick="emailpedido(\''+$(this).attr('id')+'\');"></a>Enviar E-Mail</div>'+
                '<div class="s-card-text"><a href="#" class="s-card-botao-excluir ui-shadow" onClick="deletarpedido(\''+$(this).attr('id')+'\');"></a>Excluir Pedido</div>'+
				'<div class="s-card-text2"><a href="#page" data-transition="slidedown"><div class="s-card-botao-hide ui-shadow"><br/></div></a><br/>Fechar</div>';
		
		$(".s-card-botao-top").html(bthtm);
		
		for(x in ls.detalhe){
			
			

					html += '<li id="'+ls.detalhe[x].cod+'" data-icon="false" class="ui-li-has-thumb ui-first-child">';
					html += '<a href="#">';
					html += '<img src="'+ls.detalhe[x].src+'" style="margin-top:30px;margin-left: 30px;"/>';            				
					
						html += '<div class="ui-radio">';
							html += '<label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-radio-on">';
								html += '<span id="desc'+ls.detalhe[x].cod+'"><strong>'+ls.detalhe[x].desc+'</strong></span>';
								//html += '<input name="checd" type="radio" class="cinput" value="'+ls[x].cod+'" '+data[i].cks+' />';
							html += '</label>';
						html += '</div>';
					
					
					if(ls.detalhe[x].option1 == 1){	
						
					

							html += '<div class="inp_car">';
								html += 'Vol.(PC)';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="number" disabled="disabled"  class="volume" name="volume" style="text-align:center;" data-clear-btn="false" value="'+ls.detalhe[x].vle+'">';
								html += '</div>';
							html += '</div>';

							
						
						
							html += '<div class="inpx_car">';
								html += 'QTD.('+ls.detalhe[x].unid+')';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="tel" disabled="disabled" id="quantidade" style="text-align:right;" name="quantidade" class="quanitdade" value="'+ls.detalhe[x].qtd+'">';							
								html += '</div>';							
							html += '</div>';																										
						
					}else{
						
						
						
							html += '<div class="inpx_car">';
								html += 'QTD.('+ls.detalhe[x].unid+')';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="number" id="quantidade" disabled="disabled" style="text-align:right;" name="quantidade" class="quanitdade" value="'+ls.detalhe[x].qtd+'">';							
								html += '</div>';							
							html += '</div>';																										
										
					
					}
					
					
				
						html += '<div class="inpvl_car">';
							html += 'VALOR.';
							html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';
								html += '<input type="tel" id="valor" disabled="disabled" style="text-align:right;" class="valor" value="'+ls.detalhe[x].prec+'" data-mini="true"/>';
							html += '</div>';	
						html += '</div>';
						
						if(ls.detalhe[x].sndesconto == 1){
							
								html += '<div class="inpx_car">';
									html += 'Desc %';
									html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';	
	html += '<input type="tel" id="desc_perc" style="text-align:right;" name="desc_perc" class="desc_perc" value="'+ls.detalhe[x].desconto_perc+'" disabled="disabled">';							
									html += '</div>';							
								html += '</div>';

								html += '<div class="inpx_car">';
									html += 'Desc R$';
									html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';						
									html += '<input type="tel" id="desc_valor" style="text-align:right;" name="desc_valor" class="desc_valor" value="'+ls.detalhe[x].desconto+'" disabled="disabled">';							
									html += '</div>';							
								html += '</div>';
							}
						
	
						html += '<div class="inpxs_car">';
							html += '<br/>';
							html += '<div style="margin-top: -5px; display:inline-block;">';
							html += '<p id="somaqtds"><strong style="font-size: 18px;">R$ '+ls.detalhe[x].somaqtd+'</strong></p>';
							html += '</div>';
						html += '</div>';
					
					html += '</a>';
						
					html += '</li>';		
						
					
		}
		
		
		vldesconto    = convertevalores(ls.valor_desconto);
		vltotal 	  = parseFloat(ls.somtotal2);
		var vltotal2 	  = convertevalores(ls.somtotal);
		vltotaldesc   = ls.somtotaldesconto;
		vtotal_desc   = convertevalores(ls.vtotal_desc);
		descontovalor = vltotal2 * (vldesconto / 100);
	
		
		var valor_desconto_final = parseFloat(descontovalor) + parseFloat(vtotal_desc);
		
		vltotalfinal = vltotal - valor_desconto_final;
	
		 html2 = '<div data-role="navbar">'+
            '<ul>'+                
                '<li><a href="#" data-ajax="false" id="somatotals" data-iconpos="left" data-role="button"><strong style="font-size:12px;">TOTAL: <br/>R$ '+number_format(vltotal,2,',','.')+'</strong></a></li>'+
                '<li><a href="#" data-ajax="false" id="somadesconto" data-iconpos="left" data-role="button"><strong style="font-size:12px;">TOTAL DESCONTO: <br/>R$ '+number_format(valor_desconto_final,2,',','.')+'</strong></a></li>'+
                '<li><a href="#" data-ajax="false" id="somatotalfinal" data-iconpos="left" data-role="button"><strong style="font-size:12px;">TOTAL FINAL: <br/>R$ '+number_format(vltotalfinal,2,',','.')+'</strong></a></li>'+               
            '</ul>'+
        '</div>'; 
	
	
		$('#s-card-xconteudo').html(html);		
		$("#s-card-xconteudo").listview().trigger("create");
		$("#s-card-xconteudo").listview('refresh');
		
		$('.totalizar').html(html2);
		$(".totalizar").listview().trigger("create");
		$(".totalizar").listview('refresh');	
		
	
		$(':mobile-pagecontainer').pagecontainer('change', '#bar',{
			transition: 'slideup',
			changeHash: false,
			reverse: false,
			showLoadMsg:true,
			loadMsgDelay: 75
		});
		
		var intv = setInterval(function(){
			$("#pedidofeitos li[data-id='"+codigo+"']").removeClass('selected');
			$("#pedidofeitos li[data-id='"+codigo+"']").find('a img').attr('src','../img/pedult.png');
			clearInterval(intv);
		},300);
	
});

$(document).on('click','.disabled',function(){
	
	$.confirm({
		title: 'Ops!',
		content: 'Desculpe esse pedido já foi enviado, para mais detalhes verifique com o faturamento! ',
		type: 'red',
		typeAnimated: true,
		buttons: {
			tryAgain: {
				text: 'Fechar',
				btnClass: 'btn-red',
				action: function(){
				}
			}
		}
	});
	
});

function listarpedidos(){
	
	$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/lista-pedidosfeitos-exec.php",
		 beforeSend: function(){	
			$.mobile.loading( 'show', {
				text: 'Aguarde Listando pedidos!',
				textVisible: true,
				theme: 'b',
				html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde Listando pedidos!</div>"
			});	
 		 },	
		 data:{act:"listar"},
		 dataType:"json",
		 success: function(data){
							
			var html = "";
			var totproduto = 0;
			var total      = 0;
			var vltotal 	 = 0;
			var vltotaldesc  = 0;
			var vltotalfinal = 0;
			var vtotal_desc  = 0;
			var vldesconto   = 0;
			var descontovalor= 0;
			var tot_valorped = 0; 

		   if(data.length > 0){
			for (var i = 0; i < data.length; i++) {
				
					var ls = listapedidosfeitos(data[i].nump);
					
						
					vldesconto    = convertevalores(ls.valor_desconto);
					vltotal 	  = parseFloat(ls.somtotal2);
					var vltotal2 	  = convertevalores(ls.somtotal);
					vltotaldesc   = ls.somtotaldesconto;
					vtotal_desc   = convertevalores(ls.vtotal_desc);
					descontovalor = vltotal2 * (vldesconto / 100);


					var valor_desconto_final = parseFloat(descontovalor) + parseFloat(vtotal_desc);

					vltotalfinal = vltotal - valor_desconto_final;												
					
					var disp = "hide";
					if(data[i].cor == 'danger'){
						var disp = "";
					}
								
				
				html += '<li class="ui-li-has-alt ui-li-has-thumb ui-first-child" data-id="'+data[i].nump+'">'+
							'<a href="#" data-ajax="false" class="ui-btn">'+								
								'<img src="../img/pedult.png" width="103" style="margin-top: 27px;"/>'+
									'<h2 class="text-'+data[i].cor+'">'+data[i].status+' | '+data[i].nnump+' - '+data[i].nome+'</h2>'+
									'<p><strong>Emissão:'+data[i].datap+'<BR/>Entrega  :'+data[i].dte+'</strong></p>'+
									'<p style="color:#1565c0;font-size: 0.8em;"><strong>[TOTAL: R$ '+number_format(vltotal,2,',','.')+']<br/> [TOTAL DESCONTO : R$ '+number_format(valor_desconto_final,2,',','.')+']<br/> [TOTAL FINAL: R$ '+number_format(vltotalfinal,2,',','.')+']</strong></p>'+									
							'</a>'+							
							'<a href="javascript:void(0)" data-id="'+data[i].nump+'" class="ui-btn ui-icon-plus ui-btn-a '+disp+'" id="listrestricoes" data-ajax="false" style="right: 2.5em;background: #e8133b;text-shadow: none;"><span class="ui-li-count label-danger">'+data[i].contador+'</span></a>'+
							'<a href="javascript:void(0)" id="'+data[i].nump+'" class="listaped ui-btn ui-btn-icon-notext ui-icon-plus ui-btn-a" data-ajax="false" title="Detalhe"></a>'+
						'</li>';
																	
				total = parseFloat(total) + parseFloat(totproduto);
				tot_valorped = parseFloat(tot_valorped) + parseFloat(vltotalfinal);
				//alert(valor_desconto_final);
			}
			$(".semitem").remove();
			 }else{
				 
				var htm = '<div align="center" class="semitem"><img src="../img/semitem.png" /><br/><h3>Aqui não há pedido disponivel Clique em “+” para adicionar um novo Pedido.</h3></div>'; 
				
				$('.ui-content').append(htm); 
			 }
			
			
			$(".valtotal").html(number_format(tot_valorped,2,',','.'));
			$(".counttotal").html(data.length);
			$('#pedidofeitos').html(html); 			
			$(".s-card-btn-count").html(data.length);
			$.mobile.loading("hide");
		},
		error: function(jqXHR, exception){
			alert('erro não detectado [8].\n' + jqXHR.responseText);	
			if (jqXHR.status === 0) {
			alert('Não conectar.\n Verifique Rede.');
			} else if (jqXHR.status == 404) {
				alert('A página solicitada não foi encontrado. [404]');
			} else if (jqXHR.status == 500) {
				alert('Erro do Servidor Interno [500].');
			} else if (exception === 'parsererror') {
				alert('JSON solicitada falhou analisar.');
			} else if (exception === 'timeout') {
				alert('Time out error.');
			} else if (exception === 'abort') {
				alert('Solicitação Ajax abortado.');
			} else {
				alert('erro não detectado.\n' + jqXHR.responseText);
			}	
		}	
	});
	
}

function number_format(number, decimals, dec_point, thousands_sep) {
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function(n, prec) {
			var k = Math.pow(10, prec);
			return '' + Math.round(n * k) / k;
		};
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}


	
$(document).on('click',"#pedidofeitos li", function () {
	if($(this).hasClass("selected")) {
		$(this).removeClass("selected");
		//alert('remove seleção');
		$(this).find('a img').attr('src','../img/pedult.png');
		//$("[type='checkbox'][value='"+$(this).attr('id')+"']").prop("checked",false);
	} else {			
		var nreta = $(this).find('a h2').html().split('|')[1].split('-')[0];
		if($(this).find('a h2 span').html() == 'P' || $(this).find('a h2 span').html() == 'PR'){
			
			if(nreta.trim() == ""){
				$(this).addClass("selected");
				$(this).find('a img').attr('src','../img/sucess.png');
				$(".envdadosbtn").removeClass('hide');
			}else{
				$("#s-card-botao-top").append("<div class='text-warning' style='float: left; margin-top: 12px;'>Item ja sincronizado!</div>");
			}
		}else{
			//alert("Item ja sincronizado!");
			$("#s-card-botao-top").append("<div class='text-warning' style='float: left; margin-top: 12px;'>Item ja sincronizado!</div>");
		}
		//$("[type='checkbox'][value='"+$(this).attr('id')+"']").prop("checked",true);
	}

	if($(".selected").length == 0){
		$(".envdadosbtn").addClass('hide');
		$('#checkbox-h-2a').prop('checked', false).checkboxradio('refresh');
	}
});
	
$(document).on('click','.s-card-botao-print',function(){
	var codigo = $(this).attr('data-id');
	
	bluetooth.imprimirpedido(codigo);
	
	
});

$(document).on('click','#listrestricoes',function(){
	
	$(':mobile-pagecontainer').pagecontainer('change', '#restricoes',{
			transition: 'slideup',
			changeHash: false,
			reverse: false,
			showLoadMsg:true,
			loadMsgDelay: 75
		});				
		var arr = [];
		arr.push({
			'nped':$(this).attr('data-id'),					
		});
	var nreta = $('#pedidofeitos li[data-id="'+$(this).attr('data-id')+'"]').find('a h2').html().split('|')[1].split('-')[0];
	console.log(arr);
	if(nreta.trim() != ""){
		gravarestricoes(arr);
	}
	VerificaRestricoesLiberadas();
	
	var row = listarrestricoes($(this).attr('data-id'));
	var htm = '';
	if(row.length > 0){
		for(i = 0; i < row.length; i++){

			//htm += '<li data-icon="custom" id="skull"><a href="#">'+row[i].motivo_bloqueio+' '+row[i].produto+'</a></li>';
						
			htm += '<div data-role="collapsible" id="set'+i+'" data-collapsed="true"><h3>       '+row[i].motivo_bloqueio+' '+row[i].produto+' '+row[i].liberado+'</h3>'+
				   '<p style="margin: 0;padding: 13px;background: aliceblue;">'+row[i].obs+'</p></div>';
			
			
		}
		
		$("#listarestricoes").html(htm);
		//$("#listarestricoes").listview("refresh");
		$('#listarestricoes').collapsibleset().trigger('create');
		//$("#listarestricoes").collapsible("refresh");
	}
	
	//<li data-icon="custom" id="skull"><a href="#">custom-icon</a></li>
	
});
function gravarestricoes(npeds){
	var dl;
	$.ajax({
		type:'POST',
		cache:false, 
		url:""+caminhoURL+"/projetos/webservice_pedido/php/sincronizar-exec.php",
		data:{act:'gravaresticoesapi',ids:npeds},
		beforeSend: function(){		
			
		},
		success: function(data){
			dbox.close();
			var res = JSON.parse(data);
			
			if(res[0].msg == 2){				
								  
				  dl = $.confirm({
					title: 'Resposta!',
					content: 'Não houve contato com o servidor de envio, clique em <mark>REENVIAR</mark> novamente',
					type: 'orange',
					typeAnimated: true,
					buttons: {
						tryAgain: {
							text: 'REENVIAR',
							btnClass: 'btn-green',
							action: function(){
									gravarestricoes(npeds);
								}
							}
						}
				   });
				
			}else{
				//res[0].msg				
				
			}
			
			console.log(data);	
		},
		error:function(data){

		}
	});
	
}
function listarrestricoes(cod){
	var retorno;
	$.ajax({
		 type: 'POST',
		 async:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/restricoes-exec.php",
		 data:{act:"lista",id:cod},
		 dataType:"json",
		 success: function(data){
			
			 retorno = data;
			
			
		},
		error: function(jqXHR, exception){
			alert('erro não detectado [9].\n' + jqXHR.responseText);	
			if (jqXHR.status === 0) {
			alert('Não conectar.\n Verifique Rede.');
			} else if (jqXHR.status == 404) {
				alert('A página solicitada não foi encontrado. [404]');
			} else if (jqXHR.status == 500) {
				alert('Erro do Servidor Interno [500].');
			} else if (exception === 'parsererror') {
				alert('JSON solicitada falhou analisar.');
			} else if (exception === 'timeout') {
				alert('Time out error.');
			} else if (exception === 'abort') {
				alert('Solicitação Ajax abortado.');
			} else {
				alert('erro não detectado.\n' + jqXHR.responseText);
			}	
		}	
	});		
	return retorno;
}

function VerificaRestricoesLiberadas(){
	
	$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/sincronizar-exec.php",
		 data:{act:"verificarestricoes"},
		 dataType:"json",
		 success: function(data){
						 	
			listarpedidos();
		},
		error: function(jqXHR, exception){
			alert('erro não detectado [10].\n' + jqXHR.responseText);	
			/*if (jqXHR.status === 0) {
			alert('Não conectar.\n Verifique Rede.');
			} else if (jqXHR.status == 404) {
				alert('A página solicitada não foi encontrado. [404]');
			} else if (jqXHR.status == 500) {
				alert('Erro do Servidor Interno [500].');
			} else if (exception === 'parsererror') {
				alert('JSON solicitada falhou analisar.');
			} else if (exception === 'timeout') {
				alert('Time out error.');
			} else if (exception === 'abort') {
				alert('Solicitação Ajax abortado.');
			} else {
				alert('erro não detectado.\n' + jqXHR.responseText);
			}*/	
		}	
	});	
	
}

function convertevalores(valor2){
	if(valor2.length > 2 && valor2.length <= 6){
		var valstr2 = parseFloat(valor2.replace(",","."));
	}else{
		var valstr2 = parseFloat(valor2.replace(",",".").replace(".",""));
	}
	
	return valstr2.toFixed(2);
}

$(document).on('click','.s-card-botao-hide',function(){
	$(".s-card-coteudo").animate({
			'height':'40px'
	});	
});

$(document).ready(function(){
    var links = [
        {
            "bgcolor":"#1565C0",
            "icon":"<i class='ui-icon-plus ui-btn-icon-notext'></i>",
			"url":"../tpl/pedido-cliente.html",			
        }/*,
        {
            "url":"http://www.example.com",
            "bgcolor":"red",
            "color":"#fffff",
            "icon":"<i class='fa fa-phone'></i>",
            "target":"_blank"
        },
        {
            "url":"http://www.example.com",
            "bgcolor":"black",
            "color":"white",
            "icon":"<i class='fa fa-music'></i>"
        }*/
    ]
    $('.kc_fab_wrapper').kc_fab(links);
	
	$("#checkbox-h-2a").change(function(){

		var check = $(this).is(":checked");
		var li    = $("#pedidofeitos li");
		if(check){						

			for (var i = 0; i < li.length; i++) {

				var nreta = li[i].querySelectorAll('a h2')[0].innerHTML;
				//alert(nreta.split('|')[1].split('-')[0].trim());				
				
				if(li[i].querySelectorAll('a h2 span')[0].innerHTML == 'P' || li[i].querySelectorAll('a h2 span')[0].innerHTML == 'PR'){

					if(nreta.split('|')[1].split('-')[0].trim() == ""){
						//console.log(li[i].attributes[1].nodeValue);		 
						$("#pedidofeitos li[data-id='"+li[i].attributes[1].nodeValue+"']").addClass("selected");
						$("#pedidofeitos li[data-id='"+li[i].attributes[1].nodeValue+"']").find('a img').attr('src','../img/sucess.png');
						
						$(".envdadosbtn").removeClass('hide');
					}	

				}

			}	
			


		}else{

			for (var i = 0; i < li.length; i++) {
			
				if(li[i].querySelectorAll('a h2 span')[0].innerHTML == 'P' || li[i].querySelectorAll('a h2 span')[0].innerHTML == 'PR'){

					$("#pedidofeitos li[data-id='"+li[i].attributes[1].nodeValue+"']").removeClass("selected");
					$("#pedidofeitos li[data-id='"+li[i].attributes[1].nodeValue+"']").find('a img').attr('src','../img/pedult.png');
				}	


				if($(".selected").length == 0){
					$(".envdadosbtn").addClass('hide');
				}

		}	

				//$(this).removeClass("selected");
				//alert('remove seleção');
				//$(this).find('a img').attr('src','../img/pedult.png');

		}

	});
	
});