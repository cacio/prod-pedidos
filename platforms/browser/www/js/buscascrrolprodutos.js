// JavaScript Document

$(document).ready(function(e) {

    var codc =  $("#codc").val();
	$.ajax({
			 type: 'POST',
			 cache:false,
			 url:""+caminhoURL+"/PROJETOS/service_pedido/php/lista-produtocliente-exec.php",
			 data:{act:"listarprodutosporbusca",cod:1,codcli:0},
			 dataType:"json",
			 success: function(data){

				$("#countrowss").val(data[0].rowscount);
				var html = "";
				for(var i = 1; i < data.length; i++){
											
					var codigo = data[i].cod;
					var desc   = data[i].desc;
					var cli    = data[i].codcli;
					var	preco  = data[i].PRECOLISTA;	
					var uni    = data[i].UNIDADE;
					var comp   = data[i].COMP;
					
						html += '<li>';
						html += '<a href="#" onClick="adicionaprimeiranocarrinho(\''+codigo+'\',\''+cli+'\');" data-ajax="false">';
						if(comp != 0){
							html += '<img src="../img/product_box_det.png">';
						}else{
							html += '<img src="../img/product_box.png">';
						}
						html += '<h2>'+codigo+' '+desc.toUpperCase()+'</h2>';				
						html += '<p>R$:'+number_format(preco,2,',','.')+' UN:</strong> '+uni+'</p>';
						html += '</a>';
						html += '<a href="#" onClick="adicionaprimeiranocarrinho(\''+codigo+'\',\''+cli+'\');" data-ajax="false">Detalhe</a>';
						html += '</li>';
																			
				}
				
				
									
				$(".listaprodutos").html(html);
				$('.listaprodutos').listview('refresh');
				 $.mobile.loading('hide');
				
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
	var page = 1;
	$('#more').hide();
	$('#no-more').hide();
	
	$(window).scroll(function () {
	if($("#scrrol").val() == 1){
	$.mobile.loading('hide');
	if($(window).scrollTop() + $(window).height() > $(document).height() - 200) {

		$('#more').css("top","400");
		$('#more').show();
		
		$.mobile.loading( 'show', {
				text: 'Listando...',
				textVisible: true,
				theme: 'b',
				html: "Listando..."
			});	
	}
	//alert(''+$(window).scrollTop()+' '+$(window).height()+' '+$(window).height()+'');
	if($(window).scrollTop() + $(window).height() > $(document).height() - 200) {
	 //if($(window).scrollTop() + $(window).height() == $(document).height()) {		
		$('#more').hide();
		$('#no-more').hide();
		$.mobile.loading('hide');
		page++;
		
		var codcs =  $("#codc").val();		
		var data = {
			page_num: page,
			act:'listarprodutosporum2',
			cod:1,
			codcli:0
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
				url: ''+caminhoURL+'/PROJETOS/service_pedido/php/lista-produtocliente-exec.php',
				data:data,
				success: function(res) {
				
				//alert(res)
				var html = "";	
				for (var i = 0; i < res.length; i++) {
							
						var codigo = res[i].cod;
						var desc   = res[i].desc;
						var cli    = res[i].codcli;
						var	preco  = res[i].PRECOLISTA;	
						var uni    = res[i].UNIDADE;
						
						html += '<li>';
						html += '<a href="#" onClick="adicionaprimeiranocarrinho(\''+codigo+'\',\''+cli+'\');" data-ajax="false">';
						html += '<img src="../img/product_box.png">';
						html += '<h2>'+codigo+' '+desc.toUpperCase()+'</h2>';				
						html += '<p>R$:'+number_format(preco,2,',','.')+' UN:</strong> '+uni+'</p>';
						html += '</a>';
						html += '<a href="#" onClick="adicionaprimeiranocarrinho(\''+codigo+'\',\''+cli+'\');" data-ajax="false">Detalhe</a>';
						html += '</li>';	
					
					
				}	
					
				 $(".listaprodutos").append(html);	
				 $(".listaprodutos").listview('refresh');	
				 $.mobile.loading('hide');
				
				}
			});
		}
	
	}
	
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
							
							var codigo = data[i].cod;
							var desc   = data[i].desc;
							var cli    = data[i].codcli;
							var	preco  = data[i].PRECOLISTA;	
							var uni    = data[i].UNIDADE;
							
							html += '<li>';
							html += '<a href="#" onClick="adicionaprimeiranocarrinho(\''+codigo+'\',\''+cli+'\');" data-ajax="false">';
							html += '<img src="../img/product_box.png">';
							html += '<h2>'+codigo+' '+desc.toUpperCase()+'</h2>';				
							html += '<p>R$:'+number_format(preco,2,',','.')+' UN:</strong> '+uni+'</p>';
							html += '</a>';
							html += '<a href="#" onClick="adicionaprimeiranocarrinho(\''+codigo+'\',\''+cli+'\');" data-ajax="false">Detalhe</a>';
							html += '</li>';
					
						}		
						$(".ftrdata").slideUp(1000);			
					}else{
						html = "<div align='center'><h3>Nada encontrado</h3></div>";
					}
					$(".listaprodutos").html(html);					  
					$(".listaprodutos").listview('refresh');	
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
			 url:""+caminhoURL+"/PROJETOS/service_pedido/php/lista-produtocliente-exec.php",
			 data:{act:"listarprodutosporum",cod:1,codcli:codc},
			 dataType:"json",
			 success: function(data){

			$("#countrowss").val(data[0].rowscount);
				var html = "";
				for(var i = 1; i < data.length; i++){
											
					var codigo = data[i].cod;
					var desc   = data[i].desc;
					var cli    = data[i].codcli;
					var	preco  = data[i].PRECOLISTA;	
					var uni    = data[i].UNIDADE;
					var comp   = data[i].COMP;
					
						html += '<li>';
						html += '<a href="#" onClick="adicionaprimeiranocarrinho(\''+codigo+'\',\''+cli+'\');" data-ajax="false">';
						if(comp != 0){
							html += '<img src="../img/product_box_det.png">';
						}else{
							html += '<img src="../img/product_box.png">';
						}
						html += '<h2>'+codigo+' '+desc.toUpperCase()+'</h2>';				
						html += '<p>R$:'+number_format(preco,2,',','.')+' UN:</strong> '+uni+'</p>';
						html += '</a>';
						html += '<a href="#" onClick="adicionaprimeiranocarrinho(\''+codigo+'\',\''+cli+'\');" data-ajax="false">Detalhe</a>';
						html += '</li>';
																			
				}
				
				
									
				$(".listaprodutos").html(html);
				$('.listaprodutos').listview('refresh');
				
				
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