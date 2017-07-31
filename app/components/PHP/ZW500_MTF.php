<?php
//error_reporting(E_ALL & ~E_NOTICE);
ini_set('default_socket_timeout', 600);
//set_include_path("../../../../SSRSReport/bin/");
set_include_path("../../../../ssrs/bin/");
require_once("SSRSReport.php");

$conf = parse_ini_file('../../../../ssrs/config.ini');
define("UID", $conf["UID"]);
define("PASWD", $conf["PASWD"]);
define("SERVICE_URL", $conf["UFURL"]);

define("REPORT", "/MCS/ZW500 Shiftreport MTF");

var_dump($argv);

function remove_utf8_bom($text)
{
    $bom = pack('H*','EFBBBF');
    $text = preg_replace("/^$bom/", '', $text);
    return $text;
}
// set Parameters from get
if(isset($_GET["startdate"])){
  $startdate = date("m/d/Y H:i:s", strtotime($_GET["startdate"] . " 05:50:00"));
} else {
  if(isset($argv[1])){
    $startdate = date("m/d/Y H:i:s", strtotime($argv[1] . " 05:50:00"));
  } else {
    $startdate = date("m/d/Y H:i:s", strtotime(date("Y-m-d") . "05:50:00")-60*60*24);
  }
}

if(isset($_GET["enddate"])){
  $enddate = date("m/d/Y H:i:s", strtotime($_GET["enddate"] . " 05:50:00"));
} else {
  if(isset($argv[2])){
    $enddate = date("m/d/Y H:i:s", strtotime($argv[2]." 05:50:00") + 60*60*24);
  } else {
    $enddate = date("m/d/Y H:i:s", strtotime($startdate) + 60*60*24);
  }
}

echo $startdate."\n";
echo $enddate;
try
{
    $ssrs_report = new SSRSReport(new Credentials(UID, PASWD), SERVICE_URL);
    $ssrs_report->LoadReport2(REPORT,NULL);
    $params = array();
    $params[0] = new ParameterValue();
    $params[0]->Name = "startdate";
    $params[0]->Value = $startdate;
    $params[1] = new ParameterValue();
    $params[1]->Name = "enddate";
    $params[1]->Value = $enddate;
    
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
    $re = array();
    foreach($r as $k=>$res){
      if($k > 0){
        $row = array();
        foreach($res as $x=>$y){
          if ($r[0][$x] == "amount"){
            $row[$r[0][$x]] = intval($y);
          }
          else if($r[0][$x]=="name"){
            $row["place"] = substr($y, 0, strpos($y, "-"));
            $row["type"] =  str_replace("_", "", substr($y, strpos($y,"-")+1, strrpos($y, "_")-strpos($y, "-")-1));
            $row["category"] = substr($y, strrpos($y, "_")+1);
          } else {
            $row[$r[0][$x]] = $y;
          }
        }
        if($row["amount"] > 0)
          array_push($re, $row);
        
      }
    }
    return $re;
  }
  $toWrite = Array();
  
  $result = explode("|",remove_utf8_bom($result));
  $results = fill(3,count($result)-2,$result);

  $myJson= json_encode(convert($results));
  $toWrite = array_merge($toWrite, convert($results));

	} catch (SSRSReportException $sr){
	  echo $sr->GetErrorMessage();
	}
}
catch (SSRSReportException $serviceException)
{
    echo $serviceException->GetErrorMessage();
}
    $toWrite = json_encode($toWrite);

    $myfile=fopen("MTF/mtf".date("Ymd", strtotime($startdate)).".json","w+");
    fwrite($myfile,$toWrite);
    fclose($myfile);
?>