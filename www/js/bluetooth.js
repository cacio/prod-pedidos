// JavaScript Document


var bluetooth = {
		
	   macAddress: "00:02:5B:B3:B5:58",//00:02:5B:B3:B5:58
	
		initialize: function() {
        	this.bindEvents();
    	},
		bindEvents: function() {
        	document.addEventListener('deviceready', this.onDeviceReady, false);
    	},
	
		onDeviceReady: function() {
			bluetooth.receivedEvent('deviceready');

		},
		refreshDeviceList: function() {
			 bluetoothSerial.list(bluetooth.onDeviceList, bluetooth.showError);
    	},
		onDeviceList: function(devices) {
			var  html;
			devices.forEach(function(device) {

              	html += '<b>' + device.name + '</b><br/>' + device.id;
				
			});
			alert(html);
		},
		receivedEvent: function(id) {
			//alert(bluetooth.macAddress);
			//bluetooth.refreshDeviceList();	
			
			bluetoothSerial.isConnected(
				function() { 
					console.log("Bluetooth is connected");
					bluetooth.openPort();
				},
				function() { 
					bluetoothSerial.connect(
						bluetooth.macAddress,  
						bluetooth.openPort,    
						bluetooth.showError    
					);
				}
			); 
			
			 
			
		},
		openPort: function() {
			// if you get a good Bluetooth serial connection:
			console.log("Bluetooth is connected");
			
		},
		imprimirpedido: function(cod){
			
			$.ajax({
				type:'POST',
				url:"http://localhost:8080/PROJETOS/webservice_pedido/php/xml-exec.php",
				data:{act:'imprime',codigo:cod},
				success: function(data){
										
			
					bluetoothSerial.subscribe('\n', bluetooth.onData, bluetooth.showError);			
					
					bluetoothSerial.write(data, bluetooth.sucesso, bluetooth.showError);		
					
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
			
		},
		 showError: function(error) {
			alert("Erro: "+error);
		},
		sucesso: function(){
			alert('imprimiuu');
		},
		onData: function(data) { // data received from Arduino
			alert(data);
		},
}