<?php

//Datos fijos de la BD a conectar

$host_db = "localhost";  	//Aca va la url de la pagina principal
$user_db = "root";			//El nombre del dueño de la Base de Datos en MySQL
$pass_db = "";				//El password del dueño de la BD
$db_name = "chat";			//El nombre de la Base de Datos

$conexion = new mysqli($host_db, $user_db, $pass_db, $db_name);
//echo "http_negotiate_la";
if ($conexion->connect_error) {
 	die("La conexion falló: " . $conexion->connect_error);
}

?>