<?php

return [
    'admin' => [

        'photo' => [
            'width' => 80,
            'height' => 'auto'
        ],
        'product' => [
            'width' => 800,
            'height' => 800
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
        'photo' => [
            "temp" => 'var/temp',
            'path' => 'media/product',
            'size' => 'product'
        ]
    ]
];
