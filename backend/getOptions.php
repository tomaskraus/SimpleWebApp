<?php

$post = file_get_contents('php://input');

$data = json_decode($post, true);

$optionSelectedStr = $data["optionSelected"];


header('Content-Type: application/json');

if ($optionSelectedStr == "-1") {
    echo '{
  "headertext": "nejaky citelny text",
  "options": [
    {"value": "option1"},
    {"value": "option2"},
    {"value": "option3"},
    {"value": "option4"}
  ]
}';
} else {

echo '{
  "headertext": "nejaky citelny text 2",
  "options": [
    {"value": "option1"},
    {"value": "option2"}
  ]
}';
}


