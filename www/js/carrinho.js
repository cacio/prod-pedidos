// JavaScript Document

$(document).ready(function(e) {
    $.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/cliente-exec.php",
		 data:{act:"info"},
		 dataType:"json",
		 success: function(data){
							
			$('#infcli').html(data[0].cod+' - '+data[0].nome);			
			$('#infclimuni').html(data[0].cidade+' - '+data[0].estado);
			
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

					html += '<li id="'+data[i].codigo+'">';
					html += '<div class="ui-radio">';
						html += '<label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-radio-on">';
							html += '<span id="desc'+data[i].codigo+'"><strong>'+data[i].descricao+'</strong></span>';
							html += '<input name="checd" type="radio" class="cinput" value="'+data[i].codigo+'" '+data[i].cks+' />';
						html += '</label>';
					html += '</div>';
					
					if(data[i].option1 == 1){

						var blockqtd = data[i].blockqtd == 1 ? 'readonly' : '';										

						html += '<a href="javascript:void(0);">';
							html += '<div class="inp">';
								html += 'Vol.(PC)';
								html += '<div class="ui-input-text ui-body-inherit ui-corner-all ui-mini ui-shadow-inset">';							
								html += '<input type="number" id="volume'+data[i].codigo+'" class="volume" name="volume'+data[i].codigo+'" style="text-align:center;" data-clear-btn="false"  value="'+data[i].volume+'">';
								html += '</div>';
							html += '</div>';
						html += '</a>';	
							
						
						html += '<a href="javascript:void(0);">';
							html += '<div class="inpx">';
								html += 'QTD.('+data[i].unidade+')';
								html += '<div class="ui-input-text ui-body-inherit ui-corner-all ui-mini ui-shadow-inset">';							
								html += '<input type="tel" id="quantidade'+data[i].codigo+'" style="text-align:right;" name="quantidade'+data[i].codigo+'" class="quanitdade" onkeyup="automanualqtd(this);" '+blockqtd+' value="'+data[i].qtd+'">';							
								html += '</div>';							
							html += '</div>';																										
						html += '</a>';	
					}else{

						var blockqtd = data[i].blockqtd == 1 ? 'readonly' : '';
					
						html += '<a href="javascript:void(0);">';
							html += '<div class="inpx">';
								html += 'QTD.('+data[i].unidade+')';
								html += '<div class="ui-input-text ui-body-inherit ui-corner-all ui-mini ui-shadow-inset">';							
								html += '<input type="number" id="quantidade'+data[i].codigo+'" style="text-align:right;" name="quantidade'+data[i].codigo+'" class="quanitdade" onkeyup="automanualqtd(this);" '+blockqtd+' value="'+data[i].qtd+'">';							
								html += '</div>';							
							html += '</div>';																										
						html += '</a>';					
					
					}
					
					/*html += '<div class="inpx">';
						html += '<br/>';
						html += '<div>';					
							html += '<p><strong>X</strong></p> ';
							html += '<p id="unidade'+data[i].codigo+'"><strong>'+data[i].unidade+'</strong></p>';
						html += '</div>';	
					html += '</div>';*/
					
					html += '<a href="javascript:void(0);">';
					html += '<div class="inpvl">';
						html += 'VALOR.';
						html += '<div class="ui-input-text ui-body-inherit ui-corner-all ui-mini ui-shadow-inset">';
							html += '<input type="tel" id="valor'+data[i].codigo+'" onBlur="automudapreco(this);" style="text-align:right;" class="valor" value="'+data[i].preco+'" data-mini="true"/>';
						html += '</div>';	
					html += '</div>';
					html += '</a>';

					html += '<div class="inpxs">';
						html += '<br/>';
						html += '<div style="margin-top: -5px;">';
						html += '<p id="somaqtds'+data[i].codigo+'"><strong style="font-size: 18px;">R$ '+number_format(data[i].somaqtd,2,',','.')+'</strong></p>';
						html += '</div>';
					html += '</div>';
						
					html += '</li>';		
						
					vltotal = data[i].somtotal;	
					
				}else{
					
					html += '<div class="alert fade in label-info">';
						html += '<button type="button" class="close" data-dismiss="alert">×</button>';
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
			}
			
			$('#items').html(html).show();		
			$('li[id="undefined"]').css({'display':'none'});
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
/* Aqui ao clicar no produto
################################
*/
function pausa() {

		var ck = $('input[class="cinput"]').is(':checked');
			
	
	if(ck == true){
		
		var html = '';
		html += '<div data-role="controlgroup" id="menuadd" data-type="horizontal" class="ui-corner-all ui-controlgroup ui-controlgroup-horizontal" aria-disabled="false" data-disabled="false" data-shadow="false" data-corners="true" data-exclude-invisible="true" data-mini="false" data-init-selector=":jqmData(role="controlgroup")">';
		html += '<div class="ui-controlgroup-controls">';		
		html += '<a href="#" id="adicionar" onClick="adicionarcarrinho('+parseInt($('.cinput').val())+')" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-btn-up-c"><span class="ui-btn-inner"><span class="ui-btn-text"><img src="../jquery-mobile/images/carmais.png"></span></span></a>';
		html += '<a href="#" id="remover"  onClick="diminiercarrinho('+parseInt($('.cinput').val())+')" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c"><span class="ui-btn-inner"><span class="ui-btn-text"><img src="../jquery-mobile/images/cardiminue.png"></span></span></a>';	
		html += '<a href="#" id="deletar" onClick="removercarrinho('+parseInt($('.cinput').val())+')" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-last-child ui-btn-up-c"><span class="ui-btn-inner"><span class="ui-btn-text"><img src="../jquery-mobile/images/cardelete.png"></span></span></a>';			
		html += '</div>';
		html += '</div>';	
		
		
		$(".menuaddcarinho").html(html);
		
	 }

 		clearInterval(limpa);
	}
	
//var limpa = setInterval(pausa, 500);

function clicanoproduto(code){
	//alert(code);
	var html = '';
		html += '<div data-role="controlgroup" id="menuadd" data-type="horizontal" class="ui-corner-all ui-controlgroup ui-controlgroup-horizontal" aria-disabled="false" data-disabled="false" data-shadow="false" data-corners="true" data-exclude-invisible="true" data-mini="false" data-init-selector=":jqmData(role="controlgroup")">';
		html += '<div class="ui-controlgroup-controls">';		
		html += '<a href="#" id="adicionar" onClick="adicionarcarrinho('+parseInt(code)+')" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-btn-up-c"><span class="ui-btn-inner"><span class="ui-btn-text"><img src="../jquery-mobile/images/carmais.png"></span></span></a>';
		html += '<a href="#" id="remover"  onClick="diminiercarrinho('+parseInt(code)+')" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c"><span class="ui-btn-inner"><span class="ui-btn-text"><img src="../jquery-mobile/images/cardiminue.png"></span></span></a>';	
		html += '<a href="#" id="deletar" onClick="removercarrinho('+parseInt(code)+')" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-last-child ui-btn-up-c"><span class="ui-btn-inner"><span class="ui-btn-text"><img src="../jquery-mobile/images/cardelete.png"></span></span></a>';			
		html += '</div>';
		html += '</div>';	
		
		
		$(".menuaddcarinho").html(html);
	
}

/*$(document).ready(function(e) {
	
	
	
    $(".cinput").on("click",function(e){
	
		
		//alert($("#items li").parent());
		var html = '';
		html += '<div data-role="controlgroup" id="menuadd" data-type="horizontal" class="ui-corner-all ui-controlgroup ui-controlgroup-horizontal" aria-disabled="false" data-disabled="false" data-shadow="false" data-corners="true" data-exclude-invisible="true" data-mini="false" data-init-selector=":jqmData(role="controlgroup")">';
		html += '<div class="ui-controlgroup-controls">';		
		html += '<a href="#" id="adicionar" onClick="adicionarcarrinho('+parseInt($(this).val())+')" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-btn-up-c"><span class="ui-btn-inner"><span class="ui-btn-text"><img src="../jquery-mobile/images/carmais.png"></span></span></a>';
		html += '<a href="#" id="remover"  onClick="diminiercarrinho('+parseInt($(this).val())+')" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c"><span class="ui-btn-inner"><span class="ui-btn-text"><img src="../jquery-mobile/images/cardiminue.png"></span></span></a>';	
		html += '<a href="#" id="deletar" onClick="removercarrinho('+parseInt($(this).val())+')" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-last-child ui-btn-up-c"><span class="ui-btn-inner"><span class="ui-btn-text"><img src="../jquery-mobile/images/cardelete.png"></span></span></a>';			
		html += '</div>';
		html += '</div>';	
		
		
		$(".menuaddcarinho").html(html);
		
	});
});*/

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
						
						/*html +='<li id="'+data[i].codigo+'">';
						html +='<label>'+data[i].descricao+'<input type="radio" value="'+data[i].codigo+'" name="checd" class="cinput"/></label>';
						html +='<a href="#" data-container="body" data-toggle="popover" data-placement="top" data-content="<input type="text" name="qtds" id="qtds" value="'+data[i].qtd+'"/>" data-original-title="Quantidade">';
						html +='<span class="badge badge-info">'+data[i].qtd+'X</span>';
						html +='</a>';
						html +='<p>'+data[i].unidade+'</p>';
						html +='<div class="inpvl">';
						html +='input type="text" id="valor" value="'+data[i].preco+'" data-mini="true"/>';
						html +='</div>';
						html +='R$ '+data[i].somaqtd+'';
						html +='</li>';
						somtotals = data[i].somtotals;*/
						
						if(data[i].codigo == files){
							if(data[i].option1 == 1){		
								$("#desc"+data[i].codigo+"").html(""+data[i].descricao+"");
								$("#qtds"+data[i].codigo+"").val(data[i].qtd);
								$("#quantidade"+data[i].codigo+"").val(""+data[i].qtd+"");
								$("#unidade"+data[i].codigo+"").html(""+data[i].unidade+"");
								$("#valor"+data[i].codigo+"").val(''+data[i].preco+'');
								$("#somaqtds"+data[i].codigo+"").html("<strong>R$ "+data[i].somaqtd+"</strong>");
								$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
								$("#volume"+data[i].codigo+"").val(''+data[i].volume+'');

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
								$("#somaqtds"+data[i].codigo+"").html("<strong>R$ "+data[i].somaqtd+"</strong>");
								$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");

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
					/*html +='<li>';
					html +='<p>Valor Total:</p>	';
					html +='<label>R$ '+somtotals+'</label>';
					html +='</li>';*/
					
					//$("#items").html(html); 
						

				}else{
				
					html += '<div class="alert fade in label-info">';
					html += '<button type="button" class="close" data-dismiss="alert">×</button>';
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
									$("#somaqtds"+data[i].codigo+"").html("<strong>R$ "+data[i].somaqtd+"</strong>");
									$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
									$("#volume"+data[i].codigo+"").val(''+data[i].volume+'');

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
									$("#somaqtds"+data[i].codigo+"").html("<strong>R$ "+data[i].somaqtd+"</strong>");
									$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
									
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
				 location.reload();			
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
$(document).ready(function(e) {
    $('.valor').mask("#.##0,00", {reverse: true});
});

$(document).on('click','.quanitdade',function(){

	$("#"+$(this).attr('id')+"").val('');
		
});


$(document).ready(function(){
    var links = [
        {
            "bgcolor":"#1565C0",
            "icon":"<i class='ui-icon-carat-l ui-btn-icon-notext'></i>"			
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
});