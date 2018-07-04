<?php

  $f = fopen('sapdata/sapdata.csv', 'r') or die ('Nincs meg a file');

  $result = [];

  $result["crdate"] = date('Y-m-d H:i:s', fstat($f)['mtime']);
  $result["size"] = floatval(fstat($f)['size']/(1024*1024));
  $result["data"] = [];

  while(!feof($f)){
    $rdata = fgets($f);
    $rdata = explode(',', $rdata);
    array_push($result["data"], $rdata);
  }
  fclose($f);

  $re = array();
  $r = $result["data"];
  foreach($r as $k=>$res){
    if($k > 0){
      $row = array();
      foreach($res as $x=>$y){
        if($r[0][$x] == 'NAP'){
          if($y){
            $row[$r[0][$x]] = date('Y-m-d', ($y - 25569)*86400);
          }
        } else if($x == 23){
          $row["TotalDiff"] = floatval($y);
        } else {
          $row[$r[0][$x]] = floatval($y);
        }
      }
      array_push($re, $row);
    }
  }
  array_pop($re);
  $result["data"] = $re;
  echo json_encode($result);

?>
