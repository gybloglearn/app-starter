<?php
//potting mentés
class info{
    function get(){
        //$db = new \DB\SQL('pgsql:host=localhost;dbname=ZW1500Potting','postgres','abcd');
        $db=new \DB\SQL('pgsql:host=localhost;dbname=zwdowntimes','postgres','abc912');
        $res = $db->exec("SELECT * FROM info");
        $resault=[];
        foreach($res as $k=>$v){
            array_push($resault,$v);
        }
        echo json_encode($resault);
        
    }

    function post($app,$params)
    {
        $data=json_decode($app['BODY']);
        echo json_encode($data);
        //$db = new \DB\SQL('pgsql:host=localhost;dbname=ZW1500Potting','postgres','abcd');
        $db = new \DB\SQL('pgsql:host=localhost;dbname=zwdowntimes','postgres','abc912');
        $mapper=new \DB\SQL\Mapper($db,'info');
        
        $mapper->id=$data->id; //azonosító
        $mapper->sso=$data->sso; //sso
        $mapper->operator_name=$data->operator_name; //operátor
        $mapper->start_date=$data->start; //kezdő időpont
        $mapper->end_date=$data->end; //vége időpont
        $mapper->time=$data->time; //tartam
        $mapper->pottingid=$data->pottingid; //potting azonosító
        $mapper->category=$data->category; //kategória
        $mapper->subcategory=$data->subcategory; //alkategória
        $mapper->description=$data->description; //megjegyzés
        $mapper->save();
        echo "OK";
        @unlink($data);
        @unlink($mapper);
        @unlink($db);
    }
    function put($app,$params)
    {
        $data=json_decode($app['BODY']);
        //$db = new \DB\SQL('pgsql:host=localhost;dbname=ZW1500Potting','postgres','abcd');
        $db=new \DB\SQL('pgsql:host=localhost;dbname=zwdowntimes','postgres','abc912');
        $mapper=new \DB\SQL\Mapper($db,'info');
        $info=$mapper->load(Array('id=?',$params['id']));
        $info->start=$data->start;
        $info->end=$data->end;
        $info->category=$data->category; //kategória
        $mapper->subcategory=$data->subcategory; //alkategória
        $info->description=$data->description; //megjegyzés
        $info->save();
        echo "OK";
        @unlink($data);
        @unlink($mapper);
        @unlink($db);
        @unlink($info);
    }
    function delete($app,$params)
    {
        //$db = new \DB\SQL('pgsql:host=localhost;dbname=ZW1500Potting','postgres','abcd');
        $db=new \DB\SQL('pgsql:host=localhost;dbname=zwdowntimes','postgres','abc912');
        $mapper=new DB\SQL\Mapper($db,'info');
        $info=$mapper->find(Array('id=?',$params['id']));
        $info[0]->erase();
        echo "OK";
        @unlink($mapper);
        @unlink($db);
        @unlink($info);
    }
}
//klórozó mentés
class clorinationinfo{
    function get(){
        //$db = new \DB\SQL('pgsql:host=localhost;dbname=ZW1500Potting','postgres','abcd');
        $db=new \DB\SQL('pgsql:host=localhost;dbname=zwdowntimes','postgres','abc912');
        $res = $db->exec("SELECT * FROM clorinationinfo");
        $resault=[];
        foreach($res as $k=>$v){
            array_push($resault,$v);
        }
        echo json_encode($resault);
        
    }

    function post($app,$params)
    {
        $data=json_decode($app['BODY']);
        echo json_encode($data);
        //$db = new \DB\SQL('pgsql:host=localhost;dbname=ZW1500Potting','postgres','abcd');
        $db = new \DB\SQL('pgsql:host=localhost;dbname=zwdowntimes','postgres','abc912');
        $mapper=new \DB\SQL\Mapper($db,'clorinationinfo');
        
        $mapper->id=$data->id; //azonosító
        $mapper->sso=$data->sso; //sso
        $mapper->operator_name=$data->operator_name; //operátor
        $mapper->start_date=$data->start; //kezdő időpont
        $mapper->end_date=$data->end; //vége időpont
        $mapper->time=$data->time; //tartam
        $mapper->category=$data->category; //kategória
        $mapper->subcategory=$data->subcategory; //alkategória
        $mapper->description=$data->description; //megjegyzés
        $mapper->save();
        echo "OK";
        @unlink($data);
        @unlink($mapper);
        @unlink($db);
    }
    function put($app,$params)
    {
        $data=json_decode($app['BODY']);
        //$db = new \DB\SQL('pgsql:host=localhost;dbname=ZW1500Potting','postgres','abcd');
        $db=new \DB\SQL('pgsql:host=localhost;dbname=zwdowntimes','postgres','abc912');
        $mapper=new \DB\SQL\Mapper($db,'clorinationinfo');
        $info=$mapper->load(Array('id=?',$params['id']));
        $info->start=$data->start;
        $info->end=$data->end;
        $info->category=$data->category; //kategória
        $mapper->subcategory=$data->subcategory; //alkategória
        $info->description=$data->description; //megjegyzés
        $info->save();
        echo "OK";
        @unlink($data);
        @unlink($mapper);
        @unlink($db);
        @unlink($info);
    }
    function delete($app,$params)
    {
        //$db = new \DB\SQL('pgsql:host=localhost;dbname=ZW1500Potting','postgres','abcd');
        $db=new \DB\SQL('pgsql:host=localhost;dbname=zwdowntimes','postgres','abc912');
        $mapper=new DB\SQL\Mapper($db,'clorinationinfo');
        $info=$mapper->find(Array('id=?',$params['id']));
        $info[0]->erase();
        echo "OK";
        @unlink($mapper);
        @unlink($db);
        @unlink($info);
    }
}

$app=require('../../../../../f3lib/base.php');
$app->map('/info/@id','info');
$app->map('/clorinationinfo/@id','clorinationinfo');
$app->run();
?>
