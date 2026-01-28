<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Config;

class MainController extends Controller {

    public $isDataTable = false;
    public $metaTitle = 'Admin Control Panel';
    public $title = 'Admin Control Panel';
    public $buttomGroup = 'default';
    public $params = ['pagination' => [
            'totalItemsPerPage' => 6,
            'pageLimit' => 6
    ]];

    public function __construct() {
        view()->share(['isDataTable' => $this->isDataTable]);
    }

    public function array_flatten($array = null) {

        $result = array();
        if (count($array) > 0) {
            $result = array_combine(array_map(function ($value) {
                        return $value['id'];
                    }, $array), array_map(function ($value) {
                        return $value['name'];
                    }, $array));
        }
        return $result;
    }

    
}
