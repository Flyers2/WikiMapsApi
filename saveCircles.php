

<?php 
$dsn ='mysql:host=localhost;dbname=circlesdb';
$username='root';
$password= 'FSGaE2TecM';
$options =array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION);

try {
$db =new PDO($dsn,$username,$password,$options);
} catch(PDOException $e) {
	$error_message = $e->getMessage();
	echo $error_message;
	exit();
}
$type = $_POST["type"];
$data = $_POST["data"];
$room = $_POST["room"];
$query = "INSERT INTO shapes VALUES (NULL,:type, :data, :room)";
$statement = $db->prepare($query);
$statement->bindValue(':type', $type);
$statement->bindValue(':data', $data);
$statement->bindValue(':room', $room);
$statement->execute();














