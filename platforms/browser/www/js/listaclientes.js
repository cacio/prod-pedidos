// JavaScript Document
var localDB    = null;
var caminhoURL = "http://localhost:8080";

function onInit(){
    try {
        if (!window.openDatabase) {
            updateStatus("Erro: Seu navegador não permite banco de dados.");
        }
        else {
			
            initDB();			          
            createTablesCliente();						
			
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

$(document).ready(function(e) {

$("#limite").mask("#.##0,00", {reverse: true,maxlength: false,placeholder: "0"});

onInit();	
$("#no-more").hide();
var timerlistcli = setTimeout(function(){

	$.ajax({
			type: 'POST',
			cache: false,
			dataType: "json",	
			url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/pedido-cliente-exec.php',
			data: {act:'listar'},
			beforeSend: function(){
							
				$.mobile.loading( 'show', {
						text: 'Listando Clientes..',
						textVisible: true,
						theme: 'b',
						html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Listando Clientes...</div>"
					});	
					
			},	
			success: function(data){
				
				var html = "";			
				$("#countrows").val(data[0].rowscount);
				
				for (var i = 1; i < data.length; i++) {
					
					html += '<li>';
					html += '<a href="#" data-ajax="false" data-id="'+data[i].cod+'" class="detalhe2">';
					html += '<img src="../img/company-icon-80x80.png">';
					html += '<h2>'+data[i].cod+' '+data[i].nome.toUpperCase()+'</h2>';				
					html += '<p>'+utf8_decode(data[i].fantasia.toUpperCase())+'</p>';
					html += '</a>';
					html += '<a href="#" data-ajax="false" data-id="'+data[i].cod+'" class="detalhe">Detalhe</a>';
					html += '</li>';
					
				}
				
				 $('.cli').html(html);	
				 $(".cli").listview('refresh');			
				 $.mobile.loading('hide');	
							  
			},
			error: function(jqXHR, exception){
				alert('erro não detectado [1].\n' + jqXHR.responseText);						
			}
		});

		//eventos.buscaclientebloqueado();	

		clearTimeout(timerlistcli);
	},500);	
});

$(document).ready(function(e) {
 
	//sccliente
	$forms = $('form[id="sccliente"]');	
    
	$forms.bind('submit', function(){
		
		$(".moreresult").show();	
		var params = $(this.elements).serialize();
		
		$.ajax({
				type: 'POST',
				cache: false,
				dataType: "json",	
				url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/pedido-cliente-exec.php',
				data: params,	
				beforeSend: function(){
						
					$.mobile.loading( 'show', {
							text: 'Fazendo sua busca..',
							textVisible: true,
							theme: 'b',
							html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Fazendo sua busca..</div>"
						});	
				},	
				success: function(data){
					
					$(".moreresult").show();
					$("#scrrol").val(0);

					var html = "";
					if(data.length > 0){
						for (var i = 0; i < data.length; i++) {
							
							html += '<li>';
							html += '<a href="#" data-ajax="false" data-id="'+data[i].cod+'" class="detalhe2">';
							html += '<img src="../img/company-icon-80x80.png">';
							html += '<h2>'+data[i].cod+' '+data[i].nome.toUpperCase()+'</h2>';				
							html += '<p>'+data[i].fantasia.toUpperCase()+'</p>';
							html += '</a>';
							html += '<a href="#" data-ajax="false" data-id="'+data[i].cod+'" class="detalhe">Detalhe</a>';
							html += '</li>';
							
						}
						 $(".ftrdata").slideUp(1000);
					}else{
						
						html = "<div align='center'><h3>Nada encontrado</h3></div>";	
					
					}
					 $('.cli').html(html);	
					 $(".cli").listview('refresh');			
					 $.mobile.loading('hide');
					 
				},
				error: function(jqXHR, exception){
					alert('erro não detectado [2].\n' + jqXHR.responseText);		
				}
			});
	     return false;
    });
});

$(document).on( "pageinit", "#page", function() {
    $( ".cli" ).on( "filterablebeforefilter", function ( e, data ) {
        var $ul = $( this ),
            $input = $( data.input ),
            value = $input.val(),
            html = "";
        $ul.html( "" );
		
	
        if ( value && value.length > 0 ) {
			
            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
            $ul.listview( "refresh" );
			
            $.ajax({
                url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/pedido-cliente-exec.php',
				type:'POST',
                dataType: "json",
                crossDomain: true,				
                data: {
                    p: $input.val(),					
					radio1:1,
					act:'listar',
					busca:'buscar'
                }
            })
            .then( function ( response ) {
				$('.cli').show();
                $.each( response, function ( i, val ) {
					
					
					
					html += '<li class="ui-li-has-alt ui-li-has-thumb ui-first-child">';
					html += '<a href="#" data-ajax="false" data-id="'+val.cod+'" class="detalhe2 ui-btn">';
					html += '<img src="../img/company-icon-80x80.png">';
					html += '<h2>'+val.cod+' '+val.nome.toUpperCase()+'</h2>';				
					html += '<p>'+val.fantasia.toUpperCase()+'</p>';
					html += '</a>';
					html += '<a href="#" data-ajax="false" data-id="'+val.cod+'" class="detalhe ui-btn ui-btn-icon-notext ui-icon-gear ui-btn-a">Detalhe</a>';
					html += '</li>';
					
					
                });
				
                $ul.html( html );
                //$ul.listview( "refresh" );
               // $ul.trigger( "updatelayout");				
            });
        }else{
		
			listaclientespsq();
		}				
    });
});

var page = 1;
$(document).on("scrollstop", function (e) {
	
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
        screenHeight = $.mobile.getScreenHeight(),
        contentHeight = $(".ui-content", activePage).outerHeight(),
        header = $(".ui-header", activePage).outerHeight() - 1,
        scrolled = $(window).scrollTop(),
        footer = $(".ui-footer", activePage).outerHeight() - 1,
        scrollEnd = contentHeight - screenHeight;//+ header + footer;
    //$(".ui-btn-left", activePage).text("Scrolled: " + scrolled);
    //$(".ui-btn-right", activePage).text("ScrollEnd: " + scrollEnd);
    if (activePage[0].id == "page" && scrolled >= scrollEnd) {
        console.log("adding...");
		
        page++;
	
		var data = {
					page_num: page,
					act:'listar2'
				};
		var actual_count = $("#countrows").val();
		
		if((page-1)* 12 > actual_count){
			$('#no-more').css("top","400");
			$('#no-more').show();
			$.mobile.loading('hide');
			$(".moreresult").hide();
		}else{
			
				$.ajax({
						type: "POST",
						cache: false, 
						dataType: "json",	
						url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/pedido-cliente-exec.php',
						data:data,
						beforeSend: function(){
						
								$.mobile.loading( 'show', {
										text: 'Fazendo sua busca..',
										textVisible: true,
										theme: 'b',
										html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Fazendo sua busca..</div>"
									});	
							},
						success: function(data) {
		
							var html = "";	
							
							for (var i = 0; i < data.length; i++) {
						
								/*html += '<li>';
								html += '<a href="#" data-ajax="false" data-id="'+data[i].cod+'" class="detalhe2">';
								html += '<img src="../img/company-icon-80x80.png">';
								html += '<h2>'+data[i].cod+' '+data[i].nome.toUpperCase()+'</h2>';				
								html += '<p>'+data[i].fantasia.toUpperCase()+'</p>';
								html += '</a>';
								html += '<a href="#" data-ajax="false" data-id="'+data[i].cod+'" class="detalhe">Detalhe</a>';
								html += '</li>';*/

								html += '<li class="ui-li-has-alt ui-li-has-thumb ui-first-child">';
								html += '<a href="#" data-ajax="false" data-id="'+data[i].cod+'" class="detalhe2 ui-btn">';
								html += '<img src="../img/company-icon-80x80.png">';
								html += '<h2>'+data[i].cod+' '+data[i].nome.toUpperCase()+'</h2>';				
								html += '<p>'+data[i].fantasia.toUpperCase()+'</p>';
								html += '</a>';
								html += '<a href="#" data-ajax="false" data-id="'+data[i].cod+'" class="detalhe ui-btn ui-btn-icon-notext ui-icon-gear ui-btn-a">Detalhe</a>';
								html += '</li>';
								
							}
							
							 $('.cli').append(html);	
							 //$(".cli").listview('refresh');			
							 $.mobile.loading('hide');	
							
															
						}
					});
			
		}
    }
});

$(document).on('click','.moreresult',function(e){
    	//$('.cli').html('');			
		$("#scrrol").val(1);
		//$(window).scrollTop(300);
					
		 $('html, body').animate({
            scrollTop: 0
         }, 500);
		
		
		 $('html, body').animate({
            scrollTop: 300
         }, 500);
		 $('.cli').html('');
		 listaclientespsq();
});

function listaclientespsq(){	
	$.ajax({
			type: 'POST',
			cache: false,
			dataType: "json",	
			url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/pedido-cliente-exec.php',
			data: {act:'listar'},
			beforeSend: function(){
							
				$.mobile.loading( 'show', {
						text: 'Listando Clientes..',
						textVisible: true,
						theme: 'b',
						html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Listando Clientes...</div>"
					});	
					
			},	
			success: function(data){
				
				var html = "";			
				$("#countrows").val(data[0].rowscount);
				
				for (var i = 1; i < data.length; i++) {
					
					html += '<li>';
					html += '<a href="#" data-ajax="false" data-id="'+data[i].cod+'" class="detalhe2">';
					html += '<img src="../img/company-icon-80x80.png">';
					html += '<h2>'+data[i].cod+' '+data[i].nome.toUpperCase()+'</h2>';				
					html += '<p>'+utf8_decode(data[i].fantasia.toUpperCase())+'</p>';
					html += '</a>';
					html += '<a href="#" data-ajax="false" data-id="'+data[i].cod+'" class="detalhe">Detalhe</a>';
					html += '</li>';
					
				}
				
				 $('.cli').html(html);	
				 $(".cli").listview('refresh');			
				 $.mobile.loading('hide');	
							  
			},
			error: function(jqXHR, exception){
				alert('erro não detectado [4].\n' + jqXHR.responseText);					
			}
		});

}
/*$(document).ready(function(e) {
	
	$(".view-more").click(function(){
		$(".ftrdata").slideToggle("slow");		
		$('[data-type="search"]').focus();
	});
			 
});*/

function utf8_decode(str_data){
		// http://kevin.vanzonneveld.net
		// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
		// +	  input by: Aman Gupta
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// *	 example 1: utf8_decode('Kevin van Zonneveld');
		// *	 returns 1: 'Kevin van Zonneveld'
		
		var tmp_arr = [], i = ac = c = c1 = c2 = 0;
		
		while (i < str_data.length) {
			c = str_data.charCodeAt(i);
			if (c < 128) {
				tmp_arr[ac++] = String.fromCharCode(c);
				i++;
			}
			else 
				if ((c > 191) && (c < 224)) {
					c2 = str_data.charCodeAt(i + 1);
					tmp_arr[ac++] = String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				}
				else {
					c2 = str_data.charCodeAt(i + 1);
					c3 = str_data.charCodeAt(i + 2);
					tmp_arr[ac++] = String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
		}
		
		return tmp_arr.join('');
}
var dbox;
$(document).on('click','.detalhe', function(){
	
	//alert($(this).attr('data-id'));
	$.mobile.loading('hide');
	/*dbox = $.dialog({
		title: 'Aguarde!',
		content: '<div align="center"><img src="../img/ajax_loading.gif" /><br/>Coletando Dados</div>',
	});*/
	//eventos.buscaclientebloqueadoUm($(this).attr('data-id'));
	//eventos.BuscarDuplicatasVencidasPorCliente($(this).attr('data-id'));
	//eventos.buscaclientebloqueado();
	$(':mobile-pagecontainer').pagecontainer('change', '#deltalhe_cliente',{
		transition: 'slideup',
		changeHash: false,
		reverse: false,
		showLoadMsg:true,
		loadMsgDelay: 75
	});
	
	$('.pedir').attr('data-id',''+$(this).attr('data-id')+'');
	//alert($("a[data-id='"+$(this).attr('data-id')+"'] h2").html());
	$(".view-dados-cli").html($.trim($("a[data-id='"+$(this).attr('data-id')+"'] h2").html())+'<br/>'+$.trim($("a[data-id='"+$(this).attr('data-id')+"'] p").html()));
	
	getDetalheDadosCliente($(this).attr('data-id'));
	
	ListaUltComprasCliente($(this).attr('data-id'));
	
	ListaDuplicatasEmAberto($(this).attr('data-id'));
	
	ConfereFinanceiro($(this).attr('data-id'));
	
	//dbox.close();
});

$(document).on('click','.detalhe2', function(){

	$("body").append('<div class="kc_fab_overlay"></div>');
	var codcli = $(this).attr('data-id');
	var conf = $.confirm({
		content: function () {
			var self = this;
			return $.ajax({
				url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/cliente-exec.php',
				dataType: 'json',
				method: 'post',
				data:{act:'valida',codcli:codcli},
			}).done(function (response) {
								
				ConfereFinanceiro2(codcli);
				getDetalheDadosCliente(codcli);
				conf.close();
			}).fail(function(){
				ConfereFinanceiro2(codcli);
				getDetalheDadosCliente(codcli);
				conf.close();
			});
		}
	});

	//eventos.buscaclientebloqueadoUm($(this).attr('data-id'));
	//eventos.BuscarDuplicatasVencidasPorCliente($(this).attr('data-id'));
	//eventos.buscaclientebloqueado();				
	
	
	$(".kc_fab_overlay").remove();
});


$(document).on('click','.abre',function(){
	
		$(".view-more").addClass("fecha");
		$(".view-more").removeClass("abre");
		$(".ftrdata").slideDown();
		$('[data-type="search"]').focus();
		$(".filter-icon2").css({
		  '-webkit-transform': 'rotate(-178deg)',
		  '-moz-transform': 'rotate(-178deg)',
		  '-ms-transform': 'rotate(-178deg)',
		  '-o-transform': 'rotate(-178deg)',
		  'transform': 'rotate(-178deg)',
		});
});

$(document).on('click','.fecha',function(){
		$(".filter-icon2").css({
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



function getDetalheDadosCliente(id) {
	//$(".pedir").attr('href','lista-produtocliente.html?codcli='+id+'');
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
		
		$("#prazo1").val(data[0].prazo1);
		$("#prazo2").val(data[0].prazo2);
		$("#prazo3").val(data[0].prazo3);
		$("#prazo4").val(data[0].prazo4);
		$("#prazo5").val(data[0].prazo5);
		
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


function ListaUltComprasCliente(id){
	
	//listultimas
	
	$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/lista-pedidosfeitos-exec.php",
		 beforeSend: function(){				
 		 },	
		 data:{act:"listultimas",xcodcli:id},
		 dataType:"json",
		 success: function(data){
							
			var html = "";
			var totproduto = 0;
			var total      = 0;
			for (var i = 0; i < data.length; i++) {
				
				
				html += '<li class="ui-li-has-alt ui-li-has-thumb ui-first-child">'+
							'<a href="#" data-ajax="false" class="ui-btn">'+								
								'<img src="../img/pedult.png" style="width: 92px; padding: 6px;"/>'+
									'<h2 class="text-warning">'+data[i].status+' | '+data[i].nnump+' - '+data[i].nome+'</h2>'+
									'<p><strong>Emissão:'+data[i].datap+'<BR/>Entrega  :'+data[i].dte+'</strong></p>'+
							'</a>'+							
							'<a href="javascript:void(0)" id="'+data[i].nump+'" class="listaped ui-btn ui-btn-icon-notext ui-icon-plus ui-btn-a" data-ajax="false" title="Detalhe"></a>'+
						'</li>';
							
					//var ls = listapedidosfeitos(data[i].nump);
					/*for(var x = 0; x < ls.length; x++){
						
						
						totproduto = parseFloat(totproduto) + parseFloat(convertevalores(ls[x].somaqtd));
					}
					
				total = parseFloat(total) + parseFloat(totproduto);*/
				
			}
			

			//$(".s-card-valototal").html(number_format(totproduto,2,',','.'));
			$('#pedidofeitos').html(html); 			
			//$(".s-card-btn-count").html(data.length);
			
		},
		error: function(jqXHR, exception){
			//alert('aaaa');
			alert('erro não detectado[5].\n' + jqXHR.responseText);	
		}	
	});
}



$(document).on('click','.listaped',function(){
	//alert($(this).attr('id'));
			
		var ls   = listapedidosfeitos($(this).attr('id'));
		var html = "";
		var html2 = "";
		var bthtm = "";
		var vltotal = 0;
		var vltotaldesc = 0;
		var vltotalfinal = 0;
		var vtotal_desc = 0;
		//alert(ls[0].status);
		var bloqueio = ls.detalhe[0].status == 1 ? 'editp':'disabled';
									
		
		for(x in ls.detalhe){
			
			

					html += '<li id="'+ls.detalhe[x].cod+'" data-icon="false" class="ui-li-has-thumb ui-first-child">';
					html += '<a href="#">';
					html += '<img src="'+ls.detalhe[x].src+'" style="margin-top:30px;"/>';            				
					
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
		
		vltotal 	= ls.somtotal;						
		vltotaldesc = ls.somtotaldesconto;
		vtotal_desc = ls.vtotal_desc;
	
		vltotalfinal = convertevalores(vltotal) - convertevalores(vltotaldesc);
	
		 html2 = '<div data-role="navbar">'+
            '<ul>'+                
                '<li><a href="#" data-ajax="false" id="somatotals" data-iconpos="left" data-role="button"><strong style="font-size:12px;">TOTAL: <br/>R$ '+vltotal+'</strong></a></li>'+
                '<li><a href="#" data-ajax="false" id="somadesconto" data-iconpos="left" data-role="button"><strong style="font-size:12px;">TOTAL DESCONTO: <br/>R$ '+vtotal_desc+'</strong></a></li>'+
                '<li><a href="#" data-ajax="false" id="somatotalfinal" data-iconpos="left" data-role="button"><strong style="font-size:12px;">TOTAL FINAL: <br/>R$ '+vltotal+'</strong></a></li>'+               
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
						
			alert('erro não detectado[7].\n' + jqXHR.responseText);	
		}	
	});	
	return retorno;
}

function ListaDuplicatasEmAberto(id){
	
	$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/duplicatas-exec.php",
		 data:{act:"detalhe_dup",codf:id},
		 dataType:"json",
		 success: function(data){
			
			var html = '';
			 
			 for(i in data.dados){
				 
				html += '<tr id="'+data.dados[i].numero+'">'+
						  '<th style="text-align:center;">'+data.dados[i].ndup+'</th>'+
						  '<td style="text-align:center;">'+data.dados[i].vencdup+'</td>'+
						  '<td style="text-align:right;">'+data.dados[i].vlrdup+'</td>'+
						  '<td style="text-align:center;">'+data.dados[i].formpagt+'</td>'+
						'</tr>'; 
				 
			 }
			 
			 $("table#dadosdup tbody").html( html );//.closest( "table#dadosdup" ).table("refresh").trigger( "create" );
			 
			//$("#dadosdup tbody").html(html); 
			 //alert(data.total);
			$("#dadosdup tfoot td:eq(2)").html(data.total); 
			 //dadosdup
			 if(data.dados.length > 0){
				 $.confirm({
					title: 'MENSAGEM FINANCEIRO EM ABERTO',
					content: '<mark>Cliente possui título(s) vencido(s)! Para maiores informações, consulte o financeiro:</mark><br/><h4>Detalhe financeiro:<h4>'+$("#three").html()+'<br/> *para prosseguir o pedido clique no botão [ABRIR PEDIDOS] abaixo',
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
		},
		error: function(jqXHR, exception){
						
			alert('erro não detectado[8].\n' + jqXHR.responseText);	
		}	
	});	
	
	
}

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
			if(data.liberado == 'S'){ 
				if(data.dados.length > 0){
					//if(parseFloat(data.valordups) > parseFloat(data.limite)){
						/*$.confirm({
							title: 'Cliente não habilitado para fazer pedidos!',
							content: '<form id="frmativarcli"><input type="hidden" name="act" value="pin"/><input type="hidden" name="ncli" value="'+codigo+'"/><div data-role="ui-field-contain"><label for="textinput-1"><strong>Informe PIN de liberação:</strong></label><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="tel" id="shcli" name="shcli" placeholder="Digite o PIN"></div></div><button type="submit" class="ui-btn ui-shadow" data-ajax="false">VALIDAR</button></form>',
							type: 'red',
							typeAnimated: true,
							buttons: {							
								close: function () {
								}
							}
						});*/
						$('.pedir').attr('href','lista-produtocliente.html?codcli='+codigo+'');
						$(':mobile-pagecontainer').pagecontainer('change', '#deltalhe_cliente',{
							transition: 'slideup',
							changeHash: false,
							reverse: false,
							showLoadMsg:true,
							loadMsgDelay: 75
						});

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

						$('.pedir').attr('href','lista-produtocliente.html?codcli='+codigo+'');
					
					}
			}else{

				//$('.pedir').attr('href','lista-produtocliente.html?codcli='+codigo+'');
				$(':mobile-pagecontainer').pagecontainer('change', '#deltalhe_cliente',{
					transition: 'slideup',
					changeHash: false,
					reverse: false,
					showLoadMsg:true,
					loadMsgDelay: 75
				});

				$.confirm({
					title: 'Cliente Bloqueado!',
					content: 'Motivo do bloqueio<br> '+data.obs+' ',
					type: 'red',
					typeAnimated: true,
					buttons: {							
						close: function () {
							window.location.reload();
							//$.mobile.changePage('#deltalhe_cliente');
						}
					}
				});

			}
			 
			 
		},
		error: function(jqXHR, exception){
						
			alert('erro não detectado[9].\n' + jqXHR.responseText);	
		}	
	});
	
	return false;
	
}

function ConfereFinanceiro2(id){
	
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
					ListaUltComprasCliente(codigo);
					//if(parseFloat(data.valordups) > parseFloat(data.limite)){
						/*$.confirm({
							title: 'Cliente não habilitado para fazer pedidos!',
							content: '<form id="frmativarcli"><input type="hidden" name="act" value="pin"/><input type="hidden" name="ncli" value="'+codigo+'"/><div data-role="ui-field-contain"><label for="textinput-1"><strong>Informe PIN de liberação:</strong></label><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="tel" id="shcli" name="shcli" placeholder="Digite o PIN"></div></div><button type="submit" class="ui-btn ui-shadow" data-ajax="false">VALIDAR</button></form>',
							type: 'red',
							typeAnimated: true,
							buttons: {
								
								close: function () {
								}
							}
						});*/
						$('.pedir').attr('href','lista-produtocliente.html?codcli='+codigo+'');
						ListaDuplicatasEmAberto(codigo);
						$(':mobile-pagecontainer').pagecontainer('change', '#deltalhe_cliente',{
							transition: 'slideup',
							changeHash: false,
							reverse: false,
							showLoadMsg:true,
							loadMsgDelay: 75
						});

										
						//$( "[data-role='tabs']" ).tabs( "load", "#three" );
						//$( "[data-role='tabs']" ).tabs( "#three", "show" );
						$("#three").css({
							'display':'block',
						});
						$("#two").css({
							'display':'none',
						});
						$("#one").css({
							'display':'none',
						});

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

						//$( "[data-role='tabs']" ).tabs( "#three", "active" );
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

				//$('.pedir').attr('href','lista-produtocliente.html?codcli='+codigo+'');
				$(':mobile-pagecontainer').pagecontainer('change', '#deltalhe_cliente',{
					transition: 'slideup',
					changeHash: false,
					reverse: false,
					showLoadMsg:true,
					loadMsgDelay: 75,					
				});
				$(".pedir").remove();
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
						
			alert('erro não detectado[9].\n' + jqXHR.responseText);
		}	
	});
	
	return false;
	
}


$(document).on('click','.pedir',function(){
	
	var codigo = $(this).attr('data-id');
	
	if($(this).attr('href') != 'lista-produtocliente.html?codcli='+codigo+''){
		
		/*$.confirm({
				title: 'Cliente não habilitado para fazer pedidos!',
				content: '<form id="frmativarcli"><input type="hidden" name="act" value="pin"/><input type="hidden" name="ncli" value="'+codigo+'"/><div data-role="ui-field-contain"><label for="textinput-1"><strong>Informe PIN de liberação:</strong></label><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="tel" id="shcli" name="shcli" placeholder="Digite o PIN"></div></div><button type="submit" class="ui-btn ui-shadow" data-ajax="false">VALIDAR</button></form>',
				type: 'red',
				typeAnimated: true,
				buttons: {					
					close: function () {
					}
				}
			});*/
		return true;		
	}else{
		
		
		return true;
	}
		
	return false;
});

$(document).on('submit','form[id="frmativarcli"]',function(){	
	
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
			   
				$('.pedir').attr('href','lista-produtocliente.html?codcli='+data[0].ncli+'');
				 window.location.href = 'lista-produtocliente.html?codcli='+data[0].ncli+'';
				
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

$(document).on('submit','form[id="frmaltcliente"]',function(){
			
	var params = $(this.elements).serialize();
	
	var self = this;
	$.ajax({
	type: 'POST',
	 url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/pedido-cliente-exec.php',
	data: params,
	cache: false,
	dataType: 'json',
	// Antes de enviar
	beforeSend: function(){
		$.mobile.loading( 'show', {
				text: 'Aquarde!',
				textVisible: true,
				theme: 'b',
				html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde..</div>"
			});	
	},
	success: function(data){				
	  	  $.mobile.loading("hide");
		  //alert(data.id_cli);
		  ListaClienteUm(data.id_cli,data);	
	},
	error: function(data){
		//alert('Ops!, Algo deu errado por favor entre em contato com o administrador do sistema , Obrigado!');
		var alerta = $.alert({
			title: 'Ops!',
			content: '<div align="center">Ocorreu um Erro inesperado, Por Favor entre em contato com o suporte, Obrigado!<br/><img src="../img/sad.png"/></div>',
			confirmButton:'OK',
			confirm: function(){
				alerta.close();
			}
		});	
		
		}
	})
	return false;
});

function ListaClienteUm(ccod,data){

var querys = "SELECT id, CODIGO FROM CLIENTES WHERE CODIGO = ? ";
	try {
		localDB.transaction(function(transaction){

			transaction.executeSql(querys, [ccod], function(transaction, results){
				
				if(results.rows.length > 0){					
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

function convertevalores(valor2){
	if(valor2.length > 2 && valor2.length <= 6){
			var valstr2 = parseFloat(valor2.replace(",","."));
	}else{
		var valstr2 = parseFloat(valor2.replace(",",".").replace(".",""));
	}
	
	return valstr2.toFixed(2);
}