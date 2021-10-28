<?php
require_once('conn.php');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if (
  empty($_GET['id'])) {
    $json = array(
      "ok" => false,
      "message" => 'id 錯誤'
    );
    $response = json_encode($json);
    echo($response);
    die();
}

$storage_id = $_GET['id'];
$sql = 'SELECT * FROM `wendyl_todo` WHERE storage_id = ?';
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $storage_id);
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

$result = $stmt->get_result();
$todos = array();
$row = $result->fetch_assoc();

$json = array(
  "ok" => true,
  "data" => array(
    "id" => $storage_id,
    "todo" => $row["newSaveTodo"])
);

$response = json_encode($json);
echo($response);

?>