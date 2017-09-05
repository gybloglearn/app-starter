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

define("REPORT", "/RO/RO WIP details");

function remove_utf8_bom($text)
{
    $bom = pack('H*','EFBBBF');
    $text = preg_replace("/^$bom/", '', $text);
    return $text;
}
// set Parameters from get
if(isset($_GET["enddate"])){
  $enddate = date("m/d/Y H:i:s", strtotime($_GET["enddate"] . " 05:50:00"));
} else {
  $enddate = date("m/d/Y H:i:s", strtotime(date("Y-m-d") . " 05:50:00"));
}
if(isset($_GET["startdate"])) {
  $startdate = date("m/d/Y H:i:s", strtotime($_GET["startdate"] . " 05:50:00"));
} else {
  $startdate = date("m/d/Y H:i:s", strtotime(date("Y-m-d")." 05:50:00") -(90*24*3600));
}

// define status
$Stat = Array("All"=>null, "Not Scrap"=>-41, "Unrestricted NM"=>39, "Scrap"=>41);
$Status = $Stat[$_GET["status"]];
// define pl_id
$pl=Array("AFT"=>64,"ATD"=>2,"Bubble Test"=>3,"Cageing"=>4,"Chamfer"=>62,"Drying"=>5,"FiberGlass"=>6,"FolderReinforcement"=>7,"Oven"=>8,"Packing"=>9,"Prod Init"=>18,"Prod Plan"=>61,"Puffer"=>66,
"QC"=>10,"RawMaterials"=>11,"Report to ERP"=>19,"Rework"=>65,"Rolling"=>12,"Shipping"=>60,"Sizing"=>13,"Soaking"=>14,"Trim"=>15,"Welding"=>16,"Wet Test"=>17,"WetBP"=>63);
$plid = $pl[$_GET["pl_id"]];
// define pu_id
$pu = Array("Report To ERP"=>31, "Shipping"=>105);
$puid = $pu[$_GET["pu_id"]];
//get report data
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
    $params[2] = new ParameterValue();
    $params[2]->Name = "status"; 
    $params[2]->Value = $Status;
    $params[3]= new ParameterValue();
    $params[3]->Name ="Product_Family_Id";
    $params[3]->Value = null;
    $params[4]= new ParameterValue();
    $params[4]->Name ="prod_id";
    $params[4]->Value = null;
    $params[5]= new ParameterValue();
    $params[5]->Name ="pl_id";
    $params[5]->Value = $plid;
    $params[6]= new ParameterValue();
    $params[6]->Name ="pu_id";
    $params[6]->Value = $puid;
    
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
            $row["machine"] = substr($y, 0, strpos($y, "-"));
            $row["type"] =  str_replace("_GOOD", "", substr($y, strpos($y,"-")+1, strrpos($y, "-")-strpos($y, "-")-1));
            $row["category"] = substr($y, strrpos($y, "-")+1);
          } else {
            $row[$r[0][$x]] = $y;
          }
        }
          array_push($re, $row);
      }
    }
    return $re;
  }
  $result = explode("|",remove_utf8_bom($result));
  $results = fill(3,count($result)-2,$result);
  echo json_encode(convert($results));
	} catch (SSRSReportException $sr){
	  echo $sr->GetErrorMessage();
	}
}
catch (SSRSReportException $serviceException)
{
    echo $serviceException->GetErrorMessage();
}
?>