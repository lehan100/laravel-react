<?php

return [

    'dashboard.main' => 'Dashboard',
    'users.main' => 'Users',
    'roles' => [
        'name' => 'Roles',
        'created' => 'Created Roles',
        'edit' => 'Edit Roles',
    ],
    'permissions' => 'Permissions',
    'assign_permissions' => [
        'name' => 'Assign Permissions',
        'error' => 'Assign Permissions Error',
        'error.message' => "You haven't selected any permissions."
    ],
    'users' => [
        'admin.name'=>'List Users',
        'name'=>'User',
        'created' => 'Created Users',
        'edit' => 'Edit Users',
    ],
    'button' => [
        'created' => 'Add New',
        'delete.selected' => 'Delete Items Selected',
        'edit' => 'Edit',
        'delete' => 'Delete',
        'view' => 'View',
        'save' => 'Save',
        'back' => 'Back'
    ],
    'column' => [
        'name' => 'Name',
        'guard' => 'Guard',
        'action' => 'Action',
        'first_name'=>'First Name',
        'last_name'=>'Last Name',
        'status'=>'Status',
        'password'=>'Passwword',
        'password_confirm'=>'Password Confirm',
        'account_name'=>'Account Name',
        'assign_group'=>'Assign Group'
    ],
    'title'=>[
        'infomation'=>'Infomation',
        'setting'=>'Settings'
    ],
    'status'=>[
        'active' =>'Active',
        'inactive' =>'InActive'
    ],
    'message' => [
        'dashboard.welcome' => 'Your administration system is ready. Everything is set up for you to start managing your data and operations seamlessly.',
        'destroy' => 'Are you sure you want to delete this :name?',
        'destroys' => 'Are you sure you want to delete all selected items?',
        'error'=>[
            'required'=>'The :name field is required.',
            'password_confirm'=>'Passwords do not match.'
        ]
    ]
];
