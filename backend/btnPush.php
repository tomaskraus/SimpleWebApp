<?php

$post = file_get_contents('php://input');

$data = json_decode($post, true);

$btnNumberStr = $data["buttonPressed"];

sleep(1); //wait for 1 second, just to simulate some work

header('Content-Type: application/json');
echo '{ "status": "ok", "pressed": "' . $btnNumberStr . '"}';

