// JavaScript Document

var dbox;
var spinner = $('.loading-spinner');
function onInit(){
    try {
        if (!window.openDatabase) {
            updateStatus("Erro: Seu navegador não permite banco de dados.");
        }
        else {
            initDB();			
            createTablesCliente();
			createTablesMetas();
			createTablesSinc();
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

function createTablesCliente(){
	
	var query2 = 'CREATE TABLE IF NOT EXISTS CLIENTES (id INTEGER PRIMARY KEY AUTOINCREMENT, CODIGO VARCHAR, CNPJ_CPF VARCHAR, NOME VARCHAR, ENDERECO VARCHAR, BAIRRO VARCHAR, CEP  VARCHAR, CIDADE  VARCHAR, ESTADO  VARCHAR, TELEFONE VARCHAR, INSCRICAO VARCHAR, ATIVO  VARCHAR, CONTA_CTB  VARCHAR, MOSTRA_FATURAS   VARCHAR, REPRESENTANTE  VARCHAR, FANTASIA  VARCHAR, CONTATO  VARCHAR, E_MAIL  VARCHAR, FAX   VARCHAR, COND_PAG  VARCHAR, LIMITE  VARCHAR, END_ENTREGA  VARCHAR, BAIRRO_ENTREGA   VARCHAR, CIDADE_ENTREGA   VARCHAR, UF_ENTREGA   VARCHAR, CEP_ENTREGA  VARCHAR, END_COB   VARCHAR,  BAIRRO_COB  VARCHAR, CIDADE_COB  VARCHAR, UF_COB   VARCHAR, CEP_COB  VARCHAR, CELULAR  VARCHAR, E_MAILNFE  VARCHAR, OBS TEXT);';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query2, [], nullDataHandler, errorHandler);            
        });
    } 
    catch (e) {
        updateStatus("Erro: Data base 'CLIENTES' não criada " + e + ".");
        return;
    }

}

function zeratabelaCliente(){
	
	var query = 'DROP TABLE IF EXISTS CLIENTES;';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler);
            //updateStatus("Tabela 'contato_clientes_geral' status: OK.");
        });
    } 
    catch (e) {
        updateStatus("Erro: Data base 'CLIENTES' não criada " + e + ".");
        return;
    }
	
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

function myfunction(){
	$("li.example").each(function() {
        var currentId = $(this).attr("id"); //id of each li
        var newIn = $(this).index(); //index of each li starts from 0
        newIn++;
        if(currentId!==newIn)
        {
            $(this).attr("id",newIn);			
			$(this).find('span').html(newIn);
        }
    });
}



$(document).on('click','#orderped',function(){
	
		
	
		var files = '';
		var array = [];

		$(".selected").each(function(){
			files = $(this).attr('data-id');		
			array.push(files);
		});
		
		if(files == ""){
			alert("Nem um Pedido selecionado!");
			return false;
		}else{

		$(':mobile-pagecontainer').pagecontainer('change', '#order',{
				transition: 'slideup',
				changeHash: false,
				reverse: false,
				showLoadMsg:true,
				loadMsgDelay: 1
		});			

		}
	
		$.ajax({
            url: ""+caminhoURL+"/PROJETOS/webservice_pedido/php/lista-pedidosfeitos-exec.php",
            dataType: 'json',
			cache:false,
            type: 'POST',
			data:{act:'pedselecionado',ids:array}
        }).done(function (response) {
           	
			var htm = "";
			//alert(response.length);
			for(var i = 0; i < response.length; i++){
				
				htm += '<li id="' + (i+1) + '" data-id="'+response[i].Numero_Pedido+'" class="example"><a href="#">'+
							'<img src="../img/bproduto.png">'+
							'<h2>'+response[i].codigo_cliente+' '+response[i].nome+'</h2>'+
							'<p>'+response[i].fantasia+' '+response[i].cidade+' '+response[i].estado+'</p>'+
							'<span class="ui-li-count">' + (i+1) + '</span></a>'+
						'</li>';								
				
			}
			
			$( "#lst" ).html(htm);
			
			//$("#lst").listview().trigger("create");
			$( "#lst" ).listview( "refresh" );
				
			$( "#lst" ).sortable({
					'containment': 'parent',
					'opacity': 0.6,
					update: function(event, ui) {
					   // alert("dropped");
						var index = $('li', $(ui.item).parent()).index(ui.item);
								  //alert(index);
						myfunction();
					}
			  });

			$( "#lst" ).disableSelection();

			$( "#lst" ).on( "sortstop", function() {
				$( "#lst" ).listview( "refresh" );
			});
			
        }).fail(function(){
           alert("algo falhou, desculpe, ligue para que possamos analisar o erro , Obrigado!")
      });
	
	
});


$(document).on('click','#anvdados',function(){

$("#anvdados").addClass('disable');
	spinner.addClass('active');

	var move = MoverArquivoSelecionado();
	

	$.ajax({
		type: 'POST',
		url: ""+caminhoURL+"/PROJETOS/webservice_pedido/php/sincronizar-exec.php",
		data: {act:'buscarxml'},	
		beforeSend: function(){
						
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
			var arr    =[];
			var tp     = 0;
			for(var i =0; i < data.length; i++){
			
				if(data[i].msg != ''){
					mensag = data[i].msg; 			
				}else{
					//lendo xml
					var xmlDoc = $.parseXML(data[i].xml);
					var dt     = xmlToJson(xmlDoc);					
					var nped   = dt.Pedidos.dados.Nped;
					arr.push({
						'nped':nped,					
					});
					
					retop = MandPedidoAgora(data[i].act,data[i].xml);
									
					
					if(retop == 1){
						mensag = "Desculpe, Não foi possivel acessar o servidor.";
						tp     = 1;
						break;				
					}
					ret  = RetornoPedidoAgora(retop);
					
					mensag += ret;
				}
				
			}
			//$.mobile.loading("hide");
			dbox.close();
			if(tp != 1){
				$.confirm({
					title: 'Mensagem do APP',
					 content: ''+mensag+'',
					 autoClose: 'logoutUser|10000',
					 buttons: {
						 logoutUser: {
							 text: 'Fechar',
							 action: function () {
								window.location.reload();
							 }
						 }
					 }
				 });
			}
			//location.reload();
		},
		error: function(jqXHR, exception){
			spinner.removeClass('active');						
			$.confirm({
				title: 'Ops!',
				content: 'Desculpa o transtorno , Ligue para nossa central de atendimento<br/>para que possamos identificar o erro que esta ocorrendo<br/>assim podemos ter uma melhor convivencia :D <br/> Detalhamento: <br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+' ',
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
	
});

function MoverArquivoSelecionado(){		
	
	var retorn;
	var files = '';
	var ids   = '';
	var array = [];
	
	$(".example").each(function(){
		files = $(this).attr('data-id');		
		ids   = $(this).attr('id');
		
		array.push({
			'id':files,
			'order':ids
		});
	});
	
	
	if(array.length > 0){
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
	}else{
		retorn = 'nada';
	}

	return retorn;
	
}

function verificaClienteAntesDeEnviar(){

	var files 	= '';
	var ids   	= '';
	var array 	= [];
	var retorno = "";
	var empresa = $("#empresa").val();

	$(".example").each(function(){
		files = $(this).attr('data-id');		
		ids   = $(this).attr('id');

		var codcli =  $("#lst [data-id='"+files+"'] a h2").html().replace(/[^0-9]/g,'');

		array.push({
			'id':files,
			'order':ids,
			'codcli':codcli
		});
	});

	$.mobile.loading( "show", {
		text: "Aguarde processando..",
		textVisible: true,
		theme: "b",
		html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde processando..</div>"
	  });
	
	$.ajax({
		type:'POST',
		async: false, 
		dataType: "json",
		url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
		data:{act:'buscabloqueadosclientes',cods:array},
		beforeSend: function(){
												
		},
		success: function(data){			
			
			
			for(var i = 0; i < data.length; i++){

				if(data[i].ativo == 'N'){						

					$("#lst [data-id='"+data[i].idped+"']").removeClass('example');
					retorno +="Pedido do Cliente: "+$("#lst [data-id='"+data[i].idped+"'] a h2").html()+" não pode ser processado, esta com algumas pendencias, verifique com o faturamento!  ";

				}else{
					retorno += "Pedido do Cliente: "+$("#lst [data-id='"+data[i].idped+"'] a h2").html()+"";
				}


			}
			$.mobile.loading( 'hide');
			myfunction();
		},
		error:function(jqXHR, exception){
		
		}
	});

	return retorno;

}

function pegarrestricoes(npeds,msg){
	var dl;
	$.ajax({
		type:'POST',
		cache:false, 
		url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/sincronizar-exec.php",
		data:{act:'gravaresticoesapi',ids:npeds},
		beforeSend: function(){		
			dbox = $.dialog({
				title: 'Finalizando o envio dos pedidos !',
				content: '<div align="center"><img src="../img/ajax_loading.gif" /></div>',
			});		
		},
		success: function(data){
			dbox.close();
			spinner.removeClass('active');
			var res = JSON.parse(data);
			
			if(res[0].msg == 2){				
								  
				  dl = $.confirm({
					title: 'Resposta!',
					content: 'Não houve contato com o servidor de envio, clique em <mark>REENVIAR</mark> novamente',
					type: 'orange',
					closeIcon:true,
					typeAnimated: true,
					buttons: {
						tryAgain: {
							text: 'REENVIAR',
							btnClass: 'btn-green',
							action: function(){
									pegarrestricoes(npeds,msg);
								}
							}
						}
				   });
				
			}else{
				dl = $.confirm({
					title: 'Resposta!',
					content: ''+msg+'<br/>'+res[0].msg+'',
					type: 'green',
					closeIcon:true,
					typeAnimated: true,
					buttons: {
						tryAgain: {
							text: 'FECHAR',
							btnClass: 'btn-green',
							action: function(){
									var msges = eventos.estoqueexcel(1);																		
									
									$.confirm({
										title: 'Mensagem do APP',
										 content: ''+msges+'',
										 autoClose: 'logoutUser|10000',
										 buttons: {
											 logoutUser: {
												 text: 'Fechar',
												 action: function () {
													window.location.reload();
												 }
											 }
										 }
									 });

									
								}
							}
						}
				   });
				
				
			}
			
			console.log(data);	
		},
		error:function(data){
			spinner.removeClass('active');
		}
	});
	
}

function gravarestricoesnoav(){
	
	var files   = '';
	var ids     = '';
	var array   = [];
	var dl;
	var retorno = 0;
	
	$(".example").each(function(){
		files = $(this).attr('data-id');		
		ids   = $(this).attr('id');
				
		array.push({
			'nped':files,					
		});
		
	});
	$.mobile.loading( 'show', {
			text: 'Listando Clientes..',
			textVisible: true,
			theme: 'b',
			html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Gravando Restrições...</div>"
		});		
	$.ajax({
		type:'POST',
		cache:false, 
		url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/sincronizar-exec.php",
		data:{act:'gravaresticoesapi',ids:array},
		async:false,		
		success: function(data){			
			var res = JSON.parse(data);
			
			if(res[0].msg == 2){				
				  retorno = 0;				  				 			
			}else{
			
				retorno = 1
				
			}
			
			$.mobile.loading('hide');
			console.log(data);	
		},
		error:function(data){
			retorno = 0;
		}
	});
		
	return retorno;	
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
			spinner.removeClass('active');
			retorno = 1;							
			$.confirm({
				title: 'Ops!',
				content: '<strong>Desculpe(a), Servidor não teve um retono,</strong><br/> <mark>Peço que retorne a enviar seus pedidos daqui alguns minutos!</mark><br/> Detalhamento: <br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+' ',
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


function exportaClienteAlterado(){
	var empresa = $("#empresa").val();
	var querys = "select * from CLIENTES";
		try {
			localDB.transaction(function(transaction){
				
				transaction.executeSql(querys, [], function(transaction, results){
				
					var aGlobal = new Array();
					
					if(results.rows.length > 0){
						
						 for (var i=0; i < results.rows.length; i++) {
							aGlobal[i] = results.rows.item(i);							
						  }
						 
						$.ajax({
							type: 'POST',
							url: "http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
							data: {act:'inserircli',result:aGlobal},	
							beforeSend: function(){																	
								dbox = $.dialog({
										title: 'Aguarde enquanto envio a alteração de seus clientes!',
										content: '<div align="center"><img src="../img/ajax_loading.gif" /></div>',
									});
							},	
							cache: false,
							dataType: 'json',			
							success: function(data){		
									
								//$.mobile.loading("hide");										
								dbox.close();
								var str = "";
								
								for(i = 0; i < data.length; i++){
									str += "Cliente Alterado:"+data[i].codigo+" - "+data[i].nome+"\n";						
								} 
								
								alert(str);
								zeratabelaCliente();		
								location.reload();							
							 },
							error: function(jqXHR, exception){				
								$.confirm({
									title: 'Ops!',
									content: '<strong>Desculpe(a), Servidor não teve um retono,</strong><br/> <mark>Peço que retorne a enviar seus dados daqui alguns minutos!</mark><br/> Detalhamento: <br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+' ',
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
								location.reload();
							}
						});
						return false;	
					
					}else{
						location.reload();	
					}			
					
	
					
				}, function(transaction, error){
					updateStatus("Error: SELECT não realizado " + error + ".");
			
				});
			});
		} 
		catch (e) {
			updateStatus("Error: SELECT não realizado " + e + ".");
		} 
	
}
function BuscarDuplicatasVencidas(){
	
	var empresa  = $("#empresa").val();
	var codrepre = $("#codrepre").val();
	
	$.ajax({
		type:'POST',
		cache:false, 
		dataType: "json",
		url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
		data:{act:'duplic_venc',cod:codrepre},
		beforeSend: function(){ 			   			
			
			dbox = $.dialog({
					title: 'Verificando Duplicatas...',
					content: '<div align="center"><img src="../img/ajax_loading.gif" /></div>',
				});
			
		},
		success: function(data){
			//$.mobile.loading("hide");
			dbox.close();
			InserirDuplicatasVenc(data);			
		},
		error: function(jqXHR, exception){
			dbox.close();
			$.confirm({
				title: 'Ops!',
				content: '<strong>Desculpe(a), Servidor não teve um retono,</strong><br/> <mark>Peço que retorne a buscar seus dados daqui alguns minutos!</mark><br/> Detalhamento: <br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+' ',
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
	
}

function InserirDuplicatasVenc(dtarr){
	var box
	$.ajax({
		type:'POST',				
		url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/duplicatas-exec.php",
		data:{act:'inserir',arr:dtarr},
		beforeSend: function(){ 			   						
			 box = $.dialog({
					title: 'Gravando Duplicatas...',
					content: '<div align="center"><img src="../img/ajax_loading.gif" /></div>',
				});
			
		},
		success: function(data){
		
			box.close();
			alert(data);
		},
		error: function(jqXHR, exception){
			$.confirm({
				title: 'Ops!',
				content: '<mark>Desculpe(a), Peço que ligue para nosso suporte para que possamos analizar o erro ocorrido, Obrigado!</mark><br/> Detalhamento:<br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+' ',
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
	
}

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
			$.confirm({
				title: 'Ops!',
				content: '<strong>Desculpe(a), Servidor não teve um retono,</strong><br/> <mark>Peço que retorne a buscar seus dados daqui alguns minutos!</mark><br/> Detalhamento: <br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+' ',
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
}
/* Função de Atualização de dados
	##############################################
 */
 
 $(document).ready(function(e) {
	onInit();
	 var box;
	/*setInterval(function(){*/
		//$(".atualiza").html("Aquarde , atualizando..<br/><img src='../jquery-mobile/images/ajax-loader.gif'/>");
	$("#atualizar").click(function(){
		var empresa = $("#empresa").val();
		$.ajax({
			 type: 'POST',
			 url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
			 data:{act:'clientes',codfor:$('#codrepre').val()},
			 dataType: "json",
			 beforeSend: function(){
 			   $( "[data-role='panel']" ).panel( "close" );									 
				 box = $.dialog({
					title: 'Importando Clientes...',
					content: '<div align="center"><img src="../img/ajax_loading.gif" /></div>',
				});
			 },
			 success: function(data){
								
				var ret = MandaCliente(data);
				
				
				box.close();
				//alert(ret);
				var dlo  = $.dialog({
						title: 'Importando Clientes...',
						content: '<div align="center">'+ret+'<br/><img src="../img/sucess.png" /></div>',
					});
								 
				var intv =  setInterval(function(){
					
					dlo.close();
					clearInterval(intv);
					BuscaCondPag();
					BuscarDuplicatasVencidas(); 
					
				},980); 
				 				 
																									
			},
			error: function(jqXHR, exception){
				box.close();
				$.confirm({
				title: 'Ops!',
				content: '<strong>Desculpe(a), Servidor não teve um retono,</strong><br/> <mark>Peço que retorne a atualizar seus dados daqui alguns minutos!</mark><br/> Detalhamento: <br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+' ',
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
	});
	/*},5000);*/
	
	function MandaCliente(dat){		
		var retorno;		
		$.ajax({
			type:'POST',
			async:false, 
			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/sincronizar-exec.php",
			data:{act:'impcli',arr:dat},
			success: function(data){
				
				retorno = data[0].msg;
				
			},
			error:function(data){
				
				retorno = "Desculpe(a), Peço que ligue para nosso suporte para que possamos analizar o erro ocorrido, Obrigado!";
			}
		});
		
		return retorno;
	
	}
	
	
	$("#atualizarproduto").click(function(){
		var empresa = $("#empresa").val();
		var box;
		
		$.ajax({
			 type: 'POST',
			 url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
			 data:{act:'produtos'},
			 beforeSend: function(){
 			   $( "[data-role='panel']" ).panel( "close" );				
				 
				 box = $.dialog({
					title: 'Importando Produtos...',
					content: '<div align="center"><img src="../img/ajax_loading.gif" /></div>',
				});
				 
			 },
			 success: function(data){
				
						
								
				var ret = MandaProdutos(data);
								
				//$.mobile.loading( 'hide');	
				box.close();
				 				
				 var dlo  = $.dialog({
						title: 'Importando Produtos...',
						content: '<div align="center">'+ret+'<br/><img src="../img/sucess.png" /></div>',
					});
								 
				var intv =  setInterval(function(){
					dlo.close();
					clearInterval(intv);
					var con = $.confirm({
					title: 'Mensagem',
					content: 'Deseja importar fotos dos produtos ?',
					type: 'orange',
					typeAnimated: true,
					buttons: {
						sim: {
							text: 'Sim',
							btnClass: 'btn-green',
							action: function(){
								con.close();
								BuscaFotos();
								
							}
						},
						nao: {
							text: 'Não',
							btnClass: 'btn-red',
							action: function(){
								window.location.reload();
							}
						},
					}
				});					
					
				},980);
				 								 
				
				//$("#resp").html(data);
				//importaprodutos();
																									
			},
			error: function(jqXHR, exception){
				$.confirm({
					title: 'Ops!',
					content: '<strong>Desculpe(a), Servidor não teve um retono,</strong><br/> <mark>Peço que retorne a atualizar seus dados daqui alguns minutos!</mark><br/> Detalhamento: <br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+' ',
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
	});
			 
});

function MandaProdutos(dat){
		
		var retorno;		
		$.ajax({
			type:'POST',
			async:false, 
			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/sincronizar-exec.php",
			data:{act:'imppro',arr:dat},
			success: function(data){
				
				retorno = data[0].msg;
				
			},
			error:function(data){
				
				
			}
		});
		
		return retorno;
	
	}

$(document).on('click','.foto',function(){
	
	BuscaFotos();
	
});

$(document).on('click','.importadados',function(){
	eventos.onInit();
	eventos.AtualizarDados();
	
});

$(document).on('click','#envcli',function(){
	
	exportaClienteAlterado();	
	
});

function BuscaFotos(){
	var box;
	var empresa = $("#empresa").val();
		$('.myprogress').css('width', '0');
		$('.msg').text('');
		
		var htm = "";
			
		$.ajax({
			 type: 'POST',
			 url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
			 data:{act:'foto2'},
			 dataType: "json",
			 cache:false,	
			 beforeSend: function(){ 			   				 
				 box = $.dialog({
					title: 'Buscando Fotos',
					content: '<div align="center"><img src="../img/ajax_loading.gif" /></div>',
				});
				 
			 },
			 success: function(data){																
				
				 
				  box.close();
				 
				  var boxx = $.dialog({
								title: 'Gravando Imagens!',
								content: '<div align="center"><img src="../img/ajax_loading.gif" /></div>',
							});
				 
				 var ht  = ""; 
				 var arr = [];
				 
				 for(i = 0; i < data.ret.length; i++){
					 
					var percentage = i / data.ret.length;
					percentage = (i + 1) * (100/data.ret.length);
					percentage = Math.round(percentage);
					$('.progress').text(percentage + '%');
					$('.progress').css('width', percentage + '%');  
					 
					
					 // The base64 content
					var myBase64    = ""+data.ret[i].ft['Conteudo']+"";
					// To define the type of the Blob, you need to get this value by yourself (maybe according to the file extension)
					var contentType = ""+data.ret[i].ft['Tipo']+"";
					// The path where the file will be saved
					var folderpath  = cordova.file.externalRootDirectory+"htdocs/PROJETOS/service_pedido/fotos/";
					// The name of your file
					var filename    = ""+data.ret[i].ft['Nome']+"";

					//savebase64AsImageFile(folderpath,filename,myBase64,contentType);					 									
					
					arr.push({
						nome: data.ret[i].ft['Nome'], 
						tipo: data.ret[i].ft['Tipo'],
						codigo:data.ret[i].ft['CodigoEstoque'],
						diretorio:folderpath+data.ret[i].ft['Nome'],
						base64:myBase64,
					});
					 
				 }
				 
				 
				 
				var set = setInterval(function(){
					
					var qtdimagem = InserirImagem(arr); 
						boxx.close();	
						alert(qtdimagem);
					 	clearInterval(set);
				},500); 
				 
				
				
				 
			},
			error: function(jqXHR, exception){
				$.mobile.loading( 'hide');
				$.confirm({
					title: 'Ops!',
					content: '<strong>Desculpe(a), Servidor não teve um retono,</strong><br/> <mark>Peço que retorne a atualizar seus dados daqui alguns minutos!</mark><br/> Detalhamento: <br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+' ',
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

function InserirImagem(dt){
		
	var retorno;		
	$.ajax({
		type:'POST',
		async:false, 
		dataType: "json",
		url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/sincronizar-exec.php",
		data:{act:'foto',arr:dt},
		xhr: function () {
			var xhr = new window.XMLHttpRequest();
			xhr.upload.addEventListener("progress", function (evt) {
				if (evt.lengthComputable) {
					var percentComplete = evt.loaded / evt.total;
					percentComplete = parseInt(percentComplete * 100);
					$('.myprogress').text(percentComplete + '%');
					$('.myprogress').css('width', percentComplete + '%');
				}
			}, false);
			return xhr;
		},
		success: function(data){

			retorno = data[0].msg;

		},
		error:function(data){
			$.mobile.loading( 'hide');

		}
	});

	return retorno;
	
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

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 * 
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}

/**
 * Create a Image file according to its database64 content only.
 * 
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
 */
function savebase64AsImageFile(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content,contentType);
    
    //console.log("Starting to write the file :3");
    try{
		window.resolveLocalFileSystemURL(folderpath, function(dir) {
			//console.log("Access to the directory granted succesfully");
			dir.getFile(filename, {create:true}, function(file) {
				//console.log("File created succesfully.");
				//alert("sucesso");
				file.createWriter(function(fileWriter) {
					//console.log("Writing content to file");
					fileWriter.write(DataBlob);
				}, function(){
					alert('Unable to save file in path '+ folderpath);
				});
			});
		});
	}catch(ex){
		alert("Error in data wrirting"+ex);
	}
}
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	// If just one text node inside
	if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
		obj = xml.childNodes[0].nodeValue;
	}
	else if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}
/*function savebase64AsImageFile(folderpath,filename,content,contentType){
		// Convert the base64 string in a Blob
		var sliceSizeData = 512;
		var DataBlob = this.b64toBlob(content,contentType,sliceSizeData);

		console.log("Starting to write the file :3");
		console.log("folderpath :"+folderpath);
	try{
			window.resolveLocalFileSystemURL(folderpath, (dir)=> {
				console.log("Access to the directory granted succesfully");
				dir.getFile(filename, {create:true}, (file)=> {

				file.createWriter((fileWriter)=> {
					 console.log("Writing content to file");
					 fileWriter.write(DataBlob);
					 console.log("File written sucessfully123"+file.fullPath);
					 console.log("File written sucessfully124"+file.nativeURL);

				}, function(){
					alert('Unable to save file in path '+ folderpath);
				});
			});
		});
	}catch(ex){

		alert("Error in data wrirting"+ex);
	}
}*/