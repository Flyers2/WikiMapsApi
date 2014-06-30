<?php
include_once('database.php');


global $db;

$query = "SELECT DISTINCT room FROM shapes";
$statement = $db->prepare($query);
$statement->execute();
echo json_encode($statement->fetchAll(PDO::FETCH_ASSOC));