<?php

return [
    'admin' => [

        'photo' => [
            'width' => 80,
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
        ]
    ]
];
