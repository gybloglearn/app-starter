<?php
//error_reporting(E_ALL & ~E_NOTICE);
ini_set('default_socket_timeout', 600);
//set_include_path("../../../../SSRSReport/bin/");
set_include_path("../../../../ssrs/bin/");
require_once("SSRSReport.php");

$conf = parse_ini_file('../../../../ssrs/config.ini');
define("UID", $conf["UID"]);
define("PASWD", $conf["PASWD"]);
define("SERVICE_URL", $conf["FMURL"]);
define("REPORT", "/RO/Modul History Full for Timerange");

function remove_utf8_bom($text)
{
    $bom = pack('H*','EFBBBF');
    $text = preg_replace("/^$bom/", '', $text);
    return $text;
}

try {
	$ssrs_report = new SSRSReport(new Credentials(UID, PASWD), SERVICE_URL);
  $ssrs_report->LoadReport2(REPORT,NULL);
  $params = array();

  //$pns = $_GET["pns"]."%";
  $day = strtotime($_GET["day"]. " 05:50:00");
  $tomorrow = $day + 24*60*60;
  if(isset($_GET["weekly"])){
      $day = $day - 6*24*3600;
  }
  $params[0] = new ParameterValue();$params[0]->Name = "startdate";$params[0]->Value = date("Y.m.d. H:i:s", $day);
  $params[1] = new ParameterValue();$params[1]->Name = "enddate";$params[1]->Value = date("Y.m.d. H:i:s", $tomorrow);

  $executionInfo = $ssrs_report->SetExecutionParameters2($params, "en-us");

  $csvFormat = new RenderAsCSV();
  $csvFormat->RecordDelimiter = '|';
  $csvFormat->FieldDelimiter = ';';
  $csvFormat->NoHeader = 'false';
  $csvFormat->Encoding = "UTF-8";

  $result = $ssrs_report->Render2(
		  $csvFormat,
		  PageCountModeEnum::$Estimate,
		  $Extension,
		  $MimeType,
		  $Encoding,
		  $Wranings,
		  $StreamIds
		);

  function fill($from, $to, $A){
    $res = array();
    foreach($A as $k=>$v){
      $v = explode(";",$v);
      if($k>=$from && $k < $to)
        $res[] = $v;
      }
    return $res;
  }

  function convert($r, $day) {
    $tomorrow = $day + 24*60*60;
    $re = array();
    $onlyMachines = ['Welding_1', 'Rolling1', 'Rolling2', 'Rolling3', 'Trim', 'Testing1', 'Drying #1', 'QC', 'Packaging #1', 'Report to ERP_1'];
    foreach($r as $k=>$res){
      if($k > 0){
        if($res[4] != "AUTOHIBA"){
          $row = array();
          //echo date('Y-m-d H:i', strtotime($res[2])) . " - " . date('Y-m-d H:i', $day) . " - ". date('Y-m-d H:i',$tomorrow) ."<br>";
          $rec = strtotime($res[2]);
          $mch = $res[1];
          if(in_array($mch, $onlyMachines)){
            foreach($res as $x=>$y){
              if($r[0][$x] == "Dateentry" || $r[0][$x] == "Daterecorded"){
                $row[$r[0][$x]] = strtotime($y)*1000;
              } else {
                $row[$r[0][$x]] = $y;
              }
            }
            array_push($re, $row);
          }
        }
      }
    }
    return $re;
  }
  
  $result = explode("|",$result);
  $results = fill(3,count($result)-2,$result);
  echo json_encode(convert($results, $day));

} catch (SSRSReportException $ssrsExcp){
  //echo $ssrsExcp->GetErrorMessage();
  echo "[]";
}

$result = null;
$results = null;
$ssrs_report = null;
$params = null;
ini_set('memory_limit', '33554432');

?>