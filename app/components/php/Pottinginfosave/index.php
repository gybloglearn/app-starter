<?php
class info{
    function get($app,$params)
    {
        $db=new \DB\Jig('infos/',\DB\Jig::FORMAT_JSON);
        $mapper=new \DB\Jig\Mapper($db,'infos.json');
        $infos=$mapper->find(Array('@id=?',$params['id']));
        $resault=[];
        // ez csak egyet fog visszaadni, a legutolsó bejegyzést erre az "id" re
        foreach($infos as $k=>$info){
            foreach($info as $a=>$b){
                if($a!="_id" && $info["id"]==$params["id"])
                {
                    $resault[$a]=$b;
                }
            }
        }
        //echo json_encode($resault);
        
        // ez pedig annyit kellene visszaadjon, amennyi van
        $res = [];
        foreach($infos as $k=>$info){
            if($info["id"]==$params["id"]){
                $r = [];
                foreach($info as $a=>$b){
                    if($a!="_id")
                        $r[$a] = $b;
                }
                array_push($res, $r);
            }
        }
        echo json_encode($res);
    }
    function post($app,$params)
    {
        $data=json_decode($app['BODY']);
        echo json_encode($data);
        $db=new \DB\Jig('infos/',\DB\Jig::FORMAT_JSON);
        $mapper=new \DB\Jig\Mapper($db,'infos.json');
        $mapper->id=$data->id; //azonosító
        $mapper->start=$data->start; //kezdő időpont
        $mapper->end=$data->end; //vége időpont
        $mapper->time=$data->time; //tartam
        $mapper->pottingid=$data->pottingid; //potting azonosító
        $mapper->place=$data->place; //állomás
        $mapper->category=$data->category; //kategória
        $mapper->description=$data->description; //megjegyzés
        $mapper->opid=$data->opid; //operator azonosító
        $mapper->opname=$data->opname; //operator név
        $mapper->save();
        echo "OK";
        @unlink($data);
        @unlink($mapper);
        @unlink($db);
    }
    function put($app,$params)
    {
        $data=json_decode($app['BODY']);
        $db=new \DB\Jig('infos/',\DB\Jig::FORMAT_JSON);
        $mapper=new \DB\Jig\Mapper($db,'infos.json');
        $info=$mapper->load(Array('@id=?',$params['id']));
        $info->start=$data->start;
        $info->end=$data->end;
        $info->place=$data->place; //állomás
        $info->category=$data->category; //kategória
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
        $db=new \DB\Jig('infos/',\DB\Jig::FORMAT_JSON);
        $mapper= new \DB\Jig\Mapper($db,'infos.json');
        $info=$mapper->find(Array('@id=?',$params['id']));
        $info[0]->erase();
        echo "OK";
        @unlink($mapper);
        @unlink($db);
        @unlink($info);
    }
}
$app=require('../../../../../f3lib/base.php');
$app->map('/info/@id','Info');
// ez pedig adott id-re adott days-re kellene visszaadja mindeniket.
$app->route('GET /info/@id/@date', function($app, $params){
    $db=new \DB\Jig('infos/',\DB\Jig::FORMAT_JSON);
    $mapper=new \DB\Jig\Mapper($db,'infos.json');
    $infos=$mapper->find(Array('@id = ? and @days = ?',$params['id'], $params['date']));
    // ez pedig annyit kellene visszaadjon, amennyi van
        $res = [];
        foreach($infos as $k=>$info){
            if($info["id"]==$params["id"]){
                $r = [];
                foreach($info as $a=>$b){
                    if($a!="_id")
                        $r[$a] = $b;
                }
                array_push($res, $r);
            }
        }
        echo json_encode($res);
});
$app->route('GET /allinfos',function($app){
    $data=file_get_contents('infos/infos.json');
    $data=json_decode($data);
    $resault=[];
    foreach($data as $k=>$v){
        array_push($resault,$v);
    }
    echo json_encode($resault);
});
$app->run();
?>