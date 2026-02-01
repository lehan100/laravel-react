<?php

namespace App\Helpers;
use Illuminate\Support\Str;
class Filter {

    public static function removeVN($value) {

        /* a à ả ã á ạ ă ằ ẳ ẵ ắ ặ â ầ ẩ ẫ ấ ậ b c d đ e è ẻ ẽ é ẹ ê ề ể ễ ế ệ
          f g h i ì ỉ ĩ í ị j k l m n o ò ỏ õ ó ọ ô ồ ổ ỗ ố ộ ơ ờ ở ỡ ớ ợ
          p q r s t u ù ủ ũ ú ụ ư ừ ử ữ ứ ự v w x y ỳ ỷ ỹ ý ỵ z */
        /* $filter = new Zend_Filter_StringToLower('utf-8');
          $value = $filter->filter($value); */

        $charaterA = '#(à|ả|ã|á|ạ|ă|ằ|ẳ|ẵ|ắ|ặ|â|ầ|ẩ|ẫ|ấ|ậ)#imsU';
        $replaceCharaterA = 'a';
        $value = preg_replace($charaterA, $replaceCharaterA, $value);

        $charaterD = '#(đ)#imsU';
        $replaceCharaterD = 'd';
        $value = preg_replace($charaterD, $replaceCharaterD, $value);

        $charaterE = '#(è|ẻ|ẽ|é|ẹ|ê|ề|ể|ễ|ế|ệ)#imsU';
        $replaceCharaterE = 'e';
        $value = preg_replace($charaterE, $replaceCharaterE, $value);

        $charaterI = '#(ì|ỉ|ĩ|í|ị)#imsU';
        $replaceCharaterI = 'i';
        $value = preg_replace($charaterI, $replaceCharaterI, $value);

        $charaterO = '#(ò|ỏ|õ|ó|ọ|ô|ồ|ổ|ỗ|ố|ộ|ơ|ờ|ở|ỡ|ớ|ợ)#imsU';
        $replaceCharaterO = 'o';
        $value = preg_replace($charaterO, $replaceCharaterO, $value);

        $charaterU = '#(ù|ủ|ũ|ú|ụ|ư|ừ|ử|ữ|ứ|ự)#imsU';
        $replaceCharaterU = 'u';
        $value = preg_replace($charaterU, $replaceCharaterU, $value);

        $charaterY = '#(ỳ|ỷ|ỹ|ý|ỵ)#imsU';
        $replaceCharaterY = 'y';
        $value = preg_replace($charaterY, $replaceCharaterY, $value);

        return $value;
    }

    public static function setUrlKey($name) {
        //$url = strtolower($name);
        $url = Str::slug($name);
        //$url = self::removeVN($url);
       // $url = preg_replace('#[^0-9a-z]+#i', '-', $url);
        return $url;
    }

}
