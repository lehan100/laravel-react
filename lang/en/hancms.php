<?php

return [
    'dashboard.main' => 'Dashboard',
    'users.main' => 'Users',
    'settings.main' => 'Settings',
    'roles' => [
        'name' => 'Roles',
        'created' => 'Create Role', // Đổi từ Created sang Create cho tự nhiên
        'edit' => 'Edit Role',
    ],
    'permissions' => 'Permissions',
    'assign_permissions' => [
        'name' => 'Assign Permissions',
        'error' => 'Permission Assignment Error',
        'error.message' => "Please select at least one permission."
    ],
    'users' => [
        'admin.name' => 'User List', // List Users -> User List chuyên nghiệp hơn
        'name' => 'User',
        'created' => 'Create User',
        'edit' => 'Edit User',
        'profile' => 'My Profile',
        'manage' => 'Manage Users',
        'logout' => 'Logout'
    ],
    'languages' => [
        'admin.name' => 'Language List',
        'name' => 'Language',
        'created' => 'Create Language',
        'edit' => 'Edit Language',
    ],
    'label' => [
        'admin.name' => 'Label List',
        'name' => 'Label',
        'created' => 'Create Label',
        'edit' => 'Edit Label',
        'msg_newline' => 'Click "+" to add a new line...',
        'msg_placeholder' => 'Enter key (e.g., welcome_msg)',
        'msg_verify' => 'Please enter a valid key name.',
        'confirm_delete_title' => 'Confirm Label Deletion',
        'confirm_delete' => 'Are you sure you want to delete this label? This action will remove it across all languages and cannot be undone after saving.'
    ],
    'layout' => [
        'admin.name' => 'ウェブサイト設定',
        'name' => 'ウェブサイト',
        'tabs' => [
            'home' => "Home",
            'general' => 'General'
        ],
        'items' => [
            'logo' => 'Logo',
            'favicon' => 'Favicon',
            'meta_title' => 'Meta Title',
            'meta_keyword' => 'Meta Keyword',
            'meta_description' => 'Meta Description',
            'company' => 'Company Name',
            'phone' => 'Phone Number',
            'address' => 'Address',
            'tax' => 'Tax Code',
            'copyright' => 'Copyright',
        ]
    ],
    'button' => [
        'created' => 'Add New',
        'delete.selected' => 'Delete Selected Items',
        'edit' => 'Edit',
        'delete' => 'Delete',
        'view' => 'View',
        'save' => 'Save',
        'back' => 'Back',
        'choose_image' => 'Choose Image',
        'new_line' => 'Add New Line',
        'confirm' => 'Confirm',
        'cancel' => 'Cancel'
    ],
    'column' => [
        'name' => 'Name',
        'guard' => 'Guard',
        'action' => 'Action',
        'first_name' => 'First Name',
        'last_name' => 'Last Name',
        'status' => 'Status',
        'password' => 'Password', // Sửa lỗi Passwword
        'password_confirm' => 'Confirm Password',
        'account_name' => 'Account Name',
        'assign_group' => 'Assign Group',
        'group' => 'User Group',
        'image' => 'Photo',
        'email' => 'Email',
        'code' => 'Code',
        'key' => 'Key'
    ],
    'filter' => [
        'search' => 'Search',
        'reset' => 'Reset'
    ],
    'title' => [
        'infomation' => 'Information', // Sửa lỗi Infomation
        'setting' => 'Settings',
        'success' => 'Success',
        'error' => 'Error',
    ],
    'status' => [
        'active' => 'Active',
        'inactive' => 'Inactive'
    ],
    'message' => [
        'dashboard.welcome' => 'Your administration system is ready. Everything is set up for you to start managing your data and operations seamlessly.',
        'destroy' => 'Are you sure you want to delete this :name?',
        'destroys' => 'Are you sure you want to delete all selected items?',
        'security_notice' => 'Your account has been logged in from another device.',
        'error' => [
            'required' => 'The :name field is required.',
            'password_confirm' => 'Passwords do not match.',
            'created' => 'Error creating :name.',
            'edit' => 'Error updating :name.',
            'deleted' => 'No data found to delete.'
        ],
        'success' => [
            'created' => ':name created successfully.',
            'edit' => ':name updated successfully.', // edit -> updated
            'deleted' => ':name deleted successfully.',
            'restored' => ':name restored successfully.',
        ]
    ]
];
