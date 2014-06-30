<?php
include_once("database.php");
$room = $_GET["room"];
$lastId = $_GET["lastId"];
$query = "SELECT * FROM shapes WHERE room = :room AND id > :id ORDER BY id";
$statement = $db->prepare($query);
$statement->bindValue(':room', $room);
$statement->bindValue(':id', $lastId);
$statement->execute();
echo JSON_ENCODE($statement->fetchAll(PDO::FETCH_ASSOC));
?>