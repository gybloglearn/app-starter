<?php
 class Plan{
     function get($app,$params)
     {
         $db=new \DB\Jig('plans/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'plans.json');
         $plans=$mapper->find(Array('@id=?',$params['id']));
         $resault=[];

         foreach($plans as $k=>$plan){
             foreach($plan as $a=>$b){
                 if($a!="_id" && $plan["id"]==$params["id"])
                 {
                     $resault[$a]=$b;
                 }
             }
         }

         $res=[];
         foreach($plans as $k=>$plan){
             if($plan["id"]==$params["id"]){
                 $r=[];
                 foreach($plan as $a=>$b){
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
         $db=new \DB\Jig('plans/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'plans.json');

         $mapper->id=$data->id; //azonosító
         $mapper->date=$data->date; //dátum
         $mapper->circle=$data->circle; //kör
         $mapper->value=$data->value; // százalék érték
         
         $mapper->save();

         echo "OK";

         @unlink($data);
         @unlink($mapper);
         @unlink($db);
     }

     function put($app,$params)
     {
         $data=json_decode($app['BODY']);
         $db=new \DB\Jig('plans/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'plans.json');
         $plan=$mapper->load(Array('@id=?',$params['id']));

         $plan->value=$data->value;

         $plan->save();

         echo "OK";

         @unlink($data);
         @unlink($mapper);
         @unlink($db);
         @unlink($plan);
     }

     function delete($app,$params)
     {
         $db=new \DB\Jig('plans/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'plans.json');
         $plan=$mapper->find(Array('@id=?',$params['id']));
         $plan[0]->erase();

         echo "OK";

         @unlink($mapper);
         @unlink($db);
         @unlink($plan);
     }
 }
     $app = require('../../../../../f3lib/base.php');
     $app->map('/plan/@id','Plan');

     $app->route('GET /plan/@id/@date',function($app,$params){
         $db=new \DB\Jig('plans/',\DB\Jig::FORMAT_JSON);
         $mapper=new \DB\Jig\Mapper($db,'plans.json');
         $plans=$mapper->find(Array('@id=? and @date=?',$params['id'],$params['date']));
          $res=[];
          foreach($plans as $k=>$plan){
              if($plan["id"]==$params["id"]){
                  $r=[];
                  foreach($plan as $a=>$b){
                      if($a!="_id")
                      {
                          $r[$a]=$b;
                      }
                  }
                  array_push($res,$r);
              }
          }
     });

     $app->route('GET /allplans',function($app){
         $data=file_get_contents('plans/plans.json');
         $data=json_decode($data);

         $resault=[];
         foreach($data as $v){
             array_push($resault,$v);
         }
         echo json_encode($resault);
     });
     $app->run();
?>