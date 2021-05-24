// JavaScript Document

$(document).ready(function(e) {

    var codc =  $("#codc").val();
	$.ajax({
			 type: 'POST',
			 cache:false,
			 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/lista-produtocliente-exec.php",
			 data:{act:"listarprodutosporum",cod:1,codcli:codc},
			 dataType:"json",
			 beforeSend: function(){
				 $.mobile.loading( 'show', {
						text: 'Aguarde Listando Produtos',
						textVisible: true,
						theme: 'b',
						html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde Listando Produtos</div>"
					});	
			 },
			 success: function(data){

				$("#countrowss").val(data[0].rowscount);
				var html = "";
				for(var i = 1; i < data.length; i++){
					
					var idpro     = data[i].idpro;						
					var codigo    = data[i].cod;
					var desc      = data[i].desc;
					var cli       = data[i].codcli;
					var	preco     = data[i].PRECOLISTA;	
					var uni       = data[i].UNIDADE;
					var comp      = data[i].COMP;
					var pesomedio = data[i].pesomedio;
					var pecasatu  = data[i].pecasatu;
					var pdadod	= atualizaQtd(codigo);
					
					if(pdadod[0].option1 == 1){													
						if(convertevalores(pdadod[0].volume) > 0){
								console.log(pdadod[0].volume);
							if(convertevalores(pdadod[0].volume) < 1){
								var countqtd = pdadod[0].volume;		
							}else{
								var countqtd = parseInt(pdadod[0].volume);	
							}
						}else{							 
							var countqtd = parseInt(pdadod[0].qtd);	
						}
						
						
					}else{												 
						var countqtd = parseInt(pdadod[0].qtd);
					}
					
					var img;
					var maiscomp;
					var detalhe   = "";
					var marg      = "";	
					var colormaiscomp;
					var htmitemmaismenos = "";
					
					if(comp > 0){
						 maiscomp = '<img src="../img/favorite.png"/>';	
						 colormaiscomp = 'style="background-color:#dcd9a0;"';
					}else{
						 maiscomp = '';
						 colormaiscomp = '';
					}						
					
					if(data[i].mostraalterapesomeidio == 1){
						detalhe = '<a href="#" class="alterproduto ui-btn ui-btn-icon-notext ui-icon-gear ui-btn-a" data-ajax="false" title="Detalhe"></a>';
						marg 	  = "margin-right: 40px;";
					}else if(data[i].mostraalterapesomeidio == 2){
						detalhe = "";
						marg 	  = "";
					}	
					
					if(data[i].itemmaisemenos == 1){
						htmitemmaismenos = '<a href="#purchase" data-theme="a"  style="width: 123px;clear: right; '+marg+ ' text-align: center;border-left: 0 none;" aria-haspopup="true" aria-owns="purchase" aria-expanded="false" class="ui-btn ui-btn-a">'+
						   '<div id="countcar" class="count'+codigo+'">'+countqtd+'</div>'+
						   '<button class="btn-mais" data-id="'+codigo+'|'+cli+'">+</button>'+						  
						   '<button class="btn-menos" data-id="'+codigo+'">-</button></a>';
					}else{
						htmitemmaismenos ='<a href="#purchase" data-theme="a" onClick="adicionaprimeiranocarrinho(\''+codigo+'\',\''+cli+'\');" style="width: 81px;clear: right; '+marg+ 'background-color: green;" aria-haspopup="true" aria-owns="purchase" aria-expanded="false" class="ui-btn ui-btn-icon-notext ui-icon-plus ui-btn-a"></a>';
					}
					
					if(data[i].EST_ATU <= 0){
						var	bkgest = '<strong style="font-size:18px; color:red; border-radius: 12px;  padding: 5px;">'+data[i].EST_ATU+'</strong>';
					}else{
						var	bkgest = ''+data[i].EST_ATU+'';
					}
					
					
						html += '<li id="'+idpro+'" class="ui-li-has-alt ui-first-child">'+
							'<a href="#" data-id="'+codigo+'" data-url="'+data[i].src+'" data-ajax="false" class="ui-btn deltalhe-produto" '+colormaiscomp+'>'+								
									'<h2>'+codigo+' '+desc.toUpperCase()+'</h2>'+
									'<p style="font-size: 16px;">Medida: <strong style="margin-left:39px;">'+uni+'</strong></p>'+
									'<p style="font-size: 16px;">Em Estoque: '+bkgest+'</p>'+
									'<p style="font-size: 16px;">Valor Tabela: <mark style="font-size:18px; background:#1565c0; color:#ffffff; padding:5px;">R$:'+number_format(preco,2,',','.')+'</mark> Peso Medio: '+pesomedio+'</p>'+
							'</a>'+
							''+htmitemmaismenos+''+
							''+detalhe+''+
						'</li>';			
																			
				}
				
				
									
				$(".listaprodutos").html(html);
				//$('.listaprodutos').listview('refresh');
				 $.mobile.loading('hide');
				$( '.swipebox' ).swipebox({
						useCSS : true, // false will force the use of jQuery for animations
						useSVG : true, // false to force the use of png for buttons
						initialIndexOnArray : 0, // which image index to init when a array is passed
						hideCloseButtonOnMobile : false, // true will hide the close button on mobile devices
						removeBarsOnMobile : false, // false will show top bar on mobile devices
						hideBarsDelay : 3000, // delay before hiding bars on desktop
						videoMaxWidth : 1140, // videos max width
						beforeOpen: function() {}, // called before opening
						afterOpen: null, // called after opening
						afterClose: function() {}, // called after closing
						loopAtEnd: false // true will return to the first image after the last image is reached
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
	var set = setInterval(function(){
		ListaUltComprasCliente($("#codc").val());	
		clearInterval(set);
	},500);
	
});


var page = 1;
$(document).on("scrollstop", function (e) {
	
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
        screenHeight = $.mobile.getScreenHeight(),
        contentHeight = $(".ui-content", activePage).outerHeight(),
        header = $(".ui-header", activePage).outerHeight() - 1,
        scrolled = $(window).scrollTop(),
        footer = $(".ui-footer", activePage).outerHeight() - 1,
        scrollEnd = contentHeight - screenHeight;// + header + footer;
    $(".ui-btn-left", activePage).text("Scrolled: " + scrolled);
    $(".ui-btn-right", activePage).text("ScrollEnd: " + scrollEnd);
    if (activePage[0].id == "page" && scrolled >= scrollEnd) {
        console.log("adding...");
		
        page++;
		var codcs =  $("#codc").val();
		var data = {
			page_num: page,
			act:'listarprodutosporum2',
			cod:1,
			codcli:codcs
		};
		var actual_count = $("#countrowss").val();
		
		if((page-1)* 12 > actual_count){
			$('#no-more').css("top","400");
			$('#no-more').show();
			$.mobile.loading('hide');
			$(".moreresult").hide();
		}else{
			$.ajax({
				type: "POST",
				cache:false,
				dataType: "json",	
				url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/lista-produtocliente-exec.php',
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
				
				//alert(res)
				var html = "";					
				for(var i = 1; i < data.length; i++){
					
					var idpro     = data[i].idpro;			
					var codigo    = data[i].cod;
					var desc      = data[i].desc;
					var cli       = data[i].codcli;
					var	preco     = data[i].PRECOLISTA;	
					var uni    	  = data[i].UNIDADE;
					var comp  	  = data[i].COMP;
					var pesomedio = data[i].pesomedio;
					var pecasatu  = data[i].pecasatu;
					var maiscomp;
					var detalhe = "";
					var marg    = "";	
					var colormaiscomp;
					var htmitemmaismenos = "";
					
					if(comp > 0){
						 maiscomp = '<img src="../img/favorite.png"/>';
						 colormaiscomp = 'style="background-color:#dcd9a0;"';	
					}else{
						 maiscomp = '';
						 colormaiscomp = '';		
					}						

					if(data[i].mostraalterapesomeidio == 1){
						detalhe = '<a href="#" class="alterproduto ui-btn ui-btn-icon-notext ui-icon-gear ui-btn-a" data-ajax="false" title="Detalhe"></a>';
						marg 	  = "margin-right: 40px;";
					}else if(data[i].mostraalterapesomeidio == 2){
						detalhe = "";
						marg 	  = "";
					}	
					
					if(data[i].EST_ATU <= 0){
						var	bkgest = '<strong style="font-size:18px; color:red; border-radius: 12px;  padding: 5px;">'+data[i].EST_ATU+'</strong>';
					}else{
						var	bkgest = ''+data[i].EST_ATU+'';
					}
					
					if(data[i].itemmaisemenos == 1){
						htmitemmaismenos = '<a href="#purchase" data-theme="a"  style="width: 123px;clear: right; '+marg+ ' text-align: center;border-left: 0 none;" aria-haspopup="true" aria-owns="purchase" aria-expanded="false" class="ui-btn ui-btn-a">'+
						    '<div id="countcar" class="count'+codigo+'">0</div>'+	
						   '<button class="btn-mais" data-id="'+codigo+'|'+cli+'">+</button>'+						  
						   '<button class="btn-menos" data-id="'+codigo+'">-</button></a>';
					}else{
						htmitemmaismenos ='<a href="#purchase" data-theme="a" onClick="adicionaprimeiranocarrinho(\''+codigo+'\',\''+cli+'\');" style="width: 81px;clear: right; '+marg+ 'background-color: green;" aria-haspopup="true" aria-owns="purchase" aria-expanded="false" class="ui-btn ui-btn-icon-notext ui-icon-plus ui-btn-a"></a>';
					}
					
					html = '<li id="'+idpro+'" class="ui-li-has-alt ui-first-child  " style="background-color: green;">'+
						'<a href="#" data-id="'+codigo+'" data-url="'+data[i].src+'" data-ajax="false" title="'+codigo+' '+desc.toUpperCase()+'" class="ui-btn deltalhe-produto" '+colormaiscomp+'>'+							
								'<h2>'+codigo+' '+desc.toUpperCase()+'</h2>'+
								'<p style="font-size: 16px;">Medida: <strong style="margin-left:39px;">'+uni+'</strong></p>'+
								'<p style="font-size: 16px;">Em Estoque: '+bkgest+'</p>'+
								'<p style="font-size: 16px;">Valor Tabela: <mark style="font-size:18px; background:#1565c0; color:#ffffff; padding:5px;">R$:'+number_format(preco,2,',','.')+'</mark> Peso Medio: '+pesomedio+'</p>'+
						'</a>'+
						' '+htmitemmaismenos+' '+							
						''+detalhe+''+
					'</li>';																			
					
					$(".listaprodutos").append(html);
					
				}
				// $(".listaprodutos").listview('refresh');	
				 $.mobile.loading('hide');
				
				}
			});
		}
    }
});

$( document ).on( "pageinit", "#page", function() {
    $( "#search-produto" ).on( "filterablebeforefilter", function ( e, data ) {
        var $ul = $( this ),
            $input = $( data.input ),
            value = $input.val(),
            html = "";
        $ul.html( "" );
		
	
        if ( value && value.length > 0 ) {
			//alert(caminhoURL);
            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
            $ul.listview( "refresh" );
			
            $.ajax({
                url: ""+caminhoURL+"/PROJETOS/webservice_pedido/php/lista-produtocliente-exec.php",
				type:'POST',
                dataType: "json",
                crossDomain: true,				
                data: {
                    p: $input.val(),
					codcli:$('#codcli').val(),
					cod:$('#cod').val(),
					act:'buscar',
                }
            })
            .then( function ( response ) {
				$('#search-produto').show();
                $.each( response, function ( i, val ) {
					
					var idpro  	  = val.idpro;	
					var codigo 	  = val.cod;
					var desc   	  = val.desc;
					var cli  	  = val.codcli;
					var	preco 	  = val.PRECOLISTA;	
					var uni   	  = val.UNIDADE;
					var pesomedio = val.pesomedio;
					var pecasatu  = val.pecasatu;
					var detalhe = "";
					var marg    = "";	
					var htmitemmaismenos = "";
					var pdadod	= atualizaQtd(codigo);

					if(pdadod[0].option1 == 1){													
						if(convertevalores(pdadod[0].volume) > 0){
								console.log(pdadod[0].volume);
							if(convertevalores(pdadod[0].volume) < 1){
								var countqtd = pdadod[0].volume;		
							}else{
								var countqtd = parseInt(pdadod[0].volume);	
							}
						}else{							 
							var countqtd = parseInt(pdadod[0].qtd);	
						}
						
						
					}else{												 
						var countqtd = parseInt(pdadod[0].qtd);
					}
					
					if(countqtd == undefined){
						countqtd = 0;
					}

					if(val.mostraalterapesomeidio == 1){
						detalhe = '<a href="#" class="alterproduto ui-btn ui-btn-icon-notext ui-icon-gear ui-btn-a" data-ajax="false" title="Detalhe"></a>';
						marg 	  = "margin-right: 40px;";
					}else if(val.mostraalterapesomeidio == 2){
						detalhe = "";
						marg 	= "";
					}

					if(val.itemmaisemenos == 1){
						htmitemmaismenos = '<a href="#purchase" data-theme="a"  style="width: 123px;clear: right; '+marg+ ' text-align: center;border-left: 0 none;" aria-haspopup="true" aria-owns="purchase" aria-expanded="false" class="ui-btn ui-btn-a">'+
					   '<div id="countcar" class="count'+codigo+'">'+countqtd+'</div>'+	
					   '<button class="btn-mais" data-id="'+codigo+'|'+cli+'">+</button>'+					   
					   '<button class="btn-menos" data-id="'+codigo+'">-</button></a>';
					}else{
						htmitemmaismenos ='<a href="#purchase" data-theme="a" onClick="adicionaprimeiranocarrinho(\''+codigo+'\',\''+cli+'\');" style="width: 81px;clear: right; '+marg+ 'background-color: green;" aria-haspopup="true" aria-owns="purchase" aria-expanded="false" class="ui-btn ui-btn-icon-notext ui-icon-plus ui-btn-a"></a>';
					}
					
					if(val.EST_ATU <= 0){
						var	bkgest = '<strong style="font-size:18px; color:red; border-radius: 12px;  padding: 5px;">'+val.EST_ATU+'</strong>';
					}else{
						var	bkgest = ''+val.EST_ATU+'';
					}

					html += '<li id="'+idpro+'" class="ui-li-has-alt ui-first-child">'+
							'<a href="#" data-id="'+codigo+'" data-url="'+val.src+'" data-ajax="false" class="ui-btn deltalhe-produto">'+								
									'<h2>'+codigo+' '+desc.toUpperCase()+'</h2>'+
									'<p style="font-size: 16px;">Medida: <strong style="margin-left:39px;">'+uni+'</strong></p>'+
									'<p style="font-size: 16px;">Em Estoque: '+bkgest+'</p>'+
									'<p style="font-size: 16px;">Valor Tabela: <mark style="font-size:18px; background:#1565c0; color:#ffffff; padding:5px;">R$:'+number_format(preco,2,',','.')+'</mark> Peso Medio: '+pesomedio+'</p>'+
							'</a>'+
							''+htmitemmaismenos+''+
							''+detalhe+''+
						'</li>';
					
                });				
                $ul.html( html );
                //$ul.listview( "refresh" );
                //$ul.trigger( "updatelayout");
            });
        }else{
			
			listaprodutoclientespsq();
		}				
    });
});


$(document).ready(function(e) {
    
	//sccliente
	$forms = $('form[id="busproduto"]');	
    
	$forms.bind('submit', function(){
						
		var params = $(this.elements).serialize();
		
		$.ajax({
				type: 'POST',
				cache:false, 
				dataType: "json",	
				url: this.action,
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
					
					var html = '';
					if(data.length > 0){
						for (var i = 0; i < data.length; i++) {
							
							var idpro  = data[i].idpro;
							var codigo = data[i].cod;
							var desc   = data[i].desc;
							var cli    = data[i].codcli;
							var	preco  = data[i].PRECOLISTA;	
							var uni    = data[i].UNIDADE;
							var detalhe = "";
							var marg    = "";	
							var htmitemmaismenos = "";
							var countqtd = $("#quantidade"+codigo+"").val();
							
							if(countqtd == undefined){
								countqtd = 0;
							}	

							if(data[i].mostraalterapesomeidio == 1){
								detalhe = '<a href="#" class="alterproduto ui-btn ui-btn-icon-notext ui-icon-gear ui-btn-a" data-ajax="false" title="Detalhe"></a>';
								marg 	  = "margin-right: 40px;";
							}else if(data[i].mostraalterapesomeidio == 2){
								detalhe = "";
								marg 	  = "";
							}
							
							
							
							if(data[i].itemmaisemenos == 1){
								htmitemmaismenos = '<a href="#purchase" data-theme="a"  style="width: 123px;clear: right; '+marg+ ' text-align: center;border-left: 0 none;" aria-haspopup="true" aria-owns="purchase" aria-expanded="false" class="ui-btn ui-btn-a">'+
							   '<button class="btn-mais" data-id="'+codigo+'|'+cli+'">+</button>'+
							   '<div id="countcar" class="count'+codigo+'">'+countqtd+'</div>'+
							   '<button class="btn-menos" data-id="'+codigo+'">-</button></a>';
							}else{
								htmitemmaismenos ='<a href="#purchase" data-theme="a" onClick="adicionaprimeiranocarrinho(\''+codigo+'\',\''+cli+'\');" style="width: 81px;clear: right; '+marg+ 'background-color: green;" aria-haspopup="true" aria-owns="purchase" aria-expanded="false" class="ui-btn ui-btn-icon-notext ui-icon-plus ui-btn-a"></a>';
							}
							
							html += '<li id="'+idpro+'" class="ui-li-has-alt ui-first-child">'+
									'<a href="#" data-ajax="false" class="ui-btn">'+										
											'<h2>'+codigo+' '+desc.toUpperCase()+'</h2>'+
											'<p> UN:</strong> '+uni+' <mark style="font-size:18px; background:#428bca;">R$:'+number_format(preco,2,',','.')+'</mark></p>'+
									'</a>'+
									''+htmitemmaismenos+''+
									''+detalhe+''+
								'</li>';
							
						}		
						
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
						
					}else{
						html = '<div align="center"><div class="alert alert-info" role="alert"><strong>Não ah resultado com: <mark>'+$("#searchForCollapsibleSet").val()+'</mark></strong></div></div>';;
					}
					$(".listaprodutos").html(html);					  
					//$(".listaprodutos").listview('refresh');	
					$.mobile.loading('hide');
				},
				error: function(data){
					alert('Erro: '+data.status);	
				}
			});
	     return false;
    });
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
		 $('.listaprodutos').html('');
		 listaprodutoclientespsq();
});

function listaprodutoclientespsq(){

	var codc =  $("#codc").val();
	$.ajax({
			 type: 'POST',
			 cache:false,
			 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/lista-produtocliente-exec.php",
			 data:{act:"listarprodutosporum",cod:1,codcli:codc},
			 dataType:"json",
			 success: function(data){

			$("#countrowss").val(data[0].rowscount);
				var html = "";
				for(var i = 1; i < data.length; i++){
					
					var idpro  	  = data[i].idpro;						
					var codigo	  = data[i].cod;
					var desc  	  = data[i].desc;
					var cli    	  = data[i].codcli;
					var	preco  	  = data[i].PRECOLISTA;	
					var uni    	  = data[i].UNIDADE;
					var comp   	  = data[i].COMP;
					var pesomedio = data[i].pesomedio;
					var pecasatu  = data[i].pecasatu;
					var img;
					var maiscomp;
					var detalhe = "";
					var marg    = "";						
					var colormaiscomp;
					var htmitemmaismenos = "";
					var pdadod	= atualizaQtd(codigo);
					
					
					if(pdadod[0].option1 == 1){													
						if(convertevalores(pdadod[0].volume) > 0){
							console.log(pdadod[0].volume);
							if(convertevalores(pdadod[0].volume) < 1){
								var countqtd = pdadod[0].volume;		
							}else{
								var countqtd = parseInt(pdadod[0].volume);	
							}
							
						}else{							 
							var countqtd = parseInt(pdadod[0].qtd);	
						}
						
						
					}else{												 
						var countqtd = parseInt(pdadod[0].qtd);
					}
					
					if(countqtd == undefined){
						countqtd = 0;
					}
					
					if(comp > 0){
						 maiscomp = '<img src="../img/favorite.png"/>';	
						 colormaiscomp = 'style="background-color:#dcd9a0;"';
					}else{
						 maiscomp = '';
						 colormaiscomp = '';
					}						
					
					if(data[i].mostraalterapesomeidio == 1){
						detalhe = '<a href="#" class="alterproduto ui-btn ui-btn-icon-notext ui-icon-gear ui-btn-a" data-ajax="false" title="Detalhe"></a>';
						marg 	  = "margin-right: 40px;";
					}else if(data[i].mostraalterapesomeidio == 2){
						detalhe = "";
						marg 	  = "";
					}		
											
					
					if(data[i].itemmaisemenos == 1){
						htmitemmaismenos = '<a href="#purchase" data-theme="a"  style="width: 123px;clear: right; '+marg+ ' text-align: center;border-left: 0 none;" aria-haspopup="true" aria-owns="purchase" aria-expanded="false" class="ui-btn ui-btn-a">'+
						'<div id="countcar" class="count'+codigo+'">'+countqtd+'</div>'+	
					   '<button class="btn-mais" data-id="'+codigo+'|'+cli+'">+</button>'+					   
					   '<button class="btn-menos" data-id="'+codigo+'">-</button></a>';
					}else{
						htmitemmaismenos ='<a href="#purchase" data-theme="a" onClick="adicionaprimeiranocarrinho(\''+codigo+'\',\''+cli+'\');" style="width: 81px;clear: right; '+marg+ 'background-color: green;" aria-haspopup="true" aria-owns="purchase" aria-expanded="false" class="ui-btn ui-btn-icon-notext ui-icon-plus ui-btn-a"></a>';
					}
					
					if(data[i].EST_ATU <= 0){
						var	bkgest = '<strong style="font-size:18px; color:red; border-radius: 12px;  padding: 5px;">'+data[i].EST_ATU+'</strong>';
					}else{
						var	bkgest = ''+data[i].EST_ATU+'';
					}
					
					html += '<li id="'+idpro+'" class="ui-li-has-alt ui-li-has-thumb ui-first-child">'+
						'<a href="#" data-id="'+codigo+'" data-url="'+data[i].src+'" data-ajax="false" class="ui-btn deltalhe-produto" '+colormaiscomp+'>'+			
							'<img src="'+data[i].src+'" id="'+codigo+'" alt="'+codigo+' '+desc.toUpperCase()+'"/>'+
								'<h2>'+codigo+' '+desc.toUpperCase()+' '+maiscomp+' </h2>'+
								'<p style="font-size: 16px;">Medida: <strong style="margin-left:39px;">'+uni+'</strong></p>'+
								'<p style="font-size: 16px;">Em Estoque: '+bkgest+'</p>'+
								'<p style="font-size: 16px;">Valor Tabela: <mark style="font-size:18px; background:#1565c0; color:#ffffff; padding:5px;">R$:'+number_format(preco,2,',','.')+'</mark> Peso Medio: '+pesomedio+'</p>'+
						'</a>'+
						' '+htmitemmaismenos+' '+
						''+detalhe+''+
					'</li>';														
				}
				
				
									
				$(".listaprodutos").html(html);
				//$('.listaprodutos').listview('refresh');
				
				
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




function ListaUltComprasCliente(id){
	
	//listultimas
	var vltotal 	 = 0;
	var vltotaldesc  = 0;
	var vltotalfinal = 0;
	var vtotal_desc  = 0;
	var vldesconto   = 0;
	var descontovalor= 0;
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
				
				var ls = listapedidosfeitos(data[i].nump);
					
						
				vldesconto    = convertevalores(ls.valor_desconto);
				vltotal 	  = convertevalores(ls.somtotal2);
				var vltotal2 	  = convertevalores(ls.somtotal);
				vltotaldesc   = ls.somtotaldesconto;
				vtotal_desc   = convertevalores(ls.vtotal_desc);
				descontovalor = vltotal2 * (vldesconto / 100);


				var valor_desconto_final = parseFloat(descontovalor) + parseFloat(vtotal_desc);

				vltotalfinal = vltotal - valor_desconto_final;	
				
				
				html += '<li class="ui-li-has-alt ui-li-has-thumb ui-first-child" data-icon="false">'+
							'<a href="#" data-ajax="false" class="ui-btn listaped" id="'+data[i].nump+'">'+								
								'<img src="../img/pedult.png" width="100"/>'+
									'<h2 class="text-warning">'+data[i].status+' | '+data[i].nnump+' - '+data[i].nome+'</h2>'+
									'<p style="font-size: 14px;"><strong>Emissão:'+data[i].datap+' Entrega  :'+data[i].dte+'</strong></p>'+
									'<p style="color:#1565c0;font-size: 0.8em;"><strong>[TOTAL: R$ '+number_format(vltotal,2,',','.')+']<br/> [TOTAL DESCONTO : R$ '+number_format(valor_desconto_final,2,',','.')+']<br/> [TOTAL FINAL: R$ '+number_format(vltotalfinal,2,',','.')+']</strong></p>'+
							'</a>'+							
							/*'<a href="javascript:void(0)" class="ui-btn ui-btn-icon-notext ui-icon-plus ui-btn-a" data-ajax="false" title="Detalhe"></a>'+*/
						'</li>';
												
				
			}
			

			
			$('#pedidofeitos').html(html); 			
			
			
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
					
		
		/*bthtm +='<div class="s-card-text"><a href="#" class="s-card-botao-edit ui-shadow '+bloqueio+' " id="'+$(this).attr('id')+'"></a>Editar</div>'+
                '<div class="s-card-text"><a href="#" class="s-card-botao-excluir ui-shadow" onClick="deletarpedido(\''+$(this).attr('id')+'\');"></a>Deletar</div>'+
				'<div class="s-card-text2"><a href="#page" data-transition="slidedown"><div class="s-card-botao-hide ui-shadow"><br/></div></a><br/>Fechar</div>';
		
		$(".s-card-botao-top").html(bthtm);*/
		
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
		
		
		vldesconto    = convertevalores(ls.valor_desconto);
		vltotal 	  = convertevalores(ls.somtotal2);
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
	
	
		$('#s-card-xconteudo-produtos').html(html);		
		$("#s-card-xconteudo-produtos").listview().trigger("create");
		$("#s-card-xconteudo-produtos").listview('refresh');
		
		$('.totalizar').html(html2);
		$(".totalizar").listview().trigger("create");
		$(".totalizar").listview('refresh');	
		
	
		$(':mobile-pagecontainer').pagecontainer('change', '#produtocomp',{
			transition: 'slideup',
			changeHash: false,
			reverse: false,
			showLoadMsg:true,
			loadMsgDelay: 75
		});
				
	
});

$(document).on('click','.deltalhe-produto',function(){
			
	$(':mobile-pagecontainer').pagecontainer('change', '#detalheprod',{
			transition: 'slideup',
			changeHash: false,
			reverse: false,
			showLoadMsg:true,
			loadMsgDelay: 1
	});
	//alert($("a[data-id='"+$(this).attr('data-id')+"']").html());
	
	$(".img-responsive").html("<a style='text-decoration: none; color: unset;' href='"+$("a[data-id='"+$(this).attr('data-id')+"']").attr('data-url')+"' class='swipebox'>"+$("a[data-id='"+$(this).attr('data-id')+"']").html()+"</a>");
	$(".infxcli").html(" Histórico última venda para: "+$("#infcli").html());
	
	$.ajax({
		type:'POST',
		cache:false, 
		dataType: "json",
		url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/lista-produtocliente-exec.php",
		data:{act:'detalhe_produto',codcli:$("#codcli").val(),codpro:$(this).attr('data-id')},
		success: function(data){
					
			var html = "";
			//alert(data.ultcomp.length);
			
			if(data.ultcomp.length > 0){
				html += '<tr>'+
					  '<th>'+data.ultcomp[0].numero_pedido+'</th>'+
					  '<td>'+data.ultcomp[0].data_pedido+'</td>'+
					  '<td>'+data.ultcomp[0].data_entrega+'</td>'+
					  '<td>'+data.ultcomp[0].numero_nota+'</td>'+
					  '<td>'+data.ultcomp[0].Qtd_pedido+'</td>'+
					  '<td>'+data.ultcomp[0].preco+'</td>'+
					  '<td>'+data.ultcomp[0].desconto+'</td>'+
					  '<td>'+data.ultcomp[0].valor_desconto+'</td>'+
					  '<td>'+data.ultcomp[0].subtotal+'</td>'+
					'</tr>';
			 
				$("#tbultcomp").html(html);
			}
			
			if(data.detalhe[0].sndesconto == 1){
				$('.inpdesc').show();
				$('.inpvldesc').show();
			}else{
				$('.inpdesc').hide();
				$('.inpvldesc').hide();
			}
			
			//alert(data.detalhe[0].desconto_perc);
			$("#codpro").val(data.detalhe[0].cod);
			if(data.detalhe[0].qtd > 0){
			
				$("#estatu").val(data.detalhe[0].EST_ATU);		
				$("#vlunitario").val(data.detalhe[0].PRECOLISTA);
				$("#qtd").val(data.detalhe[0].qtd);
				$("input[name='desconto']").val(data.detalhe[0].desconto_perc);
				$("#subtotal").val(data.detalhe[0].somaqtd);
				$("#valordesconto").val(data.detalhe[0].desconto_valor);
				$("#obsprod").val(data.detalhe[0].obsprod);
				$("#precotabela").val(data.detalhe[0].precotab);
				$("#pc").val(data.detalhe[0].volume);
				//$("#vlunitario").attr('disabled',false);
				$('#vlunitario').textinput('enable');
				$('input[name="desconto"]').textinput('enable');
				$('#valordesconto').textinput('enable');
				//$('#pc').textinput('enable');
				//$('#valordesconto').textinput('enable');
				//$('#btnprodobs').button('enable');
				
			}else{
				
				$("#estatu").val(data.detalhe[0].EST_ATU);		
				$("#vlunitario").val(data.detalhe[0].PRECOLISTA);
				$("#qtd").val(data.detalhe[0].qtd);
				$("input[name='desconto']").val(data.detalhe[0].desconto_perc);
				$("#subtotal").val(data.detalhe[0].somaqtd);
				$("#valordesconto").val(data.detalhe[0].desconto_valor);
				$("#obsprod").val(data.detalhe[0].obsprod);
				$("#precotabela").val(data.detalhe[0].precotab);
				$("#pc").val(data.detalhe[0].volume);
				
				$('#vlunitario').textinput('disable');
				$('input[name="desconto"]').textinput('disable');
				$('#valordesconto').textinput('disable');
				//$('#btnprodobs').button('disable');
				//$('#pc').textinput('disable');
			}

			if(data.blockqtd == 1){
				$('#qtd').textinput('disable');
				$("#qtd").attr('readonly','true');
			}
			
			/*$(".desc_perc").attr('id','desc_perc'+data.detalhe[0].cod+'');
			$(".quanitdade").attr('id','quantidade'+data.detalhe[0].cod+'');
			$(".valor").attr('id','valor'+data.detalhe[0].cod+'');*/
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

$(document).on('keyup','#qtd',function(){
	
	var codpro = $("#codpro").val();
	var codcli = $("#codcli").val();
	
	if($(this).val() > 0){
		
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{act:"addprod",id:codpro,idcli:codcli,qtd:$(this).val()},
			success: function(data){
				
				if(data[0].adicionado == 'ok'){
					ListaDadosCarinhoInput(codpro);
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
		
		
		
		$('#vlunitario').textinput('enable');
		$('input[name="desconto"]').textinput('enable');
		$('#valordesconto').textinput('enable');
		$('#btnprodobs').button('enable');
		//$('#pc').textinput('enable');
	}else{
		
		$('#vlunitario').textinput('disable');
		$('input[name="desconto"]').textinput('disable');
		$('#valordesconto').textinput('disable');				
		$('#btnprodobs').button('disable');
		//$('#pc').textinput('disable');
		
		if($(this).val() == '0'){
			removeritemnomenos(codpro);
		}
		
	}
	
});

$(document).on('keyup','#pc',function(){	
	
			
	if($(this).val() != ""){		
	
		if($(this).val() != 0){	
		
		var cod = $("#codpro").val();
		
		//alert(cod[1]);	
		if($("#valor"+cod+"").val() == '0,00' || $("#valor"+cod+"").val() == ''){
		
			alert('Valor esta vazio!');
			return false;
		}
		
		var volu = convertevalores($(this).val());
		
		if( (volu.substr(-2) != '50') && (volu.substr(-2) != '00') ){
			alert("Informação invalida! Caso queira colocar MEIO informe esse valor no campo 0,50");
			//alert(cod[1]);	
			//$("#pc").val('0,50');
			//$("#pc").keyup();
			return false;
		}
		
		if($("#qtd").val() == 0 || $("#qtd").val() == ""){
			alert("Adicione esse item no botão mais na linha do produto primeiro!");
			return false;
		}
		
		$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:cod,vlm:$(this).val(),act:'volume'},
			success: function(data){
				
				var html = "";
				var somtotals = 0;

				if(data[0].info != ''){	
					for (var i = 0; i < data.length; i++) {
																	
						if(data[i].codigo == cod){
																								
								$("#qtd").val(data[i].qtd);
								$("#vlunitario").val(data[i].preco);	
								$("#subtotal").val(data[i].somaqtd);
							
								if(data[i].volume > 0){	
									$(".count"+data[i].codigo+"").html(data[i].volume);
								}else{
									$(".count"+data[i].codigo+"").html(data[i].qtd);
								}
						}
						somtotals = data[i].somtotals;
						
					}
											

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

function ListaDadosCarinhoInput(codprod){
	
	$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
		 data:{act:"listar"},
		 dataType:"json",
		 success: function(data){
							
			var html  = "";
			var vltotal;
			
			for(var i = 0; i < data.length; i++){
				
			if(data[i].info == ''){
					
				if(data[i].codigo == codprod){
					
					$("#vlunitario").val(data[i].preco);
					$("#pc").val(data[i].volume);
					
					if(data[i].option1 == 1){	
					
					   //data[i].volume	
					  //data[i].qtd							
						if(convertevalores(data[i].volume) > 0){
							$(".count"+data[i].codigo+"").html(parseInt(data[i].volume));	
						}else{
							$(".count"+data[i].codigo+"").html(data[i].qtd);
						}
						
						
					}else{						
						$(".count"+data[i].codigo+"").html(data[i].qtd);																						
					}
											
																	
						
					if(data[i].sndesconto == 1){																				
						$("#desconto").val(data[i].desconto_perc);
						$("#valordesconto").val(data[i].desconto_valor);
						//data[i].desconto_perc
						//data[i].desconto_valor													
					}
						//alert(data[i].somaqtd);	
					$("#subtotal").val(number_format(data[i].somaqtd,2,',','.'));		
						
					vltotal = data[i].somtotal;	
					
				  }
				}else{
										
									
				}
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

$(document).on('keyup','#vlunitario',function(){
	
	var id    =  $("#codpro").val();
	var preco = $(this).val(); 
	
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
							
							//$("#vlunitario").val(data[i].preco);
							$("#subtotal").val(data[i].somaqtd);							
							$("#desconto").val(data[i].desconto_perc);
							$("#valordesconto").val(data[i].desconto_valor);	
						
					}
					somtotals = data[i].somtotals;

				}
						

			}else{
				
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

$(document).on('blur','#vlunitario',function(){
	
	var id    =  $("#codpro").val();
	var preco = $(this).val(); 
	
	if($("#validprecomenor").val() == 1){
		precomenorprod(this);
	}

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
							
							//$("#vlunitario").val(data[i].preco);
							$("#subtotal").val(data[i].somaqtd);							
							$("#desconto").val(data[i].desconto_perc);
							$("#valordesconto").val(data[i].desconto_valor);	
						
					}
					somtotals = data[i].somtotals;

				}
						

			}else{
				
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
var confmen;
function precomenorprod(prec){
	
		
	var vl 		  = convertevalores($(prec).val());
	//var id 		  = $(prec).parents('li').attr('id');
	var precolist = convertevalores($("#precotabela").val()); 
	var codigo	  = $("#codc").val();
		
	if(parseFloat(vl) < parseFloat(precolist)){
			
		
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
					$("#vlunitario").keyup();
				}
			}
		});
		
		
		return false;
	}
		
}

$(document).on('keyup','#desconto',function(){
	
	var id        =  $("#codpro").val();
	var desc  	  =  $(this).val(); 
	var descvalor = $("#valordesconto").val(); 
	
	if(convertevalores(desc) > 100){
		alert("Desconto maior que 100% não pode ser aplicado!");
		$(this).val('100,00'); 
		return false;
	}
	
	$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:id,act:'aplicadesconto',desc_perc:desc,desc_valor:descvalor},
			success: function(data){
				
				var html = "";
				var somtotals = 0;

				if(data[0].info != ''){	
							
					for (var i = 0; i < data.length; i++) {
																		
						if(data[i].codigo == id){
							if(data[i].option1 == 1){		
								$("#vlunitario").val(data[i].preco);
								$("#subtotal").val(data[i].somaqtd);							
								//$("#desconto").val(data[i].desconto_perc);
								$("#valordesconto").val(data[i].desconto_valor);
								
							}else{
								
								$("#vlunitario").val(data[i].preco);
								$("#subtotal").val(data[i].somaqtd);							
								//$("#desconto").val(data[i].desconto_perc);
								$("#valordesconto").val(data[i].desconto_valor);
								
							
							}
						}
						somtotals = data[i].somtotals;
						
					}
												
											

				}else{
								
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


$(document).on('keyup','#valordesconto',function(){
	
	var id        =  $("#codpro").val();
	var desc  	  =  $("#desconto").val(); 
	var descvalor =  $(this).val(); 
	var vldesc    = convertevalores(descvalor);
	var vltab     = convertevalores($("#precotabela").val());
	
	//var verdesc   = Math.floor((vldesc / vltab) * 100);
	//alert(verdesc.toFixed(2));
	if(vldesc > vltab){
		alert("Desconto maior que 100% não pode ser aplicado!");
		$(this).val($("#precotabela").val()); 
		return false;
	}
	
	$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:id,act:'aplicadesconto2',desc_perc:desc,desc_valor:descvalor},
			success: function(data){
				
				var html = "";
				var somtotals = 0;

				if(data[0].info != ''){	
							
					for (var i = 0; i < data.length; i++) {
																		
						if(data[i].codigo == id){
							if(data[i].option1 == 1){		
								$("#vlunitario").val(data[i].preco);
								$("#subtotal").val(data[i].somaqtd);							
								$("#desconto").val(data[i].desconto_perc);
								//$("#valordesconto").val(data[i].desconto_valor);
								
							}else{
								
								$("#vlunitario").val(data[i].preco);
								$("#subtotal").val(data[i].somaqtd);							
								$("#desconto").val(data[i].desconto_perc);
								//$("#valordesconto").val(data[i].desconto_valor);
								
							
							}
						}
						somtotals = data[i].somtotals;
						
					}																							

				}else{
													
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

$(document).on('click',"#btnprodobs",function(){
	
	var obsprod = $("#obsprod").val();
	var id      = $("#codpro").val();
	
	$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:{id:id,act:'gravaobs',desprod:obsprod},
			success: function(data){
				if(data[0].adicionado == 'ok'){
					alert("gravado!");
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

$(document).on('click','#qtd',function(){		
	$(this).select();		
});

$(document).on('click','#vlunitario',function(){		
	$(this).select();		
});
$(document).on('click','#desconto',function(){		
	$(this).select();		
});
$(document).on('click','#valordesconto',function(){		
	$(this).select();		
});
function atualizaQtd(id){
	var ret = [];
	$.ajax({
		type:'POST',
		async:false, 
		 dataType: "json",
		url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
	 	data:{act:"listaum",id:id},
		success: function(data){
			ret = data;			
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
	return ret;
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
$(document).ready(function(){
    var links = [
        {
            "bgcolor":"#1565C0",
            "icon":"<i class='ui-icon-arrow-r ui-btn-icon-notext'></i>",
			"url":"visualizar-pedido-alt.html"			
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
	var links2 = [
        {
            "bgcolor":"#05ffe6",            
			"onClick":"test();",
			"background":"../img/cartok.png",
			"icon":"<i class='ui-icon-shop ui-btn-icon-notext'></i>",
			"width":"80px",
			"height":"80px",
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
	//$('.kc_fab_wrapper2').kc_fab(links2);
});

var iScrollPos = 0;

$( window ).on( "load", function() {
	$(document).on("scroll",function () {
			
		//alert($(window).scrollTop());
		if($(window).scrollTop() > 1) {
			$("#searchForSelect").blur();
		
		}
		
		 var iCurScrollPos = $(this).scrollTop();
				
		if (iCurScrollPos > iScrollPos) {

			$( ".s-card-botao" ).fadeOut();

		} else {

		   $( ".s-card-botao" ).fadeIn();
		}

		iScrollPos = iCurScrollPos;


		});
});

$(".s-card-botao").click(function (e) {
  /*
  // Remove any old one
  $(".ripple").remove();

  // Setup
  var posX = $(this).offset().left,
      posY = $(this).offset().top,
      buttonWidth = $(this).width(),
      buttonHeight =  $(this).height();
  
  // Add the element
  $(this).prepend("<span class='ripple'></span>");

  
 // Make it round!
  if(buttonWidth >= buttonHeight) {
    buttonHeight = buttonWidth;
  } else {
    buttonWidth = buttonHeight; 
  }
  
  // Get the center of the element
  var x = e.pageX - posX - buttonWidth / 2;
  var y = e.pageY - posY - buttonHeight / 2;
  
 
  // Add the ripples CSS and start the animation
  $(".ripple").css({
    width: buttonWidth,
    height: buttonHeight,
    top: y + 'px',
    left: x + 'px'
  }).addClass("rippleEffect");
	*/
	test();
});
	
 
 $(document).on('click','.cars',function(){

		var target2  = $(this).attr("src");			
        var target = $(this),
            brand = target.attr("alt"),
            short = target.attr("id"),
            closebtn = '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>',
            header = '<div data-role="header"><h2>' + brand + '</h2></div>',
            img = '<img src="'+target2+'" alt="' + brand + '" class="photo">',
            popup = '<div data-role="popup" id="popup-' + short + '" data-short="' + short +'" data-theme="none" data-overlay-theme="a" data-corners="false" data-tolerance="15"></div>';
        // Create the popup.
        $(header).appendTo($(popup).appendTo($.mobile.activePage).popup()).toolbar().before(closebtn).after(img);
        // Wait with opening the popup until the popup image has been loaded in the DOM.
        // This ensures the popup gets the correct size and position
        $(".photo","#popup-"+short).load(function() {
            // Open the popup
            $( "#popup-" + short ).popup( "open" );
            // Clear the fallback
            clearTimeout( fallback );
        });
        // Fallback in case the browser doesn't fire a load event
        var fallback = setTimeout(function() {
            $( "#popup-" + short ).popup( "open" );
        }, 1000);
    });
    // Set a max-height to make large images shrink to fit the screen.
    $( document ).on( "popupbeforeposition", ".ui-popup", function() {
        var image = $( this ).children( "img" ),
            height = image.height(),
            width = image.width();
        // Set height and width attribute of the image
        $( this ).attr({ "height": height, "width": width });
        // 68px: 2 * 15px for top/bottom tolerance, 38px for the header.
        var maxHeight = $( window ).height() - 68 + "px";
        $( "img.photo", this ).css( "max-height", maxHeight );
    });
    // Remove the popup after it has been closed to manage DOM size
    $( document ).on( "popupafterclose", ".ui-popup", function() {
        $( this ).remove();
    });
