<?php

return [
    'dashboard.main' => 'Dashboard',
    'users.main' => 'Users',
    'settings.main' => 'Settings',
    'sidebar' => [
        'show' => 'Show sidebar',
        'hide' => 'Hide sidebar',
    ],
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
    'media' => [
        'name' => 'Media',
        'position' => [
            'name' => 'Positions',
            'created' => 'Create position',
            'edit' => 'Edit position',
        ],
        'banner' => [
            'name' => 'Banners'
        ]
    ],
    'report' => [
        'name' => 'Reports',
        'revenue' => [
            'name' => 'Revenue Report',
        ],
        'product' => [
            'name' => 'Product Report',
        ],
        'inventory' => [
            'name' => 'Inventory Report',
        ],
        'promotion' => [
            'name' => 'Promotion Report',
        ],
    ],
    'promotion' => [
        'name' => 'Promotion Settings',
        'saleoffer' => [
            'name' => 'Sale Offer',
            'conditions' => 'Conditions',
            'apply_scope' => 'Apply Scope',
            'apply_scope_hint' => 'If no product is selected, this offer applies to all products.',
            'options' => [
                'percent' => 'Percent',
                'fixed' => 'Fixed amount',
            ],
            'fields' => [
                'discount_type' => 'Discount Type',
                'discount_value' => 'Discount Value',
                'max_discount_amount' => 'Max Discount Amount',
                'starts_at' => 'Starts At',
                'ends_at' => 'Ends At',
                'priority' => 'Priority',
                'stackable' => 'Allow stackable',
                'apply_products' => 'Apply to products',
            ],
        ],
        'coupon' => [
            'name' => 'Coupon',
            'conditions' => 'Conditions',
            'apply_scope' => 'Apply Scope',
            'apply_scope_hint' => 'If no category or product is selected, this coupon applies to all.',
            'options' => [
                'percent' => 'Percent',
                'fixed' => 'Fixed amount',
            ],
            'fields' => [
                'discount_type' => 'Discount Type',
                'discount_value' => 'Discount Value',
                'max_discount_amount' => 'Max Discount Amount',
                'min_order_amount' => 'Min Order Amount',
                'max_order_amount' => 'Max Order Amount',
                'usage_limit_total' => 'Total Usage Limit',
                'usage_limit_per_user' => 'Usage Limit Per User',
                'first_order_only' => 'First order only',
                'is_public' => 'Public coupon',
                'stackable' => 'Allow stackable',
                'starts_at' => 'Starts At',
                'ends_at' => 'Ends At',
                'apply_categories' => 'Apply to categories',
                'apply_products' => 'Apply to products',
            ],
        ],
        'buytogift' => [
            'name' => 'Buy To Gift',
            'conditions' => 'Conditions',
            'apply_scope' => 'Apply Scope',
            'options' => [
                'order_amount' => 'Order amount condition',
                'buy_product' => 'Buy product get gift',
            ],
            'fields' => [
                'condition_type' => 'Condition Type',
                'buy_products' => 'Condition Products',
                'buy_qty' => 'Buy Quantity',
                'gift_products' => 'Gift Products',
                'gift_qty' => 'Gift Quantity',
                'min_order_amount' => 'Minimum order amount for gift',
                'max_sets_per_order' => 'Max gift sets per order',
                'starts_at' => 'Starts At',
                'ends_at' => 'Ends At',
                'priority' => 'Priority',
                'stackable' => 'Allow stackable',
            ],
        ],
    ],
    'sales' => [
        'name' => 'Sales',
        'warehouse' => [
            'name' => 'Warehouse Management',
        ],
        'orders' => [
            'name' => 'Orders',
        ],
        'payment_methods' => [
            'name' => 'Payment Methods',
        ],
    ],
    'catalog' => [
        'name' => 'Catalog',
        'menu_name' => 'Content Hub',
        'category' => [
            'name' => 'Categories',
            'created' => 'Add Category',
            'edit' => 'Edit Category',
            'tree_structure' => 'Category Tree Structure',
            'tree_drag' => 'Drag to reorder',
            'no_data' => 'No category tree data available.',
            'select_to_view' => 'Please select a category to view details',
            'instruction_text' => 'Click on the items on the left to edit information or configure SEO.',
             'select' => '--- Select Category Root ---',
            'type' => [
                'label' => 'Category Type',
                'options' => [
                    'select' => 'Select type',
                    'product' => 'Product',
                    'news' => 'News',
                    'blog' => 'Blog',
                    'page' => 'Page',
                    'contact' => 'Contact',
                ],
            ],
        ],
        'product' => [
            'admin.name' => 'Product List',
            'name' => 'Products',
            'created' => 'Create Product',
            'edit' => 'Edit Product',
            'ai' => [
                'suggest_content' => 'AI Suggest Content',
                'suggest_seo' => 'AI Suggest SEO',
                'generating' => 'Generating...',
                'missing_input' => 'Please enter at least name, description, or keywords before generating.',
                'empty_response' => 'AI returned an empty response. Please try again.',
                'failed' => 'Unable to generate AI content right now. Please try again later.',
            ],
            'photo_hint' => 'Upload multiple photos for the product. The default photo will be shown first.',
            'upload_photos' => 'Upload images',
            'add_photos' => 'Add photos',
            'existing_photos' => 'Existing photos',
            'new_photos' => 'New photos',
            'no_photo' => 'No photos yet.',
            'no_new_photo' => 'No new photos yet.',
            'fields' => [
                'stock_available' => 'In stock',
                'stock_out' => 'Out of stock',
                'coupon_allowed' => 'Coupon allowed',
                'coupon_disallowed' => 'Coupon not allowed',
            ],
            'tabs' => [
                'general' => 'General',
                'content' => 'Content',
                'categories' => 'Categories',
                'photos' => 'Images',
            ],
        ],
        'post' => [
            'admin.name' => 'Post List',
            'name' => 'Posts',
            'created' => 'Create Post',
            'edit' => 'Edit Post',
        ]
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
        'admin.name' => 'Layout',
        'name' => 'Layout',
        'tabs' => [
            'home' => "Home",
            'general' => 'General',
            'content' => 'Contents'
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
    'tabs' => 'Tabs',
    'section' => 'Section',
    'default' => 'Default',
    'seo' => [
        'name' => 'Search Engine Optimization',
        'slug' => 'Slug / URL',
        'character' => 'characters',
        'field' => [
            'title' => 'SEO Title',
            'keyword' => 'SEO Keywords',
            'description' => 'SEO Description',
        ],
        'review' => [
            'title' => 'Google Search Result Preview',
            'description' => 'Enter an SEO description or click the sync button to preview how it appears on Google...',
        ],
        'placeholder' => [
            'description' => 'Briefly describe the website content...',
        ],
    ],
    'button' => [
        'created' => 'Add New',
        'delete.selected' => 'Delete Selected Items',
        'edit' => 'Edit',
        'delete' => 'Delete',
        'view' => 'View',
        'open' => 'Open',
        'save' => 'Save',
        'back' => 'Back',
        'choose_image' => 'Choose Image',
        'new_line' => 'Add New Line',
        'confirm' => 'Confirm',
        'cancel' => 'Cancel'
    ],
    'view' => 'View',
    'open' => 'Open',
    'current_tab' => 'Current Tab',
    'ready' => 'Ready',
    'needs_attention' => 'Needs Attention',
    'column' => [
        'name' => 'Name',
        'slug' => 'Slug',
        'guard' => 'Guard',
        'action' => 'Action',
        'first_name' => 'First Name',
        'last_name' => 'Last Name',
        'status' => 'Status',
        'sku' => 'SKU',
        'quantity' => 'Quantity',
        'weight' => 'Weight',
        'price' => 'Price',
        'order' => 'Sort Order',
        'coupon' => 'Coupon',
        'stock' => 'Stock',
        'password' => 'Password',
        'password_confirm' => 'Confirm Password',
        'account_name' => 'Account Name',
        'assign_group' => 'Assign Group',
        'group' => 'User Group',
        'image' => 'Photo',
        'image_edit' => 'Update',
        'images' => 'Images',
        'categories' => 'Categories',
        'email' => 'Email',
        'code' => 'Code',
        'currency' => 'Currency',
        'key' => 'Key',
        'content' => 'Content',
        'description' => 'Short Description',
        'seo_title' => 'SEO Title',
        'seo_keyword' => 'SEO Keyword',
        'seo_description' => 'SEO Description',
        'default' => 'Default',
        'upload' => 'Upload'
    ],
    'placeholder' => [
        'select' => 'Please select...'
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
    ],
    'tinymce' => [
        'name' => 'Image Library',
        'button' => [
            'upload_image' => 'Upload Image',
            'create_folder' => 'Create Folder',
            'save' => 'SAVE',
            'cancel' => 'Cancel',
            'close' => 'Close'
        ],
        'label' => [
            'folder' => 'folder',
            'file' => 'file',
            'new_name' => 'Enter new name:'
        ],
        'message' => [
            'delete' => 'Delete this :name?',
            'data_warning' => 'Processing data...',
            'folder_empty' => 'Folder is empty',
            'error' => [
                'move' => 'Cannot move file!',
                'create_folder' => 'Error creating folder',
                'delete' => 'Error while deleting!',
                'rename' => 'Error renaming!'
            ]
        ]
    ]
];
