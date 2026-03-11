<?php


$j = file_get_contents('b.json');
$j = json_decode($j, true);

$pages = ($j['data']['data']['pages']);

$page0 = $pages[1];

var_dump($page0);