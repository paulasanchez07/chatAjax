<?php 

$opcion = $_POST["opc"];


switch ($opcion) {
	//REGISTRO DE UN NUEVO USUARIO AL CHAT -----------------------------------------------------
	case 1:		
		//Envia el correo al usuario 
		enviarCorreo( $_POST["usuario"], $_POST["correo"]);
	break;
	case 2:
		//consulta si el usuario se encuentra registrado en la BD
		$usuario = $_POST["usuario"];
		$password = $_POST["password"];
		$sql = "SELECT COUNT(*) AS EXISTE FROM usuario where nombreUsuario like '{$usuario}' and contrasenia like '{$password}'";
		leerRegistro($sql);
	break;
	case 3:
		$usuario = $_POST["usuario"];
		$texto = $_POST["texto"];
		$sql = "INSERT INTO  mensaje(idUsuario,mensaje) values ( (SELECT idUsuario from usuario where nombreUsuario like '{$usuario}'), '{$texto}' )";
		actualizarRegistro($sql);
	break;
	case 4:
		$sql = "SELECT usuario.nombreUsuario, mensaje.mensaje FROM mensaje JOIN usuario ON mensaje.idUsuario = usuario.idUsuario";
		leerRegistro($sql);
	break;

}

function enviarCorreo($usuario,$correo){
	$clave = rand(1111,9999);
	$mensaje = "Bienvenido ". $usuario ." al CHAT! \n Tu clave de ingreso es: ". $clave;
	$para      =  $correo;
	$titulo    = 'Clave App Chat';
	$cabeceras = 'From: adsi.nocturno2017@gmail.com' . "\r\n" .
    				'Reply-To: haroldcupitra@gmail.com' . "\r\n" .
    				'X-Mailer: PHP/' . phpversion();
	mail($para, $titulo, $mensaje, $cabeceras);

	$sql = "call sp_registrarUsuario('{$usuario}','{$correo}','{$clave}')";
	leerRegistro($sql);

	/*$respuesta = array('mensaje' => 'ok');
	echo json_encode($respuesta);*/
}



/****** LEER REGISTRO   ******************************************************
* ejecuta la consulta y devuelve datos en formato JSON
*****************************************************************************/
function leerRegistro($sql){
	include("conexion.php");   				//Conecta a la BD $conexion
	$result = $conexion->query($sql);

	$rows = array();
	if ($result != NULL && $result->num_rows > 0) {
    
		while(($r =  mysqli_fetch_assoc($result))) {
		  	$rows[] = $r;	  	
		}
		mysqli_free_result($result);
	}
	mysqli_close($conexion);
	echo json_encode($rows);
}


/*****************************************************************************
INSERTA, ACTUALIZA O ELIMINA REGISTROS DE LA BASE DE DATOS
*****************************************************************************/

function actualizarRegistro($sql){

		include("conexion.php");

		if ($conexion->query($sql) === TRUE) {	
			$respuesta = array('ok' => 'actualizo');
		}else  {
	
			$respuesta = array('ok' => 'error' );
		}
		echo json_encode($respuesta);
}




?>