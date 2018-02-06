<?php
//error_reporting(E_ALL & ~E_NOTICE);
ini_set('default_socket_timeout', 600);
//set_include_path("../../../../SSRSReport/bin/");
set_include_path("/var/www/html/ssrs/bin/");
require_once("SSRSReport.php");

$conf = parse_ini_file('/var/www/html/ssrs/config.ini');
define("UID", $conf["UID"]);
define("PASWD", $conf["PASWD"]);
define("SERVICE_URL", $conf["UFURL"]);


define("REPORT", "/MCS/Drying_List");

function remove_utf8_bom($text)
{
    $bom = pack('H*','EFBBBF');
    $text = preg_replace("/^$bom/", '', $text);
    return $text;
}
// set Parameters from get

// define drying

$mch = Array("Drying2","Drying3");


//$machine = $_GET["mch"];
function fill($from, $to, $A){
  $res = array();
  foreach($A as $k=>$v){
    $v = explode("×",$v);
    if($k>=$from && $k < $to)
      $res[] = $v;
    }
  return $res;
}
function convert($r) {
  $pott2 = Array("3098725", "3111055", "3098723", "3111054", "3111060", "3111077", "3048648", "3111076", "3035119", "3035181", "3111072", "3111070", "3035180", "3035182", "3111071", "3111073");
  $pott2length=sizeof($pott2);
  $number2=0;
  $number3=0;
  $obj=array();
  //$obj3=array();
  $re = array();
  foreach($r as $k=>$res){
    if($k > 0){
      $row = array();
      foreach($res as $x=>$y){
        if($r[0][$x] == "timestamp"){
          $row[$r[0][$x]] = strtotime($y)*1000;
        } else if ($x > 5){
          $row[$r[0][$x]] = floatval($y);
        } else {
          $row[$r[0][$x]] = $y;
        }
      }
      if($row["Time_to_Go"] <= 6 && $row["machinename"]=="Drying2"){
        $plus=true;
        for($a=0;$a<$pott2length;$a++){
          if(substr($row["modul_a"],2,7)==$pott2[$a])
          {
            $plus=false;
          }
        }
        if($plus==true){
          $number2++;
        }
        $dry2="Drying2";
        $obj["save"]=date("Y-m-d H:i");
        $obj["drying"]=$dry2;
        $obj["frame"]=$number2;
        //array_push($re, $obj2);
      }

      if($row["Time_to_Go"] <= 6 && $row["machinename"]=="Drying3"){
        $number3++;
        $dry3="Drying3";
        $obj["save"]=date("Y-m-d H:i");
        $obj["drying"]=$dry3;
        $obj["frame"]=$number3;
        
      }
    }
  }
  array_push($re,$obj);



 // array_push($re,$obj2,$obj3);
  return $re;
}
try
{
  $toWrite = Array();
  for($i=0;$i<2;$i++){
    $ssrs_report = new SSRSReport(new Credentials(UID, PASWD), SERVICE_URL);
    $ssrs_report->LoadReport2(REPORT,NULL);
    $params = array();
    $params[0] = new ParameterValue();
    $params[0]->Name = "machinename"; 
    $params[0]->Value = $mch[$i];
    
    
    $executionInfo = $ssrs_report->SetExecutionParameters2($params, "en-us");
    $csvFormat = new RenderAsCSV();
    $csvFormat->FieldDelimiter = '×';
    $csvFormat->RecordDelimiter = '|';
    $csvFormat->NoHeader = 'false';
	try {
		$result = $ssrs_report->Render2(
		  $csvFormat,
		  PageCountModeEnum::$Estimate,
		  $Extension,
		  $MimeType,
		  $Encoding,
		  $Wranings,
		  $StreamIds
		);
    //echo remove_utf8_bom(str_replace("|","<br>",$result));
  
  

  
  $result = explode("|",remove_utf8_bom($result));
  $results = fill(0,count($result)-2,$result);

  $myJson= json_encode(convert($results));
  $toWrite = array_merge($toWrite, convert($results)); 



  //echo json_encode(convert($results));
  if($i==1)
    echo json_encode($toWrite);

	} catch (SSRSReportException $sr){
	  echo $sr->GetErrorMessage();
  }
}
}
catch (SSRSReportException $serviceException)
{
    echo $serviceException->GetErrorMessage();
}
    $toWrite = json_encode($toWrite);

    //$myfile=fopen("/var/www/html/Potting4Dashboard/app/components/php/Dryingnum/Drynumbers.json","w+");
    $myfile=fopen("Dryingnum/Drynumbers.json","w+");

    fwrite($myfile,$toWrite);
    fclose($myfile);
?>
