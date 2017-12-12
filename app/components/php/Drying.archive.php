<?php

  $folder = "/var/www/html/file_reports/files/drying/";
  $files = scandir($folder, 0);

  foreach($files as $k=>$v){
    echo json_encode(file_get_contents($v));
  }

?>