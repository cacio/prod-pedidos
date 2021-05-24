// JavaScript Document


$(document).ready(function(){	
	
	 var sett = setTimeout(function(){
	
	$.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/duplicatas-exec.php",
		 beforeSend: function(){	
			$.mobile.loading( 'show', {
				text: 'Aguarde Listando!',
				textVisible: true,
				theme: 'b',
				html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Aguarde Listando!</div>"
			});	
 		 },	
		 data:{act:"listacli"},
		 dataType:"json",
		 success: function(data){
										
			var html = "";	
			 $("#countrows").val(data.rowscount);
			for(i in data.respost){
			 	
				 /*html +='<div data-role="collapsible" id="set'+data[i].cod_forc+'" class="det"  data-collapsed="true" >'+
						'<h3>'+data[i].cod_forc+'-'+data[i].nome+' '+data[i].total+'</h3>'+
						'<p clas="listadup">';										
				 			html +='<input type="button" value="Button" onClick="mandar();">';
				 html +='</p>'+
					'</div>';*/
				 
			html +='<div data-role="collapsible" data-theme="b" data-content-theme="b"  class="ui-collapsible ui-collapsible-inset ui-corner-all ui-collapsible-themed-content ui-first-child ui-collapsible-collapsed" data-collapsed="true">'+
			'<h3 class="det ui-collapsible-heading ui-collapsible-heading-collapsed" id="set'+data.respost[i].cod_forc+'">'+				
				'<a href="#" class="ui-collapsible-heading-toggle ui-btn ui-btn-icon-left ui-icon-carat-r"><img src="../img/company-icon.png" style="width: 80px; float: left;"/><br/>'+data.respost[i].cod_forc+'-'+data.respost[i].nome+' <span class="ui-li-count ui-body-b">'+data.respost[i].total+'</span></a>'+
			'</h3>'+
				'<div class="ui-collapsible-content ui-body-a ui-collapsible-content-collapsed" aria-hidden="true">'+
				'<p clas="listadup"></p>'+
			'</div>'+
		'</div>';
				 
			 }
			 			 
			 $( "#set" ).html( html );
			 //$( "#set" ).html( html );
			 
			 $.mobile.loading("hide");
		},
		error: function(jqXHR, exception){
			//alert('aaaa');
			if (jqXHR.status === 0) {
			alert('Descuple o transtorno, Contate o suporte!.');
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
	
	clearTimeout(sett);
	},700);

});
$(document).on('click','.det',function(){
	   
		$(".ui-collapsible-content").html("");
		//Set default open/close settings             
		$(".ui-collapsible-content").slideUp(500);
				
		$(this).next(".ui-collapsible-content").slideDown(500);
		var cod = $(this).attr('id').split('set');
		var intv =  setTimeout(function(){
			$(".ui-collapsible-content").html("<div align='center'><img src='../img/ajax_loading.gif'/></div>");
			ListaDuplicatas(cod[1]);
			clearTimeout(intv);
		},300);
						
		
		$(this).addClass('xfecha');
		$(this).removeClass('det');
});	

$(document).on('click','.xfecha',function(){
	
	$(".ui-collapsible-content").slideUp(500);
	$(this).addClass('det');
	$(this).removeClass('xfecha');
});

function ListaDuplicatas(cod){		
		$.ajax({
		 type: 'POST',
		 cache:false,		
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/duplicatas-exec.php",
		 data:{act:"detalhe",codf:cod},
		 dataType:"json",
		 beforeSend:function(){
			 $(".ui-collapsible-content").html("<div align='center'><img src='../img/ajax_loading.gif'/></div>");
		 },	
		 success: function(data){
			
			var htm = '';
			 	htm +='<table class="table table-striped table-hover display dataTable no-footer dtr-inline" cellspacing="0" width="100%">'+
				 '<thead>'+
						'<tr>'+					
							'<th style="text-align:center;">DOCUMENTO</th>'+
							'<th style="text-align:center;">VENCIMENTO</th>'+
							'<th style="text-align:right;">VALOR</th>'+
							'<th style="text-align:right;">SALDO</th>'+							
						'</tr>'+
				  '</thead>'+
				  '<tbody>';
			 for(var i =0; i < data.length; i++){
				 
				 htm +='<tr>';
					 htm +='<td style="text-align:center;">'+data[i].ndup+'</td>';	
					 htm +='<td style="text-align:center;">'+data[i].vencdup+'</td>';	
					 htm +='<td style="text-align:right;">'+data[i].vlrdup+'</td>';	
					 htm +='<td style="text-align:right;">'+data[i].vlrdup+'	</td>';	
				 htm +='</tr>';
				 
			 }
						 				
			 htm +='</tbody>'+
				 '</table>';
			 
			 
			 $(".ui-collapsible-content").html(htm);
			 
			/* $('.table').dataTable({				
				"responsive": true,
				"bSort" : false,
				 "paging":   false,
				 "ordering": false,
				 "info":     false,
				 "bDestroy": true,
				 "bFilter": false,					
				 "order": []
			}).columnFilter({aoColumns:[{ type:"select", sSelector: "#a" },]});*/
			 
		},
		error: function(jqXHR, exception){
						
			if (jqXHR.status === 0) {
			alert('Descuple o transtorno, Contate o suporte!.');
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

$(document).ready(function(e) {
    
	$forms = $('form[id="filtroduplicatas"]');	
    
	$forms.bind('submit', function(){
						
		var params = $(this.elements).serialize();
		
		$.ajax({
				type: 'POST',
				cache:false, 
				dataType: "json",	
				url: ""+caminhoURL+"/PROJETOS/webservice_pedido/php/duplicatas-exec.php",
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
					
					for(var i in data.respost){


					html +='<div data-role="collapsible" data-theme="b" data-content-theme="b"  class="ui-collapsible ui-collapsible-inset ui-corner-all ui-collapsible-themed-content ui-first-child ui-collapsible-collapsed" data-collapsed="true">'+
					'<h3 class="det ui-collapsible-heading ui-collapsible-heading-collapsed" id="set'+data.respost[i].cod_forc+'">'+				
						'<a href="#" class="ui-collapsible-heading-toggle ui-btn ui-btn-icon-left ui-icon-carat-r"><img src="../img/company-icon.png" style="width: 80px; float: left;"/><br/>'+data.respost[i].cod_forc+'-'+data.respost[i].nome+' <span class="ui-li-count ui-body-b">'+data.respost[i].total+'</span></a>'+
					'</h3>'+
						'<div class="ui-collapsible-content ui-body-a ui-collapsible-content-collapsed" aria-hidden="true">'+
						'<p clas="listadup"></p>'+
					'</div>'+
				'</div>';

					 }

					 $( "#set" ).html( html );		
					
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
					
					$.mobile.loading('hide');
				},
				error: function(data){
					alert('Erro: '+data.status);	
				}
			});
	     return false;
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
				
				//$('#more').show();
				//$('#more').css("top","400");
								
			}
			//alert(''+$(window).scrollTop()+' '+$(window).height()+' '+$(window).height()+'');
			//if($(window).scrollTop() + $(window).height() >= $(document).height() -500) {
			 if($(window).scrollTop() + $(window).height() == $(document).height()) {			
				$('#more').hide();
				$('#no-more').hide();
				$.mobile.loading('hide');
				page++;
			
				var data = {
					page_num: page,
					act:'listacli2'
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
						url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/duplicatas-exec.php',
						data:data,
						 beforeSend:function(){
							 $.mobile.loading( 'show', {
									text: 'Listando...',
									textVisible: true,
									theme: 'b',
									html: "<div align='center'><img src='../img/ajax_loading.gif' /><br/>Listando..."
								});	
						 },
						success: function(data) {
		
							var html = "";	
							
							for(i in data.respost){
								 

							html +='<div data-role="collapsible" data-theme="b" data-content-theme="b"  class="ui-collapsible ui-collapsible-inset ui-corner-all ui-collapsible-themed-content ui-first-child ui-collapsible-collapsed" data-collapsed="true">'+
							'<h3 class="det ui-collapsible-heading ui-collapsible-heading-collapsed" id="set'+data.respost[i].cod_forc+'">'+
								'<a href="#" class="ui-collapsible-heading-toggle ui-btn ui-btn-icon-left ui-icon-carat-r"><img src="../img/company-icon.png" style="width: 80px; float: left;"/><br/>'+data.respost[i].cod_forc+'-'+data.respost[i].nome+' <span class="ui-li-count ui-body-b">'+data.respost[i].total+'</span></a>'+
							'</h3>'+
								'<div class="ui-collapsible-content ui-body-a ui-collapsible-content-collapsed" aria-hidden="true">'+
								'<p clas="listadup"></p>'+
							'</div>'+
						'</div>';

							 }


							 $( "#set" ).append( html );			
							 $.mobile.loading('hide');	
							
															
						}
					});
				}
			
			}
			
		}	
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
		 
		 window.location.reload();
});
