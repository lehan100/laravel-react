<?php

return [
    'dashboard.main' => 'Bảng điều khiển',
    'users.main' => 'Người dùng',
    'settings.main' => 'Cài đặt',
    'sidebar' => [
        'show' => 'Hiện sidebar',
        'hide' => 'Ẩn sidebar',
    ],
    'roles' => [
        'name' => 'Vai trò',
        'created' => 'Thêm vai trò',
        'edit' => 'Chỉnh sửa vai trò',
    ],
    'permissions' => 'Quyền hạn',
    'assign_permissions' => [
        'name' => 'Gán quyền',
        'error' => 'Lỗi gán quyền',
        'error.message' => "Bạn chưa chọn quyền nào."
    ],
    'users' => [
        'admin.name' => 'Danh sách người dùng',
        'name' => 'Người dùng',
        'created' => 'Thêm người dùng',
        'edit' => 'Chỉnh sửa người dùng',
        'profile' => 'Hồ sơ cá nhân',
        'manage' => 'Quản lý người dùng',
        'logout' => 'Đăng xuất'
    ],
    'media' => [
        'name' => 'Đa phương tiện',
        'position' => [
            'name' => 'Vị trí hiển thị',
            'created' => 'Thêm vị trí hiển thị',
            'edit' => 'Chỉnh vị trí hiển thị',
        ],
        'banner' => [
            'name' => 'Hình ảnh'
        ]
    ],
    'report' => [
        'name' => 'Báo Cáo',
        'revenue' => [
            'name' => 'Báo cáo doanh thu',
        ],
        'product' => [
            'name' => 'Báo cáo sản phẩm',
        ],
        'inventory' => [
            'name' => 'Báo cáo kho',
        ],
        'promotion' => [
            'name' => 'Báo cáo khuyến mãi',
        ],
    ],
    'promotion' => [
        'name' => 'Cài đặt khuyến mãi',
        'saleoffer' => [
            'name' => 'Giảm giá',
            'conditions' => 'Điều kiện',
            'apply_scope' => 'Phạm vi áp dụng',
            'apply_scope_hint' => 'Không chọn sản phẩm nào thì chương trình sẽ áp dụng cho tất cả sản phẩm.',
            'options' => [
                'percent' => 'Phần trăm',
                'fixed' => 'Số tiền cố định',
            ],
            'fields' => [
                'discount_type' => 'Loại giảm giá',
                'discount_value' => 'Giá trị giảm giá',
                'max_discount_amount' => 'Giảm tối đa',
                'starts_at' => 'Bắt đầu lúc',
                'ends_at' => 'Kết thúc lúc',
                'priority' => 'Độ ưu tiên',
                'stackable' => 'Cho phép chồng ưu đãi',
                'apply_products' => 'Áp dụng cho sản phẩm',
            ],
        ],
        'coupon' => [
            'name' => 'Mã giảm giá',
            'conditions' => 'Điều kiện',
            'apply_scope' => 'Phạm vi áp dụng',
            'apply_scope_hint' => 'Không chọn danh mục hoặc sản phẩm nào thì mã sẽ áp dụng cho tất cả.',
            'options' => [
                'percent' => 'Phần trăm',
                'fixed' => 'Số tiền cố định',
            ],
            'fields' => [
                'discount_type' => 'Loại giảm giá',
                'discount_value' => 'Giá trị giảm giá',
                'max_discount_amount' => 'Giảm tối đa',
                'min_order_amount' => 'Đơn hàng tối thiểu',
                'max_order_amount' => 'Đơn hàng tối đa',
                'usage_limit_total' => 'Giới hạn sử dụng tổng',
                'usage_limit_per_user' => 'Giới hạn mỗi người dùng',
                'first_order_only' => 'Chỉ áp dụng cho đơn hàng đầu tiên',
                'is_public' => 'Mã công khai',
                'stackable' => 'Cho phép chồng mã',
                'starts_at' => 'Bắt đầu lúc',
                'ends_at' => 'Kết thúc lúc',
                'apply_categories' => 'Áp dụng cho danh mục',
                'apply_products' => 'Áp dụng cho sản phẩm',
            ],
        ],
        'buytogift' => [
            'name' => 'Mua tặng',
            'conditions' => 'Điều kiện',
            'apply_scope' => 'Phạm vi áp dụng',
            'options' => [
                'order_amount' => 'Theo giá trị đơn hàng',
                'buy_product' => 'Mua sản phẩm tặng sản phẩm',
            ],
            'fields' => [
                'condition_type' => 'Loại điều kiện',
                'buy_products' => 'Sản phẩm điều kiện mua',
                'buy_qty' => 'Số lượng mua',
                'gift_products' => 'Sản phẩm quà tặng',
                'gift_qty' => 'Số lượng tặng',
                'min_order_amount' => 'Đơn tối thiểu để nhận quà',
                'max_sets_per_order' => 'Giới hạn số set quà / đơn',
                'starts_at' => 'Bắt đầu lúc',
                'ends_at' => 'Kết thúc lúc',
                'priority' => 'Độ ưu tiên',
                'stackable' => 'Cho phép cộng dồn',
            ],
        ],
    ],
    'sales' => [
        'name' => 'Bán hàng',
        'warehouse' => [
            'name' => 'Quản lý kho',
        ],
        'orders' => [
            'name' => 'Đơn hàng',
        ],
        'payment_methods' => [
            'name' => 'Phương thức thanh toán',
        ],
    ],
    'catalog' => [
        'name' => 'Danh mục',
        'menu_name' => 'Quản lý nội dung',
        'category' => [
            'name' => 'Danh mục',
            'created' => 'Thêm danh mục',
            'edit' => 'Chỉnh sửa danh mục',
            'tree_structure' => 'Cấu trúc cây danh mục',
            'tree_drag' => 'Kéo để sắp xếp',
            'no_data' => 'Chưa có dữ liệu cây danh mục.',
            'select_to_view' => 'Vui lòng chọn một danh mục để xem chi tiết',
            'instruction_text' => 'Nhấp vào các mục bên trái để chỉnh sửa thông tin hoặc cấu hình SEO.',
            'select' => '--- Chọn cấp danh mục gốc ---',
            'type' => [
                'label' => 'Loại danh mục',
                'options' => [
                    'select' => 'Chọn loại',
                    'product' => 'Sản phẩm',
                    'news' => 'Tin tức',
                    'blog' => 'Blog',
                    'page' => 'Trang nội dung',
                    'contact' => 'Liên hệ',
                ],
            ],
        ],
        'product' => [
            'admin.name' => 'Danh sách sản phẩm',
            'name' => 'Sản phẩm',
            'created' => 'Thêm sản phẩm',
            'edit' => 'Chỉnh sửa sản phẩm',
            'ai' => [
                'suggest_content' => 'AI gợi ý nội dung',
                'suggest_seo' => 'AI gợi ý SEO',
                'generating' => 'Đang tạo...',
                'missing_input' => 'Vui lòng nhập ít nhất tên, mô tả hoặc từ khóa trước khi gợi ý.',
                'empty_response' => 'AI chưa trả về nội dung, vui lòng thử lại.',
                'failed' => 'Không thể tạo nội dung AI lúc này. Vui lòng thử lại sau.',
            ],
            'photo_hint' => 'Tải nhiều ảnh cho sản phẩm. Ảnh được chọn mặc định sẽ hiển thị đầu tiên.',
            'upload_photos' => 'Tải lên hình ảnh',
            'add_photos' => 'Thêm ảnh',
            'existing_photos' => 'Ảnh hiện có',
            'new_photos' => 'Ảnh mới',
            'no_photo' => 'Chưa có ảnh nào.',
            'no_new_photo' => 'Chưa có ảnh mới nào.',
            'fields' => [
                'stock_available' => 'Còn hàng',
                'stock_out' => 'Hết hàng',
                'coupon_allowed' => 'Cho phép mã giảm giá',
                'coupon_disallowed' => 'Không cho phép mã giảm giá',
            ],
            'tabs' => [
                'general' => 'Thông tin chung',
                'content' => 'Nội dung',
                'categories' => 'Danh mục',
                'photos' => 'Hình ảnh',
            ],
        ],
        'post' => [
            'admin.name' => 'Danh sách bài viết',
            'name' => 'Bài viết',
            'created' => 'Thêm bài viết',
            'edit' => 'Chỉnh sửa bài viết',
        ]
    ],
    'languages' => [
        'admin.name' => 'Danh sách ngôn ngữ',
        'name' => 'Ngôn ngữ',
        'created' => 'Thêm ngôn ngữ',
        'edit' => 'Chỉnh sửa ngôn ngữ',
    ],
    'label' => [
        'admin.name' => 'Danh sách nhãn',
        'name' => 'Nhãn dịch',
        'created' => 'Thêm nhãn',
        'edit' => 'Chỉnh sửa nhãn',
        'msg_newline' => 'Nhấn "+" để thêm dòng mới...',
        'msg_placeholder' => 'Nhập khóa (VD: welcome_msg)',
        'msg_verify' => 'Vui lòng nhập tên khóa (Key).',
        'confirm_delete_title' => 'Xác nhận xóa nhãn',
        'confirm_delete' => 'Bạn có chắc chắn muốn xóa nhãn này không? Hành động này sẽ xóa dữ liệu ở tất cả ngôn ngữ và không thể hoàn tác sau khi lưu.'
    ],
    'layout' => [
        'admin.name' => 'Cấu hình',
        'name' => 'Giao diện',
        'tabs' => [
            'home' => 'Trang chủ',
            'general' => 'Cài đặt chung',
            'content' => 'Nội dung',
        ],
        'items' => [
            'logo' => 'Logo website',
            'favicon' => 'Biểu tượng (Favicon)',
            'meta_title' => 'Tiêu đề trang (Meta Title)',
            'meta_keyword' => 'Từ khóa SEO (Meta Keyword)',
            'meta_description' => 'Mô tả trang (Meta Description)',
            'company' => 'Tên công ty',
            'phone' => 'Số điện thoại',
            'address' => 'Địa chỉ',
            'tax' => 'Mã số thuế',
            'copyright' => 'Bản quyền',
        ]
    ],
    'tabs' => 'Tab',
    'section' => 'Phần',
    'default' => 'Mặc định',
    'seo' => [
        'name' => 'Tối ưu hóa công cụ tìm kiếm (SEO)',
        'slug' => 'Đường dẫn',
        'character' => 'ký tự',
        'field' => [
            'title' => 'Tiêu đề',
            'keyword' => 'Từ khóa',
            'description' => 'Mô tả',
        ],
        'review' => [
            'title' => 'Xem trước kết quả tìm kiếm Google',
            'description' => 'Nhập mô tả SEO hoặc nhấn nút đồng bộ để xem trước nội dung hiển thị trên Google...',
        ],
        'placeholder' => [
            'description' => 'Mô tả ngắn gọn nội dung trang web...',
        ],
    ],
    'button' => [
        'created' => 'Thêm mới',
        'delete.selected' => 'Xóa mục đã chọn',
        'edit' => 'Chỉnh sửa',
        'delete' => 'Xóa',
        'view' => 'Xem',
        'open' => 'Mở',
        'save' => 'Lưu lại',
        'back' => 'Quay lại',
        'choose_image' => 'Chọn ảnh',
        'new_line' => 'Thêm dòng',
        'confirm' => 'Xác nhận',
        'cancel' => 'Hủy bỏ'
    ],
    'view' => 'Xem',
    'open' => 'Mở',
    'current_tab' => 'Tab hiện tại',
    'ready' => 'Sẵn sàng',
    'needs_attention' => 'Cần chú ý',
    'column' => [
        'name' => 'Tên',
        'slug' => 'Đường dẫn',
        'guard' => 'Cổng bảo vệ',
        'action' => 'Hành động',
        'first_name' => 'Tên',
        'last_name' => 'Họ',
        'status' => 'Trạng thái',
        'sku' => 'SKU',
        'quantity' => 'Số lượng',
        'weight' => 'Khối lượng',
        'price' => 'Giá',
        'order' => 'Sắp xếp',
        'coupon' => 'Mã giảm giá',
        'stock' => 'Tồn kho',
        'password' => 'Mật khẩu',
        'password_confirm' => 'Xác nhận mật khẩu',
        'account_name' => 'Tên tài khoản',
        'assign_group' => 'Gán nhóm',
        'group' => 'Nhóm người dùng',
        'image' => 'Hình ảnh',
        'image_edit' => 'Thay đổi',
        'images' => 'Hình ảnh',
        'categories' => 'Danh mục',
        'email' => 'Email',
        'code' => 'Mã',
        'currency' => 'Tiền tệ',
        'key' => 'Khóa (Key)',
        'content' => 'Nội dung',
        'description' => 'Mô tả ngắn',
        'seo_title' => 'SEO Title',
        'seo_keyword' => 'SEO Keyword',
        'seo_description' => 'SEO Description',
        'default' => 'Mặc định',
        'upload' => 'Tải lên'
    ],
    'placeholder' => [
        'select' => 'Vui lòng chọn...'
    ],
    'filter' => [
        'search' => 'Tìm kiếm...',
        'reset' => 'Làm mới'
    ],
    'title' => [
        'infomation' => 'Thông tin',
        'setting' => 'Cài đặt',
        'success' => 'Thành công',
        'error' => 'Lỗi',
    ],
    'status' => [
        'active' => 'Hoạt động',
        'inactive' => 'Ngừng hoạt động'
    ],
    'message' => [
        'dashboard.welcome' => 'Hệ thống quản trị của bạn đã sẵn sàng. Mọi thứ đã được thiết lập để bạn bắt đầu quản lý dữ liệu và vận hành một cách suôn sẻ.',
        'destroy' => 'Bạn có chắc chắn muốn xóa :name này không?',
        'destroys' => 'Bạn có chắc chắn muốn xóa tất cả các mục đã chọn?',
        'security_notice' => 'Tài khoản của bạn đã được đăng nhập từ một thiết bị khác.',
        'error' => [
            'required' => 'Trường :name là bắt buộc.',
            'password_confirm' => 'Mật khẩu xác nhận không khớp.',
            'created' => 'Lỗi khi thêm mới :name.',
            'edit' => 'Lỗi khi cập nhật :name.',
            'deleted' => 'Không tìm thấy dữ liệu để xóa.'
        ],
        'success' => [
            'created' => 'Thêm :name thành công.',
            'edit' => 'Cập nhật :name thành công.',
            'deleted' => 'Đã xóa :name thành công.',
            'restored' => 'Khôi phục :name thành công.',
        ]
    ],
    'tinymce' => [
        'name' => 'Thư viện ảnh',
        'button' => [
            'upload_image' => 'Tải ảnh lên',
            'create_folder' => 'Tạo thư mục',
            'save' => 'LƯU',
            'cancel' => 'Hủy',
            'close' => 'Đóng cửa sổ'
        ],
        'label' => [
            'folder' => 'thư mục',
            'file' => 'tập tin',
            'new_name' => 'Nhập tên mới:'
        ],
        'message' => [
            'delete' => 'Xóa :name này?.',
            'data_warning' => 'Đang xử lý dữ liệu...',
            'folder_empty' => 'Thư mục trống',
            'error' => [
                'move' => 'Không thể di chuyển file!',
                'create_folder' => 'Lỗi tạo thư mục',
                'delete' => 'Lỗi khi xóa!',
                'rename' => 'Lỗi đổi tên!'
            ]
        ]

    ]
];
