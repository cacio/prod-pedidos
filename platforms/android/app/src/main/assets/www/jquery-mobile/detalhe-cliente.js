// JavaScript Document

var localDB = null;
var id = getUrlVars()["id"];

function onInit(){
    try {
        if (!window.openDatabase) {
            updateStatus("Erro: Seu navegador não permite banco de dados.");
        }
        else {
            initDB();			
            createTables();
            createTablesCliente();			
			BuscaDuplicatas();
						
			
			//ListaUltamasCompras(id);
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
    var query = 'CREATE TABLE IF NOT EXISTS duplic_receber (codigo INTEGER PRIMARY KEY AUTOINCREMENT,cedente VARCHAR,nome VARCHAR,emissao DATE,numero_nota VARCHAR,total_nota FLOAT,numero VARCHAR,vencimento DATE, valordoc FLOAT, datapag DATE, SLD_DEV TEXT);';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler);            
        });
    } 
    catch (e) {
        updateStatus("Erro: Data base 'duplic_receber' não criada " + e + ".");
        return;
    }
	
	

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
function zeratabela(){
	
	var query = 'DROP TABLE IF EXISTS duplic_receber;';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler);
            //updateStatus("Tabela 'contato_clientes_geral' status: OK.");
        });
    } 
    catch (e) {
        updateStatus("Erro: Data base 'duplic_receber' não criada " + e + ".");
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
function DeleteCliente(cod){
	
	var query = 'DELETE FROM CLIENTES WHERE id = ? ';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [cod], nullDataHandler, errorHandler);
            //updateStatus("Tabela 'contato_clientes_geral' status: OK.");
        });
    } 
    catch (e) {
        updateStatus("Erro: Data base 'CLIENTES' não criada " + e + ".");
        return;
    }
	
}

$(document).ready(function(e) {

		loadMore(id);	

});
$(window).load(function() {
	setTimeout(getEmployee, 100);	
});


function getEmployee() {
	$(".pedir").attr('href','lista-produtocliente.html?codcli='+id+'');
	//alert(id);
	$.getJSON(''+caminhoURL+'/PROJETOS/webservice_pedido/php/pedido-cliente-exec.php?id='+id+'&act=detalhe', function(data) {
		
		//var employee = data.item;
		//console.log(data);
		$("#id_cli").val(data[0].id);
		$("#xcode").val(data[0].cod);
		$("#xcode_cli").val(data[0].cod);
		$("#xnome").val(data[0].nome);
		$("#xfant").val(data[0].fantasia);
		$("#cpfcnpj").val(data[0].cgc);
		$("#inscricao").val(data[0].ins);
		$("#telefone").val(data[0].fone1);
		$("#celular").val(data[0].celular);
		$("#contato").val(data[0].contato);
		$("#email").val(data[0].emailnfe);
		ListaFormaPagamento(data[0].formapag);
		$("#limite").val(data[0].limite);
		//$('#ativo option[value="'+data[0].ativo+'"]').attr('selected','selected');
		$("#ativo").val(''+data[0].ativo+'').slider("refresh");
		$("#observacao").val(data[0].obs);
		
		//dados enderecos do cliente
		$("#cep_cli").val(data[0].cep);
		$("#endereco_cli").val(data[0].end);
		$("#bairro_cli").val(data[0].bairro);		
		$("#cidade_cli").val(data[0].cidade);
		$("#uf_cli").val(data[0].estado);
		
		//dados de endereco de entrega
		$("#cep_entrega").val(data[0].cepent);
		$("#endereco_entrega").val(data[0].endent);
		$("#bairro_entrega").val(data[0].endent);
		$("#cidade_entrega").val('');
		$("#uf_entrega").val('');
		
		//dados de cobranca
		$("#cep_cobranca").val(data[0].cepcob);
		$("#endereco_cobranca").val(data[0].endcob);
		$("#bairro_cobranca").val('');
		$("#cidade_cobranca").val(data[0].cidcob);
		$("#uf_cobranca").val(data[0].estcob);
		
	});
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// Next page index loaded
var nextPageIndex = 0;

// Indicates if new entries loading is in progress
var loading = false;

// Load more function        
function loadMore(idc) {
		
	if (!loading) {
	
		loading = true;
		
		var query = "SELECT  dup.numero_nota as NUM_NOTA,  dup.total_nota as VLR_NOTA FROM  duplic_receber dup WHERE dup.cedente = ? GROUP BY  dup.numero_nota,dup.total_nota";
		try {
			localDB.transaction(function(transaction){
				
				transaction.executeSql(query, [idc], function(transaction, results){
					
					var targetList = $('#items');
					var datarow    = "";
					
					if (nextPageIndex == 0) {
						targetList.empty();
					}
					var ht = "";
					if(results.rows.length > 0){	
						for (var i = 0; i < results.rows.length; i++) {
						
							var row = results.rows.item(i);
							
							
							//targetList.append("<div data-role='collapsible' id='deta"+row['NUM_NOTA']+"'><h3>"+row['NUM_NOTA']+" - "+row['VLR_NOTA']+"</h3></div>");
							
							detalhefinanc(row['NUM_NOTA']);   
						}
					//alert(ht);
					}else{
						targetList.html('<div align="center"><img src="../img/financ.png" style="opacity: 0.3;"/><br/><h3>Sem Histórico!</h3></div>');
					}
												
					
					
					nextPageIndex = 0;
				
					if (nextPageIndex == 0) {
						$('#content').scrollz('hidePullHeader');
					}
					nextPageIndex++;

					loading = false;
					
				}, function(transaction, error){					
					updateStatus("Error: SELECT não realizado " + error + ".");
					 loading = false;
				});
			});
		} 
		catch (e) {
			updateStatus("Error: SELECT não realizado " + e + ".");
		}           
												
	}
}
            
function detalhefinanc(nnota){
	
	var querys = "select DUP.emissao ,DUP.numero, DUP.vencimento, DUP.valordoc ,DUP.datapag , DUP.SLD_DEV from DUPLIC_RECEBER DUP WHERE dup.numero_nota = ? ";
		try {
			localDB.transaction(function(transaction){
				
				transaction.executeSql(querys, [nnota], function(transaction, results){
					
					var targetList = $('#items');
					
					if (nextPageIndex == 0) {
						targetList.empty();
					}
					
					var htm = "";
					var tot_valor_dev = 0;
					var tot_valor 	  = 0;	
					for (var i = 0; i < results.rows.length; i++) {
					
						var rows = results.rows.item(i);
						
						htm += "------------------------------------------<br/>";
						htm += "NUMERO.......................: "+rows['numero']+"<br/>";
						htm += "DATA EMISSÃO.................: <span style='text-align:left;'>"+formatadata(rows['emissao'])+"</span><br/>";
						htm += "VENCIMENTO...................: "+formatadata(rows['vencimento'])+"<br/>";
						htm += "VALOR........................: <span style='width: 100px;display: inline-block;text-align: right;'>"+number_format(rows['valordoc'],2,',','.')+"</span><br/>";
						htm += "SALDO DEVEDOR................: <span style='width: 100px;display: inline-block;text-align: right;'>"+number_format(rows['SLD_DEV'],2,',','.')+"</span><br/>";																							    
 					    htm += "------------------------------------------<br/>"; 
						
						tot_valor_dev += tot_valor_dev + rows['SLD_DEV'];
						tot_valor	  += tot_valor + rows['valordoc'];
						
					}					
						
						htm += "<div>VALOR SALDO TOTAL............: <span style='width: 100px;display: inline-block;text-align: right;'>"+number_format(tot_valor,2,',','.')+"</span></div><br/>";
						htm += "<div style='background:red;'>SALDO TOTAL DEVEDOR..........: <span style='width: 100px;display: inline-block;text-align: right;'>"+number_format(tot_valor_dev,2,',','.')+"</span></div><br/>";
						
					targetList.html(''+htm+'');
				
					
				}, function(transaction, error){
					
					updateStatus("Error: SELECT não realizado " + error + ".");
			
				});
			});
		} 
		catch (e) {
			
			updateStatus("Error: SELECT não realizado " + e + ".");
		}           
												
	}

          
			
// Load initial items
// loadMore();
            	
// Bind events
$(document).on('bottomreached', '#content', function() {
	// Load more
	
	//loadMore();
});

$(document).on('pulled', '#content', function() {
	 // Reset page index
	nextPageIndex = 0;
	//alert('entro3');    
	// Reload
	loadMore(id);
});


function BuscaDuplicatas(){
		
		var empresa = $("#empresa").val();
		$.ajax({
		type: 'POST',
		url: "http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
		data: {act:'duplic'},	
		beforeSend: function(){	
			
		},	
		cache: false,
		dataType: 'json',			
		success: function(data){		
				//alert(data.length);
			zeratabela();	
			createTables();
			for(var i = 0; i < data.length; i++){
					
					var cod_cli  = data[i].cod_cli;	
					var nome_cli = data[i].nome_cli;
					var dtemiss  = data[i].dtemiss;
					var num_nota = data[i].num_nota;
					var vlenota  = data[i].vlenota;
					var num_dup  = data[i].num_dup;  
					var dtvenc   = data[i].dtvenc;
					var vlrdup   = data[i].vlrdup;
					var dtpag    = data[i].dtpag;
					var sld_dev	 = data[i].sld_dev;

					inserirduplicatascliente(cod_cli,nome_cli,dtemiss,num_nota,vlenota,num_dup,dtvenc,vlrdup,dtpag,sld_dev);
					
			}	
				
								
		 },
		error: function(data){				
			//alert('Servidor indisponível no momento. tente novamente!');
			BuscaDuplicatas();
		}
	});
	return false;

}

function inserirduplicatascliente(cod_cli,nome_cli,dtemiss,num_nota,vlenota,num_dup,dtvenc,vlrdup,dtpag,sld_dev){

	var query = "insert into duplic_receber (cedente, nome,emissao ,numero_nota ,total_nota ,numero ,vencimento , valordoc , datapag , SLD_DEV ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
	try {
		localDB.transaction(function(transaction){
			transaction.executeSql(query, [cod_cli, nome_cli,dtemiss,num_nota,vlenota,num_dup,dtvenc,vlrdup,dtpag,sld_dev], function(transaction, results){
				if (!results.rowsAffected) {
					updateStatus("Erro: Inserção não realizada");
				}
				else {
					
					var cod_cli  = '';	
					var nome_cli = '';
					var dtemiss  = '';
					var num_nota = '';
					var vlenota  = '';
					var num_dup  = '';
					var dtvenc   = '';
					var vlrdup   = '';
					var dtpag    = '';
					var sld_dev	 = '';
					//updateStatus("Inserção realizada, linha id: " + results.insertId);
													
					
				}
			}, errorHandler);
		});
	} 
	catch (e) {
		updateStatus("Erro: INSERT não realizado " + e + ".");
	}
	
			
}

function ListaFormaPagamento(cdf){
	
	var querys = "select CODIGO_DA_FORMA, DESCRICAO, case CODIGO_DA_FORMA when ? then 'selected' end as selected from CONDICOES_PAGAMENTO";
		try {
			localDB.transaction(function(transaction){
				
				transaction.executeSql(querys, [cdf], function(transaction, results){
				
					var htm = "";	
					for (var i = 0; i < results.rows.length; i++) {
					
						var rows = results.rows.item(i);
						
						//htm += "";
						htm += '<option value="'+rows['CODIGO_DA_FORMA']+'" '+rows['selected']+'>'+rows['DESCRICAO']+'</option>';
											    
 					     
					}					
		
					$('select[name="formpag"]').html(htm).selectmenu( "refresh" );
					
				}, function(transaction, error){

					updateStatus("Error: SELECT não realizado " + error + ".");
			
				});
			});
		} 
		catch (e) {
			updateStatus("Error: SELECT não realizados " + e + ".");
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
    document.getElementById('status').innerHTML = status;
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
function formatadata(data){
	var novadata = data.split("-");
	var nvdt = ""+novadata[2] +"/"+novadata[1]+"/"+novadata[0]+"";
	return nvdt;
}

$(document).on('submit','form[id="frmaltcliente"]',function(){
			
	var params = $(this.elements).serialize();
	
	var self = this;
	$.ajax({
	type: 'POST',
	 url: ''+caminhoURL+'/PROJETOS/service_pedido/php/pedido-cliente-exec.php',
	data: params,
	cache: false,
	dataType: 'json',
	// Antes de enviar
	beforeSend: function(){
		
	},
	success: function(data){				
	  
		  //alert(data.id_cli);
		  ListaClienteUm(data.id_cli,data);	
	},
	error: function(data){
		alert('Ops!, Algo deu errado por favor entre em contato com o administrador do sistema , Obrigado!');
		}
	})
	return false;
});

function ListaClienteUm(ccod,data){

	var querys = "SELECT id, CODIGO FROM CLIENTES WHERE CODIGO = ? ";
		try {
			localDB.transaction(function(transaction){
				
				transaction.executeSql(querys, [ccod], function(transaction, results){
					alert(results.rows.length);
					if(results.rows.length > 0){
						alert('entro2');
						var rows = results.rows.item(0);	
						DeleteCliente(rows['id']);
						inserirClientes(data);																			
					 }else{					
					 
						inserirClientes(data);					
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

function inserirClientes(row){

	var query = "insert into CLIENTES (CODIGO , CNPJ_CPF, NOME, ENDERECO, BAIRRO, CEP, CIDADE, ESTADO, TELEFONE, INSCRICAO, ATIVO, CONTA_CTB, MOSTRA_FATURAS, REPRESENTANTE, FANTASIA, CONTATO, E_MAIL, FAX, COND_PAG, LIMITE, END_ENTREGA, BAIRRO_ENTREGA, CIDADE_ENTREGA, UF_ENTREGA, CEP_ENTREGA, END_COB,  BAIRRO_COB, CIDADE_COB, UF_COB, CEP_COB, CELULAR, E_MAILNFE, OBS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
	try {
		localDB.transaction(function(transaction){
			transaction.executeSql(query, [row.xcode_cli, row.cpfcnpj,row.xnome,row.endereco_cli,row.bairro_cli, row.cep_cli, row.cidade_cli, row.uf_cli, row.telefone, row.inscricao, row.ativo, '99999', 'S', row.codrepre, row.xfant, row.contato, row.email, '', row.formpag, row.limite, row.endereco_entrega, row.bairro_entrega, row.cidade_entrega, row.uf_entrega, row.cep_entrega, row.endereco_cobranca,  row.bairro_cobranca, row.cidade_cobranca, row.uf_cobranca, row.cep_cobranca, row.celular, row.email, row.observacao], function(transaction, results){
				if (!results.rowsAffected) {
					updateStatus("Erro: Inserção não realizada");
				}
				else {
					
					//updateStatus("Inserção realizada, linha id: " + results.insertId);
													
					
				}
			}, errorHandler);
		});
	} 
	catch (e) {
		updateStatus("Erro: INSERT não realizado " + e + ".");
	}
	
			
}

$(document).ready(function(e) {
    ListaUltamasCompras(id);
});
function ListaUltamasCompras(xcode){

	    $.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/service_pedido/php/lista-pedidosfeitos-exec.php",
		 data:{act:"listultimas",xcodcli:xcode},
		 dataType:"json",
		 success: function(data){
							
			if(data.length > 0){
				for (var i = 0; i < data.length; i++) {
								
					listapedidosfeitos(data[i].nump,data[i].datap,data[i].nome,data[i].dte,data[i].nnump,data[i].status);
				}
			}else{
				$("#fragment-2").append('<div align="center"><img src="../img/pedult.png" style="opacity: 0.3;"/><br/><h3>Sem Histórico!</h3></div>');	
			}
		},
		error: function(jqXHR, exception){
			//alert('aaaa');
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
function listapedidosfeitos(nump,datap,nome,dtenv,nnump,status){

		$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/service_pedido/php/lista-pedidosfeitos-exec.php",
		 data:{act:"detalhe",nump:nump},
		 dataType:"json",
		 success: function(data){
							
			var html = "";
			 //html += '';
			 html += '<div data-role="collapsible" id="ped'+nump+'" data-collapsed="true">';
			 html += '<h2 class="text-warning">'+status+' | '+nnump+' - '+nome+'</h2>';
			 html += '<ul data-role="listview" data-theme="a" data-divider-theme="b">';
			 html += '<li data-role="list-divider" class="ui-shadow ui-corner-all ui-btn-icon-left ui-icon-calendar">Emissão:'+datap+'<BR/>Entrega  :'+dtenv+' <span class="ui-li-count">'+data.length+'</span></li>';
			 /*html += '<li>';
			 html += '<div data-role="controlgroup" data-type="horizontal" data-mini="true">';
  			 html += '<a href="#" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-top" onClick="deletarpedido('+nump+');">DELETAR PEDIDO</a>';			 
			 html += '<a href="#" class="ui-btn ui-corner-all ui-icon-edit ui-btn-icon-top editp" id="'+nump+'">EDITAR PEDIDO</a>';
			 html += '</div>';
			 html += '</li>';*/
			 		
				for (var i = 0; i < data.length; i++) {
						
					html += '<li><a href="#">';
					
						html += '<h3>'+data[i].cod+' - '+data[i].desc+'</h3>';
						if(data[i].option1 == 1){
							html += '<p><strong>('+data[i].vle+')</strong> | <strong> '+data[i].qtd+' '+data[i].unid+'</strong> | <strong>R$ '+data[i].prec+'</strong> | <strong>R$ '+data[i].somaqtd+'</strong></p>';
						}else{
							html += '<p><strong> '+data[i].qtd+' '+data[i].unid+'</strong> | <strong>R$ '+data[i].prec+'</strong> | <strong>R$ '+data[i].somaqtd+'</strong></p>';
						}
					
					html += '</a></li>';					
					
				}
			html += '</ul>';
			html += '</div>';
			 
			$('#pedidofeitos').append(html); 
			//$( "#pedidofeitos" ).children().trigger( "collapse" );
			//$( "#pedidofeitos" ).collapsibleset( "refresh" );
			//$("#pedidofeitos").listview('refresh');
			$( "#pedidofeitos" ).collapsibleset().trigger('create');	
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