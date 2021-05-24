// JavaScript Document

$(document).ready(function(e) {
    
	 $.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
		 data:{act:"listar"},
		 dataType:"json",
		 success: function(data){
							
			var html = "";
			var vltotal;
			//html += '';
			for(var i = 0; i < data.length; i++){
				
				if(data[i].info == ''){
					
					if(data[i].msgest != ""){
						var msgest = "class='"+data[i].msgest+"'";
					}else{
						var msgest = "";
					}

					html += '<li id="'+data[i].codigo+'" data-icon="false" class="ui-li-has-thumb ui-first-child">';										
					html += '<a href="#" '+msgest+'>';							
					html += '<img src="'+data[i].src+'" style="margin-top:30px;margin-left: 30px;">';
						html += '<div class="ui-radio">';
							html += '<label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-radio-on">';
								html += '<span id="desc'+data[i].codigo+'"><strong>'+data[i].descricao+'</strong></span>';
								html += '<input name="checd" type="radio" class="cinput" value="'+data[i].codigo+'" '+data[i].cks+' />';
							html += '</label>';
						html += '</div>';
					//html += '<br/>';
					
					if(convertevalores(data[i].volume) > 0){
						$('.count'+data[i].codigo+'').html(parseInt(data[i].volume));
					}else{
						$('.count'+data[i].codigo+'').html(data[i].qtd);	
					}
					
					
					if(data[i].option1 == 1){	
						
							var blockqtd = data[i].blockqtd == 1 ? 'readonly' : '';
							
							html += '<div class="inp_car">';
								html += 'Vol.(PC)';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="tel" id="volume'+data[i].codigo+'" class="volume" name="volume'+data[i].codigo+'" style="text-align:center;" data-clear-btn="false"  value="'+data[i].volume+'">';
								html += '</div>';
							html += '</div>';

							
						
						
							html += '<div class="inpx_car">';
								html += 'QTD.('+data[i].unidade+')';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="tel" id="quantidade'+data[i].codigo+'" style="text-align:right;" name="quantidade'+data[i].codigo+'" class="quanitdade" '+blockqtd+'  value="'+data[i].qtd+'">';							
								html += '</div>';							
							html += '</div>';																										
												
						
					}else{
						
							var blockqtd = data[i].blockqtd == 1 ? 'readonly' : '';
						
							html += '<div class="inpx_car">';
								html += 'QTD.('+data[i].unidade+')';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="number" id="quantidade'+data[i].codigo+'" style="text-align:right;" name="quantidade'+data[i].codigo+'" class="quanitdade" '+blockqtd+'  value="'+data[i].qtd+'">';							
								html += '</div>';							
							html += '</div>';																										
																						
					
					}
						
					
						if(convertevalores(data[i].desconto_perc) > 0){
							var dis = "disabled";
						}else{
							var dis = "";
						}
						
						html += '<div class="inpvl_car">';
							html += 'VALOR.';
							html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';
								html += '<input type="tel" id="valor'+data[i].codigo+'" onBlur="automudapreco(this);" style="text-align:right;" '+dis+' class="valor" value="'+data[i].preco+'" data-mini="true"/>';
								html += '<input type="hidden" id="precolista'+data[i].codigo+'" class="precolista" value="'+data[i].precolista+'" data-mini="true"/>';
							html += '</div>';	
						html += '</div>';
						
						if(data[i].sndesconto == 1){																				
							
							
							html += '<div class="inpx_car">';
								html += 'Desc %';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="tel" id="desc_perc'+data[i].codigo+'" style="text-align:right;"  name="desc_perc'+data[i].codigo+'" class="desc_perc" value="'+data[i].desconto_perc+'">';							
								html += '</div>';							
							html += '</div>';

							html += '<div class="inpx_car">';
								html += 'Desc R$';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="tel" id="desc_valor'+data[i].codigo+'"  style="text-align:right;" name="desc_valor'+data[i].codigo+'" class="desc_valor" value="'+data[i].desconto_valor+'">';							
								html += '</div>';							
							html += '</div>';
						}
	
						html += '<div class="inpxs_car">';
							html += '<br/>';
							html += '<div style="margin-top: -5px; display:inline-block;">';
							html += '<p id="somaqtds'+data[i].codigo+'"><strong style="font-size: 18px;">R$ '+number_format(data[i].somaqtd,2,',','.')+'</strong></p>';
							html += '</div>';
						html += '</div>';
										
						html += '</a>';
					html += '</li>';		
						
					vltotal = data[i].somtotal;	
					
				}else{
					
					html += '<div class="alert fade in label-info" style="text-align:center;">';						
						html += '<strong>Ops!</strong> '+data[i].info+'.';
					html += '</div>';
					
									
				}
			}
			if(data[0].info == ''){
				/*html += '<li>';
					html += '<p><strong>Valor Total:</strong></p>';
					html += '<label id="somatotals"><strong>R$ '+vltotal+'</strong></label>';
				html += '</li>';*/
				$("#somatotals").html("<strong style='font-size:20px;'>R$ "+vltotal+"</strong>");
				$(".s-card-valototal").html("<strong style='font-size:20px;'>R$ "+vltotal+"</strong>");
				
			}
			
			$('#s-card-xconteudo').append(html);
			$(".s-card-count").html(data.length - 1);
			$('li[id="undefined"]').css({'display':'none'});
			 
			 abrecarrinhonoalterar();
			 totaliza();
		},
		error: function(jqXHR, exception){
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

function abrecarrinhonoalterar(){
	var pathArray = window.location.pathname.split('/');
	var newPathname = "";
	for (i = 0; i < pathArray.length; i++) {
	  newPathname += "/";
	  newPathname += pathArray[i];
		//alert(pathArray[i]);
		if(pathArray[i] == 'lista-produtoclientealt.html'){
			test();
		}
	}
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

$(document).on('click','#adicionar',function(){
		
	var files = '';
	var array = [];
	
	$(".cinput:checked").each(function(){
		//if(this.checked) {
			files = this.value;
			//ids = array.push(files);
			array.push(files);	
			
		//}
	});	
//	alert(files);
	
	if($("#valor"+files+"").val() == '0,00' || $("#valor"+files+"").val() == ''){
		
		alert('Valor esta vazio!');
		return false;
	}
	
	if(files == ''){
		alert('Selecione um Item para adicionar!');		
		return false;
	}else{
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:files,act:'add2'},
			success: function(data){
				
				var html = "";
				var somtotals = 0;

				if(data[0].info != ''){	
					for (var i = 0; i < data.length; i++) {
																		
						if(data[i].codigo == files){
							if(data[i].option1 == 1){		
								$("#desc"+data[i].codigo+"").html(""+data[i].descricao+"");
								$("#qtds"+data[i].codigo+"").val(data[i].qtd);
								$("#quantidade"+data[i].codigo+"").val(""+data[i].qtd+"");
								$("#unidade"+data[i].codigo+"").html(""+data[i].unidade+"");
								$("#valor"+data[i].codigo+"").val(''+data[i].preco+'');
								$("#somaqtds"+data[i].codigo+"").html("<strong style='font-size: 18px;'>R$ "+data[i].somaqtd+"</strong>");
								$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
								$("#volume"+data[i].codigo+"").val(''+data[i].volume+'');
								$("#desc_perc"+data[i].codigo+"").val(''+data[i].desconto_perc+'');
								$("#desc_valor"+data[i].codigo+"").val(''+data[i].desconto_valor+'');
								if(convertevalores(data[i].volume) > 0){
									$(".count"+data[i].codigo+"").html(""+parseInt(data[i].volume)+"");
								}else{
									$(".count"+data[i].codigo+"").html(""+data[i].qtd+"");
								}

								if(data[i].msgest != ""){
									$("#s-card-xconteudo li[id='"+data[i].codigo+"'] a").addClass(""+data[i].msgest+"");
								}else{
									$("#s-card-xconteudo li[id='"+data[i].codigo+"'] a").removeClass("carnegativo");
								}

							}else{
								
								$("#desc"+data[i].codigo+"").html(""+data[i].descricao+"");
								$("#qtds"+data[i].codigo+"").val(data[i].qtd);
								$("#quantidade"+data[i].codigo+"").val(""+data[i].qtd+"");
								$("#unidade"+data[i].codigo+"").html(""+data[i].unidade+"");
								$("#valor"+data[i].codigo+"").val(''+data[i].preco+'');
								$("#somaqtds"+data[i].codigo+"").html("<strong style='font-size: 18px;'>R$ "+data[i].somaqtd+"</strong>");
								$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
								$("#desc_perc"+data[i].codigo+"").val(''+data[i].desconto_perc+'');
								$("#desc_valor"+data[i].codigo+"").val(''+data[i].desconto_valor+'');
								$(".count"+data[i].codigo+"").html(""+data[i].qtd+"");
								
								if(data[i].msgest != ""){
									$("#s-card-xconteudo li[id='"+data[i].codigo+"'] a").addClass(""+data[i].msgest+"");
								}else{
									$("#s-card-xconteudo li[id='"+data[i].codigo+"'] a").removeClass("carnegativo");
								}

							}
						}
						somtotals = data[i].somtotals;
						
					}
					
							$("#somatotals").html("<strong style='font-size:20px;'>R$ "+somtotals+"</strong>");
							$(".s-card-valototal").html("<strong style='font-size:20px;'>R$ "+somtotals+"</strong>");
											

				}else{
				
					html += '<div class="alert fade in label-info" style="text-align:center;">';					
					html += '<strong>Ops!</strong> '+data[0].info+'.';
					html += '</div>';
					
					$("#items").html(html); 					
				}
				
				totaliza();
				
			},
			error: function(jqXHR, exception){
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
	
});

$(document).on('click','#remover',function(){
	
	var files = '';
	var array = [];
	
	$(".cinput:checked").each(function(){
		//if(this.checked) {
			files = this.value;
			//ids = array.push(files);
			array.push(files);	
			
		//}
	});	
	
	if($("#valor"+files+"").val() == '0,00' || $("#valor"+files+"").val() == ''){
		
		alert('Valor esta vazio!');
		return false;
	}
	
	//alert($("#quantidade"+files+"").val());
	//if($("").val());
	if($("#quantidade"+files+"").val() == '1'){
		 alert('Ops, tentativa errada para remover clica no botao de remover o item!');
		return false;
	}
	
	
	if(files == ''){
		alert('Selecione um Item para adicionar!');		
		return false;
	}else{
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:files,act:'excluir'},
			success: function(data){
				
				var html = "";
				var somtotals = 0;

				
				for (var i = 0; i < data.length; i++) {
												
						
					if(data[i].codigo == files){
							
						if(data[i].qtd == 0){
							  alert('Ops, tentativa errada para remover clica no botao de remover o item!');
							  location.reload();
							  return false;
						}else{
								if(data[i].option1 == 1){
																		
									$("#desc"+data[i].codigo+"").html(""+data[i].descricao+"");
									$("#qtds"+data[i].codigo+"").val(data[i].qtd);
									$("#quantidade"+data[i].codigo+"").val(""+data[i].qtd+"");
									$("#unidade"+data[i].codigo+"").html(""+data[i].unidade+"");
									$("#valor"+data[i].codigo+"").val(''+data[i].preco+'');
									$("#somaqtds"+data[i].codigo+"").html("<strong style='font-size: 18px;'>R$ "+data[i].somaqtd+"</strong>");
									$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
									$("#volume"+data[i].codigo+"").val(''+data[i].volume+'');
									$("#desc_perc"+data[i].codigo+"").val(''+data[i].desconto_perc+'');
									$("#desc_valor"+data[i].codigo+"").val(''+data[i].desconto_valor+'');
									
									if(convertevalores(data[i].volume) > 0){
										$(".count"+data[i].codigo+"").html(""+parseInt(data[i].volume)+"");
									}else{
										$(".count"+data[i].codigo+"").html(""+data[i].qtd+"");
									}

									if(data[i].msgest != ""){
										$("#s-card-xconteudo li[id='"+data[i].codigo+"'] a").addClass(""+data[i].msgest+"");
									}else{
										$("#s-card-xconteudo li[id='"+data[i].codigo+"'] a").removeClass("carnegativo");
									}

								}else{
									
									$("#desc"+data[i].codigo+"").html(""+data[i].descricao+"");
									$("#qtds"+data[i].codigo+"").val(data[i].qtd);
									$("#quantidade"+data[i].codigo+"").val(""+data[i].qtd+"");
									$("#unidade"+data[i].codigo+"").html(""+data[i].unidade+"");
									$("#valor"+data[i].codigo+"").val(''+data[i].preco+'');
									$("#somaqtds"+data[i].codigo+"").html("<strong style='font-size: 18px;'>R$ "+data[i].somaqtd+"</strong>");
									$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
									$("#desc_perc"+data[i].codigo+"").val(''+data[i].desconto_perc+'');
									$("#desc_valor"+data[i].codigo+"").val(''+data[i].desconto_valor+'');
									$(".count"+data[i].codigo+"").html(""+data[i].qtd+"");

									if(data[i].msgest != ""){
										$("#s-card-xconteudo li[id='"+data[i].codigo+"'] a").addClass(""+data[i].msgest+"");
									}else{
										$("#s-card-xconteudo li[id='"+data[i].codigo+"'] a").removeClass("carnegativo");
									}
								}
							}
						}
						somtotals = data[i].somtotals;
						
					}
					
					$("#somatotals").html("<strong style='font-size:20px;'>R$ "+somtotals+"</strong>");
					$(".s-card-valototal").html("<strong style='font-size:20px;'>R$ "+somtotals+"</strong>");
					totaliza();					
			},
			error: function(jqXHR, exception){
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
	
});

$(document).on('click','#deletar',function(){
	
	var files = '';
	var array = [];
	
	$(".cinput:checked").each(function(){
		//if(this.checked) {
			files = this.value;
			//ids = array.push(files);
			array.push(files);	
			
		//}
	});	
	
	$(".count"+files+"").html('0');
	
	if(files == ''){
		alert('Selecione um Item para remover!');		
		return false;
	}else{
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:files,act:'deletar'},
			success: function(data){
				
				if(data[0].sucesso){
				 //location.reload();			
				 MostraCarrinhoFlutuantes();
				}
							
			},
			error: function(jqXHR, exception){
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
	
});
$(document).on('click','#deletarvoltapro',function(){
	
	var files = '';
	var array = [];
	
	$(".cinput:checked").each(function(){
		//if(this.checked) {
			files = this.value;
			//ids = array.push(files);
			array.push(files);	
			
		//}
	});	
		var nomep   = $("#desc"+files+"").html();		
		var	snomep  = nomep.split('</strong>');
 		var xno     = snomep[0].split('<strong>');	
		if(typeof(xno[1]) == 'undefined'){
			xno[1] = nomep;
		}
		var conf = confirm("Deseja substituir o produto "+xno[1]+" ?");
		if(conf == true){
			if(files == ''){
				alert('Selecione um Item para remover!');		
				return false;
			}else{
				$.ajax({
					type:'POST',
					async:false, 
					dataType: "json",
					url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
					data:{id:files,act:'deletar'},
					success: function(data){
						
						if(data[0].sucesso){
							location.href = "../tpl/lista-produtocliente.html";
						}
									
					},
					error: function(jqXHR, exception){
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
		}
});


$(document).on('blur',".desc_perc",function(){
	
	
	var id = $(this).attr('id').split('desc_perc')[1];
	
	if($(this).val() == 0 || $(this).val() == "" || $(this).val() == "0,00"){
		$("#desc_valor"+id+"").attr('disabled',false);
		$("#desc_perc"+id+"").attr('disabled',false);	
		//$("#desc_valor"+id+"").val('');
		//$("#desc_perc"+id+"").val('');
		//return false;
	}
	
	//$("#desc_valor"+id+"").attr('disabled',true);
	//$("#desc_perc"+id+"").attr('disabled',false);
	
	if(convertevalores($(this).val()) > 0){		
		//$("#valor"+id+"").attr('disabled',true);
		
		$("#valor"+id+"").textinput('disable');
	}else{
		//alert("b");
		//$("#valor"+id+"").attr('disabled',false);
		$("#valor"+id+"").textinput('enable');
	}
	
	$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:id,act:'aplicadesconto',desc_perc:$(this).val(),desc_valor:$("#desc_valor"+id+"").val()},
			success: function(data){
				
				var html = "";
				var somtotals = 0;

				if(data[0].info != ''){	
							
					for (var i = 0; i < data.length; i++) {
																		
						if(data[i].codigo == id){
							if(data[i].option1 == 1){		
								$("#desc"+data[i].codigo+"").html(""+data[i].descricao+"");
								$("#qtds"+data[i].codigo+"").val(data[i].qtd);
								$("#quantidade"+data[i].codigo+"").val(""+data[i].qtd+"");
								$("#unidade"+data[i].codigo+"").html(""+data[i].unidade+"");
								$("#valor"+data[i].codigo+"").val(''+data[i].preco+'');
								$("#somaqtds"+data[i].codigo+"").html("<strong style='font-size: 18px;'>R$ "+data[i].somaqtd+"</strong>");
								$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
								$("#volume"+data[i].codigo+"").val(''+data[i].volume+'');
								$("#desc_perc"+data[i].codigo+"").val(''+data[i].desconto_perc+'');
								$("#desc_valor"+data[i].codigo+"").val(''+data[i].desconto_valor+'');
								
							}else{
								
								$("#desc"+data[i].codigo+"").html(""+data[i].descricao+"");
								$("#qtds"+data[i].codigo+"").val(data[i].qtd);
								$("#quantidade"+data[i].codigo+"").val(""+data[i].qtd+"");
								$("#unidade"+data[i].codigo+"").html(""+data[i].unidade+"");
								$("#valor"+data[i].codigo+"").val(''+data[i].preco+'');
								$("#somaqtds"+data[i].codigo+"").html("<strong style='font-size: 18px;'>R$ "+data[i].somaqtd+"</strong>");
								$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
								$("#desc_perc"+data[i].codigo+"").val(''+data[i].desconto_perc+'');
								$("#desc_valor"+data[i].codigo+"").val(''+data[i].desconto_valor+'');
								
							
							}
						}
						somtotals = data[i].somtotals;
						
					}
					
							$("#somatotals").html("<strong style='font-size:20px;'>R$ "+somtotals+"</strong>");
							$(".s-card-valototal").html("<strong style='font-size:20px;'>R$ "+somtotals+"</strong>");
											

				}else{
				
					html += '<div class="alert fade in label-info" style="text-align:center;">';					
					html += '<strong>Ops!</strong> '+data[0].info+'.';
					html += '</div>';
					
					$("#items").html(html); 
					$("#s-card-xconteudo").listview('refresh');
				}
			},
			error: function(jqXHR, exception){
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

/*$(document).on('keyup',".desc_perc",function(){
	
	var id   	  = $(this).attr('id').split('desc_perc')[1];
	var descvalor = parseFloat(convertevalores($("#desc_valor"+id+"").val()));
	var descperc  = convertevalores($(this).val());
	var stot	  = $.trim($("#somaqtds"+id+"").html().replace(/(<([^>]+)>)/ig,"").split('R$')[1]);
	//alert(stot);
	var subtotal  = parseFloat(convertevalores(stot));
	
	if(descperc > 100){
		
		alert("Valor incorreto");
		$(this).val('');
		$(this).focus();
		return false;
	}
		  
	if($(this).val() == 0){
		$("#desc_valor"+id+"").attr('disabled',false);
		$("#desc_perc"+id+"").attr('disabled',false);	
		$("#desc_valor"+id+"").val('');
		//$("#desc_perc"+id+"").val('');	
		return false;
	}
	
	if($(this).val() == ''){
		$("#desc_valor"+id+"").attr('disabled',false);
		$("#desc_perc"+id+"").attr('disabled',false);	
		$("#desc_valor"+id+"").val('');
		//$("#desc_perc"+id+"").val('');	
		return false;
	}
	
	if($(this).val() == "0,00"){
		$("#desc_valor"+id+"").attr('disabled',false);
		$("#desc_perc"+id+"").attr('disabled',false);	
		$("#desc_valor"+id+"").val('');
		//$("#desc_perc"+id+"").val('');	
		alert("aaa");
		return false;
	}
	
	if($(this).val() < 0){
		$("#desc_valor"+id+"").attr('disabled',false);
		$("#desc_perc"+id+"").attr('disabled',false);	
		//$("#desc_valor"+id+"").val('');
		$("#desc_perc"+id+"").val('');	
		
		return false;
	}
	
	descvalor = subtotal * (Math.round(descperc) / 100);

	$("#desc_valor"+id+"").val(''+number_format(descvalor,2,',','.')+'');
	
});*/

/*$(document).on('keyup',".desc_valor",function(){			
	
	var id   	  = $(this).attr('id').split('desc_valor')[1];	
	var descvalor = convertevalores($(this).val());	
	var descperc  = convertevalores($("#desc_perc"+id+"").val());
	var stot	  = $.trim($("#somaqtds"+id+"").html().replace(/(<([^>]+)>)/ig,"").split('R$')[1]);
	var subtotal  = convertevalores(stot);
	
	/*if(descperc > 100){		
		alert("Valor incorreto");
		$(this).val('');
		$("#desc_perc"+id+"").val('');	
		$(this).focus();
		return false;
	}*/
		  
	/*if($(this).val() == 0){
		$("#desc_valor"+id+"").attr('disabled',false);
		$("#desc_perc"+id+"").attr('disabled',false);	
		//$("#desc_valor"+id+"").val('');
		$("#desc_perc"+id+"").val('');	
		return false;
	}
	
	if($(this).val() == ''){
		$("#desc_valor"+id+"").attr('disabled',false);
		$("#desc_perc"+id+"").attr('disabled',false);	
		//$("#desc_valor"+id+"").val('');
		$("#desc_perc"+id+"").val('');	
		return false;
	}
	
	if($(this).val() == "0,00"){		
		$("#desc_valor"+id+"").attr('disabled',false);
		$("#desc_perc"+id+"").attr('disabled',false);	
		//$("#desc_valor"+id+"").val('');
		$("#desc_perc"+id+"").val('');	
		return false;
	}
	
	if($(this).val() < 0){
		$("#desc_valor"+id+"").attr('disabled',false);
		$("#desc_perc"+id+"").attr('disabled',false);	
		//$("#desc_valor"+id+"").val('');
		$("#desc_perc"+id+"").val('');	
		return false;
	}
	//console.log(descvalor);
	descperc = (descvalor / subtotal) * 100;
	$("#desc_perc"+id+"").val(''+number_format(descperc,2,',','.')+'');
	
});*/

var parseFloatIntl = function (value) {
	value = value.replace(/[.]/g, "").replace(",", ".")
	value = parseFloat(value) || 0;
	return value;
}

$(document).on('blur',".desc_valor",function(){
	
	
	var id = $(this).attr('id').split('desc_valor')[1];
	
	if($(this).val() == 0 || $(this).val() == "" || $(this).val() == "0,00"){
		$("#desc_valor"+id+"").attr('disabled',false);
		$("#desc_perc"+id+"").attr('disabled',false);	
		//$("#desc_valor"+id+"").val('');
		//$("#desc_perc"+id+"").val('');	
		//return false;
	}
	
	var descperc  = convertevalores($("#desc_perc"+id+"").val());
	if(descperc > 100){		
		alert("Valor percentual incorreto!");
		$(this).val('');
		$("#desc_perc"+id+"").val('');	
		$(this).focus();
		return false;
	}
	
	//$("#desc_valor"+id+"").attr('disabled',false);
	//$("#desc_perc"+id+"").attr('disabled',true);
	if(convertevalores($(this).val()) > 0){		
		//$("#valor"+id+"").attr('disabled',true);
		$("#valor"+id+"").textinput('disable');
	}else{
		//$("#valor"+id+"").attr('disabled',false);
		$("#valor"+id+"").textinput('enable');
	}
	
	$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:id,act:'aplicadesconto2',desc_perc:$("#desc_perc"+id+"").val(),desc_valor:$(this).val()},
			success: function(data){
				
				var html = "";
				var somtotals = 0;

				if(data[0].info != ''){	
							
					for (var i = 0; i < data.length; i++) {
																		
						if(data[i].codigo == id){
							if(data[i].option1 == 1){		
								$("#desc"+data[i].codigo+"").html(""+data[i].descricao+"");
								$("#qtds"+data[i].codigo+"").val(data[i].qtd);
								$("#quantidade"+data[i].codigo+"").val(""+data[i].qtd+"");
								$("#unidade"+data[i].codigo+"").html(""+data[i].unidade+"");
								$("#valor"+data[i].codigo+"").val(''+data[i].preco+'');
								$("#somaqtds"+data[i].codigo+"").html("<strong style='font-size: 18px;'>R$ "+data[i].somaqtd+"</strong>");
								$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
								$("#volume"+data[i].codigo+"").val(''+data[i].volume+'');
								$("#desc_perc"+data[i].codigo+"").val(''+number_format(data[i].desconto_perc,2,',','.')+'');
								$("#desc_valor"+data[i].codigo+"").val(''+data[i].desconto_valor+'');
								
							}else{
								
								$("#desc"+data[i].codigo+"").html(""+data[i].descricao+"");
								$("#qtds"+data[i].codigo+"").val(data[i].qtd);
								$("#quantidade"+data[i].codigo+"").val(""+data[i].qtd+"");
								$("#unidade"+data[i].codigo+"").html(""+data[i].unidade+"");
								$("#valor"+data[i].codigo+"").val(''+data[i].preco+'');
								$("#somaqtds"+data[i].codigo+"").html("<strong style='font-size: 18px;'>R$ "+data[i].somaqtd+"</strong>");
								$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
								$("#desc_perc"+data[i].codigo+"").val(''+data[i].desconto_perc+'');
								$("#desc_valor"+data[i].codigo+"").val(''+data[i].desconto_valor+'');
								
							
							}
						}
						somtotals = data[i].somtotals;
						
					}
					
							$("#somatotals").html("<strong style='font-size:20px;'>R$ "+somtotals+"</strong>");
							$(".s-card-valototal").html("<strong style='font-size:20px;'>R$ "+somtotals+"</strong>");
											

				}else{
				
					html += '<div class="alert fade in label-info" style="text-align:center;">';					
					html += '<strong>Ops!</strong> '+data[0].info+'.';
					html += '</div>';
					
					$("#items").html(html); 					
				}
			},
			error: function(jqXHR, exception){
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
    
	$('.valor').mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
	$('.desc_valor').mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
	$('#vlunitario').mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
	$('#desconto').mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
	$('#valordesconto').mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
	$('.quanitdade').mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
	$('.volume').mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
	$('#pc').mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
	//$('.desc_valor').mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
	//$('.desc_perc').mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
	
});

$(document).on('click','.quanitdade',function(){	
	$("#"+$(this).attr('id')+"").select();
		
});

$(document).on('click','.volume',function(){	
	$("#"+$(this).attr('id')+"").select();		
});

$(document).on('click','.valor',function(){	
	$("#"+$(this).attr('id')+"").select();		
});

$(document).on('click','.desc_perc',function(){		
	$("#"+$(this).attr('id')+"").select();		
});

$(document).on('click','.desc_valor',function(){		
	$("#"+$(this).attr('id')+"").select();		
});

$(document).on('click','.volume',function(){		
	$("#"+$(this).attr('id')+"").select();		
});

$(document).on('click','#pc',function(){		
	$(this).select();		
});

$(document).on('click','.valor',function(){	
	/*$(this).priceFormat({
		prefix: '',
		centsSeparator: ',',
		thousandsSeparator: '.',
		clearOnEmpty: true
	});	*/
	$(this).mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
});

$(document).on('focus','.valor',function(){	
	/*$(this).priceFormat({
		prefix: '',
		centsSeparator: ',',
		thousandsSeparator: '.',
		clearOnEmpty: true
	});	*/
	$(this).mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
});

$(document).on('focus','.desc_valor',function(){	
	$(this).priceFormat({
		prefix: '',
		centsSeparator: ',',
		thousandsSeparator: '.',
		clearOnEmpty: false
	});	
});

$(document).on('click','.desc_valor',function(){	
	/*$(this).priceFormat({
		prefix: '',
		centsSeparator: ',',
		thousandsSeparator: '.',
		clearOnEmpty: false
	});*/	
	$(this).mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
});


$(document).on('click','.desc_perc',function(){	
	//$(this).val('0,00');	
	/*$(this).priceFormat({
		prefix: '',
		centsSeparator: ',',
		thousandsSeparator: '.',
		clearOnEmpty: false
	});*/	
	$(this).mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
});

$(document).on('focus','.desc_perc',function(){	
	/*$(this).priceFormat({
		prefix: '',
		centsSeparator: ',',
		thousandsSeparator: '.',
		clearOnEmpty: false
	});	*/
	$(this).mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
});


$(document).on('click','.volume',function(){	
	//$(this).val('0,00');	
	/*$(this).priceFormat({
		prefix: '',
		centsSeparator: ',',
		thousandsSeparator: '.',
		clearOnEmpty: false
	});*/	
	$(this).mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
});

$(document).on('focus','.volume',function(){	
	/*$(this).priceFormat({
		prefix: '',
		centsSeparator: ',',
		thousandsSeparator: '.',
		clearOnEmpty: false
	});	*/
	$(this).mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});
});

function MostraCarrinhoFlutuantes(){
	
	$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
		 data:{act:"listar"},
		 dataType:"json",
		 success: function(data){
							
			var html = "";
			var vltotal;
			//html += '';
			for(var i = 0; i < data.length; i++){
				
				if(data[i].info == ''){
					
					if(data[i].msgest != ""){
						var msgest = "class='"+data[i].msgest+"'";
					}else{
						var msgest = "";
					}

					html += '<li id="'+data[i].codigo+'" data-icon="false" class="ui-li-has-thumb ui-first-child">';
					
					html += '<a href="#" '+msgest+'>';							
					html += '<img src="'+data[i].src+'" style="margin-top:30px;margin-left: 30px;">';
					
					
						html += '<div class="ui-radio">';
							html += '<label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-radio-on">';
								html += '<span id="desc'+data[i].codigo+'"><strong>'+data[i].descricao+'</strong></span>';
								html += '<input name="checd" type="radio" class="cinput" value="'+data[i].codigo+'" '+data[i].cks+' />';
							html += '</label>';
						html += '</div>';
					html += '</div><br/>';
					
					if(data[i].option1 == 1){	
						
					
							var blockqtd = data[i].blockqtd == 1 ? 'readonly' : '';

							html += '<div class="inp_car">';
								html += 'Vol.(PC)';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="tel" id="volume'+data[i].codigo+'" class="volume" name="volume'+data[i].codigo+'" style="text-align:center;" data-clear-btn="false"  value="'+data[i].volume+'">';
								html += '</div>';
							html += '</div>';

							
						
						
							html += '<div class="inpx_car">';
								html += 'QTD.('+data[i].unidade+')';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="tel" id="quantidade'+data[i].codigo+'" style="text-align:right;" name="quantidade'+data[i].codigo+'" class="quanitdade" '+blockqtd+'  value="'+data[i].qtd+'">';							
								html += '</div>';							
							html += '</div>';																										
							
												
						
					}else{
							
							var blockqtd = data[i].blockqtd == 1 ? 'readonly' : '';

							html += '<div class="inpx_car">';
								html += 'QTD.('+data[i].unidade+')';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="number" id="quantidade'+data[i].codigo+'" style="text-align:right;" name="quantidade'+data[i].codigo+'" class="quanitdade" '+blockqtd+' value="'+data[i].qtd+'">';							
								html += '</div>';							
							html += '</div>';																										
							
												
					}
						
					
						if(convertevalores(data[i].desconto_perc) > 0){
							var dis = "disabled";
						}else{
							var dis = "";
						}
				
						html += '<div class="inpvl_car">';
							html += 'VALOR.';
							html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';
								html += '<input type="tel" id="valor'+data[i].codigo+'" '+dis+' onBlur="automudapreco(this);" style="text-align:right;" class="valor" value="'+data[i].preco+'" data-mini="true"/>';
							html += '<input type="hidden" id="precolista'+data[i].codigo+'" class="precolista" value="'+data[i].precolista+'" data-mini="true"/>';
							html += '</div>';	
						html += '</div>';
						
						if(data[i].sndesconto == 1){
								
								
							
									
								html += '<div class="inpx_car">';
									html += 'Desc %';
									html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
									html += '<input type="tel" id="desc_perc'+data[i].codigo+'" style="text-align:right;" name="desc_perc'+data[i].codigo+'" class="desc_perc" value="'+data[i].desconto_perc+'">';							
									html += '</div>';							
								html += '</div>';

								html += '<div class="inpx_car">';
									html += 'Desc R$';
									html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
									html += '<input type="tel" id="desc_valor'+data[i].codigo+'" style="text-align:right;" name="desc_valor'+data[i].codigo+'" class="desc_valor" value="'+data[i].desconto_valor+'">';							
									html += '</div>';							
								html += '</div>';
							}
					
	
						html += '<div class="inpxs_car">';
							html += '<br/>';
							html += '<div style="margin-top: -5px; display:inline-block;">';
							html += '<p id="somaqtds'+data[i].codigo+'"><strong style="font-size: 18px;">R$ '+number_format(data[i].somaqtd,2,',','.')+'</strong></p>';
							html += '</div>';
						html += '</div>';
					
					html += '</a>';
						
					html += '</li>';		
						
					vltotal = data[i].somtotal;	
					
				}else{
					
					html += '<div class="alert fade in label-info" style="text-align:center;">';						
						html += '<strong>Ops!</strong> '+data[i].info+'.';
					html += '</div>';
					$(".s-card-valototal").html("<strong style='font-size:20px;'>R$ 0,00</strong>");
									
				}
			}
			if(data[0].info == ''){
				/*html += '<li>';
					html += '<p><strong>Valor Total:</strong></p>';
					html += '<label id="somatotals"><strong>R$ '+vltotal+'</strong></label>';
				html += '</li>';*/
				$("#somatotals").html("<strong style='font-size:20px;'>R$ "+vltotal+"</strong>");
				$(".s-card-valototal").html("<strong style='font-size:20px;'>R$ "+vltotal+"</strong>");
				
			}
			
			$('#s-card-xconteudo').html(html);
			$(".s-card-count").html(data.length - 1);
			$('li[id="undefined"]').css({'display':'none'});
			$("#s-card-xconteudo").listview('refresh');
			$("#s-card-xconteudo").listview().trigger("create");
			//test();
			totaliza();
			$(".kc_fab_overlay").remove();
		},
		error: function(jqXHR, exception){
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

function test() {
			
	//$.mobile.loading('hide');		
	
	$(':mobile-pagecontainer').pagecontainer('change', '#bar',{
		transition: 'slideup',
		changeHash: false,
		reverse: false,
		showLoadMsg:true,
		loadMsgDelay: 20
	});
	
	MostraCarrinhoFlutuantes();
	
	
}



$(document).on('click','.btn-mais',function(){
	
	//alert($(this).attr('data-id'));
	
	
	var files     = $(this).attr('data-id').split('|');	
	var codtptab = $("#idtabelapreco").val();		
	/*if($("#valor"+files+"").val() == '0,00' || $("#valor"+files+"").val() == ''){
		
		alert('Valor esta vazio!');
		return false;
	}*/
	
	if(files[0] == ''){
		alert('Selecione um Item para adicionar!');		
		return false;
	}else{
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{act:"add",id:files[0],idcli:files[1],idtabpreco:codtptab},
			success: function(data){
				
				if(data[0].adicionado == 'ok'){
					//var count = parseInt($(".count"+files[0]+"").html()) + 1;
					$(".count"+files[0]+"").html(data[0].qtd);
					$(".s-card-count").html(data[0].pedqtd);
					totaliza();
				}
			},
			error: function(jqXHR, exception){
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
	
	
	
});


$(document).on('click','.btn-menos',function(){
	
	var files = $(this).attr('data-id');
	
	
	/*if($("#valor"+files+"").val() == '0,00' || $("#valor"+files+"").val() == ''){
		
		alert('Valor esta vazio!');
		return false;
	}*/
	
	if(parseInt($(".count"+files+"").html()) == '0'){
		return false;
	}
	
	if(parseInt($(".count"+files+"").html()) == '1'){
		 //alert('Ops, tentativa errada para remover clica no botao de remover o item!');
		removeritemnomenos(files);
		return false;
	}
	
	
	if(files == ''){
		alert('Selecione um Item para adicionar!');		
		return false;
	}else{
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:files,act:'excluir'},
			success: function(data){
				
				var html = "";
				var somtotals = 0;

				
				for (var i = 0; i < data.length; i++) {
												
						
					if(data[i].codigo == files){
							
						if(data[i].qtd == 0){
							  removeritemnomenos(files);
							  return false;
						}else{
							if(data[i].volume > 0){
								$(".count"+data[i].codigo+"").html(parseInt(data[i].volume));			
							}else{
								$(".count"+data[i].codigo+"").html(data[i].qtd);
							}	
							//var count = parseInt($(".count"+data[i].qtd+"").html()) - 1;
							
						}
					}
					
						
				}
				totaliza();		
				//$(".s-card-count").html(data[0].pedqtd);						
			},
			error: function(jqXHR, exception){
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
	
});

var confmen;
$(document).on('click','.btnfinal',function(){
	
	if($('.alert').hasClass('label-info') == true){
		alert('Sem itens no carrinho para finalizar !! ');
		return false;
	}
	var validlimitecliente = $("#validlimitecliente").val();
	var codcli = $("#codcli").val();
	$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{act:'limitepedido',codcli:codcli},
			success: function(data){
							
				//alert(data[0].total_pedido);
				if(parseFloat(data[0].total_pedido) < 10){
					
					//alert('Valor total do pedido Muito baixo para essa compra!');
					
					confmen = $.confirm({
								title: 'Valor total do pedido Muito baixo para essa compra!',
								content: '<form id="frmvalidcomprabaixa"><input type="hidden" name="act" value="pin"/><input type="hidden" name="ncli" value="'+codcli+'"/><div data-role="ui-field-contain"><label for="textinput-1"><strong>Informe PIN de liberação:</strong></label><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="tel" id="shcli" name="shcli" placeholder="Digite o PIN"></div></div><button type="submit" class="ui-btn ui-shadow" data-ajax="false">VALIDAR</button></form>',
								type: 'red',
								typeAnimated: true,
								buttons: {
									/*tryAgain: {
										text: 'Try again',
										btnClass: 'btn-red',
										action: function(){
										}
									},*/
									close: function () {
										
									}
								}
							});
					
					return false;					
				}else{
				
				 if(data[0].limite > 0){	
						if(parseFloat(data[0].saldo) < 0){
							if(validlimitecliente == 1){
							alert('O Total do Pedido de '+number_format(data[0].total_pedido,2,',','.')+' ultrapassou o limite do cliente '+number_format(data[0].limite,2,',','.')+' ');
							window.location.href = '../tpl/visualizar-pedido.html';	
						}else{
							window.location.href = '../tpl/visualizar-pedido.html';	
						}
							
						}else{
							window.location.href = '../tpl/visualizar-pedido.html';	
						}
					}else{
						window.location.href = '../tpl/visualizar-pedido.html';
					}
				}
				
				
			},
			error: function(jqXHR, exception){
				alert("Lamentamos, mas algo deu errado [btn finalizar]:\r"+jqXHR.responseText+" ");			
			}				
		});
	
	
	
	
});

$(document).on('click','.btnfinal2',function(){
	
	if($('.alert').hasClass('label-info') == true){
		alert('Sem itens no carrinho para finalizar !! ');
		return false;
	}
	var validlimitecliente = $("#validlimitecliente").val();
	var codcli = $("#codcli").val();
	$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{act:'limitepedido',codcli:codcli},
			success: function(data){
							
				//alert(data[0].total_pedido);
				if(parseFloat(data[0].total_pedido) < 10){
					
					//alert('Valor total do pedido Muito baixo para essa compra!');
					
					confmen = $.confirm({
								title: 'Valor total do pedido Muito baixo para essa compra!',
								content: '<form id="frmvalidcomprabaixa"><input type="hidden" name="act" value="pin"/><input type="hidden" name="ncli" value="'+codcli+'"/><div data-role="ui-field-contain"><label for="textinput-1"><strong>Informe PIN de liberação:</strong></label><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="tel" id="shcli" name="shcli" placeholder="Digite o PIN"></div></div><button type="submit" class="ui-btn ui-shadow" data-ajax="false">VALIDAR</button></form>',
								type: 'red',
								typeAnimated: true,
								buttons: {
									/*tryAgain: {
										text: 'Try again',
										btnClass: 'btn-red',
										action: function(){
										}
									},*/
									close: function () {
										
									}
								}
							});
					
					return false;					
				}else{
				
				 if(data[0].limite > 0){	
						if(parseFloat(data[0].saldo) < 0){
							if(validlimitecliente == 1){
							alert('O Total do Pedido de '+number_format(data[0].total_pedido,2,',','.')+' ultrapassou o limite do cliente '+number_format(data[0].limite,2,',','.')+' ');
							window.location.href = '../tpl/visualizar-pedido-alt.html';	
						}else{
							window.location.href = '../tpl/visualizar-pedido-alt.html';	
						}
							
						}else{
							window.location.href = '../tpl/visualizar-pedido-alt.html';	
						}
					}else{
						window.location.href = '../tpl/visualizar-pedido-alt.html';
					}
				}
				
				
			},
			error: function(jqXHR, exception){
				alert("Lamentamos, mas algo deu errado [btn finalizar]:\r"+jqXHR.responseText+" ");			
			}				
		});
	
	
	
	
});

function removeritemnomenos(cod){
	
	$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:cod,act:'deletar'},
			success: function(data){
				
				if(data[0].sucesso){
				 //location.reload();			
				// MostraCarrinhoFlutuantes();
					$(".count"+cod+"").html('0');
					$(".s-card-count").html(data[0].pedqtd);
					totaliza();
				}
							
			},
			error: function(jqXHR, exception){
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

function totaliza(){
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{act:'somageral'},
			success: function(data){
				$("#frt-qtd").html(data[0].qtditem);							
				$("#frt-vl").html(number_format(data[0].total,2,',','.'));
			},
			error: function(jqXHR, exception){
				console.log('Erro: '+jqXHR.status+' - '+jqXHR.responseText);					
			}				
		});
}

function convertevalores(valor2){
	if(valor2 != undefined){
		if(valor2.length > 2 && valor2.length <= 6){
				var valstr2 = parseFloat(valor2.replace(",","."));
		}else{
			var valstr2 = parseFloat(valor2.replace(",",".").replace(".",""));
		}

		return valstr2.toFixed(2);
	}
}
function convertevalores2(valor2){
	var valor3 = (valor2);
	console.log(valor3);
	if(valor3.length > 2 && valor3.length <= 6){
		var valstr2 = parseFloat(valor3.replace(",",".")) / 100;
	}else{
		var valstr2 = parseFloat(valor3.replace(",",".").replace(".","")) / 100;
	}
	
	return valstr2.toFixed(2);
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

