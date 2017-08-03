<?php
 class Shiftnum{
     function get($app,$params)
     {
         $db=new \DB\Jig('files/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'shift.json');
         $shifts=$mapper->find(Array('@id=?',$params['id']));
         $resault=[];

         foreach($shifts as $k=>$shift){
             foreach($shift as $a=>$b){
                 if($a!="_id" && $shift["id"]==$params["id"])
                 {
                     $resault[$a]=$b;
                 }
             }
         }

         $res=[];
         foreach($shifts as $k=>$shift){
             if($shift["id"]==$params["id"]){
                 $r=[];
                 foreach($shift as $a=>$b){
                     if($a!="_id")
                     {
                         $r[$a]=$b;
                     }
                 }
                 array_push($res,$r);
             }
         }
         echo json_encode($res);
     }

     function post($app,$params)
     {
         $data=json_decode($app['BODY']);
         echo json_encode($data);
         $db=new \DB\Jig('files/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'shift.json');

         $mapper->id=$data->id; //azonosító
         $mapper->date=$data->date; //dátum
         $mapper->numbera=$data->numbera; // A szakszám
         $mapper->numberb=$data->numberb; // B szakszám
         $mapper->numberc=$data->numberc; // C szakszám
         $mapper->numberd=$data->numberd; // D szakszám
    
         $mapper->save();

         echo "OK";

         @unlink($data);
         @unlink($mapper);
         @unlink($db);
     }

     function put($app,$params)
     {
         $data=json_decode($app['BODY']);
         $db=new \DB\Jig('files/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'shift.json');
         $shift=$mapper->load(Array('@id=?',$params['id']));

         $shift->number=$data->number; //szakszám

         $shift->save();

         echo "OK";

         @unlink($data);
         @unlink($mapper);
         @unlink($db);
         @unlink($shift);
     }

     function delete($app,$params)
     {
         $db=new \DB\Jig('files/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'shift.json');
         $shift=$mapper->find(Array('@id=?',$params['id']));
         $shift[0]->erase();

         echo "OK";

         @unlink($mapper);
         @unlink($db);
         @unlink($shift);
     }
 }

 class Tmk{
     function get($app,$params)
     {
         $db=new \DB\Jig('files/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'tmk.json');
         $tmks=$mapper->find(Array('@id=?',$params['id']));
         $resault=[];

         foreach($tmks as $k=>$tmk){
             foreach($tmk as $a=>$b){
                 if($a!="_id" && $tmk["id"]==$params["id"])
                 {
                     $resault[$a]=$b;
                 }
             }
         }

         $res=[];
         foreach($tmks as $k=>$tmk){
             if($tmk["id"]==$params["id"]){
                 $r=[];
                 foreach($tmk as $a=>$b){
                     if($a!="_id")
                     {
                         $r[$a]=$b;
                     }
                 }
                 array_push($res,$r);
             }
         }
         echo json_encode($res);
     }

     function post($app,$params)
     {
         $data=json_decode($app['BODY']);
         echo json_encode($data);
         $db=new \DB\Jig('files/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'tmk.json');

         $mapper->id=$data->id; //azonosító
         $mapper->sm=$data->sm; //azonosító
         $mapper->lastdate=$data->lastdate; //előző dátum
         $mapper->nextdate=$data->nextdate; //következő dátum
    
         $mapper->save();

         echo "OK";

         @unlink($data);
         @unlink($mapper);
         @unlink($db);
     }

     function put($app,$params)
     {
         $data=json_decode($app['BODY']);
         $db=new \DB\Jig('files/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'tmk.json');
         $tmk=$mapper->load(Array('@id=?',$params['id']));

         $tmk->lastdate=$date->lastdate; //előző dátum
         $tmk->nextdate=$date->nextdate; // következő dátum

         $tmk->save();

         echo "OK";

         @unlink($data);
         @unlink($mapper);
         @unlink($db);
         @unlink($tmk);
     }

     function delete($app,$params)
     {
         $db=new \DB\Jig('files/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'tmk.json');
         $tmk=$mapper->find(Array('@id=?',$params['id']));
         $tmk[0]->erase();

         echo "OK";

         @unlink($mapper);
         @unlink($db);
         @unlink($tmk);
     }
 }

 class Kbm{
     function get($app,$params)
     {
         $db=new \DB\Jig('files/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'kardosbela.json');
         $kbms=$mapper->find(Array('@id=?',$params['id']));
         $resault=[];

         foreach($kbms as $k=>$kbm){
             foreach($kbm as $a=>$b){
                 if($a!="_id" && $kbm["id"]==$params["id"])
                 {
                     $resault[$a]=$b;
                 }
             }
         }

         $res=[];
         foreach($kbms as $k=>$kbm){
             if($kbm["id"]==$params["id"]){
                 $r=[];
                 foreach($kbm as $a=>$b){
                     if($a!="_id")
                     {
                         $r[$a]=$b;
                     }
                 }
                 array_push($res,$r);
             }
         }
         echo json_encode($res);
     }

     function post($app,$params)
     {
         $data=json_decode($app['BODY']);
         echo json_encode($data);
         $db=new \DB\Jig('files/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'kardosbela.json');

         $mapper->id=$data->id; //azonosító
         $mapper->sm=$data->sm; //sm
         $mapper->nextdate=$data->nextdate; //következő dátum
         $mapper->nextproduct=$data->nextproduct; //következő termék
    
         $mapper->save();

         echo "OK";

         @unlink($data);
         @unlink($mapper);
         @unlink($db);
     }

     function put($app,$params)
     {
         $data=json_decode($app['BODY']);
         $db=new \DB\Jig('files/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'kardosbela.json');
         $kbm=$mapper->load(Array('@id=?',$params['id']));

         $kbm->nextdate=$data->nextdate; // következő dátum
         $kbm->nextproduct=$data->nextproduct; // következő termék

         $kbm->save();

         echo "OK";

         @unlink($data);
         @unlink($mapper);
         @unlink($db);
         @unlink($kbm);
     }

     function delete($app,$params)
     {
         $db=new \DB\Jig('files/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'kardosbela.json');
         $kbm=$mapper->find(Array('@id=?',$params['id']));
         $kbm[0]->erase();

         echo "OK";

         @unlink($mapper);
         @unlink($db);
         @unlink($kbm);
     }
 }
 
     $app = require('../../../../f3lib/base.php');
     $app->map('/shift/@id','Shiftnum');
     $app->map('/tmk/@id','Tmk');
     $app->map('/kardosbela/@id','Kbm');

     $app->route('GET /shift/@date',function($app,$params){
         $db=new \DB\Jig('files/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'shift.json');
         $shift=$mapper->find(Array('@date=?',$params['date']));
          $res=[];
          foreach($shift as $k=>$shift){
                  $r=[];
                  foreach($shift as $a=>$b){
                      if($a!="_id")
                      {
                          $r[$a]=$b;
                      }
                  }
                  array_push($res,$r);
          }
     });

     $app->route('GET /allshift',function($app){
         $data=file_get_contents('files/shift.json');
         $data=json_decode($data);

         $resault=[];
         foreach($data as $v){
             array_push($resault,$v);
         }
         echo json_encode($resault);
     });

     $app->route('GET /alltmk',function($app){
         $data=file_get_contents('files/tmk.json');
         $data=json_decode($data);

         $resault=[];
         foreach($data as $v){
             array_push($resault,$v);
         }
         echo json_encode($resault);
     });

     $app->route('GET /alltype',function($app){
         $data=file_get_contents('files/kardosbela.json');
         $data=json_decode($data);

         $resault=[];
         foreach($data as $v){
             array_push($resault,$v);
         }
         echo json_encode($resault);
     });
     
     $app->run();
?>