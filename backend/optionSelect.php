<?php

$post = file_get_contents('php://input');

$data = json_decode($post, true);

$optionSelectedStr = $data["optionSelected"];

header('Content-Type: application/json');
echo '{ "status": "ok", "optionSelected": "' . $optionSelectedStr . '"}';
