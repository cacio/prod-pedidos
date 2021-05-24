// JavaScript Document

$(document).ready(function(e) {
	
	
	
	 // Crio uma variável chamada $forms que pega o valor da tag form
   	 $forms = $('form[id="frmcadproduto"]');	
   	 $forms.bind('submit', function(){
		
        var params = $(this.elements).serialize();							
        var self = this;
        $.ajax({
            type: 'POST',
             url: ''+caminhoURL+'/PROJETOS/webservice_pedido/php/produto-exec.php',
            data: params,
			cache: false,
			dataType: 'json',
            // Antes de enviar
            beforeSend: function(){
             	$.mobile.loading( 'show', {
					text: 'Cadastrando produto..',
					textVisible: true,
					theme: 'b',
					html: "Cadastrando produto.."
				});	
            },
            success: function(data){				
	          $.mobile.loading( 'hide');  
			  	
				alert(data[0].msg);
			  	
						
			 },
            error: function(data){
                alert('Ops!, Algo deu errado por favor entre em contato com o administrador do sistema , Obrigado!');
            }
        })
        return false;
    });	
		
});
