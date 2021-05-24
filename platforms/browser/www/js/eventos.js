// JavaScript Document
var localDB;
var eventos = {
	empresa:$("#empresa").val(),
	localDB:'',
	internet :"No",
	onInit: function(){
	
		try {
        if (!window.openDatabase) {
				eventos.updateStatus("Erro: Seu navegador não permite banco de dados.");
			}
			else {
				eventos.initDB();			
				eventos.createTablesCliente();
				eventos.createTablesMetas();
				eventos.createTablesSinc();
			}
		} 
		catch (e) {
			if (e == 2) {
				eventos.updateStatus("Erro: Versão de banco de dados inválida.");
			}
			else {
				eventos.updateStatus("Erro: Erro desconhecido: " + e + ".");
			}
			return;
		}
		
	},
	
	initDB: function(){
		
		var shortName 	= 'Database';
		var version 	= '1.0';
		var displayName = 'DBPedidos';
		var maxSize 	= 65536; // Em bytes
		localDB 	= window.openDatabase(shortName, version, displayName, maxSize);
		
	},
	
	createTablesCliente: function(){
		
		var query2 = 'CREATE TABLE IF NOT EXISTS CLIENTES (id INTEGER PRIMARY KEY AUTOINCREMENT, CODIGO VARCHAR, CNPJ_CPF VARCHAR, NOME VARCHAR, ENDERECO VARCHAR, BAIRRO VARCHAR, CEP  VARCHAR, CIDADE  VARCHAR, ESTADO  VARCHAR, TELEFONE VARCHAR, INSCRICAO VARCHAR, ATIVO  VARCHAR, CONTA_CTB  VARCHAR, MOSTRA_FATURAS   VARCHAR, REPRESENTANTE  VARCHAR, FANTASIA  VARCHAR, CONTATO  VARCHAR, E_MAIL  VARCHAR, FAX   VARCHAR, COND_PAG  VARCHAR, LIMITE  VARCHAR, END_ENTREGA  VARCHAR, BAIRRO_ENTREGA   VARCHAR, CIDADE_ENTREGA   VARCHAR, UF_ENTREGA   VARCHAR, CEP_ENTREGA  VARCHAR, END_COB   VARCHAR,  BAIRRO_COB  VARCHAR, CIDADE_COB  VARCHAR, UF_COB   VARCHAR, CEP_COB  VARCHAR, CELULAR  VARCHAR, E_MAILNFE  VARCHAR, OBS TEXT);';
		try {
			localDB.transaction(function(transaction){
				transaction.executeSql(query2, [], nullDataHandler, errorHandler);            
			});
		} 
		catch (e) {
			eventos.updateStatus("Erro: Data base 'CLIENTES' não criada " + e + ".");
			return;
		}
	},
	
	zeratabelaCliente: function(){
		var query = 'DROP TABLE IF EXISTS CLIENTES;';
		try {
			localDB.transaction(function(transaction){
				transaction.executeSql(query, [], nullDataHandler, errorHandler);
				//updateStatus("Tabela 'contato_clientes_geral' status: OK.");
			});
		} 
		catch (e) {
			eventos.updateStatus("Erro: Data base 'CLIENTES' não criada " + e + ".");
			return;
		}
		
	},
	
	createTables: function(){
		var query = 'CREATE TABLE IF NOT EXISTS CONDICOES_PAGAMENTO (codigo INTEGER PRIMARY KEY AUTOINCREMENT,CODIGO_DA_FORMA VARCHAR,DESCRICAO VARCHAR);';
		try {
			localDB.transaction(function(transaction){
				transaction.executeSql(query, [], nullDataHandler, errorHandler);            
			});
		} 
		catch (e) {
			eventos.updateStatus("Erro: Data base 'CONDICOES_PAGAMENTO' não criada " + e + ".");
			return;
		}
	},	
		
	zeratabela: function(){
	
		var query = 'DROP TABLE IF EXISTS CONDICOES_PAGAMENTO;';
		try {
			localDB.transaction(function(transaction){
				transaction.executeSql(query, [], nullDataHandler, errorHandler);
				//updateStatus("Tabela 'contato_clientes_geral' status: OK.");
			});
		} 
		catch (e) {
			eventos.updateStatus("Erro: Data base 'CONDICOES_PAGAMENTO' não criada " + e + ".");
			return;
		}
		
	},	
	createTablesMetas: function(){
	
		var query = 'CREATE TABLE IF NOT EXISTS METAS (ID INTEGER PRIMARY KEY AUTOINCREMENT,ID_VENDEDOR INTEGER,DATA_COPETENCIA DATE,META FLOAT(10,2),META_ATINGIDA FLOAT(10,2));';
		try {
			localDB.transaction(function(transaction){
				transaction.executeSql(query, [], nullDataHandler, errorHandler);            
			});
		} 
		catch (e) {
			eventos.updateStatus("Erro: Data base 'METAS' não criada " + e + ".");
			return;
		}
	},	
	createTablesSinc: function(){
		var query = 'CREATE TABLE IF NOT EXISTS sync (ID INTEGER PRIMARY KEY AUTOINCREMENT,DATA DATE);';
		try {
			localDB.transaction(function(transaction){
				transaction.executeSql(query, [], nullDataHandler, errorHandler);            
			});
		} 
		catch (e) {
			eventos.updateStatus("Erro: Data base 'sync' não criada " + e + ".");
			return;
		}
	},	
	errorHandler: function(transaction, error){
		eventos.updateStatus("Erro: " + error.message);
		return true;
	},
	successCB: function(transaction, error){
		this.updateStatus("sucesso: " + error.message);
		return true;
	},
	nullDataHandler: function(transaction, results){
	},
	
	updateStatus: function(status){
		 alert(status);		
	},
	OrdenaPedido: function(){
		
		$(':mobile-pagecontainer').pagecontainer('change', '#order',{
			transition: 'slideup',
			changeHash: false,
			reverse: false,
			showLoadMsg:true,
			loadMsgDelay: 1
		});		
	
		var files = '';
		var array = [];

		$(".selected").each(function(){
			files = $(this).attr('data-id');		
			array.push(files);
		});
		
		if(files == ""){
			alert("Nem um Pedido selecionado!");
			return false;
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
		
	},
	MoverArquivoSelecionado: function(){
	
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


		//alert(array);
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
		
	},
	
	EnviarDados: function(){	
			
		this.MoverArquivoSelecionado();
		
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

						 retop = this.MandPedidoAgora(data[i].act,data[i].xml);

						 //alert(print_r(retop));

						if(retop == 1){
							mensag = "Desculpe, Não foi possivel acessar o servidor.";
							break;				
						}
						 ret  = this.RetornoPedidoAgora(retop);

						 mensag += ret;
					}

				}
				//$.mobile.loading("hide");
				dbox.close();
				alert(mensag);
				this.exportaClienteAlterado();

				location.reload();
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
			
	},
	
	MandPedidoAgora: function(act,xml){
		
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
	},
	RetornoPedidoAgora: function(dat){
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
		
	},

	exportaClienteAlterado: function(){
		
		var empresa = $("#empresa").val();
		var querys  = "select * from CLIENTES";
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
								eventos.zeratabelaCliente();		
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
					this.updateStatus("Error: SELECT não realizado " + error + ".");
			
				});
			});
		} 
		catch (e) {
			this.updateStatus("Error: SELECT não realizado " + e + ".");
		}
	},
	
	BuscarDuplicatasVencidas: function(){
		
		var empresa  = $("#empresa").val();
		var codrepre = $("#codrepre").val();
		var ret;      
		var dbox;
		
		$.ajax({
			type:'POST',
			async:false, 
			dataType: "json",
			url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
			data:{act:'duplic_venc',cod:codrepre},	
			success: function(data){
				//$.mobile.loading("hide");
				
				ret = eventos.InserirDuplicatasVenc(data);			
			},
			error: function(jqXHR, exception){			
				ret = '<strong>Desculpe(a), Servidor não teve um retono,</strong><br/> <mark>Peço que retorne a buscar seus dados daqui alguns minutos!</mark><br/> Detalhamento: <br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+'';
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

		return ret;
	},
	InserirDuplicatasVenc: function(dtarr){
		var box
		var retorno;

		$.ajax({
			type:'POST',				
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/duplicatas-exec.php",
			data:{act:'inserir',arr:dtarr},
			async:false,			
			success: function(data){
				
				
				retorno = data;
			},
			error: function(jqXHR, exception){
				retorno = '<mark>Desculpe(a), Peço que ligue para nosso suporte para que possamos analizar o erro ocorrido, Obrigado!</mark><br/> Detalhamento:<br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+'';
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
		
		return retorno;

	},
	BuscarDuplicatasVencidasPorCliente: function($codcli){
		
		var empresa  = $("#empresa").val();
		var codrepre = $("#codrepre").val();
		var ret;      
		var dbox;
		
		$.ajax({
			type:'POST',
			async:false, 
			dataType: "json",
			url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
			data:{act:'duplic_venc_cli',cod:codrepre,codcli:$codcli},	
			success: function(data){
				//$.mobile.loading("hide");
				
				ret = eventos.InserirDuplicatasVenc(data);
				console.log(ret);			
			},
			error: function(jqXHR, exception){							
				ret = '<strong>Desculpe(a), Servidor não teve um retono,</strong><br/> <mark>Peço que retorne a buscar seus dados daqui alguns minutos!</mark><br/> Detalhamento: <br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+'';				
				console.log(ret);
			}				
		});	

		return ret;
	},
	BuscaCondPag: function(){
		
		var empresa = $("#empresa").val();
		var retorn;

		$.ajax({
			type:'POST',
			async:false, 
			dataType: "json",
			url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
			data:{act:'condpag'},
			success: function(data){

				eventos.zeratabela();
				eventos.createTables();		

				for(var i = 0; i < data.length; i++){

						var codigo   = data[i].codigo;	
						var descrica = data[i].descricao;


						eventos.inserircondpag(codigo,descrica);

				}
				retorn = ' <strong>'+data.length+'</strong> atualizadas com sucesso!';
			},
			error: function(jqXHR, exception){
				retorn = '<strong>Desculpe(a), Servidor não teve um retono,</strong><br/> <mark>Peço que retorne a buscar seus dados daqui alguns minutos!</mark><br/> Detalhamento: <br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+'';
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
		
		return retorn;
	},
	MandaCliente: function(dat){
		
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
	},
	AtualizarDados: function(){
		
		var box;
		var msg = '';
		var empresa = $("#empresa").val();
		$.ajax({
			 type: 'POST',
			 url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
			 data:{act:'clientes',codfor:$('#codrepre').val()},
			 dataType: "json",
			 beforeSend: function(){
 			   $( "[data-role='panel']" ).panel( "close" );									 
				 box = $.dialog({
					title: 'Importando Dados...',
					content: '<div align="center"><img src="../img/ajax_loading.gif" /></div>',
				});
			 },
			 success: function(data){
				if(data.length > 0){
					var ret = "<strong>CLIENTES:</strong><br/><div style='display: inline-block;margin-left: 35px;'>"+eventos.MandaCliente(data)+"</div>";
			 	}else{
					var ret = "<strong>CLIENTES:</strong><br/><div style='display: inline-block;margin-left: 35px;'>"+"Não existe cliente cadastrado para este vendedor/empresa!</div>";
				}
				 
				msg += ret;
							
				msg += '<hr>';				 
				var intv =  setInterval(function(){
					
					
					clearInterval(intv);
					
					msg += '<strong>PRODUTOS:</strong><br/>';
					msg += '<div style="display: inline-block;margin-left: 35px;">'+eventos.AtualizaProdutos()+'</div>';
					msg += '<hr>';
					msg += '<strong>FINANCEIRO:</strong><br/>';				
					msg += '<div style="display: inline-block;margin-left: 35px;"><strong>Forma de pagamento:</strong><br/>'+eventos.BuscaCondPag()+'</div><br/>';					
					msg += '<div style="display: inline-block;margin-left: 35px;"><strong>Duplicatas:</strong><br/>'+eventos.BuscarDuplicatasVencidas()+'</div><br/>'; 
					msg += '<hr>';
					msg += '<strong>ESTOQUE:</strong><br/>';										
					msg += '<div style="display: inline-block;margin-left: 35px;">'+eventos.estoqueexcel('')+'</div><br/>';
					
					msg += '<hr>';

					if($('#tabpreco').val() == 1){
						msg += '<strong>TABELA DE PREÇO:</strong><br/>';
						msg += '<div style="display: inline-block;margin-left: 35px;">'+eventos.buscatabelapreco()+'</div><br/>';
						msg += '<hr>';
					}
					
					msg += eventos.buscamargemproduto();
					msg += '<hr>';

					box.close();
					
					$.dialog({
						title: 'MENSAGEM DE IMPORTAÇÃO',
						content: ''+msg+'<br/><div align="center"><img src="../img/sucess.png" /></div>',
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
		
	},
	
	AtualizaProdutos: function(){
		var empresa = $("#empresa").val();
		var box;
		var reto;

		$.ajax({
			 type: 'POST',
			 url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
			 data:{act:'produtos'},
			 async:false,			
			 success: function(data){
				
						
								
				var ret = eventos.MandaProdutos(data);
				
				reto = ret;

				//$.mobile.loading( 'hide');					
								
						
				/*var intv =  setInterval(function(){
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
								this.BuscaFotos();
								
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
					
				},980);*/
				 								 
				
				//$("#resp").html(data);
				//importaprodutos();
																									
			},
			error: function(jqXHR, exception){
				reto = '<strong>Desculpe(a), Servidor não teve um retono,</strong><br/> <mark>Peço que retorne a atualizar seus dados daqui alguns minutos!</mark><br/> Detalhamento: <br/> Status:'+jqXHR.status+'<br/> Response: '+jqXHR.responseText+' Execption: '+exception+'';
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

		return reto;	
	},
	MandaProdutos: function(dat){
		
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
		
	},
	BuscaFotos: function(){
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
					
					var qtdimagem = this.InserirImagem(arr); 
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
	},
	InserirImagem: function(dt){
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
	},
	
	inserircondpag: function(cod,desc){
		
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
				}, eventos.errorHandler);
			});
		} 
		catch (e) {
			eventos.updateStatus("Erro: INSERT não realizado " + e + ".");
		}
		
	},
	buscatabelapreco:function(){

		 	var  emp = $("#empresa").val();			
		 	var retorno;

			$.ajax({
				type:'POST',
				async:false, 
				dataType: "json",
				url:"http://api.prodapro.com.br/pedidos/"+emp+"/php/recebe-exec.php",
				data:{act:'tabpreco'},
				success: function(data){
					
				 var tabpre = eventos.inserirtabpreco(data);
				 retorno = tabpre.tabpreco[0].msg+'<br/>'+tabpre.tabprecoprod[0].msg;

				 	/*if(tabpre.tabpreco.length > 0){

				 		if(tabpre.tabpreco[0].tipo == 1){

							alert(tabpre.tabpreco[0].msg);				 			
				 		}else{
				 			alert(tabpre.tabpreco[0].msg);	
				 		}	
				 	}

				 	if(tabpre.tabprecoprod.length > 0){
				 		if(tabpre.tabprecoprod[0].tipo == 1){

							alert(tabpre.tabprecoprod[0].msg);				 			
				 		}else{
				 			alert(tabpre.tabprecoprod[0].msg);	
				 		}
				 	}*/

				},
				error:function(jqXHR, exception){
					
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

			return retorno;

	},	
	inserirtabpreco: function(dados){

		var retorno;		
			$.ajax({
				type:'POST',
				async:false, 
				dataType: "json",
				url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/tabpreco-exec.php",
				data:{act:'inserir',arr:dados},
				success: function(data){
					
					retorno =data;
					
				},
				error:function(data){
					retorno =data;
					
				}
			});
			
			return retorno;

	},
	buscamargemproduto:function(){
		var  emp    = $("#empresa").val();
		var idrepre = $("#codrepre").val();
		var retorno;		
		$.ajax({
			type:'POST',
			async:false, 
			dataType: "json",
			url:"http://api.prodapro.com.br/pedidos/"+emp+"/php/recebe-exec.php",
			data:{act:'margemproduto',idvend:idrepre},
			success: function(data){
				
				var marg = eventos.inserirmargemnoconfig(data[0].margemproduto,data[0].margemprodutovalor,data[0].conf);
				retorno =marg;
				
			},
			error:function(jqXHR, exception){
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
		
		return retorno;

	},
	inserirmargemnoconfig:function(margemproduto,margemprodutopercent,conf){

		var retorno;		
		$.ajax({
			type:'POST',
			async:false, 
			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/config-exec.php",
			data:{act:'gravanoconf',margemproduto:margemproduto,margemprodutopercent:margemprodutopercent,conf:conf},
			success: function(data){
				
				retorno = data[0].msg;
				
			},
			error:function(data){
				retorno =data;
				
			}
		});
		
		return retorno;

	},
	estoqueexcel:function(ind){
		var  emp = $("#empresa").val();
		var retorno;		
		$.ajax({
			type:'POST',
			async:false, 
			dataType: "json",
			url:"http://api.prodapro.com.br/pedidos/"+emp+"/php/recebe-exec.php",
			data:{act:'buscaextoqueexcel',venda:ind},
			success: function(data){
				if(data.length ==0){
					retorno = "Não existe nada cadastrado de estoque!";
				}

				if(data.length > 0){
					retorno = eventos.gravaestoque(data);	
				}

				//var marg = eventos.inserirmargemnoconfig(data[0].margemproduto,data[0].margemprodutovalor);
				//retorno =marg;
				
			},
			error:function(jqXHR, exception){
				
				retorno = "Não Consegui atualizar o estoque , verifique sua internet !"; 
				
			}
		});
		
		return retorno;
	},
	gravaestoque:function(dat){

		var retorno;		
		$.ajax({
			type:'POST',
			async:false, 
			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/recebe-exec.php",
			data:{act:'atualizaestoque',dados:dat},
			success: function(data){
				
				retorno = data[0].msg;
				
			},
			error:function(data){
				retorno =data;
				
			}
		});
		
		return retorno;

	},
	buscaclientebloqueado:function(){

		var  emp 	= $("#empresa").val();
		var idrepre = $("#codrepre").val();
		var retorno;		
		$.ajax({
			type:'POST',
			async:false,
			dataType: "json",
			url:"http://api.prodapro.com.br/pedidos/"+emp+"/php/recebe-exec.php",
			data:{act:'buscabloqueados',codrepre:idrepre},
			beforeSend:function(){
				$.mobile.loading( "show", {
					text: "Aguarde processando..",
					textVisible: true,
					theme: "b",
					html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde processando..</div>"
				  });
			},
			success: function(data){
				if(data.length ==0){
					retorno = "Não existe clientes bloqueados!";
				}

				if(data.length > 0){
					
					if(data[0].tipo == 2){

						console.log(data[0].msg);
					}else{
						//aqui update

						var res = eventos.updateclientebloqueados(data);
						$.mobile.loading( 'hide');
						console.log("quantidade: "+res);
						
					}

				}
				
				
			},
			error:function(jqXHR, exception){
				
				retorno = "Não Consegui atualizar o estoque , verifique sua internet !"; 
				
			}
		});
		
		return retorno;

	},
	updateclientebloqueados:function(dat){

		var retorno;		
		$.ajax({
			type:'POST',
			async:false, 
			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/recebe-exec.php",
			data:{act:'updatebloqueados',dados:dat},
			success: function(data){
				
				retorno = data.length;
				
			},
			error:function(data){
				retorno =data;
				
			}
		});
		
		return retorno;

	},
	buscaclientebloqueadoUm:function(codcli){

		var  emp 	= $("#empresa").val();
		var idrepre = $("#codrepre").val();
		var retorno;		
		$.ajax({
			type:'POST',
			cache:false, 
			dataType: "json",
			url:"http://api.prodapro.com.br/pedidos/"+emp+"/php/recebe-exec.php",
			data:{act:'buscabloqueadosum',codcli:codcli},
			beforeSend:function(){
				$.mobile.loading( "show", {
					text: "Aguarde processando..",
					textVisible: true,
					theme: "b",
					html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde processando..</div>"
				  });
			},
			success: function(data){
				if(data.length ==0){
					retorno = "Não existe clientes bloqueados!";
				}

				if(data.length > 0){
					
					if(data[0].tipo == 2){

						console.log(data[0].msg);
					}else{
						//aqui update

						var res = eventos.updateclientebloqueados(data);
						$.mobile.loading( 'hide');
						console.log("quantidade: "+res);
						
					}

				}
				
				
			},
			error:function(jqXHR, exception){
				
				retorno = "Não Consegui atualizar, verifique sua internet !"; 
				
			}
		});
		
		return retorno;

	},
	verificainternet:function(){

		var networkState = navigator.connection.type;
		var retorno = {};
		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown';
		states[Connection.ETHERNET] = 'Ethernet';
		states[Connection.WIFI]     = 'WiFi';
		states[Connection.CELL_2G]  = '2G';
		states[Connection.CELL_3G]  = '3G';
		states[Connection.CELL_4G]  = '4G';
		states[Connection.CELL]     = 'generic';
		states[Connection.NONE]     = 'No';
		console.log('Tipo de conexão com a Internet: ' + states[networkState]);
		eventos.internet = states[networkState];

		if (eventos.internet !== 'Unknown' || eventos.internet !== 'No'){			
			 retorno = {
				'tipo':'1',
				'msg':'Conectado a uma internet: '+eventos.internet+' '
			};
		}else{
			 retorno = {
				'tipo':'2',
				'msg':'"Esta Off-line'
			};
			
		}

		return retorno;
	}

}