<?php
require_once('conn.php');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if (
  empty($_POST['todo'])||
  empty($_POST['storage_id'])
  ) {
    $json = array(
      "ok" => false,
      "message" => '無資料'
    );
    $response = json_encode($json);
    echo($response);
    die();
}

$newSaveTodo = $_POST['todo'];
$storage_id = $_POST['storage_id'];

$sql = 'INSERT INTO `wendyl_todo`(newSaveTodo, storage_id) VALUES(?, ?)';
$stmt = $conn->prepare($sql);
$stmt->bind_param('ss', $newSaveTodo, $storage_id);
$result = $stmt->execute();

if (!$result) {
  $json = array(
    "ok" =>false,
    "message" => $conn->error
  );
  $response = json_encode($json);
  echo($response);
  die();
}

$json = array(
  "ok" => true,
  "message" => 'success'
);

$response = json_encode($json);
echo($response);

?>