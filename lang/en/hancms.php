<?php

return array (
  'loading' => 'Saving...',
  'dashboard' => 
  array (
    'main' => 'Dashboard',
    'hello' => 'Hello, :name',
    'quick_actions' => 'Quick actions',
    'revenue_chart' => '14-day revenue',
    'order_status' => 'Order status',
    'top_products' => 'Top products',
    'stock_alerts' => 'Stock alerts',
    'recent_orders' => 'Recent orders',
    'operations' => 'Operations overview',
    'view_products' => 'Open product list',
    'view_categories' => 'Arrange category tree',
    'view_orders' => 'View orders',
    'view_reports' => 'View revenue report',
    'empty' => 'No data yet.',
    'summary' => 
    array (
      'products' => 'Products',
      'active_products' => 'Active',
      'categories' => 'Categories',
      'users' => 'Users',
      'active_promotions' => 'Active promotions',
      'out_of_stock' => 'Out of stock',
    ),
    'metrics' => 
    array (
      'revenue' => 'Revenue',
      'revenue_hint' => 'Last 14 days',
      'orders' => 'Valid orders',
      'orders_hint' => 'Cancelled excluded',
      'paid' => 'Paid',
      'paid_hint' => 'Collected orders',
      'low_stock' => 'Low stock',
      'low_stock_hint' => 'Stock from 1-5',
    ),
  ),
  'users' => 
  array (
    'main' => 'Users',
    'admin' => 
    array (
      'name' => 'User List',
    ),
    'name' => 'User',
    'created' => 'Create User',
    'edit' => 'Edit User',
    'profile' => 'My Profile',
    'manage' => 'Manage Users',
    'logout' => 'Logout',
  ),
  'settings' => 
  array (
    'main' => 'Settings',
    'locations' => 
    array (
      'name' => 'Province / Ward Management',
      'summary' => 
      array (
        'provinces' => 'Provinces / Cities',
        'wards' => 'Wards / Communes',
      ),
    ),
  ),
  'translation' => 
  array (
    'name' => 'Setting Translations',
    'admin' => 
    array (
      'name' => 'Setting Translation Manager',
    ),
    'messages' => 
    array (
      'saved' => 'Setting translations saved.',
      'empty' => 'No translations available.',
    ),
  ),
  'sidebar' => 
  array (
    'show' => 'Show sidebar',
    'hide' => 'Hide sidebar',
  ),
  'roles' => 
  array (
    'name' => 'Roles',
    'created' => 'Create Role',
    'edit' => 'Edit Role',
  ),
  'permissions' => 'Permissions',
  'assign_permissions' => 
  array (
    'name' => 'Assign Permissions',
    'error' => 
    array (
      'message' => 'Please select at least one permission.',
    ),
  ),
  'media' => 
  array (
    'name' => 'Media',
    'position' => 
    array (
      'name' => 'Positions',
      'created' => 'Create position',
      'edit' => 'Edit position',
    ),
    'banner' => 
    array (
      'name' => 'Banners',
    ),
  ),
  'report' => 
  array (
    'name' => 'Reports',
    'center' => 'Report center',
    'from_date' => 'From date',
    'to_date' => 'To date',
    'filter' => 'Filter',
    'trend' => 'Trend',
    'ai_insight' => 'AI insight',
    'ai_analyze' => 'AI analysis',
    'ai_empty' => 'AI did not return an analysis.',
    'ai_failed' => 'Unable to analyze with AI right now.',
    'ai_rate_limited' => 'AI is rate limited. Please try again later.',
    'ai_hint' => 'Click AI analysis to get insights and recommended actions from the current data.',
    'details' => 'Detailed data',
    'empty_chart' => 'No chart data yet.',
    'empty_rows' => 'No data for this date range.',
    'columns' => 
    array (
      'date' => 'Date',
      'orders' => 'Orders',
      'quantity' => 'Quantity',
      'revenue' => 'Revenue',
      'product' => 'Product',
      'sku' => 'SKU',
      'sold_quantity' => 'Sold',
      'stock' => 'Stock',
      'status' => 'Status',
      'type' => 'Type',
      'code' => 'Code',
      'name' => 'Name',
    ),
    'status_labels' => 
    array (
      'active' => 'Running',
      'inactive' => 'Paused/expired',
      'out_of_stock' => 'Out of stock',
      'low_stock' => 'Low stock',
      'healthy' => 'Healthy',
    ),
    'campaigns' => 
    array (
      'coupon' => 'Coupon',
      'sale_offer' => 'Sale offer',
      'buy_to_gift' => 'Buy to gift',
    ),
    'revenue' => 
    array (
      'name' => 'Revenue Report',
      'description' => 'Track revenue, orders, payment status, and daily trends.',
      'metrics' => 
      array (
        'revenue' => 'Revenue',
        'paid' => 'Paid',
        'valid_orders' => 'Valid orders',
        'average_order_value' => 'Average order value',
      ),
    ),
    'product' => 
    array (
      'name' => 'Product Report',
      'description' => 'Analyze best-selling products, product revenue, and catalog health.',
      'metrics' => 
      array (
        'sold_products' => 'Products sold',
        'sold_quantity' => 'Units sold',
        'top_revenue' => 'Top revenue',
        'active_catalog' => 'Active catalog',
      ),
    ),
    'inventory' => 
    array (
      'name' => 'Inventory Report',
      'description' => 'Track low stock, out-of-stock products, and inventory adjustments.',
      'metrics' => 
      array (
        'total_stock' => 'Total stock',
        'low_stock' => 'Low stock',
        'out_of_stock' => 'Out of stock',
        'adjustments' => 'Adjustments',
      ),
    ),
    'promotion' => 
    array (
      'name' => 'Promotion Report',
      'description' => 'Summarize coupon, sale offer, and buy-to-gift campaign performance.',
      'metrics' => 
      array (
        'active' => 'Active campaigns',
        'coupon_used' => 'Coupons used',
        'discount_total' => 'Discount total',
        'campaign_total' => 'Total campaigns',
      ),
    ),
  ),
  'promotion' => 
  array (
    'name' => 'Promotion Settings',
    'saleoffer' => 
    array (
      'name' => 'Sale Offer',
      'conditions' => 'Conditions',
      'apply_scope' => 'Apply Scope',
      'apply_scope_hint' => 'If no product is selected, this offer applies to all products.',
      'options' => 
      array (
        'percent' => 'Percent',
        'fixed' => 'Fixed amount',
      ),
      'fields' => 
      array (
        'discount_type' => 'Discount Type',
        'discount_value' => 'Discount Value',
        'max_discount_amount' => 'Max Discount Amount',
        'starts_at' => 'Starts At',
        'ends_at' => 'Ends At',
        'priority' => 'Priority',
        'stackable' => 'Allow stackable',
        'apply_products' => 'Apply to products',
      ),
      'columns' => 
      array (
        'discount' => 'Discount',
        'final_price' => 'Final Price',
      ),
    ),
    'coupon' => 
    array (
      'name' => 'Coupon',
      'conditions' => 'Conditions',
      'apply_scope' => 'Apply Scope',
      'apply_scope_hint' => 'If no category or product is selected, this coupon applies to all.',
      'options' => 
      array (
        'percent' => 'Percent',
        'fixed' => 'Fixed amount',
      ),
      'fields' => 
      array (
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
        'products_count' => 'Product count',
      ),
    ),
    'buytogift' => 
    array (
      'name' => 'Buy To Gift',
      'conditions' => 'Conditions',
      'apply_scope' => 'Apply Scope',
      'options' => 
      array (
        'order_amount' => 'Order amount condition',
        'buy_product' => 'Buy product get gift',
        'stock_scope_all' => 'Unlimited stock scope',
        'stock_scope_limited' => 'Limited stock scope',
      ),
      'summary' => 
      array (
        'rule' => 'Rule',
        'buy' => 'Buy',
        'gift' => 'Gift',
        'min_order_amount' => 'Minimum order',
        'product_short' => 'product',
        'more_rules' => 'more rules',
      ),
      'fields' => 
      array (
        'condition_type' => 'Condition Type',
        'buy_products' => 'Condition Products',
        'buy_qty' => 'Buy Quantity',
        'gift_products' => 'Gift Products',
        'gift_qty' => 'Gift Quantity',
        'min_order_amount' => 'Minimum order amount for gift',
        'max_sets_per_order' => 'Max gift sets per order',
        'stock_scope' => 'Stock scope',
        'stock_limit' => 'Applicable stock quantity',
        'starts_at' => 'Starts At',
        'ends_at' => 'Ends At',
        'priority' => 'Priority',
        'stackable' => 'Allow stackable',
      ),
    ),
  ),
  'sales' => 
  array (
    'name' => 'Sales',
    'warehouse' => 
    array (
      'name' => 'Warehouse Management',
      'default_name' => 'Default Warehouse',
      'placeholders' => 
      array (
        'search' => 'Search SKU or product name...',
        'reason' => 'Enter adjustment reason...',
      ),
      'messages' => 
      array (
        'product_not_found' => 'Product not found.',
        'updated_success' => 'Updated successfully.',
        'toggled_success' => 'Warehouse status updated successfully.',
        'delete_not_supported' => 'Warehouse delete is not supported.',
        'bulk_delete_not_supported' => 'Bulk warehouse delete is not supported.',
        'toggle_reason' => 'Warehouse status updated from the warehouse management page.',
      ),
      'actions' => 
      array (
        'update_stock' => 'Update stock',
        'mark_in_stock' => 'Mark in stock',
        'mark_out_stock' => 'Mark out of stock',
        'save_stock' => 'Save stock',
      ),
      'fields' => 
      array (
        'current_stock' => 'Current stock',
        'update_method' => 'Update method',
        'set_new_stock' => 'Set new stock',
        'adjust_delta' => 'Adjust by quantity',
        'new_stock' => 'New stock',
        'delta' => 'Delta',
        'reason' => 'Reason',
        'set_label' => 'Set',
        'adjust_label' => 'Adjust',
      ),
      'titles' => 
      array (
        'update_stock' => 'Update stock',
        'recent_history' => 'Recent history',
      ),
      'empty_history' => 'No stock adjustment history yet.',
      'system_user' => 'System',
    ),
    'orders' => 
    array (
      'name' => 'Orders',
      'created' => 'Create Order',
      'edit' => 'Edit Order',
      'placeholders' => 
      array (
        'search' => 'Search order number, customer name, or phone...',
        'order_number' => 'Enter order number...',
        'product' => 'Select product',
        'province_first' => 'Please select a province / city first',
      ),
      'sections' => 
      array (
        'customer' => 'Customer Information',
        'status' => 'Order Status',
        'items' => 'Order Items',
        'history' => 'Processing History',
      ),
      'actions' => 
      array (
        'add_item' => 'Add Item',
      ),
      'empty_items' => 'No items have been added to this order yet.',
      'empty_history' => 'No processing history yet.',
      'history' => 
      array (
        'system_user' => 'System',
        'event_labels' => 
        array (
          'created' => 'Order Created',
          'updated' => 'Order Updated',
          'deleted' => 'Order Deleted',
          'order_status_changed' => 'Order Status Changed',
          'payment_status_changed' => 'Payment Status Updated',
          'shipping_status_changed' => 'Shipping Status Updated',
          'payment_method_changed' => 'Payment Method Changed',
        ),
        'messages' => 
        array (
          'created' => 'Created an order with status :order_status, payment :payment_status, and shipping :shipping_status.',
          'updated' => 'Updated the order information.',
          'deleted' => 'Deleted order :order_number for customer :customer_name.',
          'order_status_changed' => 'Order status changed from :from to :to.',
          'payment_status_changed' => 'Payment status changed from :from to :to.',
          'shipping_status_changed' => 'Shipping status changed from :from to :to.',
          'payment_method_changed' => 'Payment method changed from :from to :to.',
        ),
      ),
      'fields' => 
      array (
        'order_number' => 'Order Number',
        'customer_name' => 'Customer Name',
        'customer_phone' => 'Phone Number',
        'customer_email' => 'Email',
        'payment_method' => 'Payment Method',
        'province' => 'Province / City',
        'ward' => 'Ward / Commune',
        'customer_address' => 'Shipping Address',
        'note' => 'Note',
        'order_status' => 'Order Status',
        'payment_status' => 'Payment Status',
        'shipping_status' => 'Shipping Status',
        'discount_total' => 'Discount',
        'shipping_total' => 'Shipping Fee',
        'subtotal' => 'Subtotal',
        'grand_total' => 'Grand Total',
        'product' => 'Product',
        'variant' => 'Variant',
        'no_variant' => 'No variant',
        'available_stock' => 'Available Stock',
        'quantity' => 'Quantity',
        'unit_price' => 'Unit Price',
        'line_total' => 'Line Total',
        'placed_at' => 'Placed At',
        'total_quantity' => 'Total Quantity',
      ),
      'payment_methods' => 
      array (
        'cod_label' => 'Cash on Delivery',
      ),
      'statuses' => 
      array (
        'order' => 
        array (
          'pending' => 'Pending',
          'confirmed' => 'Confirmed',
          'processing' => 'Processing',
          'completed' => 'Completed',
          'cancelled' => 'Cancelled',
        ),
        'payment' => 
        array (
          'unpaid' => 'Unpaid',
          'paid' => 'Paid',
          'refunded' => 'Refunded',
          'failed' => 'Failed',
        ),
        'shipping' => 
        array (
          'pending' => 'Pending',
          'ready_to_ship' => 'Ready to Ship',
          'shipping' => 'Shipping',
          'delivered' => 'Delivered',
          'returned' => 'Returned',
        ),
      ),
      'print' => 
      array (
        'confirmation_title' => 'Order Confirmation',
        'confirmation_note' => 'I confirm that the information above is correct and agree with the contents of this order.',
        'confirmation_document' => 'Order Confirmation Form',
        'date_line' => 'Date :day Month :month Year :year',
        'sign_hint' => 'Sign and print your full name',
        'prepared_by' => 'Prepared By',
        'stock_keeper' => 'Stock Keeper',
        'customer_label' => 'Customer',
        'labels' => 
        array (
          'hotline' => 'Hotline',
          'website' => 'Website',
          'address' => 'Address',
          'number' => 'No.',
          'date' => 'Date',
          'name' => 'Name',
          'phone_short' => 'Phone',
          'placed_date' => 'Placed At',
          'no' => 'No.',
          'unit' => 'Unit',
          'item_unit' => 'pcs',
        ),
        'sections' => 
        array (
          'fulfillment' => 'Fulfillment',
        ),
      ),
    ),
    'payment_methods' => 
    array (
      'name' => 'Payment Methods',
      'sections' => 
      array (
        'gateway_settings' => 'Gateway Settings',
      ),
      'actions' => 
      array (
        'enable' => 'Enable',
        'disable' => 'Disable',
      ),
      'providers' => 
      array (
        'cash_on_delivery' => 'Cash on Delivery (COD)',
        'momo' => 'MoMo',
        'zalopay' => 'ZaloPay',
        'vnpay' => 'VNPay',
        'paypal' => 'PayPal',
      ),
      'fields' => 
      array (
        'instructions' => 'Instructions',
        'cod_fee' => 'Cash collection fee (if any)',
        'partner_code' => 'Partner Code',
        'access_key' => 'Access Key',
        'secret_key' => 'Secret Key',
        'endpoint' => 'Endpoint',
        'return_url' => 'Return URL',
        'ipn_url' => 'IPN URL',
        'app_id' => 'App ID',
        'key1' => 'Key 1',
        'key2' => 'Key 2',
        'callback_url' => 'Callback URL',
        'tmn_code' => 'TMN Code',
        'hash_secret' => 'Hash Secret',
        'client_id' => 'Client ID',
        'client_secret' => 'Client Secret',
        'mode' => 'Mode (sandbox/live)',
        'webhook_id' => 'Webhook ID',
      ),
    ),
    'shipping_methods' => 
    array (
      'name' => 'Shipping Methods',
      'sections' => 
      array (
        'gateway_settings' => 'Shipping API Settings',
      ),
      'actions' => 
      array (
        'enable' => 'Enable',
        'disable' => 'Disable',
      ),
      'providers' => 
      array (
        'ghn' => 'GHN',
        'ghtk' => 'GHTK',
        'viettel_post' => 'Viettel Post',
        'jnt' => 'J&T Express',
        'ninja_van' => 'Ninja Van',
      ),
      'fields' => 
      array (
        'token' => 'Token',
        'shop_id' => 'Shop ID',
        'username' => 'Username',
        'password' => 'Password',
        'client_id' => 'Client ID',
        'client_secret' => 'Client Secret',
        'endpoint' => 'Endpoint',
        'webhook_url' => 'Webhook URL',
      ),
      'messages' => 
      array (
        'method_not_found' => 'Shipping method not found.',
        'updated_success' => 'Updated successfully.',
        'toggled_success' => 'Shipping method status updated successfully.',
        'delete_not_supported' => 'Shipping method delete is not supported.',
        'bulk_delete_not_supported' => 'Bulk shipping method delete is not supported.',
        'toggle_reason' => 'Shipping method status updated from the shipping management page.',
      ),
    ),
  ),
  'catalog' => 
  array (
    'name' => 'Catalog',
    'menu_name' => 'Content Hub',
    'category' => 
    array (
      'name' => 'Categories',
      'created' => 'Add Category',
      'edit' => 'Edit Category',
      'products' => 'Category Products',
      'products_hint' => 'Select the products that belong to this category.',
      'tree_structure' => 'Category Tree Structure',
      'tree_drag' => 'Drag to reorder',
      'no_data' => 'No category tree data available.',
      'select_to_view' => 'Please select a category to view details',
      'instruction_text' => 'Click on the items on the left to edit information or configure SEO.',
      'select' => '--- Select Category Root ---',
      'ai' => 
      array (
        'suggest_seo' => 'AI Suggest SEO',
        'generating' => 'Generating...',
        'missing_input' => 'Please enter at least category name, content, or keywords before generating.',
        'empty_response' => 'AI returned empty SEO content. Please try again.',
        'failed' => 'Unable to generate AI SEO right now. Please try again later.',
      ),
      'type' => 
      array (
        'label' => 'Category Type',
        'options' => 
        array (
          'select' => 'Select type',
          'product' => 'Product',
          'news' => 'News',
          'blog' => 'Blog',
          'page' => 'Page',
          'contact' => 'Contact',
        ),
      ),
    ),
    'product' => 
    array (
      'admin' => 
      array (
        'name' => 'Product List',
      ),
      'name' => 'Products',
      'created' => 'Create Product',
      'edit' => 'Edit Product',
      'ai' => 
      array (
        'suggest_content' => 'AI Suggest Content',
        'suggest_seo' => 'AI Suggest SEO',
        'generating' => 'Generating...',
        'processing' => 'Processing...',
        'missing_input' => 'Please enter at least name, description, or keywords before generating.',
        'empty_response' => 'AI returned an empty response. Please try again.',
        'rate_limited' => 'AI is currently rate limited. Please wait a few seconds and try again.',
        'failed' => 'Unable to generate AI content right now. Please try again later.',
      ),
      'photo_hint' => 'Upload multiple photos for the product. The default photo will be shown first.',
      'upload_photos' => 'Upload images',
      'add_photos' => 'Add photos',
      'existing_photos' => 'Existing photos',
      'new_photos' => 'New photos',
      'no_photo' => 'No photos yet.',
      'no_new_photo' => 'No new photos yet.',
      'fields' => 
      array (
        'base_price' => 'Base price',
        'stock_available' => 'In stock',
        'stock_out' => 'Out of stock',
        'coupon_allowed' => 'Coupon allowed',
        'coupon_disallowed' => 'Coupon not allowed',
      ),
      'variants' => 
      array (
        'name' => 'Product variants',
        'attributes' => 'Variant attributes',
        'attributes_hint' => 'Choose attribute values, then generate variant combinations.',
        'generate' => 'Generate variants',
        'create_attribute' => 'Create attribute',
        'quick_attribute_hint' => 'Create a new attribute directly from the product screen.',
        'localized_name_hint' => 'Enter the value in all languages at once.',
        'images_hint' => 'Upload variant images in a single row. Click an image to set it as the cover.',
        'set_cover' => 'Set cover',
        'empty_attributes' => 'Create attributes and values before generating variants.',
        'empty' => 'No variants yet.',
        'rows' => 'rows',
        'manual' => 'Manual',
        'modal_title' => 'Variant information',
        'images' => 'Variant images',
        'upload_images' => 'Upload images',
        'clear_images' => 'Clear images',
      ),
      'tabs' => 
      array (
        'general' => 'General',
        'content' => 'Content',
        'categories' => 'Categories',
        'photos' => 'Images',
        'variants' => 'Variants',
      ),
    ),
    'attribute' => 
    array (
      'admin' => 
      array (
        'name' => 'Attribute List',
      ),
      'name' => 'Attributes',
      'created' => 'Create Attribute',
      'edit' => 'Edit Attribute',
      'create_hint' => 'Create a new attribute with multilingual names, code, and values.',
      'edit_hint' => 'Update translations, values, and display type.',
      'uploading' => 'Uploading image...',
      'empty' => 'No attributes yet.',
      'empty_hint' => 'Create attributes to manage text, image, and color values.',
      'sections' => 
      array (
        'information' => 'Information',
        'translations' => 'Translations',
        'values' => 'Values',
      ),
      'fields' => 
      array (
        'code' => 'Code',
        'code_placeholder' => 'brand, color, size',
        'type' => 'Type',
        'text' => 'Text',
        'image' => 'Image',
        'color' => 'Color',
        'active' => 'Active',
        'inactive' => 'Inactive',
        'add_value' => 'Add value',
        'remove' => 'Remove',
        'image_upload' => 'Image',
        'language' => 'Language',
        'value' => 'Value',
        'localized_name_hint' => 'Enter the attribute name in all languages at once.',
        'localized_value_hint' => 'Enter the value in all languages at once.',
        'code_hint' => 'Use a stable machine code like `brand`, `color`, or `size`.',
        'type_hint' => 'Choose how the value should be displayed.',
        'image_hint' => 'Click to upload the value image.',
        'color_hint' => 'Pick the color that represents the value.',
      ),
      'errors' => 
      array (
        'value_translation_required' => 'Each attribute value must have at least one localized label.',
        'value_image_required' => 'Image attributes require an image for every value.',
        'value_color_required' => 'Color attributes require a color for every value.',
      ),
      'messages' => 
      array (
        'created' => 'Attribute created successfully.',
        'updated' => 'Attribute updated successfully.',
        'deleted' => 'Attribute deleted successfully.',
        'create_failed' => 'Unable to create attribute.',
        'update_failed' => 'Unable to update attribute.',
        'save_failed' => 'Unable to save attribute.',
        'delete_failed' => 'Unable to delete attribute.',
      ),
    ),
    'post' => 
    array (
      'admin' => 
      array (
        'name' => 'Post List',
      ),
      'name' => 'Posts',
      'created' => 'Create Post',
      'edit' => 'Edit Post',
      'ai' => 
      array (
        'suggest_content' => 'AI Suggest Content',
        'suggest_seo' => 'AI Suggest SEO',
        'generating' => 'Generating...',
        'processing' => 'Processing...',
        'missing_input' => 'Please enter at least name, description, or keywords before generating.',
        'empty_response' => 'AI returned an empty response. Please try again.',
        'failed' => 'Unable to generate AI content right now. Please try again later.',
      ),
      'tabs' => 
      array (
        'general' => 'General',
        'content' => 'Content',
      ),
      'type' => 
      array (
        'label' => 'Post Type',
        'options' => 
        array (
          'select' => 'Select type',
          'primary' => 'Primary',
          'footer' => 'Footer',
          'sidebar' => 'Sidebar',
        ),
      ),
    ),
  ),
  'languages' => 
  array (
    'admin' => 
    array (
      'name' => 'Language List',
    ),
    'name' => 'Language',
    'created' => 'Create Language',
    'edit' => 'Edit Language',
  ),
  'label' => 
  array (
    'admin' => 
    array (
      'name' => 'Label List',
    ),
    'name' => 'Label',
    'created' => 'Create Label',
    'edit' => 'Edit Label',
    'msg_newline' => 'Click "+" to add a new line...',
    'msg_placeholder' => 'Enter key (e.g., welcome_msg)',
    'msg_verify' => 'Please enter a valid key name.',
    'confirm_delete_title' => 'Confirm Label Deletion',
    'confirm_delete' => 'Are you sure you want to delete this label? This action will remove it across all languages and cannot be undone after saving.',
  ),
  'layout' => 
  array (
    'admin' => 
    array (
      'name' => 'Layout',
    ),
    'name' => 'Layout',
    'tabs' => 
    array (
      'home' => 'Home',
      'general' => 'General',
      'content' => 'Contents',
    ),
    'items' => 
    array (
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
    ),
  ),
  'tabs' => 'Tabs',
  'section' => 'Section',
  'default' => 'Default',
  'seo' => 
  array (
    'name' => 'Search Engine Optimization',
    'slug' => 'Slug / URL',
    'character' => 'characters',
    'field' => 
    array (
      'title' => 'SEO Title',
      'keyword' => 'SEO Keywords',
      'description' => 'SEO Description',
    ),
    'review' => 
    array (
      'title' => 'Google Search Result Preview',
      'description' => 'Enter an SEO description or click the sync button to preview how it appears on Google...',
    ),
    'placeholder' => 
    array (
      'description' => 'Briefly describe the website content...',
    ),
  ),
  'button' => 
  array (
    'add' => 'Add',
    'created' => 'Add New',
    'delete' => 'Delete',
    'delete_selected' => 'Delete selected',
    'edit' => 'Edit',
    'view' => 'View',
    'print' => 'Print',
    'filter' => 'Filter',
    'open' => 'Open',
    'save' => 'Save',
    'back' => 'Back',
    'choose_image' => 'Choose Image',
    'new_line' => 'Add New Line',
    'confirm' => 'Confirm',
    'cancel' => 'Cancel',
    'close' => 'Close',
  ),
  'view' => 'View',
  'open' => 'Open',
  'current_tab' => 'Current Tab',
  'ready' => 'Ready',
  'needs_attention' => 'Needs Attention',
  'column' => 
  array (
    'name' => 'Name',
    'slug' => 'Slug',
    'guard' => 'Guard',
    'action' => 'Action',
    'first_name' => 'First Name',
    'last_name' => 'Last Name',
    'status' => 'Status',
    'search' => 'Search',
    'sku' => 'SKU',
    'quantity' => 'Quantity',
    'weight' => 'Weight',
    'brand' => 'Brand',
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
    'attributes' => 'Attributes',
    'categories' => 'Categories',
    'type' => 'Type',
    'value' => 'Value',
    'email' => 'Email',
    'code' => 'Code',
    'full_name' => 'Full Name',
    'administrative_unit' => 'Administrative Unit',
    'province' => 'Province / City',
    'ward_count' => 'Ward Count',
    'provider' => 'Provider',
    'currency' => 'Currency',
    'key' => 'Key',
    'content' => 'Content',
    'description' => 'Short Description',
    'seo_title' => 'SEO Title',
    'seo_keyword' => 'SEO Keyword',
    'seo_description' => 'SEO Description',
    'default' => 'Default',
    'upload' => 'Upload',
  ),
  'placeholder' => 
  array (
    'select' => 'Please select...',
  ),
  'filter' => 
  array (
    'all' => 'All',
    'search' => 'Search',
    'reset' => 'Reset',
  ),
  'title' => 
  array (
    'infomation' => 'Information',
    'setting' => 'Settings',
    'success' => 'Success',
    'error' => 'Error',
  ),
  'status' => 
  array (
    'active' => 'Active',
    'inactive' => 'Inactive',
  ),
  'message' => 
  array (
    'selected' => 'selected',
    'nodata' => 'No data.',
    'empty' => 'No data.',
    'edit_slug' => '* Manual slug editing is enabled for this language.',
    'dashboard' => 
    array (
      'welcome' => 'Your administration system is ready. Everything is set up for you to start managing your data and operations seamlessly.',
    ),
    'destroy' => 'Are you sure you want to delete this :name?',
    'destroys' => 'Are you sure you want to delete all selected items?',
    'security_notice' => 'Your account has been logged in from another device.',
    'error' => 
    array (
      'required' => 'The :name field is required.',
      'password_confirm' => 'Passwords do not match.',
      'created' => 'Error creating :name.',
      'edit' => 'Error updating :name.',
      'deleted' => 'No data found to delete.',
    ),
    'success' => 
    array (
      'created' => ':name created successfully.',
      'edit' => ':name updated successfully.',
      'deleted' => ':name deleted successfully.',
      'restored' => ':name restored successfully.',
    ),
  ),
  'tinymce' => 
  array (
    'name' => 'Image Library',
    'button' => 
    array (
      'upload_image' => 'Upload Image',
      'create_folder' => 'Create Folder',
      'save' => 'SAVE',
      'cancel' => 'Cancel',
      'close' => 'Close',
    ),
    'label' => 
    array (
      'folder' => 'folder',
      'file' => 'file',
      'new_name' => 'Enter new name:',
    ),
    'message' => 
    array (
      'delete' => 'Delete this :name?',
      'data_warning' => 'Processing data...',
      'folder_empty' => 'Folder is empty',
      'error' => 
      array (
        'move' => 'Cannot move file!',
        'create_folder' => 'Error creating folder',
        'delete' => 'Error while deleting!',
        'rename' => 'Error renaming!',
      ),
    ),
  ),
);
