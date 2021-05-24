// JavaScript Document

var localDB = null;


function onInit(){
    try {
        if (!window.openDatabase) {
            updateStatus("Erro: Seu navegador não permite banco de dados.");
        }
        else {
            initDB();			
            createTables();
			//ListaFormaPagamento();
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

$(document).ready(function(e) {
	
    $.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/cliente-exec.php",
		 data:{act:"info"},
		 dataType:"json",
		 success: function(data){
							
			$('#infcli').html(data[0].cod+' - '+data[0].nome);			
			$('#infclimuni').html(data[0].cidade+' - '+data[0].estado);
			$('#mydate').val(data[0].dtent);
			$('#nump').val(data[0].nump);
			$('#nnump').val(data[0].nnump);
			//alert(data[0].obs);
			//$("#obs").val(data[0].obs);
			$("#obs").html(data[0].obs);
			$("#desconto").val(data[0].desconto);
			$("#clipdv").val(data[0].nomeretira);
			//$("#desconto").keyup(); 
			$('select[name="retira"] option[value="'+data[0].retira+'"]').attr('selected','selected');			
			$('select[name="retira"]').selectmenu( "refresh" );			 
			 $('#obs').trigger('keyup');
			if(data[0].cod == '03434'){
				$('.clipdv').removeClass('hide');
			}	

			 var stt = setInterval(function(){
				descontodototal(); 
				clearInterval(stt);
			},600);
								
			 
			//$('#formpag option[value="'+data[0].formpag+'"]').attr('selected','selected');
			ListaFormaPagamento(data[0].formpag);
			prazosalter();
			 
			$("#prazo1").val(data[0].prazo1);
			$("#prazo2").val(data[0].prazo2);
			$("#prazo3").val(data[0].prazo3);
			$("#prazo4").val(data[0].prazo4);
			$("#prazo5").val(data[0].prazo5);
			$("#obs").val(window.localStorage.getItem("obs")); 
			
			/*if(data[0].formpag == '0001' || data[0].formpag == '0005'){
				
				$(".prazos").show();
				prazosalter();
			}

			var myselect = $( "#formpag" );
			myselect[0].selectedIndex = data[0].formpag;
			myselect.selectmenu( "refresh" );*/
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
	
	
$(document).ready(function()
	{
		// DOM Element Insertion and Plugin Initialisation on loading of first page if you are using DatePicker on first page
		//$("#page").find(".ui-content").append("<div id='dateBox'></div>"); // Add Element To DOM
		//$("#dateBox").DateTimePicker(); // Plugin Initialization
	
		
		/*$("#page, #page2").on("pageshow", function(event) 
		{
			$(this).find(".ui-content").append("<div id='dateBox'></div>"); // Add Element To DOM
			$("#dateBox").DateTimePicker({
			dateTimeFormat:"dd/MM/yyyy"
		}); // Plugin Initialization
		});*/
	
		
		$("#page, #page2").on("pagehide", function(event) 
		{
			$("#dateBox").remove(); // Remove Element From DOM
		});
	
	});
	
function prazosalter(){
		
		
		 $.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/pedido-cliente-exec.php",
		 data:{act:"altprazos"},
		 dataType:"json",
		 success: function(data){
			
			 if(data[0].prazo1 > 0){
				$("#prazo1").val(data[0].prazo1);
				$("#prazo2").val(data[0].prazo2);
				$("#prazo3").val(data[0].prazo3);
				$("#prazo4").val(data[0].prazo4);
				$("#prazo5").val(data[0].prazo5);				
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
	
	//$('#desconto').mask("#.##0,00", {reverse: true});
	$('#desconto').priceFormat({
		prefix: '',
		centsSeparator: ',',
		thousandsSeparator: '.',
		clearOnEmpty: false
	});	
});

$(document).ready(function(e) {
    
	 $.ajax({
		 type: 'POST',
		 cache:false,
		 url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
		 data:{act:"listar"},
		 dataType:"json",
		 success: function(data){
							
			var html = "";
			var vltotal;
			var vltotaldesc;
			var	vldesc = 0;
			var vltotalfinal = 0;
			var somtotalvalor = 0; 
			//html += '';
			for(var i = 0; i < data.length; i++){
				
				if(data[i].info == ''){
				
				html += '<li id="'+data[i].codigo+'">';
						
					html += '<div class="ui-radio">';
						html += '<h3 class="text-center">';
							html += '<span id="desc'+data[i].codigo+'"><strong>'+data[i].descricao+'</strong></span>';							
							html += '<a href="#" data-id="'+data[i].codigo+'" class="prodcoment ui-btn ui-icon-comment ui-btn-icon-notext ui-corner-all" style="display: inline-block;width: 33px;height: 30px;text-align: left;background: none;box-shadow: none;"></a>';
						html += '</h3>';
						//html += '<a href="#" class="ui-icon-comment ui-mini ui-btn-icon-notext ui-corner-all" style="display: inline-block;"></a>';
					html += '</div>';
										
					if(data[i].option1 == 1){
												
															
						html += '<a href="javascript:void(0);">';
							html += '<div class="inp">';
								html += 'Vol.(PC)';														
								html += '<p id="volume'+data[i].codigo+'" class="volume">'+data[i].volume+'</p>';								
							html += '</div>';
						html += '</a>';	
							
						
						html += '<a href="javascript:void(0);">';
							html += '<div class="inpx">';
								html += 'QTD.('+data[i].unidade+')';														
								html += '<p id="quantidade'+data[i].codigo+'">'+data[i].qtd+'</p>';																				
							html += '</div>';																										
						html += '</a>';	
						
						if(data[i].sndesconto == 1){
							
							html += '<a href="javascript:void(0);">';
								html += '<div class="inpx">';
									html += 'Desc %';								
									html += '<p id="desc_perc'+data[i].codigo+'">'+data[i].desconto_perc+'</p>';								
								html += '</div>';
							html += '</a>';	
							
							html += '<a href="javascript:void(0);">';
								html += '<div class="inpx">';
									html += 'Desc R$';							
									html += '<p id="desc_valor'+data[i].codigo+'">'+data[i].desconto_valor+'</p>';	
								html += '</div>';
							html += '</a>';
							
							vldesc = data[i].total_desconto;
							
						}
						
					}else{
					
						html += '<a href="javascript:void(0);">';
							html += '<div class="inpx">';
								html += 'QTD.('+data[i].unidade+')';															
								html += '<p id="quantidade'+data[i].codigo+'"> '+data[i].qtd+'</p>';															
							html += '</div>';																										
						html += '</a>';					
						
						if(data[i].sndesconto == 1){
							
							html += '<a href="javascript:void(0);">';
								html += '<div class="inpx">';
									html += 'Desc %';								
									html += '<p id="desc_perc'+data[i].codigo+'">'+data[i].desconto_perc+'</p>';								
								html += '</div>';
							html += '</a>';	
							
							html += '<a href="javascript:void(0);">';
								html += '<div class="inpx">';
									html += 'Desc R$';							
									html += '<p id="desc_valor'+data[i].codigo+'">'+data[i].desconto_valor+'</p>';	
								html += '</div>';
							html += '</a>';
							vldesc = data[i].total_desconto;
						}
						
					}
					
					/*html += '<div class="inpx">';
						html += '<br/>';
						html += '<div>';					
							html += '<p><strong>X</strong></p> ';
							html += '<p id="unidade'+data[i].codigo+'"><strong>'+data[i].unidade+'</strong></p>';
						html += '</div>';	
					html += '</div>';*/
					
					html += '<a href="javascript:void(0);">';
					html += '<div class="inpvl">';
							html += 'VALOR.';
							html += '<p id="valor'+data[i].codigo+'"  class="valor">R$ '+data[i].preco+'</p>';
					html += '</div>';
					html += '</a>';
					
									
					html += '<div class="inpxs">';
						html += '<br/>';
						html += '<div>';
						html += '<p id="somaqtds'+data[i].codigo+'"><strong>R$ '+number_format(data[i].somaqtd,2,',','.')+'</strong></p>';
						html += '</div>';
					html += '</div>';
						
					html += '</li>';
					vltotal = data[i].somtotal2;	
					vltotaldesc = data[i].somtotaldesconto;
					vldesc = data[i].total_desconto;
					somtotalvalor = data[i].somtotal;
				}else{
					
					html += '<div class="alert fade in label-info">';
						html += '<button type="button" class="close" data-dismiss="alert">×</button>';
						html += '<strong>Ops!</strong> '+data[i].info+'.';
					html += '</div>';
					
									
				}
			}
			if(data[0].info == ''){
										
								
				
				$("#somatotals").html("<strong style='font-size:12px;'>TOTAL: <br/>R$ "+vltotal+"</strong>");
				$("#somadesconto").html("<strong style='font-size:12px;'>TOTAL DESCONTO: <br/>R$ "+vldesc+"</strong>");
				$("#somatotalfinal").html("<strong style='font-size:12px;'>TOTAL FINAL: <br/>R$ "+somtotalvalor+"</strong>");
				
				$(".somatotals").val(vltotal);
				$(".somadesconto").val(vldesc);
				$(".somatotalfinal").val(somtotalvalor);
			}
			
			$('#items').html(html).show();
			
			$('li[id="undefined"]').css({'display':'none'});
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
    $("#formpag").bind( "change", function(event, ui) {
			
			if($("select[name='formpag'] option:selected").text() != 'A VISTA'){			
				$(".prazos").show();			
			}else{
				$(".prazos").hide();
			}
	});
});

function ListaAoAplicarDesconto(){		
	
	$("#somatotals").html("<strong style='font-size:12px;'>TOTAL: <br/>R$ "+$('.somatotals').val()+"</strong>");
	$("#somadesconto").html("<strong style='font-size:12px;'>TOTAL DESCONTO: <br/>R$ "+$('.somadesconto').val()+"</strong>");
	$("#somatotalfinal").html("<strong style='font-size:12px;'>TOTAL FINAL: <br/>R$ "+$('.somatotalfinal').val()+"</strong>");
}

$(document).on('keyup','#desconto',function(){
	
	if($(this).val()){
		
		String.prototype.stripHTML = function() {return this.replace(/<.*?>/g, '');}
		
		var vldesconto = convertevalores($(this).val());
		
		if(vldesconto > 100){
			alert("Valor incorreto!");
			$(this).val('');
			$(this).focus();
			ListaAoAplicarDesconto();
			return false;
		}
		
		if(vldesconto == '0' || vldesconto == '0.00' || vldesconto == ''){
			ListaAoAplicarDesconto();
			return false;
		}
		
		var total		  = convertevalores($('.somatotals').val());
		var totaldesconto = convertevalores($('.somadesconto').val());
		var totalfinal    = convertevalores($('.somatotalfinal').val());
		var descontovalor = totalfinal * (vldesconto / 100);		
		var descontofinal = parseFloat(descontovalor) + parseFloat(totaldesconto);
		var totalfinal    = total - descontofinal;
		
		//vltotalfinal = parseFloat(data.total) - parseFloat(data.totaldeconto);
				
		$("#somatotals").html("<strong style='font-size:12px;'>TOTAL: <br/>R$ "+number_format(total,2,',','.')+"</strong>");
		$("#somadesconto").html("<strong style='font-size:12px;'>TOTAL DESCONTO: <br/>R$ "+number_format(descontofinal,2,',','.')+"</strong>");
		$("#somatotalfinal").html("<strong style='font-size:12px;'>TOTAL FINAL: <br/>R$ "+number_format(totalfinal,2,',','.')+"</strong>");
		
	}else{
		
		ListaAoAplicarDesconto();
	}
	
	return false;
});


function descontodototal(){
	
	if($("#desconto").val()){
		
		String.prototype.stripHTML = function() {return this.replace(/<.*?>/g, '');}
		
		var vldesconto = convertevalores($("#desconto").val());
		
		if(vldesconto > 100){
			alert("Valor incorreto!");
			$(this).val('');
			$(this).focus();
			ListaAoAplicarDesconto();
			return false;
		}
		
		if(vldesconto == '0' || vldesconto == '0.00' || vldesconto == ''){
			ListaAoAplicarDesconto();
			return false;
		}
		
		var total		  = convertevalores($('.somatotals').val());
		var totaldesconto = convertevalores($('.somadesconto').val());
		var totalfinal    = convertevalores($('.somatotalfinal').val());
		var descontovalor = totalfinal * (vldesconto / 100);		
		var descontofinal = parseFloat(descontovalor) + parseFloat(totaldesconto);
		var totalfinal    = total - descontofinal;
		
		//vltotalfinal = parseFloat(data.total) - parseFloat(data.totaldeconto);
				
		$("#somatotals").html("<strong style='font-size:12px;'>TOTAL: <br/>R$ "+number_format(total,2,',','.')+"</strong>");
		$("#somadesconto").html("<strong style='font-size:12px;'>TOTAL DESCONTO: <br/>R$ "+number_format(descontofinal,2,',','.')+"</strong>");
		$("#somatotalfinal").html("<strong style='font-size:12px;'>TOTAL FINAL: <br/>R$ "+number_format(totalfinal,2,',','.')+"</strong>");
		
	}else{
		
		ListaAoAplicarDesconto();
	}
	
	return false;
}

function convertevalores(valor2){

	if(valor2 != undefined){
		if(valor2.length > 2 && valor2.length <= 6){
				var valstr2 = parseFloat(valor2.replace(",","."));
		}else{
			var valstr2 = parseFloat(valor2.replace(",",".").replace(".",""));
		}

		return valstr2.toFixed(2);
	}
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

$(document).ready(function(e) {
    
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
	
	if($('#mydate').val() == ""){
		$('#mydate').trigger('datebox', {'method':'set', 'value':''+dataFormatada+''});
		//$('#mydate').val(dataFormatada);
	}
	
	$("#mydate").change(function(){
		
		var dataatu    = dataatual();	
		
		moment.locale('pt-br');

		var start      = moment(dataatu,'DD/MM/YYYY');
        var end        = moment($(this).val(),'DD/MM/YYYY');      
             
        var diferenca = end.diff(start, 'days');	
		var diaslimite = $("#limitdiasentrega").val();		
		if(diferenca > diaslimite){

			alert('A data não poser maior que '+diaslimite+' dias!');
			$('#mydate').val(moment(dataatu).format('MM/DD/YYYY'));
		}

		
	});
	
});

function dataatual(){

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
	var str_data = dia + '-' + (mes+1) + '-' + ano4;
	var dataFormatada = ("0" + data.getDate()).substr(-2) + "-" 
    + ("0" + (data.getMonth() + 1)).substr(-2) + "-" + data.getFullYear();

    return dataFormatada;
}

$(document).on('click','#mydate',function(){
  	
	//$('#mydate').datebox('open');
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
							title: 'Alerta!',
							content: 'Dias de prazo não pode ser menor ou iqual ao prazo anterior!',							
							 buttons: {
								tryAgain: {
									text: 'OK',
									btnClass: 'btn-green',
									action: function(){
										$("input[id='prazo2']").focus();
										$("#prazo3").val('');			
										
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
							title: 'Alerta!',
							content: 'Dias de prazo não pode ser menor ou iqual ao prazo anterior!',							
							 buttons: {
								tryAgain: {
									text: 'OK',
									btnClass: 'btn-green',
									action: function(){
										$("input[id='prazo3']").focus();
										$("#prazo4").val('');			
										
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
							title: 'Alerta!',
							content: 'Dias de prazo não pode ser menor ou iqual ao prazo anterior!',							
							 buttons: {
								tryAgain: {
									text: 'OK',
									btnClass: 'btn-green',
									action: function(){
										$("input[id='prazo4']").focus();
										$("#prazo5").val('');			
										
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
							title: 'Alerta!',
							content: 'Dias de prazo não pode ser menor ou iqual ao prazo anterior!',						
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

$(document).on('click','.prodcoment',function(){

	var id = $(this).attr('data-id');
	//alert(id);

	$.dynamic_popup({
	    content: '<div style="padding:5px;"><form id="frmobsproduto"><input type="hidden" value="gravaobs" name="act"/><input type="hidden" value="'+id+'" name="id"/><textarea name="desprod" rows="5" cols="33"></textarea><input type="submit" value="GRAVAR" class="btn btn-primary btn-lg btn-block" data-role="none" id="btnprodobsprod"></form></div>',
	    'data-transition': 'slideup',
        'data-position-to': '#Register',
        'data-theme': 'b',
        'data-content-theme':'b',
        'data-rel':'popup',
	    'data-dismissible': true,    	
	})
	.bind({
		popupafteropen: function(e){
			//('.ui-popup-close-btn').remove();
			$.ajax({
				type:'POST',
				async:false, 
	 			dataType: "json",
				url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
				data:{id:id,act:'buscaobs'},
				success: function(data){
					
					$('textarea[name="desprod"]').val(data[0].obs);
					
				},
				error: function(jqXHR, exception){
					alert('erro não detectado.\n' + jqXHR.responseText);
				}				
			});							
			
		},
		popupafterclose: function(e){
			$.mobile.changePage('#popuppage');
		}
	});

});

$(document).on('click','.ui-popup-close-btn',function(){
	$.mobile.changePage('#popuppage');
});

$(document).on('submit','#frmobsproduto',function(){

	var param = $(this).serialize();
	
	if($('textarea[name="desprod"]').val().length < 2){
		alert("Digite uma observação que contem mais que 2 caracteres!");
		return false;
	}

	$.ajax({
			type:'POST',
			async:false, 
 			dataType: "json",
			url:""+caminhoURL+"/PROJETOS/webservice_pedido/php/carrinho-exec.php",
			data:param,
			success: function(data){
				if(data[0].adicionado == 'ok'){
					$.confirm({
						title: 'Mensagem do sistema',
						content: 'Dado gravado com sucesso!',
						buttons: {							
							somethingElse: {
								text: 'Fechar',
								btnClass: 'btn-blue',								
								action: function(){
									$.mobile.changePage('#popuppage');
								}
							}
						}
					});
					
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

	return false;
});

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
					$('select[name="formpag"]').html(htm).selectmenu( "disable" );
					
					if($("select[name='formpag'] option:selected").text() != "A VISTA"){				
						$(".prazos").show();
						/*var set = setInterval(function(){
							prazosalter();
							clearInterval(set);
						},300);	*/
								
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



$(document).ready(function(){
	$("#obs").keyup(function(){		
		window.localStorage.setItem("obs", $(this).val());
	});
});

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