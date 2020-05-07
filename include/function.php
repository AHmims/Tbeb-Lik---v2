<?php


function debug($variable){
  return   '<pre>' . $variable . '</pre>';
}
function checkInput($data){
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
    
    
}