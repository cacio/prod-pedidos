// JavaScript Document
var localDB = null;
var caminhoURL = "http://localhost:8080";
var dbox;

$(document).ready(function(e) {
    $( ".cli" ).collapsibleset().trigger('create');	
	$('.produto').listview('refresh');
    $( ".produto" ).collapsibleset().trigger('create');	
	
	onInit();
	
	$('body').on('click', function (e) {
		
		$('[data-toggle="popover"]').each(function () {
			//the 'is' for buttons that trigger popups
			//the 'has' for icons within a button that triggers a popup
			if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
				$(this).popover('hide');
			}
		});
	});
});


function onInit(){
	
    try {
        if (!window.openDatabase) {
            updateStatus("Erro: Seu navegador não permite banco de dados.");
        }
        else {
			
            initDB();			
            createTablesSinc();
			createTablesMetas();
			//ListaFormaPagamento();
        }
    } 
    catch (e) {
        if (e == 2) {
            updateStatus("Erro: Versão de banco de dados inválida.");
        }
        else {
            updateStatus("Erro: Erro desconhecido: " + e + ".");
        }
        return;
    }
}

function initDB(){
    
	var shortName = 'Database';
    var version = '1.0';
    var displayName = 'DBPedidos';
    var maxSize = 65536; // Em bytes
    localDB = window.openDatabase(shortName, version, displayName, maxSize);
		
	
}
function createTables(){
	
    var query = 'CREATE TABLE IF NOT EXISTS CONDICOES_PAGAMENTO (codigo INTEGER PRIMARY KEY AUTOINCREMENT,CODIGO_DA_FORMA VARCHAR,DESCRICAO VARCHAR);';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler);            
        });
    } 
    catch (e) {
        updateStatus("Erro: Data base 'CONDICOES_PAGAMENTO' não criada " + e + ".");
        return;
    }
	

}

function zeratabela(){
	
	var query = 'DROP TABLE IF EXISTS CONDICOES_PAGAMENTO;';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler);
            //updateStatus("Tabela 'contato_clientes_geral' status: OK.");
        });
    } 
    catch (e) {
        updateStatus("Erro: Data base 'CONDICOES_PAGAMENTO' não criada " + e + ".");
        return;
    }
	
}

function createTablesMetas(){
	
    var query = 'CREATE TABLE IF NOT EXISTS METAS (ID INTEGER PRIMARY KEY AUTOINCREMENT,ID_VENDEDOR INTEGER,DATA_COPETENCIA DATE,META FLOAT(10,2),META_ATINGIDA FLOAT(10,2));';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler);            
        });
    } 
    catch (e) {
        updateStatus("Erro: Data base 'METAS' não criada " + e + ".");
        return;
    }	

}
function zeratabelaMETAS(){
	
	var query = 'DROP TABLE IF EXISTS METAS;';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler);
            //updateStatus("Tabela 'contato_clientes_geral' status: OK.");
        });
    } 
    catch (e) {
        updateStatus("Erro: Data base 'METAS' não criada " + e + ".");
        return;
    }
	
}
function createTablesSinc(){
	
    var query = 'CREATE TABLE IF NOT EXISTS sync (ID INTEGER PRIMARY KEY AUTOINCREMENT,DATA DATE);';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler);            
        });
    } 
    catch (e) {
        updateStatus("Erro: Data base 'sync' não criada " + e + ".");
        return;
    }	

}


/* Aqui o clique do adicionar
################################

$(document).ready(function(e) {
   
   $("#adicionar").click(function(){
	 	
		var files = '';
		var array = [];
		
		$(".cinput:checked").each(function(){

			files = this.value;
			//ids = array.push(files);
			array.push(files);	
			
		});
	if(array == ''){
		alert('Selecione um Item para adicionar!');		
		return false;
	}else{
		$.ajax({
			type:'POST',
			url:"../php/carrinho-exec.php",
			data:{id:array,act:'add2'},
			success: function(data){
				location.reload();
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
});*/



/* Função de adicionar no carrinho
################################
*/
function adicionarcarrinho(id){
	
	
	if(id == ''){
		alert('Selecione um Item para adicionar!');		
		return false;
	}else{
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:id,act:'add2'},
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
						
						if(data[i].codigo == id){
								
								$("#desc"+data[i].codigo+"").html(""+data[i].descricao+"");
								$("#qtds"+data[i].codigo+"").val(data[i].qtd);
								$("#quantidade"+data[i].codigo+"").val(""+data[i].qtd+"");
								$("#unidade"+data[i].codigo+"").html(""+data[i].unidade+"");
								$("#valor"+data[i].codigo+"").val(''+data[i].preco+'');
								$("#somaqtds"+data[i].codigo+"").html("<strong>R$ "+data[i].somaqtd+"</strong>");
								$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
								$("#volume"+data[i].codigo+"").val(''+data[i].volume+'');
									
						}
						somtotals = data[i].somtotals;
						
					}
					
							$("#somatotals").html("<strong>R$ "+somtotals+"</strong>");
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
}

/* Função de diminue do carrinho
################################
*/
function diminiercarrinho(id){
	
	//alert(id);
	if(id == ''){
		alert('Selecione um Item para adicionar!');		
		return false;
	}else{
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:id,act:'excluir'},
			success: function(data){
				
				var html = "";
				var somtotals = 0;

				
					for (var i = 0; i < data.length; i++) {
												
						
					if(data[i].codigo == id){
							
						if(data[i].qtd == 0){
							  alert('Ops, tentativa errada para remover clica no botao de remover o item!');
							  location.reload();
							  return false;
						}else{
								$("#desc"+data[i].codigo+"").html(""+data[i].descricao+"");
								$("#qtds"+data[i].codigo+"").val(data[i].qtd);
								$("#quantidade"+data[i].codigo+"").val(""+data[i].qtd+"");
								$("#unidade"+data[i].codigo+"").html(""+data[i].unidade+"");
								$("#valor"+data[i].codigo+"").val(''+data[i].preco+'');
								$("#somaqtds"+data[i].codigo+"").html("<strong>R$ "+data[i].somaqtd+"</strong>");
								$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
								$("#volume"+data[i].codigo+"").val(''+data[i].volume+'');
							}
						}
						somtotals = data[i].somtotals;
						
					}
					
					$("#somatotals").html("<strong>R$ "+somtotals+"</strong>");
							
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
/* Função de remover item do carrinho
################################
*/
function removercarrinho(id){
	
	//alert(id);
	if(id == ''){
		alert('Selecione um Item para remover!');		
		return false;
	}else{
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:id,act:'deletar'},
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
}

/* Função mostrar limte
################################
*/

$(document).ready(function(e) {
    $(".custom").click(function(){
			
		if($(this).is(':checked') == true){
			$(".ld").show();
		}else{
			$(".ld").hide();
		}
		
	});
});


/* Função mostrar carrinho flutuante
################################
*/

function MostraCarrinhoFlutuante(){
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

					html += '<li id="'+data[i].codigo+'" data-icon="false" class="ui-li-has-thumb ui-first-child">';
					
					html += '<a href="#" class="ui-btn">';							
					html += '<img src="'+data[i].src+'" style="margin-top:30px;">';
					
						html += '<div class="ui-radio">';
							html += '<label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-radio-on">';
								html += '<span id="desc'+data[i].codigo+'"><strong>'+data[i].descricao+'</strong></span>';
								html += '<input name="checd" type="radio" class="cinput" value="'+data[i].codigo+'" '+data[i].cks+' />';
							html += '</label>';
						html += '</div>';
					
					
					if(data[i].option1 == 1){	
						
					

							html += '<div class="inp_car">';
								html += 'Vol.(PC)';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="number" id="volume'+data[i].codigo+'" class="volume" name="volume'+data[i].codigo+'" style="text-align:center;" data-clear-btn="false" value="'+data[i].volume+'">';
								html += '</div>';
							html += '</div>';

							
							html += '<div class="inpx_car">';
								html += 'QTD.('+data[i].unidade+')';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="tel" id="quantidade'+data[i].codigo+'" style="text-align:right;" name="quantidade'+data[i].codigo+'" class="quanitdade"  value="'+data[i].qtd+'">';							
								html += '</div>';							
							html += '</div>';																										
												
						
					}else{
																			
							html += '<div class="inpx_car">';
								html += 'QTD.('+data[i].unidade+')';
								html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';							
								html += '<input type="number" id="quantidade'+data[i].codigo+'" style="text-align:right;" name="quantidade'+data[i].codigo+'" class="quanitdade" value="'+data[i].qtd+'">';							
								html += '</div>';							
							html += '</div>';																										
										
					
					}
					
					
				
						html += '<div class="inpvl_car">';
							html += 'VALOR.';
							html += '<div class="ui-input-text ui-corner-all ui-mini ui-shadow-inset" style="border-style: none;">';
								html += '<input type="tel" id="valor'+data[i].codigo+'" onBlur="automudapreco(this);" style="text-align:right;" class="valor" value="'+data[i].preco+'" data-mini="true"/>';
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
				$(".s-card-valototal").html("<strong style='font-size:20px;'>R$ "+vltotal+"</strong>");
				
			}
			
			$('#s-card-xconteudo').html(html);
			$(".s-card-count").html(data.length - 1);
			$('li[id="undefined"]').css({'display':'none'});
			
			// $('#s-card-xconteudo').listview('refresh');
			$("#s-card-xconteudo").listview().trigger("create");
			test();
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

/* Função de finalizar o pedido
################################
*/
$(document).ready(function(e) {
	
    $("#finalizarped").click(function(){
		
		$.mobile.loading( "show", {
		  text: "Aquarde que estavamos finalizando",
		  textVisible: true,
		  theme: "d",
		  html: ""
		});
		
		var date    = new Date();
		var hour    = date.getHours();
		var min     = date.getMinutes();
		var seconds = date.getSeconds();

		var dataentrega = $("#mydate").val();
		var formapag    = $('select[name="formpag"] option:selected').val();
		var obs		    = $("#obs").val();
		var prazo1 		= $("#prazo1").val();
		var prazo2 		= $("#prazo2").val();
		var prazo3 		= $("#prazo3").val();
		var prazo4 		= $("#prazo4").val();
		var prazo5 		= $("#prazo5").val();
		var vdesconto   = $("#desconto").val();
		var retira      = $("#retira").val();
		var nomeretira  = $("#clipdv").val();
		var codcli      = $("#infcli").html().split('-')[0].trim(); 
		var horafixa    = hour+':'+min+':'+seconds;
				

		if(codcli == '03434'){

			if(nomeretira == ""){
				alert("Informar o nome da pessoa ou apelido de quem vai retirar o pedido");
				$.mobile.loading( "hide");
				return false;
			}
		}

		if(retira == ""){
			alert("Informar aonde vai retirar o pedido!");
			return false;
		}
		if(dataentrega != "" && formapag != ""){
			window.localStorage.removeItem("obs");
			$.ajax({
				url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
				type:'POST',
				data:{act:'finalizar',
					  dtentrega:dataentrega,
					  formpag:formapag,
					  prazo1:prazo1,
					  prazo2:prazo2,
					  prazo3:prazo3,
					  prazo4:prazo4,
					  prazo5:prazo5,
					  obs:obs,
					  desconto:vdesconto,
					  retira:retira,
					  clipdv:nomeretira,
					  horafixa:horafixa},
				success: function(data){
				
					var arr = $.parseJSON(data);
					
					$.mobile.loading( "hide");
					
					$.confirm({
						title: 'PEDIDO',
						content: '<div align="center"><img src="../img/sucess.png"/></div><br/><strong>'+arr[0].msg+'<br/> Clique em <mark>[FINALIZAR]</mark></strong>',
						type: 'green',
						typeAnimated: true,
						buttons: {
							/*tryAgain: {
								text: 'ENVIAR AGORA',
								btnClass: 'btn-blue',
								action: function(){
									MoverArquivoSelecionado(arr[0].id);
									
									$.ajax({
										type: 'POST',
										 url: ""+caminhoURL+"/PROJETOS/webservice_pedido/php/sincronizar-exec.php",
										data: {act:'buscarxml'},	
										beforeSend: function(){
											$( "[data-role='panel']" ).panel( "close" );

											dbox = $.dialog({
												title: 'Aguarde enquanto envio seus pedidos !',
												content: '<div align="center"><img src="../img/ajax_loading.gif" /></div>',
											});
											
										},	
										cache: false,
										dataType: 'json',			
										success: function(data){		

											var ret;										
											var retop;
											var mensag = "";
											for(var i =0; i < data.length; i++){

												if(data[i].msg != ''){
													mensag = data[i].msg; 			
												}else{

													 retop = MandPedidoAgora(data[i].act,data[i].xml);

													 //alert(print_r(retop));

													if(retop == 1){
														mensag = "Desculpe, Não foi possivel acessar o servidor.";
														break;				
													}
													 ret  = RetornoPedidoAgora(retop);

													 mensag += ret;
												}

											}
											//$.mobile.loading("hide");
											dbox.close();
											alert(mensag);
											
											location.href = "../tpl/lista-pedidosfeitos.html";
										 },
										error: function(data){						
											$.confirm({
												title: 'Ops!',
												content: 'Desculpa o transtorno , Ligue para nossa central de atendimento<br/>para que possamos identificar o erro que esta ocorrendo<br/>assim podemos ter uma melhor convivencia :D',
												type: 'red',
												typeAnimated: true,
												buttons: {
													tryAgain: {
														text: 'FECHAR',
														btnClass: 'btn-red',
														action: function(){
														}
													}
												}
											});

										}
									});
									
									
									
									return false;
								}
							},*/
							finalizar: {
								text: 'FINALIZAR',
								btnClass: 'btn-green',
								action: function(){
									location.href = "../tpl/lista-pedidosfeitos.html";
								}
							},
						}
					});															
										
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
		}else{
			alert("Selecione uma data de entrega!");
			$.mobile.loading( "hide");
		}
	});
});

function MoverArquivoSelecionado(id){		
	
	var retorn;
	var files = '';
	var array = [];
	
	files = id;		
	//array.push(files);
	array.push({
			'id':files,
			'order':1
		});
	
	$.ajax({
		type:'POST',
		async:false, 
		url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/sincronizar-exec.php",
		data:{act:'mover',arr:array},
		success: function(data){
			retorn = 'ok';	
		},
		error:function(data){


		}
	});
	
	return retorn;
	
}


function MandPedidoAgora(act,xml){
		
		var empresa = $("#empresa").val();
		var retorno;		
		var data = {
			act:''+act+'',
			xml:xml
		};
		
		$.ajax({
			type:'POST',
			async: false, 
			dataType: "json",
			url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
			data:data,
			beforeSend: function(){
				$( "[data-role='panel']" ).panel( "close" );								
			},
			success: function(data){
				
				retorno = data;
				
			},
			error:function(jqXHR, exception){
			
			retorno = 1;							
			$.confirm({
				title: 'Ops!',
				content: '<strong>Desculpe(a), Servidor não teve um retono,</strong><br/> <mark>Peso que retorne a enviar seus pedidos daqui alguns minutos!</mark><br/> Detalhamento: <br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+' ',
				type: 'red',
				typeAnimated: true,
				buttons: {
					tryAgain: {
						text: 'FECHAR',
						btnClass: 'btn-red',
						action: function(){
						}
					}
				}
			});	
				
				
				
			}
		});
		
		return retorno;
}

function RetornoPedidoAgora(dat){
		
		var retorno;		
		$.ajax({
			type:'POST',
			async:false, 
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/sincronizar-exec.php",
			data:{act:'enviar',arr:dat},
			success: function(data){
				
				retorno = data;
				
			},
			error:function(data){
				
				
			}
		});
		
		return retorno;
}



/* Função de finalizar o pedido
################################
*/
$(document).ready(function(e) {
	
    $("#finalizarpedalteracao").click(function(){
		
		$.mobile.loading( "show", {
		  text: "Aquarde que estavamos finalizando",
		  textVisible: true,
		  theme: "d",
		  html: ""
		});

		var date    = new Date();
		var hour    = date.getHours();
		var min     = date.getMinutes();
		var seconds = date.getSeconds();

		var dataentrega = $("#mydate").val();
		var formapag    = $('select[name="formpag"] option:selected').val();
		var prazo1 		= $("#prazo1").val();
		var prazo2 		= $("#prazo2").val();
		var prazo3 		= $("#prazo3").val();
		var prazo4 		= $("#prazo4").val();
		var prazo5 		= $("#prazo5").val();
		var obs		    = $("#obs").val();
		var vdesconto   = $("#desconto").val();
		var retira      = $("#retira").val();
		var nomeretira  = $("#clipdv").val();
		var codcli      = $("#infcli").html().split('-')[0].trim(); 
		var horafixa    = hour+':'+min+':'+seconds;

		if(codcli == '03434'){

			if(nomeretira == ""){
				alert("Informar o nome da pessoa ou apelido de quem vai retirar o pedido");
				$.mobile.loading( "hide");
				return false;
			}
		}

		if(retira == ""){
			alert("Informar aonde vai retirar o pedido!");
			$.mobile.loading( "hide");
			return false;
		}
		

		if(dataentrega != ""){
			window.localStorage.removeItem("obs");
			$.ajax({
				url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
				type:'POST',
				data:{act:'finalizaralter',
					  dtentrega:dataentrega,
					  formpag:formapag,
					  prazo1:prazo1,
					  prazo2:prazo2,
					  prazo3:prazo3,
					  prazo4:prazo4,
					  prazo5:prazo5,
					  obs:obs,
					  desconto:vdesconto,
					  retira:retira,
					  clipdv:nomeretira,
					  horafixa:horafixa},
				success: function(data){
									
					var arr = $.parseJSON(data);
					
					$.mobile.loading( "hide");
					
					$.confirm({
						title: 'PEDIDO',
						content: '<div align="center"><img src="../img/sucess.png"/></div><br/><strong>'+arr[0].msg+'<br/> Clique em <mark>[FINALIZAR]</mark></strong>',
						type: 'green',
						typeAnimated: true,
						buttons: {
							/*tryAgain: {
								text: 'ENVIAR AGORA',
								btnClass: 'btn-blue',
								action: function(){
									MoverArquivoSelecionado(arr[0].id);
									
									$.ajax({
										type: 'POST',
										 url: ""+caminhoURL+"/PROJETOS/webservice_pedido/php/sincronizar-exec.php",
										data: {act:'buscarxml'},	
										beforeSend: function(){
											$( "[data-role='panel']" ).panel( "close" );

											dbox = $.dialog({
												title: 'Aguarde enquanto envio seus pedidos !',
												content: '<div align="center"><img src="../img/ajax_loading.gif" /></div>',
											});
											
										},	
										cache: false,
										dataType: 'json',			
										success: function(data){		

											var ret;										
											var retop;
											var mensag = "";
											for(var i =0; i < data.length; i++){

												if(data[i].msg != ''){
													mensag = data[i].msg; 			
												}else{

													 retop = MandPedidoAgora(data[i].act,data[i].xml);

													 //alert(print_r(retop));

													if(retop == 1){
														mensag = "Desculpe, Não foi possivel acessar o servidor.";
														break;				
													}
													 ret  = RetornoPedidoAgora(retop);

													 mensag += ret;
												}

											}
											//$.mobile.loading("hide");
											dbox.close();
											alert(mensag);
											
											location.href = "../tpl/lista-pedidosfeitos.html";
										 },
										error: function(data){						
											$.confirm({
												title: 'Ops!',
												content: 'Desculpa o transtorno , Ligue para nossa central de atendimento<br/>para que possamos identificar o erro que esta ocorrendo<br/>assim podemos ter uma melhor convivencia :D',
												type: 'red',
												typeAnimated: true,
												buttons: {
													tryAgain: {
														text: 'FECHAR',
														btnClass: 'btn-red',
														action: function(){
														}
													}
												}
											});

										}
									});
									
									
									
									return false;
								}
							},*/
							finalizar: {
								text: 'FINALIZAR',
								btnClass: 'btn-green',
								action: function(){
									location.href = "../tpl/lista-pedidosfeitos.html";
								}
							},
						}
					});
					
					
					
					//$.mobile.loading( "hide");
					
					//alert(data);
					
					//location.href = "../tpl/lista-pedidosfeitos.html";
					
					
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
		}else{
			alert("Selecione uma data de entrega!");
			$.mobile.loading( "hide");
		}
	});
});


 
  /* Chmando a função adicionar a primeira no carrinho
	####################################
 */
  function adicionaprimeiranocarrinho(cod,cli){
		
	  	if(cod == ''){
			alert("Ops, Produto sem codigo,Por gentileza Vefique esse produto em seu sistema!");
			return false;
		} 
	  
		$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
		 data:{act:"add",id:cod,idcli:cli},
		 dataType:"json",
		 success: function(data){
							
			if(data[0].adicionado == 'ok'){
				//window.location.href = '../tpl/pedido.html';
				MostraCarrinhoFlutuante();
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
 	 function adicionaprimeiranocarrinho2(cod,cli){
		
		if(cod == ''){
			alert("Ops, Produto sem codigo,Por gentileza Vefique esse produto em seu sistema!");
			return false;
		} 
		 
		$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
		 data:{act:"add",id:cod,idcli:cli},
		 dataType:"json",
		 success: function(data){
							
			if(data[0].adicionado == 'ok'){
				//window.location.href = '../tpl/pedidoalt.html';
				MostraCarrinhoFlutuante();
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
 
  /* Chmando a função que lista os produtos
	####################################
 */
 
 function inforclietenum(cod){
	$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/cliente-exec.php",
		 data:{act:"info",codcli:cod},
		 dataType:"json",
		 success: function(data){
							
			$('#infcli').html(data[0].cod+' - '+data[0].nome);						 			
			$('#infclimuni').html(data[0].cidade+' - '+data[0].estado);
			$('#codc').val(data[0].cod);  
			$('#codcli').val(data[0].cod);
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
  /* Chmando a função que lista os produtos
	####################################
 */
$(document).ready(function(e) {
   
	var url  = window.location.search.replace("?", "");
    var parm = url.split("=");
    var cl   = $("#codcli").val();
	
	$('#codc').val(parm[1]);  
	$('#codcli').val(parm[1]);
	
	if(parm[0] == 'codcli' || cl == 'codcli'){
			
		inforclietenum(parm[1]);		
		
	}
	
	var pathArray = window.location.pathname.split('/');
	var newPathname = "";
	for (i = 0; i < pathArray.length; i++) {
	  newPathname += "/";
	  newPathname += pathArray[i];
		//alert(pathArray[i]);
		if(pathArray[i] == 'lista-produtoclientealt.html'){									
						
			inforclietenum('');
		}
	}
	
});
 
 /* Função de esconder e aparecer filtro por data
	##############################################
 */
 
$(document).ready(function(e) {
	
	/*$(".view-more").click(function(){
		$(".ftrdata").slideToggle("slow");		
		$('[data-type="search"]').focus();
	});
	
	$(".abre").click(function(){
		alert("abre");
		$(".view-more").addClass("fecha");
		$(".view-more").removeClass("abre");
		$(".ftrdata").slideToggle("slow");
		$('[data-type="search"]').focus();
	});*/
		
	
});

$(document).on('click','.abre',function(){
	
		$(".view-more").addClass("fecha");
		$(".view-more").removeClass("abre");
		$(".ftrdata").slideDown();
		$('[data-type="search"]').focus();
		$(".filter-icon").css({
		  '-webkit-transform': 'rotate(-178deg)',
		  '-moz-transform': 'rotate(-178deg)',
		  '-ms-transform': 'rotate(-178deg)',
		  '-o-transform': 'rotate(-178deg)',
		  'transform': 'rotate(-178deg)',
		});
});

$(document).on('click','.fecha',function(){
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
});

/* Função de Atualização de dados
	##############################################
 */
 
 	
	
	
$(document).ready(function(e) {
	
	$(".atualizarcliente").click(function(){
	
	$.ajax({
		type:'POST',
		async:false, 
		dataType: "json",
		url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/exporta-exec.php",
		data:{act:'ping'},
		success: function(data){
		
			if(data[0].msg == 'on'){
				exportaclientebd();
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
	    
});


function BuscaCondPag(){
	var empresa = $("#empresa").val();
	$.ajax({
		type:'POST',
		async:false, 
		dataType: "json",
		url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
		data:{act:'condpag'},
		success: function(data){
		
			zeratabela();
			createTables();		
						
			for(var i = 0; i < data.length; i++){
					
					var codigo   = data[i].codigo;	
					var descrica = data[i].descricao;
				
							
					inserircondpag(codigo,descrica);
					
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


function inserircondpag(cod,desc){

	var query = "insert into CONDICOES_PAGAMENTO (CODIGO_DA_FORMA, DESCRICAO) VALUES (?, ?);";
	try {
		localDB.transaction(function(transaction){
			transaction.executeSql(query, [cod, desc], function(transaction, results){
				if (!results.rowsAffected) {
					updateStatus("Erro: Inserção não realizada");
				}
				else {
					
					var cod  = '';	
					var desc = '';
																				
				}
			}, errorHandler);
		});
	} 
	catch (e) {
		updateStatus("Erro: INSERT não realizado " + e + ".");
	}
	
			
}

function exportaclientebd(){
	
	
	$.ajax({
			 type: 'POST',
			 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/exporta-exec.php",
			 data:{act:'cliente'},
			 beforeSend: function(){
				$.mobile.loading( 'show', {
					text: 'Exportando Cliente para DATABASE...',
					textVisible: true,
					theme: 'b',
					html: "Exportando Cliente para DATABASE..."
				});		 
			 },
			 success: function(data){
								
				//alert(data);
				$.mobile.loading( 'hide');	
				$("#resp").html(data);
				
																									
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
	

function importaprodutos(){
	
	$.ajax({
			 type: 'POST',
			 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/exportar-exec.php",
			 data:{RadioGroup1:'2'},
			 beforeSend: function(){
				$.mobile.loading( 'show', {
					text: 'Exportando Produto...',
					textVisible: true,
					theme: 'b',
					html: "Exportando Produto..."
				});		 
			 },
			 success: function(data){
								
				//alert(data);
				$.mobile.loading( 'hide');	
				$("#resp").html(data);
				
																					
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

function importaprodutosdb(){
	
	$.ajax({
			 type: 'POST',
			 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/exporta-exec.php",
			 data:{act:'produto'},
			 beforeSend: function(){
				$.mobile.loading( 'show', {
					text: 'Exportando Produto para o DATABASE...',
					textVisible: true,
					theme: 'b',
					html: "Exportando Produto para o DATABASE..."
				});		 
			 },
			 success: function(data){
								
				//alert(data);
				$.mobile.loading( 'hide');	
				$("#resp").html(data);
				
																									
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




function cancacelarpedidos(){
	var conf = confirm("[Abandonar pedido?],\nDeseja sair deste pedido sem salvar? ");
		if(conf == true){
		
		
			$.ajax({
				type:'POST',
				url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
				data:{act:'cancelar'},
				success: function(){
												
					window.location.href = "admin.html";
					
				}			
			});
		
	
	}else{
	
	
	}

}
$(document).ready(function(e) {
	
	$("#cancelarpedido").click(function(){
			var conf = confirm("Deseja realmente cancelar esse pedido?");
			if(conf == true){
				$.ajax({
					type:'POST',
					url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
					data:{act:'cancelar'},
					success: function(){
						alert("Pedido cancelado!");
						window.localStorage.removeItem("obs");
						window.location.href = "admin.html";
					}			
				});
			}
	  });
	
	$("#cancelarpedidoalt").click(function(){
			var conf = confirm("Deseja realmente abortar a Alteração?");
			if(conf == true){
				$.ajax({
					type:'POST',
					url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
					data:{act:'cancelar'},
					success: function(){
						window.localStorage.removeItem("obs");		
						window.location.href = "lista-pedidosfeitos.html";
					}			
				});
			}
	  });
});

/* Função de adicionar no carrinho
################################
*/

$(document).on('keyup','.quanitdade',function(){
	
	//var ck = $('input[class="cinput"]').is(':checked');	
	var tq  = $(this).attr('id').split('quantidade');	
	var id  = tq[1];	
	//alert(id);
	//var qtd =
	var quanti = $(this).val();
	/*if($(this).val() > "" && $(this).val() > 0){			
		var quanti = $(this).val();		
	}else{
		alert("aaa");	
		return false;
	}*/
	
	if($("#valor"+id+"").val() == '0,00' || $("#valor"+id+"").val() == ''){
		
		alert('Valor esta vazio!');
		return false;
	}
	
	if(id == ''){
		alert('Selecione um Item para adicionar!');		
		return false;
	}else{
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:id,quantidade:quanti,act:'quantidade'},
			success: function(data){
				
				var html = "";
				var somtotals = 0;

				if(data[0].info != ''){	
					for (var i = 0; i < data.length; i++) {
						
												
						if(data[i].codigo == id){
							if(data[i].option1 == 1){	
								$("#desc"+data[i].codigo+"").html(""+data[i].descricao+"");
								$("#qtds"+data[i].codigo+"").val(data[i].qtd);
								//	$("#quantidade"+data[i].codigo+"").val(""+data[i].qtd+"");
								$("#unidade"+data[i].codigo+"").html(""+data[i].unidade+"");
								$("#valor"+data[i].codigo+"").val(''+data[i].preco+'');
								$("#somaqtds"+data[i].codigo+"").html("<strong style='font-size: 18px;'>R$ "+data[i].somaqtd+"</strong>");
								$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
								$("#volume"+data[i].codigo+"").val(''+data[i].volume+'');
								$("#desc_perc"+data[i].codigo+"").val(''+data[i].desconto_perc+'');
								$("#desc_valor"+data[i].codigo+"").val(''+data[i].desconto_valor+'');
								if(data[i].volume > 0){
									$(".count"+data[i].codigo+"").html(parseInt(data[i].volume));
								}else{
									$(".count"+data[i].codigo+"").html(data[i].qtd);
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
function automanualqtd(qtd){
		
	//var ck = $('input[class="cinput"]').is(':checked');	
	var tq  = qtd.id.split('quantidade');	
	var id  = tq[1];	
	//var qtd =
	if(qtd.value > "" && qtd.value > 0){			
		var quanti = qtd.value;		
	}else{

		return false;
	}
	
	if($("#valor"+id+"").val() == '0,00' || $("#valor"+id+"").val() == ''){
		
		alert('Valor esta vazio!');
		return false;
	}
	
	if(id == ''){
		alert('Selecione um Item para adicionar!');		
		return false;
	}else{
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:id,quantidade:quanti,act:'quantidade'},
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
}
var confmen;
function precomenor(prec){
	
		
	var vl 		  = convertevalores($(prec).val());
	var id 		  = $(prec).parents('li').attr('id');
	var precolist = convertevalores($("#precolista"+id+"").val()); 
	var codigo	  = $("#codc").val();
		
	if(parseFloat(vl) < parseFloat(precolist)){
			
		$(".btn-finalizar").hide();
		confmen = $.confirm({
			title: 'Preço a menor do que esta!',
			content: '<form id="frmativarclipreco"><input type="hidden" name="act" value="pin"/><input type="hidden" name="ncli" value="'+codigo+'"/><div data-role="ui-field-contain"><label for="textinput-1"><strong>Informe PIN de liberação:</strong></label><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="tel" id="shcli" name="shcli" placeholder="Digite o PIN"></div></div><button type="submit" class="ui-btn ui-shadow" data-ajax="false">VALIDAR</button></form>',
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
					$(prec).val(number_format(precolist,2,',','.'));
					automudapreco(prec);
					$(".btn-finalizar").show();
				}
			}
		});
		
		
		return false;
	}
		
}

$(document).on('submit','form[id="frmativarclipreco"]',function(){	
	
	  var $form = $(this);
	  var params = $form.serialize();	
				
	   $.ajax({
		 type: 'POST',
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/duplicatas-exec.php",
		 data:params,
		 beforeSend: function(){
			$.mobile.loading( 'show', {
				text: 'Aquarde!',
				textVisible: true,
				theme: 'b',
				html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde..</div>"
			});	
		 },
		 cache:false,
		 dataType: "json",
		 success: function(data){
			 
			$.mobile.loading("hide");
			
			if(data[0].pin == data[0].snh){
				//alert(data[0].ncli)
			   $(".btn-finalizar").show();
				confmen.close();
				return true;
				
			}else{										
						 	
				$.confirm({
					title: 'Erro de validação',
					content: 'Código PIN inválido!<br/> Entre em contato com o financeiro para liberação do PIN!',
					autoClose: 'confirm|10000',
					cancelButton: false, 					
				});	
					
			}
																								
		},
		error: function(jqXHR, exception){
			var alerta = $.alert({
			title: 'Ops!',
			content: '<div align="center">Ocorreu um Erro inesperado, Por Favor entre em contato com o suporte!<br/><img src="../img/sad.png"/></div>',
			confirmButton:'OK',
			confirm: function(){
				alerta.close();
			}
		});	
		}	
	});		
			
			
	return false;
});

function automudapreco(prec){
		
	//var ck = $('input[class="cinput"]').is(':checked');	
	var t = prec.id.split('valor');
	var id  = t[1];	
	
	if($("#validprecomenor").val() == 1){
		precomenor(prec);	
	}
	
	

	var preco = prec.value;		
	
	if(preco != $("#precolista"+id+"").val()){
		$("#desc_valor"+id+"").attr('disabled',true);
		$("#desc_perc"+id+"").attr('disabled',true);
	}else{
		$("#desc_valor"+id+"").attr('disabled',false);
		$("#desc_perc"+id+"").attr('disabled',false);
	}
	
	var comparamax = PrecoMaximo($("#precolista"+id+"").val(),preco);

	if(comparamax == false){
		$("#valor"+id+"").val($("#precolista"+id+"").val());
		$("#valor"+id+"").focus();
		return false;	
	}

	if($('#tabpreco').val() == 1){
		var compara = comparavalormargem($("#precolista"+id+"").val(),preco);
	
		if(compara == false){
			$("#valor"+id+"").val($("#precolista"+id+"").val());
			$("#valor"+id+"").focus();
			return false;
		}
	}
	
	if(preco != ""){
		//return false;	
	
	
	if(id == ''){
		alert('Selecione um Item para adicionar!');		
		return false;
	}else{
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:id,preco:preco,act:'alterapreco'},
			success: function(data){
				
				var html = "";
				var somtotals = 0;

				if(data[0].info != ''){	
					for (var i = 0; i < data.length; i++) {
						
												
						if(data[i].codigo == id){
								
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
						somtotals = data[i].somtotals;
						
					}
					
							$("#somatotals").html("R$ "+somtotals+"");
			
							$(".s-card-valototal").html("<strong style='font-size:20px;'>R$ "+somtotals+"</strong>");

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
	}
}

function comparavalormargem(precolist,preco){
	
	var indica   = $("#margemprodperc").val(); 
	var valor    = convertevalores(precolist);
	var precos   = convertevalores(preco);

	if(indica == 0){
		var marge    = (parseFloat($("#margemprod").val()) / 100);
		var calc     = valor * marge;  	
		var precomin = number_format(parseFloat(valor) - parseFloat(calc),2,',','.');
		var precomax = number_format(parseFloat(valor) + parseFloat(calc),2,',','.');
		

		var precomin2 = convertevalores(precomin);
		var precomax2 = convertevalores(precomax);

		//alert(precomin+'  '+precomax+' '+precos+' '+valor);
		//alert(precos+' '+convertevalores(precomin));
		//console.log(precos +' '+ convertevalores(precomax));
		if(parseFloat(precos) < parseFloat(precomin2)){

			$.confirm({
					title: 'validação',
					content: 'Preço informado é menor que o preço minimo : '+precomin+' ',
					autoClose: 'confirm|10000',
					cancelButton: false, 					
				});	

			return false;
		}else if(parseFloat(precos) > parseFloat(precomax2)){
			
			$.confirm({
					title: 'validação',
					content: 'Preço informado é maior que o preço maximo : '+precomax+' ',
					autoClose: 'confirm|10000',
					cancelButton: false, 					
				});	

			return false;
		}
	}else{
		
		var valormarge = parseFloat($("#margemprod").val());
		var precomin   = number_format(parseFloat(valor) - parseFloat(valormarge),2,',','.');
		var precomin2  = convertevalores(precomin);

		if(parseFloat(precos) < parseFloat(precomin2)){

			$.confirm({
				title: 'validação',
				content: 'Preço informado é menor que o preço minimo : '+precomin+' ',
				autoClose: 'confirm|10000',
				cancelButton: false, 					
			});	

			return false;
		}

	}
	
}

function PrecoMaximo(precolist,preco){
	
	var indica   = $("#perclimitprecoprodutos").val(); 
	var valor    = convertevalores(precolist);
	var precos   = convertevalores(preco);

	if(indica > 0){
		var marge     = (parseFloat($("#perclimitprecoprodutos").val()) / 100);
		var calc      = valor * marge;  	
		
		var precomax  = number_format(parseFloat(valor) + parseFloat(calc),2,',','.');		

		var precomax2 = convertevalores(precomax);
		

	 if(parseFloat(precos) > parseFloat(precomax2)){
			
			$.confirm({
					title: 'validação',
					content: 'Preço informado é maior que o preço maximo : '+precomax+' ',					
					cancelButton: false, 					
				});	

			return false;
		}
	}
	
}

$(document).on('keyup','.volume',function(){	
	
			
	if($(this).val() != ""){		
	
		if($(this).val() != 0){	
		
		var cod = $(this).attr('id').split('volume');
		
		//alert(cod[1]);	
		if($("#valor"+cod[1]+"").val() == '0,00' || $("#valor"+cod[1]+"").val() == ''){
		
			alert('Valor esta vazio!');
			return false;
		}
		
		var volu = convertevalores($(this).val());
		//alert(volu+" - "+volu.substr(-2));
		if( (volu.substr(-2) != '50') && (volu.substr(-2) != '00') ){
			alert("Informação invalida! Caso queira colocar MEIO informe esse valor no campo 0,50");
			//alert(cod[1]);	
			//$("#volume"+cod[1]+"").val('0,50');
			//$("#volume"+cod[1]+"").keyup();
			return false;
		}
		
			
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:cod[1],vlm:$(this).val(),act:'volume'},
			success: function(data){
				
				var html = "";
				var somtotals = 0;

				if(data[0].info != ''){	
					for (var i = 0; i < data.length; i++) {
																	
						if(data[i].codigo == cod[1]){
								
								$("#desc"+data[i].codigo+"").html(""+data[i].descricao+"");
								$("#qtds"+data[i].codigo+"").val(data[i].qtd);
								$("#quantidade"+data[i].codigo+"").val(""+data[i].qtd+"");
								$("#unidade"+data[i].codigo+"").html(""+data[i].unidade+"");
								$("#valor"+data[i].codigo+"").val(''+data[i].preco+'');
								$("#somaqtds"+data[i].codigo+"").html("<strong style='font-size: 18px;'>R$ "+data[i].somaqtd+" </strong>");
								$("#quantidade"+data[i].codigo+"").html(""+data[i].qtd+"X");
								$("#desc_perc"+data[i].codigo+"").val(''+data[i].desconto_perc+'');
								$("#desc_valor"+data[i].codigo+"").val(''+data[i].desconto_valor+'');	

								if(data[i].msgest != ""){
									$("#s-card-xconteudo li[id='"+data[i].codigo+"'] a").addClass(""+data[i].msgest+"");
								}else{
									$("#s-card-xconteudo li[id='"+data[i].codigo+"'] a").removeClass("carnegativo");
								}

								if(data[i].volume > 0){	
									$(".count"+data[i].codigo+"").html(parseInt(data[i].volume));
								}else{
									$(".count"+data[i].codigo+"").html(parseInt(data[i].qtd));
								}
						}
						somtotals = data[i].somtotals;
						
					}
					
							$("#somatotals").html("R$ "+somtotals+"");
							$(".s-card-valototal").html("<strong style='font-size:20px;'>R$ "+somtotals+"</strong>");
						

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
		
		}else{
			return false;	
		}
	}else{
	
		return false;
	}
	
});

$(document).ready(function(e) {
    	
		$(".sair").click(function(){	
			$.ajax({
			 type: 'POST',
			 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/login-exec.php",
			 data:{act:'logout'},
			 success: function(data){
								
				window.location.href = '../index.html';
																									
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
		
});
$(document).ready(function(e) {
    $("#pedm").click(function(){
		
		$("body").append('<div class="kc_fab_overlay"></div>');
		var conn = navigator.onLine;
		
		$.mobile.loading( "show", {
		  text: "Buscando Clientes.....",
		  textVisible: true,
		  theme: "b",
		  html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Buscando Clientes.....</div>"
		});
		if(conn == true){
			eventos.buscaclientebloqueado();		
		}else{
			alert(ret['msg']);
		}
		window.location.href = "../tpl/pedido-cliente.html";				
		
	});
});
$(document).on('click','#voltar',function(){
		
		
		$(':mobile-pagecontainer').pagecontainer('change', '#clientes',{
			transition: 'slideup',
			changeHash: false,
			reverse: false,
			showLoadMsg:false,
		});
		
		var set = setInterval(function(){
			ListaClientesAlteracao();
			clearInterval(set);
		},500);					  
	
});	

$(document).on('click','.voltainicio',function(){
	
	 var retor = verificapedidonovcarrinho();
	
		if(retor > 0){
			
			var sn = confirm("Deseja realmente abortar esse pedido ?, Vejo que tem "+retor+" itens no carrinho!");
			if(sn == true){
				$.ajax({
					type:'POST',
					url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
					data:{act:'cancelar'},
					success: function(){
													
						window.location.href = "pedido-cliente.html";
						
					}			
				});
			}
			
		}else{
			//alert('Vazio: '+retor);
			$.ajax({
				type:'POST',
				url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
				data:{act:'cancelar'},
				success: function(){
												
					window.location.href = "pedido-cliente.html";
					
				}			
			});
			
		}
	
});

function verificapedidonovcarrinho(){
	var retorno;
	$.ajax({
		type:'POST',
 	    async:false, 
		dataType: "json",
		url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
		data:{act:'vrcarinho'},
		success: function(data){
			
			retorno	= data[0].num;
			
		},
		error:function(data){
		
		}
		
	});
	
	return retorno;
	
}
function ListaClientesAlteracao(){
	
	
	$.ajax({
			type: 'POST',
			cache: false,
			dataType: "json",	
			url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/pedido-cliente-exec.php',
			data: {act:'listar'},
			beforeSend:function(){
				$.mobile.loading( 'show', {
					text: 'Listando...',
					textVisible: true,
					theme: 'b',
					html: "Listando..."
				});	
			},
			success: function(data){
				
				var html = "";			
				
				
				for (var i = 1; i < data.length; i++) {
					//<option value="'+data[i].cod+'">'+data[i].cod+' - '+data[i].nome.toUpperCase()+'</option>					
					html += '<li><a href="#" data-id="'+data[i].cod+'">'+data[i].cod+' - '+data[i].nome.toUpperCase()+'</a></li>';					
					
				}
				
				$('#clitroca').html(html).listview('refresh');
				$.mobile.loading( 'hide');			  
			},
			error: function(data){
				alert('Erro: '+data.statusText);					
			}
		});	
}

$(document).on('click','#clitroca li a',function(){
	
	//alert($(this).attr('data-id'));
	var ccli = $(this).attr('data-id');
	ConfereFinanceiro(ccli);
	
	
	
});

function ConfereFinanceiro(id){
	
	var codigo = id;
	
	$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/duplicatas-exec.php",
		 data:{act:"verificaduplicatas",codf:codigo},
		 dataType:"json",
		 success: function(data){
			
			 //alert(data.dados.length);
			if(data.dados.length > 0){
				//if(parseFloat(data.valordups) > parseFloat(data.limite)){
					$.confirm({
						title: 'Cliente não habilitado para fazer pedidos!',
						content: '<form id="frmativarclis"><input type="hidden" name="act" value="pin"/><input type="hidden" name="ncli" value="'+codigo+'"/><div data-role="ui-field-contain"><label for="textinput-1"><strong>Informe PIN de liberação:</strong></label><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="tel" id="shcli" name="shcli" placeholder="Digite o PIN"></div></div><button type="submit" class="ui-btn ui-shadow" data-ajax="false">VALIDAR</button></form>',
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
					$.ajax({
						type:'POST',
						url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
						data:{act:'trocacli',codcli:codigo},
						success: function(){			
							//$.mobile.changePage('#page');			
							history.pushState({},"Resultado de `Clientes`",'lista-produtocliente.html?codcli='+codigo+'');
							//inforclietenum(ccli);
							window.location.reload();			
						}			
					});
					
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
	
	return false;
	
}

$(document).on('submit','form[id="frmativarclis"]',function(){	
	
	  var $form = $(this);
	  var params = $form.serialize();	
				
	   $.ajax({
		 type: 'POST',
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/duplicatas-exec.php",
		 data:params,
		 beforeSend: function(){
			$.mobile.loading( 'show', {
				text: 'Aquarde!',
				textVisible: true,
				theme: 'b',
				html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde..</div>"
			});	
		 },
		 cache:false,
		 dataType: "json",
		 success: function(data){
			 
			$.mobile.loading("hide");
			
			if(data[0].pin == data[0].snh){
				//alert(data[0].ncli)
			   				
				//$.mobile.changePage('#page');			
				history.pushState({},"Resultado de `Clientes`",'lista-produtocliente.html?codcli='+data[0].ncli+'');
				//inforclietenum(ccli);
				window.location.reload();
				
				
			}else{										
						 	
				$.confirm({
					title: 'Erro de validação',
					content: 'Código PIN inválido!<br/> Entre em contato com o financeiro para liberação do PIN!',
					autoClose: 'confirm|10000',
					cancelButton: false, 					
				});	
					
			}
																								
		},
		error: function(jqXHR, exception){
			var alerta = $.alert({
			title: 'Ops!',
			content: '<div align="center">Ocorreu um Erro inesperado, Por Favor entre em contato com o suporte!<br/><img src="../img/sad.png"/></div>',
			confirmButton:'OK',
			confirm: function(){
				alerta.close();
			}
		});	
		}	
	});		
			
			
	return false;
});

$(document).on('click','.alterproduto',function(){
	
	var idp  = $(this).parents('li').attr("id");
	var xpro = $(".listaprodutos li[id='"+idp+"'] a h2").html();
	var htm  = "";
	
	$.confirm({
		content: function () {
			var self = this;
			return $.ajax({
				url: ""+caminhoURL+"/PROJETOS/webservice_pedido/php/produto-exec.php",
				dataType: 'json',
				method: 'POST',
				data:{act:'produtoum',id:''+idp+''}
			}).done(function (response) {
				htm +='<strong> PRODUTO: '+xpro+'</strong><br/><br/>';
				htm +='<input type="hidden" name="idpro" id="idpro" value="'+idp+'" />';				
				htm +='<div data-demo-html="true">'+
					 '<label for="text-basic">Peso Medio:</label>'+
					 '<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="tel" name="propesomedio" id="propesomedio" value="'+response[0].pesomedio+'"></div>'+
					 '</div>';
				self.setContent(''+htm+'' );
						
			}).fail(function(){
				self.setContent('Algo deu errado , contate o suporte para que possamos resolver o mais rápido possível!');
			});
		},
		title: 'Alterar Produto',
		buttons: {
			tryAgain: {
				text: 'ALTERAR',
				btnClass: 'btn-green',
				action: function(){
					//alert(''+$("#idpro").val()+' - '+$("#propesomedio").val()+'');
					
					$.ajax({
						type:'POST',
						cache:false, 
						dataType: "json",
						url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/produto-exec.php",
						data:{act:'alterarpesomedio', idpro:$("#idpro").val(),pesomedio:$("#propesomedio").val()},
						success: function(data){
							alert(data[0].msg);								
						},
						error:function(data){
							alert('Algo deu errado , contate o suporte para que possamos resolver o mais rápido possível!');
						}
						
					});
										
					return false;
					
				}
			},
			close: function () {
				
			}
		}
	});
	
	/*$.confirm({
    title: 'Alterar Produto',
    content: ''+htm+'',
    buttons: {        
        cancel: function () {
            $.alert('Canceled!');
        }        
    }
	});*/
	
});

$(document).on('click','#dtinient',function(){
  	
	$('#dtinient').datebox('open');
});

$(document).ready(function(e) {
	
	$("#nav").click(function(){			
		$( "#nav-panel" ).panel( "open" );
	});
	
	
	
	var xhtml = "";
	
	xhtml +='<form id="frmconfigaracao">'+	
				 '<input type="hidden" name="act" value="inserir"/>'+
				 '<div data-role="ui-field-contain">'+
					  '<label for="textinput-1"><strong>Empresa:</strong></label>'+
					'<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="text" value="" id="xnome"  name="xnome"></div>'+
				 '</div>'+
				 '<div data-role="ui-field-contain">'+
					  '<label for="textinput-1"><strong>Serie:</strong></label>'+
					'<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="text" value="" id="serie" name="serie"></div>'+
				 '</div>'+	
				 '<div data-role="ui-field-contain" style="display: inline-block;">'+
						'<label for="slider-flip-m">Peças:</label>'+
						'<select name="option1" id="option1">'+
							'<option value="" selected="">Selecione</option>'+
							'<option value="2">Não</option>'+
							'<option value="1">Sim</option>'+
						'</select>'+
				 '</div>'+
				 '<div data-role="ui-field-contain" style="display: inline-block; margin-left: 5px">'+
						'<label for="slider-flip-m2">Gera Carga:</label>'+
						'<select name="geracarga" id="geracarga">'+
							'<option value="" selected="">Selecione</option>'+
							'<option value="2">Não</option>'+
							'<option value="1">Sim</option>'+
						'</select>'+
				 '</div>'+
				 
				 '<div data-role="ui-field-contain" style="display: inline-block; margin-left: 5px">'+
						'<label for="slider-flip-m2">Alteração de Peso Medio :</label>'+
						'<select name="mostraalterapesomeidio" id="mostraalterapesomeidio">'+
							'<option value="" selected="">Selecione</option>'+
							'<option value="1">SIM</option>'+
							'<option value="2">NÃO</option>'+
						'</select>'+
				 '</div><br/>'+
				 	
				'<div data-role="ui-field-contain" style="display: inline-block;">'+
						'<label for="slider-flip-m2">Mostra Desconto:</label>'+
						'<select name="sndesconto" id="sndesconto">'+
							'<option value="" selected="">Selecione</option>'+
							'<option value="1">SIM</option>'+
							'<option value="2">NÃO</option>'+
						'</select>'+
				 '</div>'+
				'<div data-role="ui-field-contain" style="display: inline-block;">'+
						'<label for="slider-flip-m2">Tabela de Preço:</label>'+
						'<select name="tabpreco" id="tabpreco">'+
							'<option value="" selected="">Selecione</option>'+
							'<option value="1">SIM</option>'+
							'<option value="2">NÃO</option>'+
						'</select>'+
				 '</div>'+		
				'<div data-role="ui-field-contain">'+
					  '<label for="textinput-1"><strong>Limite de dias para Bloqueio Cliente:</strong></label>'+
					'<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="text" value="" id="limitardiaparabloquear" name="limitardiaparabloquear"></div>'+
				 '</div>'+
				'<div data-role="ui-field-contain" style="display: inline-block; margin-left: 5px">'+
						'<label for="slider-flip-m2">Mostra no Item Produto +/-:</label>'+
						'<select name="itemmaisemenos" id="itemmaisemenos">'+
							'<option value="" selected="">Selecione</option>'+
							'<option value="1">SIM</option>'+
							'<option value="2">NÃO</option>'+
						'</select>'+
				 '</div>'+															
					
				'<div data-role="ui-field-contain" style="display: inline-block; margin-left: 5px">'+
						'<label for="slider-flip-m2">Importa Clientes:</label>'+
						'<select name="impcli" id="impcli">'+
							'<option value="" selected="">Selecione</option>'+
							'<option value="1">TODOS</option>'+
							'<option value="2">SOMENTE DO VENDEDOR</option>'+
						'</select>'+
				 '</div>'+
				
				'<div data-role="ui-field-contain" style="display: inline-block; margin-left: 5px">'+
						'<label for="slider-flip-m2">Validar Preço Menor:</label>'+
						'<select name="validprecomenor" id="validprecomenor">'+
							'<option value="" selected="">Selecione</option>'+
							'<option value="1">Sim</option>'+
							'<option value="2">NÃO</option>'+
						'</select>'+
				 '</div>'+	

				 '<div data-role="ui-field-contain" style="display: inline-block; margin-left: 5px">'+
						'<label for="slider-flip-m2">Validar Limite Clientes:</label>'+
						'<select name="validlimitecliente" id="validlimitecliente">'+
							'<option value="" selected="">Selecione</option>'+
							'<option value="1">Sim</option>'+
							'<option value="2">NÃO</option>'+
						'</select>'+
				 '</div>'+
				 '<div data-role="ui-field-contain">'+
					  '<label for="textinput-1"><strong>Percentual Limite Maximo Preço Venda:</strong></label>'+
					'<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="tel" value="" id="perclimitmax" name="perclimitmax"></div>'+
				 '</div>'+
				 '<div data-role="ui-field-contain">'+
					  '<label for="textinput-1"><strong>Limite Dias Entrega:</strong></label>'+
					'<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="tel" value="" id="limitdiasentrega" name="limitdiasentrega"></div>'+
				 '</div>'+
				 '<div data-role="ui-field-contain" style="display: inline-block; margin-left: 5px">'+
						'<label for="slider-flip-m2">Bloquear QTD:</label>'+
						'<select name="blockqtd" id="blockqtd">'+
							'<option value="" selected="">Selecione</option>'+
							'<option value="1">Sim</option>'+
							'<option value="2">NÃO</option>'+
						'</select>'+
				 '</div>'+
				 '<div data-role="ui-field-contain">'+
					'<label for="textinput-1"><strong>Limite Hora pedido:</strong></label>'+
					'<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="time" value="" id="limitedehorapedido" name="limitedehorapedido"></div>'+
				'</div>'+
				 '<input type="hidden" name="margemprodutopercent" id="margemprodutopercent" value=""/><input type="hidden" name="margemproduto" id="margemproduto" value=""/><br/><br/><button type="submit" class="btn btn-primary btn-lg btn-block" data-ajax="false">GRAVAR</button>'+
			'</form>';
	
	var shn = '<div data-role="ui-field-contain">'+
					  '<label for="textinput-1"><strong>Senha:</strong></label>'+
					'<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="password" value="" id="promptsh"  name="promptsh"></div>'+
				 '</div>';
				 
	$("#configura").click(function(){
		
		
		
		
		
		$.alert({
			title: 'Senha ?',
			content: ''+shn+'',
			buttons: {
				tryAgain: {
					text: 'CONFIRMAR',
					btnClass: 'btn-green',
					action: function(){
						
						if($("#promptsh").val() == "Prod4Pr0"){

							setTimeout(function(){

								var res = editconfig();

								$("#xnome").val(res[0].empresa);
								$("#serie").val(res[0].serie);
								$("#limitardiaparabloquear").val(res[0].limitardiaparabloquear);
								$('select[name="option1"] option[value="'+res[0].option1+'"]').attr('selected', 'selected');
								$('select[name="geracarga"] option[value="'+res[0].geracarga+'"]').attr('selected', 'selected');
								$('select[name="mostraalterapesomeidio"] option[value="'+res[0].mostraalterapesomeidio+'"]').attr('selected', 'selected');
								$('select[name="sndesconto"] option[value="'+res[0].sndesconto+'"]').attr('selected', 'selected');							
								$('select[name="itemmaisemenos"] option[value="'+res[0].itemmaisemenos+'"]').attr('selected', 'selected');						
								$('select[name="impcli"] option[value="'+res[0].impcli+'"]').attr('selected', 'selected');
								$('select[name="validprecomenor"] option[value="'+res[0].validprecomenor+'"]').attr('selected', 'selected');
								$('select[name="validlimitecliente"] option[value="'+res[0].validlimitecliente+'"]').attr('selected', 'selected');
								$('select[name="tabpreco"] option[value="'+res[0].tabpreco+'"]').attr('selected', 'selected');
								$("#margemproduto").val(res[0].margemproduto);
								$("#margemprodutopercent").val(res[0].margemprodutopercent);
								$("#perclimitmax").val(res[0].perclimitmax);
								$("#limitdiasentrega").val(res[0].perclimitmax);
								$('select[name="blockqtd"] option[value="'+res[0].blockqtd+'"]').attr('selected', 'selected');
								$("#limitedehorapedido").val(res[0].limitedehorapedido);
								
								$("#loaders").hide();
							}, 2000);	


							$.confirm({
								content: '<div align="center" id="loaders" style="position:absolute; z-index:10; background: #333; opacity:0.5;	 width: 100%;"><img src="../img/ajax_loading.gif" /> AGUARDE..</div>'+xhtml+'',
								title: 'Configuração',
								confirmButton: false,
								cancelButton: 'Fechar',
								buttons: {
									/*tryAgain: {
										text: 'Try again',
										btnClass: 'btn-red',
										action: function(){
										}
									},*/
									close: function () {
										window.location.reload();
									}
								}											
							});

						}else{
							window.location.reload();
						}
						
						
					}
				}
			}
			
		});
		
		
		/*$.confirm({
			content: '<div align="center" id="loaders" style="position:absolute; z-index:10; background: #333; opacity:0.5;	 width: 100%;"><img src="../img/ajax_loading.gif" /> AGUARDE..</div>'+xhtml+'',
			title: 'Configuração',
			confirmButton: false,
			cancelButton: 'Fechar',
			cancel: function(){
       			window.location.reload();
    		}			
		});	*/
		
	});
		
});

function editconfig(){
	
	var retorno = "";
		
	$.ajax({
		 type: 'POST',
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/config-exec.php",
		 data:{act:'detalhe'},
		 async:false,
		 dataType: "json",
		 success: function(data){
							
			retorno = data;	
																	
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
	
	return retorno;
} 

$(document).on('submit','form[id="frmconfigaracao"]',function(){
	
		var params = $(this.elements).serialize();		
		$.ajax({
			 type: 'POST',
			 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/config-exec.php",
			 data:params,
			  beforeSend: function(){
				$.mobile.loading( 'show', {
					text: 'Salvando configuração !',
					textVisible: true,
					theme: 'b',
					html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Salvando configuração..</div>"
				});	
			 },
			/* cache:false,
			 dataType: "json",*/
			 success: function(data){
				 
				$.mobile.loading("hide");	
				alert(data);
																						
			},
			error: function(jqXHR, exception){
				var alerta = $.alert({
					title: 'Ops!',
					content: '<div align="center">Ocorreu um Erro inesperado, Por Favor entre em contato com o suporte!<br/><img src="../img/sad.png"/></div>',
					confirmButton:'OK',
					confirm: function(){
						alerta.close();
					}
				});
			}	
		});		
	return false;
});

$(document).on('submit','form[id="filtrorelpedidofat"]',function(){
		var empresa = $("#empresa").val();
		var params  = $(this.elements).serialize();		
		$.ajax({
			 type: 'POST',
			 url:"http://relatorio.prodapro.com.br/"+empresa+"/php/relatoriopedidocomfaturamento.php",
			 data:params,
			  beforeSend: function(){
				$.mobile.loading( 'show', {
					text: 'Aguarde !',
					textVisible: true,
					theme: 'b',
					html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde Gerando..</div>"
				});	
			 },
			/* cache:false,
			 dataType: "json",*/
			 success: function(data){
					
				$("#stringmensagem").html(data);
				$.mobile.loading("hide");
				
				$('.table').dataTable({
					"info":false,
					"bFilter": false, 
					"bSort" : false,
					"paging":   false,
					"ordering": false,
					"dom": 'Bfrtip',
					"responsive": true													
				})
				
					$(".fecha").click();
			},
			error: function(jqXHR, exception){
				var alerta = $.alert({
					title: 'Ops!',
					content: '<div align="center">Ocorreu um Erro inesperado, Por Favor entre em contato com o suporte!<br/><img src="../img/sad.png"/></div>',
					confirmButton:'OK',
					confirm: function(){
						alerta.close();
					}
				});
			}	
		});		
	return false;
});

$(document).on("click",".clickcli",function(){
	var cod = $(this).attr('data-id');
	var conf = $.confirm({
		content: function () {
			var self = this;
			return $.ajax({
				url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/cliente-exec.php',
				dataType: 'json',
				method: 'post',
				data:{act:'valida',codcli:cod},
			}).done(function (response) {
				
				Vdupcliente(cod);				
				conf.close();
			}).fail(function(){
				Vdupcliente(cod);				
				conf.close();
			});
		}
	});
});

function Vdupcliente(id){
	
	var codigo = id;
	
	$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/duplicatas-exec.php",
		 data:{act:"verificaduplicatas",codf:codigo},
		 dataType:"json",
		 success: function(data){
			
			
			 //alert(data.dados.length);
			if(data.liberado == 'S'){  
				if(data.dados.length > 0){														
						
						var msges = eventos.estoqueexcel(1);																		
									
						var confs =	$.confirm({
							title: 'Mensagem do APP',
								content: ''+msges+'',
								autoClose: 'logoutUser|6000',
								buttons: {
									logoutUser: {
										text: 'Fechar',
										action: function () {
											confs.close();
										}
									}
								}
							});
							
						window.location.href = 'lista-produtocliente.html?codcli='+codigo+'';
						
					}else{
						var msges = eventos.estoqueexcel(1);																		
									
						var confs =	$.confirm({
							title: 'Mensagem do APP',
								content: ''+msges+'',
								autoClose: 'logoutUser|6000',
								buttons: {
									logoutUser: {
										text: 'Fechar',
										action: function () {
											confs.close();
										}
									}
								}
							});														
						window.location.href = 'lista-produtocliente.html?codcli='+codigo+'';	
					}
			 }else{

				
				$.confirm({
							title: 'Cliente Bloqueado!',
							content: 'Motivo do bloqueio<br> '+data.obs+' ',
							type: 'red',
							typeAnimated: true,
							buttons: {							
								close: function () {
									//$.mobile.changePage('#deltalhe_cliente');
									window.location.reload();
								}
							}
						});

			}
			 
			 
		},
		error: function(jqXHR, exception){
						
			alert('erro não detectado[verificaduplicatas].\n' + jqXHR.responseText);
		}	
	});
	
	return false;
	
}

function print_r(arr,level) {
var dumped_text = "";
if(!level) level = 0;

//The padding given at the beginning of the line.
var level_padding = "";
for(var j=0;j<level+1;j++) level_padding += "    ";

if(typeof(arr) == 'object') { //Array/Hashes/Objects 
    for(var item in arr) {
        var value = arr[item];

        if(typeof(value) == 'object') { //If it is an array,
            dumped_text += level_padding + "'" + item + "' ...\n";
            dumped_text += print_r(value,level+1);
        } else {
            dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
        }
    }
} else { //Stings/Chars/Numbers etc.
    dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
}
return dumped_text;
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
/*$(document).ready(function(e) {
    var jElement = $('.element');

	$(window).scroll(function(){
		if ( $(this).scrollTop() > 100 ){
			jElement.css({
				'position':'fixed',
				'top':'50px',
				'z-index':'1000',
				'background':'#f9f9f9',
				'width':'100%',
				'border-bottom':'1px solid #eee'								
			});
		}else{
			jElement.css({
				'position':'relative',
				'top':'auto'
			});
		}
	});
		
});*/

document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown(e) {
  e.preventDefault();
	  navigator.notification.alert(
        'Usar O "MENU INICIAL", obrigado!',     // mensaje (message)
        'Evento de voltar',            // titulo (title)
        'Sair'                // nombre del botón (buttonName)
        );
}
$(document).bind(" mobileinit ", function(){
     $.mobile.defaultPageTransition = 'none' ;     
});

errorHandler = function(transaction, error){
    updateStatus("Erro: " + error.message);
    return true;
}

successCB = function(transaction, error){
    updateStatus("sucesso: " + error.message);
    return true;
}
 
nullDataHandler = function(transaction, results){
}			

function updateStatus(status){
		alert(status);  
}	

