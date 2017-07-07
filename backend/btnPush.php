<?php

$post = file_get_contents('php://input');

$data = json_decode($post, true);

$btnNumberStr = $data["buttonPressed"];

header('Content-Type: application/json');
echo '{ "status": "ok", "pressed": "' . $btnNumberStr . '"}';

