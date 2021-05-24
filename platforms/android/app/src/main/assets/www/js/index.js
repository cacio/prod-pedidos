/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
			
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');*/

        console.log('Received Event: ' + id);
    }
};

//app.initialize();
 /*document.addEventListener('deviceready', function () {
   console.log(cordova.plugins.notification.local.launchDetails);
	cordova.plugins.notification.local.schedule({
		title: 'My first notification',
		text: 'Thats pretty easy...'
	});	
	
}, false);*/

var arr = [];

$(document).ready(function(e) {	
	
	
	$.ajax({
		type: 'POST',
		cache:false, 
		dataType: "json",	
		url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/admin-exec.php',
		data: {act:'info'},	
		success: function(data){

			//data[0].acesso	
			//alert(data[0].coduser);									
			$('#usernome').html(data[0].login);
			$('.numpedidodia').html(data[0].numpedidodia);
			$('#codrepre').val(data[0].codrepre);
			$('.idrepre').html(data[0].codrepre);
			$("#empresa").val(data[0].empresa);
			$(".numerocobra").html(data[0].numerocobra+'<br/><i class="fr" style="font-size: 14px;">Total para cobrar</i>');
			$("#validprecomenor").val(data[0].validprecomenor);
			$("#validlimitecliente").val(data[0].validlimitecliente);
			$("#tabpreco").val(data[0].tabpreco);
			$("#margemprod").val(data[0].margemproduto);
			$("#margemprodperc").val(data[0].margemprodutopercent);
			$(".numerocli").html(data[0].numerocli+'<br/><i class="fr" style="font-size: 14px;">Total Clientes</i></span>');
			$(".vltotaldia").html('R$ '+data[0].totalpeddia+'<br/><i class="fr" style="font-size: 14px;">Valor Total Pedido dia</i>');
			$(".numprod").html(data[0].numprod+'<br/><i class="fr" style="font-size: 14px;">Total Produtos</i>');
			$("#perclimitprecoprodutos").val(data[0].perclimitmax);
			$("#limitdiasentrega").val(data[0].limitdiasentrega);

			if(data[0].geracarga == 1){
				$("#geracarga").css({
					'display': 'block',
				});
				$("#gerarcarga").css({
					'display': 'block',
				});
			}else{
				$("#geracarga").css({
					'display': 'none',
				});
				$("#gerarcarga").css({
					'display': 'none',
				});
				$("#orderped").removeClass('btn-footer-1');
				$("#orderped").addClass('btn-footer-1-1');

			}
			
			
			
			
			var pathArray = window.location.pathname.split('/');
			var newPathname = "";
			for (i = 0; i < pathArray.length; i++) {
			  newPathname += "/";
			  newPathname += pathArray[i];
				//alert(pathArray[i]);
				if(pathArray[i] == 'admin.html'){
					listaosmaisvendidos();
				}
			}
			//MostraMeta(data[0].codrepre,data[0].empresa);
			BuscaSync();
			//formatdate();
			//ListaMetas();
			
			
		},
		error: function(data){
			window.location.href = '../index.html';	
		}
	});
});

function listaosmaisvendidos(){
	$.ajax({
		type: 'POST',
		cache:false, 
		dataType: "json",	
		url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/admin-exec.php',
		data: {act:'lista'},			
		success: function(data){
			var htm = '';
			
			for(var i=0; i < data.length; i++){
				//data[i].nome
				if(data[i].liberado == 'S'){
					var bord = "border:3px solid green;";
				}else{
					var bord = "border:3px solid red;";
				}
				htm +='<div><a href="javascript:void(0)" class="clickcli" data-id="'+data[i].codret+'"><img src="../img/corrent_emp.png" style="'+bord+'" /><p>'+data[i].nome+'</p></a></div>';
			}
			
			$(".slider").html(htm);
			
			if ($('.slider').hasClass('slick-initialized')) {
				$('.slider').slick('destroy');
			  }  
			$('.slider').slick({
			   slidesToShow: 5,
			   slidesToScroll: 1,
			   asNavFor: '.slider-for',
			   dots: false,
			   focusOnSelect: true,
			   arrows:false
			 });			
		},
		error: function(data){
			
		}
	});
	
	
}


function MostraMeta(idrepre,empresa){
	
	$.ajax({
		type: 'POST',
		cache:false, 
		dataType: "json",	
		url: 'http://prodapro.com/atualiza/clientes/'+empresa+'/php/recebe-exec.php',
		data: {act:'metas',idvend:idrepre},	
		beforeSend: function(){
			
		},
		success: function(data){
			
			var query = "insert into METAS (ID_VENDEDOR, DATA_COPETENCIA, META, META_ATINGIDA) VALUES (?, ?, ?, ?);";
			try {
				localDB.transaction(function(transaction){
					transaction.executeSql(query, [data[0].idvendedor, data[0].data_compe,data[0].metas,data[0].metas_ating], function(transaction, results){
						if (!results.rowsAffected) {
							updateStatus("Erro: Inserção não realizada");
						}
						else {

							//alert("sucesso");

						}
					}, errorHandler);
				});
			} 
			catch (e) {
				updateStatus("Erro: INSERT não realizado " + e + ".");
			}
			
		},
		error: function(data){
			
		}
	});
	
}


function ListaMetas(){
		
		var anomeshj = formatdate();
	
		var retorno;
		var querys = "SELECT ID_VENDEDOR, DATA_COPETENCIA, META, META_ATINGIDA FROM METAS WHERE strftime('%Y-%m',DATA_COPETENCIA) = '"+anomeshj+"' ";
		try {
			
			localDB.transaction(function(transaction){
				
				transaction.executeSql(querys, [], function(transaction, results){
				
					var htm = "";	
					
					//arr.push(results.rows);
					
					if(results.rows.length > 0){											

						for (var i = 0; i < results.rows.length; i++) {

							var rows = results.rows.item(i);

									//alert(rows['META']);									    

						}					
					}else{
							MostraMeta($('#codrepre').val(),$("#empresa").val());
					}
					
				return	retorno;	
									
				}, function(transaction, error){
					updateStatus("Error: SELECT não realizado " + error + ".");
			
				});
				
			});
			
		} 
		catch (e) {
			updateStatus("Error: SELECT não realizado " + e + ".");
		} 
	
	
	return	retorno;										
}

function BuscaSync(){
		
		var anomeshj = formatdate();
	
		var retorno;
		var querys = "SELECT DATA FROM sync WHERE DATA = '"+anomeshj+"' ";
		try {
			
			localDB.transaction(function(transaction){
				
				transaction.executeSql(querys, [], function(transaction, results){
				
					var htm = "";	
					
					//arr.push(results.rows);
					
					if(results.rows.length > 0){											
							
							
					}else{
						
						eventos.AtualizarDados();
						eventos.AtualizaProdutos();
						
						inserirsync(anomeshj);
					}
					
				return	retorno;	
									
				}, function(transaction, error){
					updateStatus("Error: SELECT não realizado " + error + ".");
			
				});
				
			});
			
		} 
		catch (e) {
			updateStatus("Error: SELECT não realizado " + e + ".");
		} 
	
	
	return	retorno;										
}

function inserirsync(data){

	var query = "insert into sync (DATA) VALUES (?);";
	try {
		localDB.transaction(function(transaction){
			transaction.executeSql(query, [data], function(transaction, results){
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

function formatdate(){
	
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
	
	//var dataFormatada = data.getFullYear() +'-'+("0" + (data.getMonth() + 1)).substr(-2);
	return dataFormatada;
}
