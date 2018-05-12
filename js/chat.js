
/* ejecutarAjaxJson  *********************************************************** 
	* Ejecuta una consulta AJAX en el servidor. Usa el metodo POST 
	* devuelve los datos en formatoJSON 
	* Parametros: datos: arreglo de parametroscon los datos, 
	* llama la funcion leerDatos() para tratar la respuesta
	********************************************************************/
var UsuarioGlobal = '';

function ejecutarAjaxJson(datos, opc){
	$.ajax({                                      
		type: 'post',
		url:  'php/leerDatos.php',                  
		data: datos,                                       
		//dataType: 'json',                     

	    success : function(response) {
			leerDatos(response, opc);
	    },
	 
	    error : function(xhr, status) {
	    	console.log(' No se pudo realizar la conexión al servidor. ' + status)
	    },	 
	});	
}


function leerDatos(responseJSON, opc){
	var response = JSON.parse(responseJSON);
	switch(opc){
		case 1:
			if(response[0]['EXISTE'] == 0){
				alert("contraseña enviada al correo");
			}else{
				alert("Usuario Ya Existe");
			}
		break;
		case 2:
			if(response[0]['EXISTE'] == '1'){
				mostrarInterfazChat();
			}else{
				alert("No se encuentra registrado");
			}
		break;
		case 4:
			if (response.length > 0) {
				cargarMensajesGUI(response);
			}
		break;
	}
}

//Retorna el nombre del usuario que ha iniciado sesion
function getUsuario(){
	return UsuarioGlobal;
}

//Asigna el nombre del usuario que ha iniciado sesion a una variable global
function setUsuario(nombreUsuario){
	UsuarioGlobal = nombreUsuario;
}

//HTML Para mostrar la interfaz del login
function mostrarInterfazLogin(){
	var login = '<div id="cont_trabajo">'+
			'<h1>CHAT ADSI</h1>'+
			'<h3>Usuario</h3>'+
			'<input id="inUsuario" class="btn btn-block" type="text" placeholder="Usuario"></input>'+
			'<h3>Contraseña</h3>'+
			'<input id="inPassword" class="btn btn-block" type="password" placeholder="Usuario"></input>'+
			'<button id="btnIngresar" class="btn btn-primary" onclick="validarUsuario()">Ingresar</button>'+
			'<button id="btnRegistrarme" class="btn btn-primary" onclick="mostrarInterfazRegistro()">Registrarme</button>'+
			'</div>';
	$('#cont_trabajo').html(login);
}


function mostrarInterfazRegistro(){
	var registro = '<h1>Registro</h1>'+
			'<h3>Usuario</h3>'+
			'<input id="regUsuario" class="btn btn-block" type="text" placeholder="Usuario"></input>'+
			'<h3>Correo Electronico</h3>'+
			'<input id="regCorreo" class="btn btn-block" type="text" placeholder="Correo Electronico"></input>'+
			'<button id="btnAtras" class="btn btn-primary " onclick="mostrarInterfazLogin()">Atras</button>'+
			'<button id="btnRegistrar" class="btn btn-primary" onclick="registrarUsuario()">Aceptar</button>';
	$('#cont_trabajo').html(registro);
}

function mostrarInterfazChat(){
	var chat = '<div id="cont_principal_chat" class="container"><div id="cont_mensajes"></div><div id="cont_sur"><input id="mensaje" type="text" placeholder="Escriba aqui su mensaje" class="btn"></input><button id="btnEnviar" class="btn btn-primary" onclick="agregarMensaje()">Enviar</button></div></div>';
	$('body').html(chat);

}

//Obtiene el mensaje escrito por el usuario y lo registra en la BD
function agregarMensaje(){
	var texto = $('#mensaje').val();//obtiene el mensaje de la caja de texto
	if(texto != ''){
		var mensaje = '<div id="lineaMensaje"><h4>'+getUsuario()+'</h4><h3>'+texto+'</h3></div>';
		$('#cont_mensajes').append(mensaje);
		$('#mensaje').val('');
		registrarMensaje(getUsuario(),texto);//Envia los parametros para registrar el mensaje
	}else{
		alert("Escriba un mensaje");
	}
	
}

//Uso de Ajax para almacenar el mensaje enviado por el usuario
function registrarMensaje(usuario, texto){
	var parametros = {"opc" : 3, "usuario" : usuario, "texto" : texto};
	ejecutarAjaxJson(parametros, 3);
}

//consulta los mensajes escritos por los usuarios
function actualizarChat(){
	var parametros = {"opc" : 4};
	ejecutarAjaxJson(parametros,4);
}

//Verifica que el usuario se encuentre registrado en la BD
function validarUsuario(){
	var usuario = $('#inUsuario').val();
	var password = $('#inPassword').val();
	if(usuario != '' && password != ''){
		setUsuario(usuario);
		var parametros = {"opc" : 2, "usuario" : usuario, "password" : password};
		ejecutarAjaxJson(parametros,2);
	}else{
		alert("Faltan campos por llenar");
	}
	
}

//Almacena el usuario en la BD
function registrarUsuario(){
	var usuario = $('#regUsuario').val();
	var correo = $('#regCorreo').val();
	if (usuario != '' && correo != '') {
		var parametros = {"opc" : 1, "usuario" : usuario, "correo" : correo};
		ejecutarAjaxJson(parametros,1);
	}else{
		alert("Faltan campos por llenar");
	}
	
}
//Obtiene los mensajes escritos por los usuarios y los carga en el contenedor de mensajes
function cargarMensajesGUI(response){
	$('#cont_mensajes').html('');//Limpiamos la caja de mensaje para que no se agreguen en la nueva carga
	for (var i = 0; i < response.length; i++) {
		var mensaje = '<div id="lineaMensaje"><h4>'+response[i]["nombreUsuario"]+'</h4><h3>'+response[i]["mensaje"]+'</h3></div>';
		$('#cont_mensajes').append(mensaje);
	}
}
