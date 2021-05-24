// JavaScript Document
var dlog,dlog2;
var page = 1;
$(document).ready(function(e) {    
	
$('#more').hide();
$('#no-more').hide();	

	// ao carregar a pagina lista os primeiros 12 produtos
	/*var dlog = $.dialog({
				title: 'Aguarde :D',
				content: '<div align="center"><img src="../img/ajax_loading.gif" /><br/>Carregando Dados..!</div>',
			});*/
	
					
	$.ajax({
		 type: 'POST',
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/produto-exec.php",
		 data:{act:'consultaproduto'},
		 cache:false,
		 dataType: "json",		 
		 success: function(data){
				
			var list = '';
			
			$.mobile.loading( 'show', {
				text: 'Listando...',
				textVisible: true,
				theme: 'b',
				html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Listando..."
			});	
			
			for(var i in data.produtos){
					
				list += '<li id="'+data.produtos[i].cod+'" class="ui-li-has-alt ui-li-has-thumb ui-first-child">'+
							'<a href="'+data.produtos[i].conteudo+'" data-ajax="false" id="'+data.produtos[i].cod+'" title="'+data.produtos[i].cod+' - '+data.produtos[i].desc+'" class="ui-btn swipebox">'+								
								'<img src="'+data.produtos[i].conteudo+'" width="80" height="80">'+
									'<h2>'+data.produtos[i].cod+' - '+data.produtos[i].desc+'</h2>'+
									'<p>Un:'+data.produtos[i].UNIDADE+' Preço: R$ '+data.produtos[i].PRECOLISTA+'</p>'+
							'</a>'+
							'<a href="#" class="ui-btn ui-btn-icon-notext ui-btn-a" data-ajax="false" title="Detalhe"></a>'+
						'</li>';
						
										
						
			}			
			$("#lista_produtos").html(list);																						
			//dlog.close();
			$("#countrowss").val(data.rowscount);
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

$( document ).on( "pageinit", "#page", function() {
    $( "#lista_produtos" ).on( "filterablebeforefilter", function ( e, data ) {
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
                url: ""+caminhoURL+"/PROJETOS/webservice_pedido/php/produto-exec.php",
				type:'POST',
                dataType: "json",
                crossDomain: true,				
                data: {
                    p: $input.val(),					
					act:'consultaproduto',
                }
            })
            .then( function ( response ) {
				$('#lista_produtos').show();
                $.each( response.produtos, function ( i, val ) {
					
					html += '<li id="'+val.cod+'" class="ui-li-has-alt ui-li-has-thumb ui-first-child">'+
								'<a href="'+val.conteudo+'" data-ajax="false" id="'+val.cod+'" class="ui-btn swipebox">'+								
									'<img src="'+val.conteudo+'" width="80" height="80">'+
										'<h2>'+val.cod+' - '+val.desc+'</h2>'+
										'<p>Un:'+val.UNIDADE+' Preço: R$ '+val.PRECOLISTA+'</p>'+
								'</a>'+
								'<a href="#" class="ui-btn ui-btn-icon-notext ui-btn-a" data-ajax="false" title="Detalhe"></a>'+
							'</li>';
					
                });				
                $ul.html( html );
                $ul.listview( "refresh" );
                $ul.trigger( "updatelayout");
            });
        }else{
			
			listaprodutos();
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
					
					var list = '';
					
					$("#lista_produtos").html('');		
					for(var i in data.produtos){								
						
						
							list = '<li id="'+data.produtos[i].cod+'" class="ui-li-has-alt ui-li-has-thumb ui-first-child">'+
										'<a href="'+data.produtos[i].conteudo+'" data-ajax="false" id="'+data.produtos[i].cod+'" class="ui-btn swipebox">'+								
											'<img src="'+data.produtos[i].conteudo+'" width="80" height="80">'+
												'<h2>'+data.produtos[i].cod+' - '+data.produtos[i].desc+'</h2>'+
												'<p>Un:'+data.produtos[i].UNIDADE+' Preço: R$ '+data.produtos[i].PRECOLISTA+'</p>'+
										'</a>'+
										'<a href="#" class="ui-btn ui-btn-icon-notext ui-btn-a" data-ajax="false" title="Detalhe"></a>'+
									'</li>';
											
						$("#lista_produtos").append(list);		
					}			
					
				
					$.mobile.loading('hide');
				},
				error: function(data){
					alert('Erro: '+data.status);	
				}
			});
	     return false;
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
        scrollEnd = contentHeight - screenHeight + header + footer;
    $(".ui-btn-left", activePage).text("Scrolled: " + scrolled);
    $(".ui-btn-right", activePage).text("ScrollEnd: " + scrollEnd);
    if (activePage[0].id == "page" && scrolled >= scrollEnd) {
        console.log("adding...");
		
        page++;		
		var data = {
			page_num: page,
			act:'consultaproduto',					
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
				url: ""+caminhoURL+"/PROJETOS/webservice_pedido/php/produto-exec.php",
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
				var list = "";					
				for(var i in data.produtos){
					
				list += '<li id="'+data.produtos[i].cod+'" class="ui-li-has-alt ui-li-has-thumb ui-first-child">'+
							'<a href="'+data.produtos[i].conteudo+'" data-ajax="false" id="'+data.produtos[i].cod+'" title="'+data.produtos[i].cod+' - '+data.produtos[i].desc+'" class="ui-btn swipebox">'+								
								'<img src="'+data.produtos[i].conteudo+'" width="80" height="80">'+
									'<h2>'+data.produtos[i].cod+' - '+data.produtos[i].desc+'</h2>'+
									'<p>Un:'+data.produtos[i].UNIDADE+' Preço: R$ '+data.produtos[i].PRECOLISTA+'</p>'+
							'</a>'+
							'<a href="#" class="ui-btn ui-btn-icon-notext ui-btn-a" data-ajax="false" title="Detalhe"></a>'+
						'</li>';
						
						
						
					}
					
				$("#lista_produtos").append(list);	
				// $(".listaprodutos").listview('refresh');	
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
		 $('#lista_produtos').html('');
		 window.location.reload();
});

function listaprodutos(){	
	$.ajax({
		 type: 'POST',
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/produto-exec.php",
		 data:{act:'consultaproduto'},
		 cache:false,
		 dataType: "json",
	  	 beforeSend: function(){
										
				$.mobile.loading( 'show', {
					text: 'Fazendo sua busca..',
					textVisible: true,
					theme: 'b',
					html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Fazendo sua busca..</div>"
				});	
				
			},	
		 success: function(data){
				
			
			var list = '';
			
			for(var i in data.produtos){
				
								
				list = '<li id="'+data.produtos[i].cod+'" class="ui-li-has-alt ui-li-has-thumb ui-first-child">'+
						'<a href="'+data.produtos[i].conteudo+'" data-ajax="false" id="'+data.produtos[i].cod+'" class="ui-btn swipebox">'+	
							'<img src="'+data.produtos[i].conteudo+'" width="80" height="80">'+
								'<h2>'+data.produtos[i].cod+' - '+data.produtos[i].desc+'</h2>'+
								'<p>Un:'+data.produtos[i].UNIDADE+' Preço: R$ '+data.produtos[i].PRECOLISTA+'</p>'+
						'</a>'+
						'<a href="#" class="ui-btn ui-btn-icon-notext ui-btn-a" data-ajax="false" title="Detalhe"></a>'+
					'</li>';
						
				$("#lista_produtos").append(list);		
			}																									
			
			$("#countrowss").val(data.rowscount);
			$.mobile.loading('hide');
		},
		error: function(jqXHR, exception){
			dlog.close();
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
	
}
var id_foto = "";
$(document).on('click','.editar_produto',function(){
	
	id_foto  = $(this).parents('li').attr("id");

	 navigator.camera.getPicture(uploadPhoto,function(message) { 
	 	alert('Operação Cancelada pelo operador'); 
	 },{ 
	 	quality: 50, 
	    destinationType: navigator.camera.DestinationType.FILE_URI,
       	sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY 
	   });
	
});

 function uploadPhoto(imageURI) {
	 var options = new FileUploadOptions();
	 options.fileKey = "file";
	 options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
	 options.mimeType = "image/jpeg";
	// alert(options.fileName);
	 var params = new Object();
	 params.value1 = "test";
	 params.value2 = "param";
	 options.params = params;
	 options.chunkedMode = false;
	//alert(id_foto);
	var ft = new FileTransfer();
	 ft.upload(imageURI, ""+caminhoURL+"/PROJETOS/webservice_pedido/php/produto-exec.php?act=upload&codigo="+id_foto+"", function(result){
		
		//alert(JSON.stringify(result));
		var myEvent = $.parseJSON(JSON.stringify(result));				
		var res 	= $.parseJSON(myEvent['response']);
		
		alert(res['mensagem']);
		
		window.location.reload();
	 }, function(error){
		 
	 	alert("erro"+JSON.stringify(error));
	 
	 }, options);
 }

 function print_r( input, _indent ) {
// Recuo

var indent = ( typeof( _indent ) == 'string' ) ? _indent + '    ' : '    '
var parent_indent = ( typeof( _indent ) == 'string' ) ? _indent : '';
var output = '';

// Tipo de Elemento do Array
switch( typeof( input ) ) {
case 'string':
     output = "'" + input + "'n";
     break;
case 'number':
     output = input + "n";
     break;
case 'boolean':
     output = ( input ? 'true' : 'false' ) + "n";
     break;
case 'object':
     output = ( ( input.reverse ) ? 'Array' : 'Object' ) + "n";
     output += parent_indent + "(n";
     for( var i in input ) {
          output += indent + '[' + i + '] => ' + print_r( input[ i ], indent );
     }
     output += parent_indent + ")n"
     break;
  }
return output;
}

$(document).on('click','.cars',function(){

		var target2  = $(this).find("img").attr("src");			
        var target = $(this),
            brand = target.find("h2").html(),
            model = target.find("p").html(),
            short = target.attr("id"),
            closebtn = '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>',
            header = '<div data-role="header"><h2>' + brand + ' ' + model + '</h2></div>',
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
