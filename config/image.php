<?php

return [
    'admin' => [

        'photo' => [
            'width' => 80,
            'height' => 'auto'
        ],
        'category' => [
            'width' => 480,
            'height' => 480
        ],
        'product' => [
            'width' => 800,
            'height' => 800
        ],
        'post' => [
            'width' => 800,
            'height' => 'auto'
        ],
        'rating' => [
            'width' => 80,
            'height' => 80
        ],
        'attribute_set' => [
            'width' => 80,
            'height' => 'auto'
        ]
    ],
    'path' => [
        'default' => [
            "temp" => 'var/temp',
            'path' => 'media/uploads',
            'size' => 'photo'
        ],
        'photo' => [
            "temp" => 'var/temp',
            'path' => 'media/photo',
            'size' => 'photo'
        ],
        'category' => [
            "temp" => 'var/temp',
            'path' => 'media/category',
            'size' => 'category'
        ],
        'product' => [
            "temp" => 'var/temp',
            'path' => 'media/product',
            'size' => 'product'
        ],
        'post' => [
            "temp" => 'var/temp',
            'path' => 'media/post',
            'size' => 'post'
        ]
    ]
];
