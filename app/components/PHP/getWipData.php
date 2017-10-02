<?php
  $folderUrl = "wip/";

  if(isset($_GET["d"]))
    $d = $_GET["d"];
  else
    $d = new Date("Ymd");

  $res = [];
  $files = ["05", "13", "21"];
  for($i=0;$i<3;$i++){
    if(file_exists($folderUrl."wip_".$d.$files[$i].".json"))
      array_push($res,["file"=>$d.$files[$i],"data"=>json_decode(file_get_contents($folderUrl."wip_".$d.$files[$i].".json"))]);
  }
  echo json_encode($res);
?>