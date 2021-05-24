// JavaScript Document

$(document).on('click','#gerarcarga',function(){
	
	var files = '';
	var array = [];
	
	$(".selected").each(function(){
		files = $(this).attr('data-id');		
		array.push(files);
	});
	
	$( "[data-role='panel']" ).panel( "close" );	
	
	if(files == ''){
		alert('Selecione Pedidos para gerar a carga!');
		return false;
	}
	
	$(':mobile-pagecontainer').pagecontainer('change', '#carga',{
			transition: 'slideup',
			changeHash: false,
			reverse: false,
			showLoadMsg:true,
			loadMsgDelay: 1
	});
	
	var dtd = datadia();
	
	$("#datap").val(dtd);
	
	
	$.ajax({
			 type: 'POST',
			 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carga-exec.php",
			 data:{act:'listacarga',datap:dtd,ids:array},
			 beforeSend: function(){
				$.mobile.loading( 'show', {
					text: 'Listando Carga!',
					textVisible: true,
					theme: 'b',
					html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Listando Carga!</div>"
				});	
			 },
			 cache:false,
			 dataType: "json",
			 success: function(data){
				$.mobile.loading("hide");																												
				
				var str = "";
								
				for(var i in data.result){
															
					str += '<tr class="item" data-tag="item">';
					str += '<td><input type="hidden" name="romaneio['+i+'][codproduto]" value="'+data.result[i].cod+'"/>'+data.result[i].cod+'</td>';
					str += '<td><input type="hidden" name="romaneio['+i+'][desc]" value="'+data.result[i].desc+'"/>'+data.result[i].desc+'</td>';
					str += '<td style="text-align: center;"><input type="hidden" name="romaneio['+i+'][pecas]" value="'+data.result[i].vle+'"/> '+data.result[i].vle+'</td>';
					str += '<td style="text-align: center;"><input type="hidden" name="romaneio['+i+'][qtd]" value="'+data.result[i].qtd+'"/>'+data.result[i].qtd+'</td>';
					str += '<td><input type="hidden" name="romaneio['+i+'][valor]" value="'+data.result[i].preco+'"/><input type="hidden" name="romaneio['+i+'][preco_min]" value="'+data.result[i].preco_min+'"/><input type="hidden" name="romaneio['+i+'][preco_max]" value="'+data.result[i].preco_max+'"/><div data-role="ui-field-contain"><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="text" name="romaneio['+i+'][obs]" clas="obs" value="" style="width: 100%;"/></div></div></td>';					
					str += '</tr>';			
				
				}
				
				$("#total").val(data.total);
				$("#serie").val(data.serie); 
				$('#tblistcarga').html(str);
				$("#idscli").val(data.idscli);
				 
				$('#listcarga').dataTable({
					"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
					"iDisplayLength": -1,
					"responsive": true,
					"bSort" : false,
					 "paging":   false,
					 "ordering": false,
					 "info":     false,
					 "bDestroy": true,
					 "bFilter": false,		
					  "fnRowCallback"  : function(nRow,aData,iDisplayIndex) {                               
						  $('td:eq(4)', nRow).css( "text-align", "center" );
						  $('td:eq(5)', nRow).css( "text-align", "right","display","flex" );						 
						  return nRow;
					  },									
				    "order": []
																	
				}).columnFilter({aoColumns:[
											{ type:"select", sSelector: "#a" },
											]});
				
			},
			error: function(jqXHR, exception){
				$.mobile.loading("hide");
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
	
});

function datadia(){
	
	var data = new Date();			
	var dia     = data.getDate();
	var mes     = data.getMonth();
	var ano4    = data.getFullYear();
	 if (dia.toString().length == 1){
	  dia = "0"+dia;
	 }
	 if (mes.toString().length == 1){
	  mes = "0"+mes;
	 }
	var str_data = dia + '/' + (mes+1) + '/' + ano4;
	var dataFormatada = ("0" + data.getDate()).substr(-2) + "/" 
	+ ("0" + (data.getMonth() + 1)).substr(-2) + "/" + data.getFullYear();
	
	return dataFormatada;
}

$(document).on('submit','form[id="frmcarga"]',function(){
	
	var param = $(this).serialize();
	//alert(param);
	var dataFormatada = $("#dtinient").val();
		
	
	$("#datap").val(dataFormatada);
	$.ajax({
			 type: 'POST',
			 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carga-exec.php",
			 data:param,
			  beforeSend: function(){
				$.mobile.loading( 'show', {
					text: 'Filtrando !',
					textVisible: true,
					theme: 'b',
					html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Filtrando..</div>"
				});	
			 },
			 cache:false,
			 dataType: "json",
			 success: function(data){
				 
				$.mobile.loading("hide");	
				var str = "";
				 
				for(var i in data.result){										
					
					str += '<tr class="item" data-tag="item">';
					str += '<td><input type="hidden" name="romaneio['+i+'][codproduto]" value="'+data.result[i].cod+'"/>'+data.result[i].cod+'</td>';
					str += '<td><input type="hidden" name="romaneio['+i+'][desc]" value="'+data.result[i].desc+'"/>'+data.result[i].desc+'</td>';
					str += '<td style="text-align: center;"><input type="hidden" name="romaneio['+i+'][pecas]" value="'+data.result[i].vle+'"/> '+data.result[i].vle+'</td>';
					str += '<td style="text-align: center;"><input type="hidden" name="romaneio['+i+'][qtd]" value="'+data.result[i].qtd+'"/>'+data.result[i].qtd+'</td>';
					str += '<td><input type="hidden" name="romaneio['+i+'][valor]" value="'+data.result[i].preco+'"/><div data-role="ui-field-contain"><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="text" name="romaneio['+i+'][obs]" clas="obs" value="" style="width: 100%;"/></div></div></td>';						
					str += '</tr>';		
				
				}
				
				 $("#total").val(data.total);
				 $("#serie").val(data.serie); 
				$('#tblistcarga').html(str);
										   									
				
			},
			error: function(jqXHR, exception){
				$.mobile.loading("hide");
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

$(document).on('submit','form[id="frmexportacarga"]',function(){
	
	var param = $(this).serialize();
	
	var placas = ListaPlaca();
	
	/*var htm = '<div data-role="ui-field-contain">'+
					  '<label for="textinput-1"><strong>Placa:</strong></label>'+
					'<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="text" value="" id="placa" name="placa"></div>'+
				 '</div>';*/
	var htm = '<div data-role="ui-field-contain" align="center"><label for="select-choice-a" class="select"><strong>Placa:</strong></label>'+
				'<select name="placa" id="placa" data-native-menu="false">';
				htm +='<option value="">Selecione uma Placa</option>';
				for(var x = 0; x < placas.length; x++){
    				htm +='<option value="'+placas[x].placa+'">'+placas[x].placa+'</option>';    
				}
				htm +='</select></div><br/>';
	
	if($("#listcarga tr[data-tag='item']").length == 0){
		
		alert("Não existe Pedidos feitos nesse dia!");
		return false;
	}
	
	$.confirm({
		title: 'Informar Placa',
		content: ''+htm+'',
		type: 'orange',
		typeAnimated: true,
		closeIcon:true,
		buttons: {			
			submeter: {
				text: 'ENVIAR',
				btnClass: 'btn-green btn-lg btn-block',
				action: function(){
						//alert(param);
					if($("#placa").val() != ""){
						
						var params = param+"&placa="+$("#placa").val();
						var empresa=$("#empresa").val();
						$.confirm({
							title:'Resposta do envio da carga!',
							content: function () {
							var self = this;
							return $.ajax({
								url: 'http://nfe.prodapro.com/'+empresa+'/php/romaneio-exec.php',
								dataType: 'json',
								method: 'post',
								data:params,
							}).done(function (response) {

								if(response.ind == 1){
																	
									RetornoCarga(response.result,response.idscli);
									self.setContent(response.msg);
									
								}else{
									self.setContent(response.msg);
								}			
								
							}).fail(function(){
								self.setContent('Desculpe algo deu errado, contate o suporte, Obrigado!');
							});
						},
						buttons: {
							tryAgain: {
								text: 'Fechar',
								btnClass: 'btn-green',
								action: function(){
									
									window.location.reload();
								}
							}
						}
						
						});
					}else{
						
						var confr = $.confirm({
							title: 'Ops!',
							content: 'Informar a Placa!',
							type: 'red',
							typeAnimated: true,
							buttons: {								
								close: function () {
									confr.close();
								}
							}
						});
						
						
					}
					return false;
				}
			}
		}
	});
	$('select').selectmenu().selectmenu('refresh', true);
	return false;
});

function ListaPlaca(){
	
	var retorno = [];
	
	$.ajax({
		type:'POST',
 	    async:false, 
		dataType: "json",
		url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/placa-exec.php",
		data:{act:'lista'},
		success: function(data){
			
			retorno	= data;
			
		},
		error:function(data){
		
		}
		
	});
	
	
	return retorno;
}


function RetornoCarga(res,ids){
	var retorno = [];
	$.ajax({
		type:'POST',
 	    async:false, 
		dataType: "json",
		url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carga-exec.php",
		data:{act:'inserir',arr:res,idscli:ids},
		success: function(data){
			
			retorno	= data;
			
		},
		error:function(data){
		
		}
		
	});
	
	return retorno;
}

$(document).ready(function(){			
	var pathArray = window.location.pathname.split('/');
	var newPathname = "";
	for (i = 0; i < pathArray.length; i++) {
	  newPathname += "/";
	  newPathname += pathArray[i];
		//alert(pathArray[i]);
		if(pathArray[i] == 'carga.html'){
			ListaCargas();
		}
	}	
});

function ListaCargas(){
	
	$.ajax({
		type:'POST',
 	    cache:false, 
		dataType: "json",
		url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carga-exec.php",
		data:{act:'listacargagerada'},
		success: function(data){
			
			var html = "";  
			if(data.length > 0){
				
				for(var i = 0; i < data.length; i++){
					
					
					html += '<li><a href="#" class="list" data-id="'+data[i].numero_reta+'">'+
								'<img src="../img/product_box.png">'+
								'<h2>NUMERO: '+data[i].numero_reta+' DATA: '+data[i].data+'</h2>'+
								'<p>PLACA: '+data[i].placa+'<br/> SERIE:'+data[i].serie+'</p>'+
								'</a>'+
							'</li>';
					
				}
				
				$('#listaresumocarga').html(html);
				$('#listaresumocarga').listview('refresh');
			}else{
				
				$('#listaresumocarga').html("<div align='center'><img src='../img/nocarga.png'  style='width: 50%;' /></div>");
			}
					
		},
		error:function(data){
		
		}
		
	});		
	
}


$(document).on('click','.list',function(){
	
	//alert($(this).attr('data-id'));
	$(':mobile-pagecontainer').pagecontainer('change', '#detalhe',{
			transition: 'slideup',
			changeHash: false,
			reverse: false,
			showLoadMsg:true,
			loadMsgDelay: 1
	});
	
	$.ajax({
		type:'POST',
 	    cache:false, 
		dataType: "json",
		url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carga-exec.php",
		data:{act:'detalhe',cod:$(this).attr('data-id')},
		success: function(data){
			
			var html = "";  
			if(data.length > 0){
				
				for(var i = 0; i < data.length; i++){
														
					
					html += '<tr>';
					html += '<td>'+data[i].codproduto+'</td>';
					html += '<td>'+data[i].desc_prod+'</td>';
					html += '<td style="text-align: center;">'+data[i].pc+'</td>';
					html += '<td style="text-align: center;">'+data[i].qtd+'</td>';
					html += '<td>'+data[i].obs+'</td>';					
					html += '</tr>';
					
					
				}
				
				$('#tblistadetalhe').html(html);
				
				$('#listadetalhe').dataTable({
					"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
					"iDisplayLength": -1,
					"responsive": true,
					"bSort" : false,
					 "paging":   false,
					 "ordering": false,
					 "info":     false,
					 "bDestroy": true,
					 "bFilter": false,		
					  "fnRowCallback"  : function(nRow,aData,iDisplayIndex) {                               
						  $('td:eq(4)', nRow).css( "text-align", "center" );
						  $('td:eq(5)', nRow).css( "text-align", "right","display","flex" );						 
						  return nRow;
					  },									
				    "order": []
																	
				}).columnFilter({aoColumns:[
											{ type:"select", sSelector: "#a" },
											]});
				
				
			}else{
				
				
			}
					
		},
		error:function(data){
		
		}
		
	});	
	
	
});



