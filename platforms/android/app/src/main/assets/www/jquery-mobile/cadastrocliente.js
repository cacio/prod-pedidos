// JavaScript Document

function ListaFormaPagamento(cdf){
	
	var querys = "select CODIGO_DA_FORMA, DESCRICAO, case CODIGO_DA_FORMA when ? then 'selected' end as selected from CONDICOES_PAGAMENTO";
		try {
			localDB.transaction(function(transaction){
				
				transaction.executeSql(querys, [cdf], function(transaction, results){
				
					var htm = "";	
					for (var i = 0; i < results.rows.length; i++) {
					
						var rows = results.rows.item(i);
						
						if(rows['DESCRICAO'] == 'BOLETO'){
							htm += '<option value="'+rows['CODIGO_DA_FORMA']+'" selected>'+rows['DESCRICAO']+'</option>';
						}else{
							htm += '<option value="'+rows['CODIGO_DA_FORMA']+'" '+rows['selected']+'>'+rows['DESCRICAO']+'</option>';
						}
								//BOLETO			    
 					     
					}					
		
					$('select[name="formpag"]').html(htm).selectmenu( "refresh" );
														
									
				}, function(transaction, error){
					updateStatus("Error: SELECT não realizado " + error + ".");
			
				});
			});
		} 
		catch (e) {
			updateStatus("Error: SELECT não realizado " + e + ".");
		}           
												
}

$(document).ready(function(e) {
		ListaFormaPagamento('');
		ListaClienteParaExportar();
	
	 $forms = $('form[id="frmcadclientes"]');	
	
		$forms.validate({
			rules: {
			 ins:{        
                    required: function(){
						if($("input[name='option']:checked").val() == 2){
							return false;
						}else{
							return true;
						}
					}
                },
			cnpj:{
					required:true,
				},
			nome:{
					required:true,
				},
			fant:{
					required:function(){
						if($("input[name='option']:checked").val() == 2){
							return false;
						}else{
							return true;
						}
					},
				},
			cep:{
					required:true,
				},
			estado:{
					required:true,
				},
			endereco:{
					required:true,
				},
			nro:{
					required:true,
				},	
			bairro:{
					required:true,
				},
			cidade:{
					required:true,
				},
			contato_nome:{
					required:true,
				},
			tel:{
					required:true,
				},
			email:{
					required:false,
				},
			limit:{
				required: function(element){
					if($("select[name='formpag'] option:selected").text() == 'BOLETO' || $("select[name='formpag'] option:selected").text() == 'A PRAZO'){
						if($("#limit").val() > 0){
							return true;	
						}else{
							return false;
						}
					}else{
						return false;
					}
					
				},				
			},
			formpag:{
					required:true,
				}	
			},
		messages:{
			 ins: {
                      required:"Informar Uma inscrição estadual",                      
                  },		  					  
			  cnpj: {
                      required:"Informar um cnpj ou cpf valido!",                      
                  },
			  nome: {
                      required:"Informar uma razão social!",                      
                  },
			  fant: {
                      required:"Informar um nome fantasia!",                      
                  },
			  cep: {
                      required:"Informar um CEP!",                      
                  },
			  estado: {
                      required:"Informar uma sicla do estado !",                      
                  },
			  endereco: {
                      required:"Informar um endereço !",                      
                  },
              nro: {
                      required:"Informar um numero !",                      
                  },    
			  bairro: {
                      required:"Informar um Bairro !",                      
                  },
			  cidade: {
                      required:"Informar uma cidade !",                      
                  },
				contato_nome:{
					required:"Informar uma nome de contato !",  
			  	},
				tel:{
					required:"Informar o telefone do contato !",  
			  	},
				email:{
					required:"Informar o email do contato !",
					email: true,
			  	},
				limit:{
					required:"Informar um limite !",  
			  	},
				formpag:{
					required:"Informar uma forma de pagamento !",  
			  	}
			},
			submitHandler: function( form ) {
				
				if($("select[name='formpag'] option:selected").text() == 'A PRAZO'){										
					
					if($("#prazo1").val() == "" || $("#prazo1").val() == '0'){
						
						alert('Infome pelomenos um prazo para este cliente!');
						
						return false;
						
					}					
					
				}
				
				var params = $(form).serialize();							
				//var self = this;
				$.ajax({
					type: 'POST',
					 url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/cliente-exec.php',
					data: params,
					cache: false,
					dataType: 'json',
					// Antes de enviar
					beforeSend: function(){
						$.mobile.loading( 'show', {
							text: 'Cadastrando Cliente..',
							textVisible: true,
							theme: 'b',
							html: "Cadastrando Cliente.."
						});	
					},
					success: function(data){				

					   $.mobile.loading( 'hide');  

						//alert(data[0].msg);
						ExportaClienteNovo(data);

					 },
					error: function(data){
						alert('Ops!, Algo deu errado por favor entre em contato com o administrador do sistema , Obrigado!');
					}
				})
				return false;
				
				
			}
		});
	
	 // Crio uma variável chamada $forms que pega o valor da tag form
   
   	/* $forms.bind('submit', function(){
		
        
    });	*/
		
});

function ExportaClienteNovo(res){

	var empresa = $("#empresa").val();
	$.ajax({
			 type: 'POST',
			 url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
			 data:{act:'inserir',result:res},
			 beforeSend: function(){
 			   $( "[data-role='panel']" ).panel( "close" );
				$.mobile.loading( 'show', {
					text: 'Exportando Cliente...',
					textVisible: true,
					theme: 'b',
					html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Exportando Cliente...</div>"
				});		 
			 },
			 dataType: "json",
			 cache:false,
			 success: function(data){
														
				var resp;
				var atc = ""; 
				for(var i = 0; i < data.length; i++){
					
					resp = data[i];	
					
					atc += AtualizaCodigoCliente(resp);
					
				}
				 
				$.mobile.loading( 'hide'); 
				 
				alert(atc);			
					
				
				var confi = confirm("Deseja Cadastrar Outro Cliente");		
				 
				if(confi == true){
					window.location.reload();
				}else{
					window.location.href = "admin.html";
				} 
				 
			},
			error: function(jqXHR, exception){
				$.mobile.loading( 'hide'); 
				/*alert('Esta sem internet para enviar o cliente, tente mais tarde!');
				var confi = confirm("Deseja Cadastrar Outro Cliente");		
				 
				if(confi == true){
					window.location.reload();
				}else{
					window.location.href = "admin.html";
				} */
				
			}	
		});

	
	function AtualizaCodigoCliente(req){				
		var ret = "";
		$.ajax({
			 type: 'POST',
			 url:''+caminhoURL+'/PROJETOS/webservice_pedido/php/cliente-exec.php',
			 data:{act:'updatecod',CODIGO:req.CODIGO,COD_RETA:req.COD_RETA,ATIVO:req.ATIVO},
			 beforeSend: function(){
 			   $( "[data-role='panel']" ).panel( "close" );
				$.mobile.loading( 'show', {
					text: 'Aguarde Finalizando',
					textVisible: true,
					theme: 'b',
					html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde Finalizando...</div>"
				});		 
			 },
			 dataType: "json",
			 async:false,
			 success: function(data){
				var msgs = "";										
				for(var x = 0; x < data.length; x++){
					
					msgs += data[x].msg;
				}
				 ret = msgs;
								
			},
			error: function(jqXHR, exception){
				 alert('Ops!, Algo deu errado por favor entre em contato com o administrador do sistema , Obrigado!');	
			}	
		});
		
		return ret;
		
	}


}


$(document).ready(function(e) {
	 $("#cnpj").mask("99.999.999/9999-99");
	 $("#cep").mask("99999999");
	 $("#tel").mask("(99)99999-9999");
	 $('#limit').mask("000.000,00", {reverse: true,placeholder: "0"});
	
	$(".errocnpjcpf").hide();
	
	$("input[name='option']").change(function(){
		//alert($(this).val());
		if($(this).val() == 1){
			$("#cnpj").mask("99.999.999/9999-99");
		}else{
			$("#cnpj").mask("999.999.999-99");
			$("#ins").val('ISENTO');
		}
		
	});
	
	/*$("#limit").keyup(function(){
		
		if($(this).val() > 100000){
			
		}
		
	});*/
	
});

function ListaClienteParaExportar(){
	$("#reenviar").hide();	
	$.ajax({
			 type: 'POST',
			 url:''+caminhoURL+'/PROJETOS/webservice_pedido/php/cliente-exec.php',
			 data:{act:'cliexport'},
			 beforeSend: function(){
 			   
				$.mobile.loading( 'show', {
					text: 'Listando',
					textVisible: true,
					theme: 'b',
					html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Listando...</div>"
				});		 
			 },
			 dataType: "json",
			 cache:false,
			 success: function(data){
														
				var html = '';
				 
				 if(data.length > 0){
				 
					 for(var i = 0; i < data.length; i++){

						 html += '<li><a href="#">'+data[i].NOME+'</a></li>';					 

					 }
					$("#reenviar").show();
				 }else{
					html = "<div align='center'><img src='../img/ok.png' /><br/>Não ah clientes para exportar!</div>";		 
				 }
				 
				 $("#cliinativo").html(html);
				 $("#cliinativo").listview().trigger("create");
				 $("#cliinativo").listview('refresh');
				  $.mobile.loading( 'hide'); 
				 
				 //cliinativo
			},
			error: function(jqXHR, exception){
				 alert('Ops!, Algo deu errado por favor entre em contato com o administrador do sistema , Obrigado!');	
			}	
		});
		
}

function ColetaClientes(){
	var dados;
	$.ajax({
			 type: 'POST',
			 url:''+caminhoURL+'/PROJETOS/webservice_pedido/php/cliente-exec.php',
			 data:{act:'cliexport'},
			 dataType: "json",
			 async:false,
			 success: function(data){
														
				dados = data;	
				 
				
			},
			error: function(jqXHR, exception){
				 dados = [];
				 alert('Ops!, Algo deu errado por favor entre em contato com o administrador do sistema , Obrigado!');	
			}	
		});
	return dados;
}

$(document).ready(function(){
	
	$("#reenviar").click(function(){
		
		var dados = ColetaClientes();
		if(dados.length > 0){
			ExportaClienteNovo(dados);
		}else{
			alert("Não a nada");
		}
	});
	
});


$(document).ready(function() {

            function limpa_formulário_cep() {
                // Limpa valores do formulário de cep.
                $("#endereco").val("");
                $("#bairro").val("");
                $("#cidade").val("");
                $("#estado").val("");
                $("#ibge").val("");
            }
            
            //Quando o campo cep perde o foco.
            $("#cep").blur(function() {

                //Nova variável "cep" somente com dígitos.
                var cep = $(this).val().replace(/\D/g, '');

                //Verifica se campo cep possui valor informado.
                if (cep != "") {

                    //Expressão regular para validar o CEP.
                    var validacep = /^[0-9]{8}$/;

                    //Valida o formato do CEP.
                    if(validacep.test(cep)) {

                        //Preenche os campos com "..." enquanto consulta webservice.
                        $("#endereco").val("...");
                        $("#bairro").val("...");
                        $("#cidade").val("...");
                        $("#estado").val("...");
                        $("#ibge").val("...");

                        //Consulta o webservice viacep.com.br/
                        $.getJSON("http://www.viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

                            if (!("erro" in dados)) {
                                //Atualiza os campos com os valores da consulta.
                                $("#endereco").val(dados.logradouro);
                                $("#bairro").val(dados.bairro);
                                $("#cidade").val(dados.localidade);
                                $("#estado").val(dados.uf);
                                $("#ibge").val(dados.ibge);
                            } //end if.
                            else {
                                //CEP pesquisado não foi encontrado.
                                limpa_formulário_cep();
                                alert("CEP não encontrado.");
								$("#cep").val('');
								$("#cep").focus();
                            }
                        });
                    } //end if.
                    else {
                        //cep é inválido.
                        limpa_formulário_cep();
                        alert("Formato de CEP inválido.");
						$("#cep").val('');
						$("#cep").focus();
                    }
                } //end if.
                else {
                    //cep sem valor, limpa formulário.
                    limpa_formulário_cep();
                }
            });
        });

$(document).ready(function(){
	
	$("#cnpj").blur(function(){
		
		if($("input[name='option']:checked").val() == 1){
			if(validarCNPJ($(this).val())){
				$(".errocnpjcpf").hide();
				var svcli = verificacasdastroserver($(this).val().replace(/[^\d]+/g,''));
				if(svcli[0].tipo == 1){
					alert("CNPJ OU CPF JA EXISTE!:\n CLIENTE: ("+svcli[0].cod_cli+") - "+svcli[0].nome+"\n DO VENDEDOR: "+svcli[0].vendedor+"\n DETALHE: Status:"+svcli[0].nomestatus+" OBS:"+svcli[0].obs+" Situação:"+svcli[0].situacao+" ");
					$(this).val('');
					$(this).focus();
					$(".errocnpjcpf").show();
				}else{
					var vcli = ClienteExisteCadastro($(this).val().replace(/[^\d]+/g,''));
					
					if(vcli[0].msg == 1){
						
						alert("CNPJ OU CPF JA EXISTE!");
						
						$(this).val('');
						$(this).focus();
						$(".errocnpjcpf").show();	
					}
				}
			}else{
				//alert("cnpj invalido");
				$(this).val('');
				$(this).focus();
				$(".errocnpjcpf").show();	
				//$(this).select();
			}
		}else{
			
			if(validarCPF($(this).val())){
				$(".errocnpjcpf").hide();
				var svcli = verificacasdastroserver($(this).val().replace(/[^\d]+/g,''));
				if(svcli[0].tipo == 1){
					
					alert("CNPJ OU CPF JA EXISTE!:\n CLIENTE: ("+svcli[0].cod_cli+") - "+svcli[0].nome+"\n DO VENDEDOR: "+svcli[0].vendedor+"\n DETALHE: Status:"+svcli[0].nomestatus+" OBS:"+svcli[0].obs+" Situação:"+svcli[0].situacao+" ");
						
					$(this).val('');
					$(this).focus();
					$(".errocnpjcpf").show();	
							
				}else{
					var vcli = ClienteExisteCadastro($(this).val().replace(/[^\d]+/g,''));
					
					if(vcli[0].msg == 1){
						
						alert("CNPJ OU CPF JA EXISTE!");
						
						$(this).val('');
						$(this).focus();
						$(".errocnpjcpf").show();	
					}
				}
			}else{
				$(this).val('');
				$(this).focus();
				$(".errocnpjcpf").show();	
			}
			
		}
		
	});
	
	
	$("#email").blur(function(){
	    if($(this).val()){				
			if(!validateEmail($(this).val())){
				
				//alert("E-Mail incorreto, digite um email valido");
				
				$(this).val('');
				$(this).focus();
							
			}
		}
	});
			
});


function validateEmail(sEmail) {
			
	var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;

	if (filter.test(sEmail)) {
		return true;
	}else{				
		return false;
	}
}

function validarCNPJ(cnpj) {
 	
		cnpj = cnpj.replace(/[^\d]+/g,'');

		if(cnpj == '') return false;

		if (cnpj.length != 14)
			return false;

		// Elimina CNPJs invalidos conhecidos
		if (cnpj == "00000000000000" || 
			cnpj == "11111111111111" || 
			cnpj == "22222222222222" || 
			cnpj == "33333333333333" || 
			cnpj == "44444444444444" || 
			cnpj == "55555555555555" || 
			cnpj == "66666666666666" || 
			cnpj == "77777777777777" || 
			cnpj == "88888888888888" || 
			cnpj == "99999999999999")
			return false;

		// Valida DVs
		tamanho = cnpj.length - 2
		numeros = cnpj.substring(0,tamanho);
		digitos = cnpj.substring(tamanho);
		soma = 0;
		pos = tamanho - 7;
		for (i = tamanho; i >= 1; i--) {
		  soma += numeros.charAt(tamanho - i) * pos--;
		  if (pos < 2)
				pos = 9;
		}
		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if (resultado != digitos.charAt(0))
			return false;

		tamanho = tamanho + 1;
		numeros = cnpj.substring(0,tamanho);
		soma = 0;
		pos = tamanho - 7;
		for (i = tamanho; i >= 1; i--) {
		  soma += numeros.charAt(tamanho - i) * pos--;
		  if (pos < 2)
				pos = 9;
		}
		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if (resultado != digitos.charAt(1))
			  return false;

		return true;
 	
}

function validarCPF(cpf) {  
    cpf = cpf.replace(/[^\d]+/g,'');    
    if(cpf == '') return false; 
    // Elimina CPFs invalidos conhecidos    
    if (cpf.length != 11 || 
        cpf == "00000000000" || 
        cpf == "11111111111" || 
        cpf == "22222222222" || 
        cpf == "33333333333" || 
        cpf == "44444444444" || 
        cpf == "55555555555" || 
        cpf == "66666666666" || 
        cpf == "77777777777" || 
        cpf == "88888888888" || 
        cpf == "99999999999")
            return false;       
    // Valida 1o digito 
    add = 0;    
    for (i=0; i < 9; i ++)       
        add += parseInt(cpf.charAt(i)) * (10 - i);  
        rev = 11 - (add % 11);  
        if (rev == 10 || rev == 11)     
            rev = 0;    
        if (rev != parseInt(cpf.charAt(9)))     
            return false;       
    // Valida 2o digito 
    add = 0;    
    for (i = 0; i < 10; i ++)        
        add += parseInt(cpf.charAt(i)) * (11 - i);  
    rev = 11 - (add % 11);  
    if (rev == 10 || rev == 11) 
        rev = 0;    
    if (rev != parseInt(cpf.charAt(10)))
        return false;       
    return true;   
}

function ClienteExisteCadastro(cnpjcpf){
	
	var ret = "";
	
	$.ajax({
		 type: 'POST',
		 url:''+caminhoURL+'/PROJETOS/webservice_pedido/php/cliente-exec.php',
		 data:{act:'validacpjcpf',cnpjcpf:cnpjcpf},
		 dataType: "json",
		 async:false,
		 success: function(data){

			ret = data;	


		},
		error: function(jqXHR, exception){
			 ret = [];
			 alert('Ops!, Algo deu errado por favor entre em contato com o administrador do sistema , Obrigado!');	
		}	
	});
	
	return ret;
	
}
function verificacasdastroserver(cnpjcpf){
	var rets = [];
	var empresa = $("#empresa").val();
	alert("aa");
	$.ajax({
		 type: 'POST',
		 url:"http://api.prodapro.com.br/pedidos/"+empresa+"/php/recebe-exec.php",
		 data:{act:'validacpjcpf',cnpjcpf:cnpjcpf},
		 dataType: "json",
		 async:false,
		 success: function(data){
			rets = data;	
		},
		error: function(jqXHR, exception){
			 rets = [];
			 //alert('Ops!, Algo deu errado por favor entre em contato com o administrador do sistema , Obrigado!');	
		}	
	});
	
	return rets;
}
$(document).on("keyup",'.prazos',function(){

	if($(this).attr('id') == "prazo1"){

		if($(this).val() != ''){
			$(".prazos2").css({
				'display':'inline-block'
			});
		}else{
			$("#prazo1").focus();
			$("#prazo2").val('');			
			$(".prazos2").css({
				'display':'none'
			});
		}
	}else if($(this).attr('id') == "prazo2"){
		if($(this).val() != ''){
			$(".prazos3").css({
				'display':'inline-block'
			});
		}else{
			$("#prazo2").focus();
			$("#prazo3").val('');			
			$(".prazos3").css({
				'display':'none'
			});
		}
	}else if($(this).attr('id') == "prazo3"){
		if($(this).val() != ''){
			$(".prazos4").css({
				'display':'inline-block'
			});
		}else{
			$("#prazo3").focus();
			$("#prazo4").val('');			
			$(".prazos4").css({
				'display':'none'
			});
		}
	}else if($(this).attr('id') == "prazo4"){
		if($(this).val() != ''){
			$(".prazos5").css({
				'display':'inline-block'
			});
		}else{
			$("#prazo4").focus();
			$("#prazo5").val('');			
			$(".prazos5").css({
				'display':'none'
			});

		}
	}else if($(this).attr('id') == "prazo5"){
		if($(this).val() == ''){
					
			$("#prazo4").focus();
			$(".prazos5").css({
				'display':'none'
			});
		}
	}
});

$(document).ready(function(){
	
	$(".prazos").blur(function(event){
			//event.stopPropagation();
			var id = $(this).attr("id");
			//alert(id);
			
			if(id == "prazo2"){	
				if($("#prazo2").val() != 0 && $("#prazo2").val() != ''){
					if(parseInt($("#prazo1").val()) >= parseInt($("#prazo2").val()) ){	
											
						$("input[id='prazo2']").val('');
																
						$.alert({
							title: 'Ops',
							content: 'Não pode ser menor e iqual que o prazo 1!',							
							 buttons: {
								tryAgain: {
									text: 'OK',
									btnClass: 'btn-green',
									action: function(){
										$("input[id='prazo2']").focus();
										$("#prazo3").val('');			
										$(".prazos3").css({
											'display':'none'
										});
									}
								}
							}												
						});
					}
				}
			}
			
			if(id == "prazo3"){
				if($("#prazo3").val() != 0 && $("#prazo3").val() != ''){			
					if(parseInt($("#prazo2").val()) >= parseInt($("#prazo3").val())){					
						$("input[name='prazo3']").val('');																
						$.alert({
							title: 'Ops',
							content: 'Não pode ser menor e iqual que o prazo 2!',							
							 buttons: {
								tryAgain: {
									text: 'OK',
									btnClass: 'btn-green',
									action: function(){
										$("input[id='prazo3']").focus();
										$("#prazo4").val('');			
										$(".prazos4").css({
											'display':'none'
										});
									}
								}
							}												
						});
						
					}
				}
			}
			
			if(id == "prazo4"){
				if($("#prazo4").val() != 0 && $("#prazo4").val() != ''){			
					if(parseInt($("#prazo3").val()) >= parseInt($("#prazo4").val())){				
						$("input[name='prazo4']").val('');							
						$.alert({
							title: 'Ops',
							content: 'Não pode ser menor e iqual que o prazo 3!',							
							 buttons: {
								tryAgain: {
									text: 'OK',
									btnClass: 'btn-green',
									action: function(){
										$("input[id='prazo4']").focus();
										$("#prazo5").val('');			
										$(".prazos5").css({
											'display':'none'
										});
									}
								}
							}												
						});
								
					}
				}
			}
			
			if(id == "prazo5"){
				if($("#prazo5").val() != 0 && $("#prazo5").val() != ''){				
					if(parseInt($("#prazo4").val()) >= parseInt($("#prazo5").val())){				
						$("input[name='nprazo5']").val('');							
						$.alert({
							title: 'Ops',
							content: 'Não pode ser menor e iqual que o prazo 4!',							
							 buttons: {
								tryAgain: {
									text: 'OK',
									btnClass: 'btn-green',
									action: function(){
										$("input[id='prazo5']").focus();
									}
								}
							}												
						});
						
					}
				}
			}
			
	});	
	
});