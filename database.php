
<?php
$dsn ='mysql:host=localhost;dbname=circlesdb';
$username='root';
$password= 'FSGaE2TecM';
$options =array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION);

try {
$db =new PDO($dsn,$username,$password,$options);
} catch(PDOException $e) {
	$error_message = $e->getMessage();
	echo error_message;
	exit();
}
?>















