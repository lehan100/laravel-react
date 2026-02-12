<?php

return [
    'dashboard.main' => 'Bảng điều khiển',
    'users.main' => 'Người dùng',
    'settings.main' => 'Cài đặt',
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
        'admin.name' => 'Cấu hình website',
        'name' => 'Giao diện',
        'tabs' => [
            'home'    => 'Trang chủ',
            'general' => 'Cài đặt chung',
        ],
        'items' => [
            'logo' => 'Logo website',
            'favicon' => 'Biểu tượng (Favicon)',
            'meta_title' => 'Tiêu đề trang (Meta Title)',
            'meta_keyword' => 'Từ khóa SEO (Meta Keyword)',
            'meta_description' => 'Mô tả trang (Meta Description)',
            'company'   => 'Tên công ty',
            'phone'     => 'Số điện thoại',
            'address'   => 'Địa chỉ',
            'tax'       => 'Mã số thuế',
            'copyright' => 'Bản quyền',
        ]
    ],
    'button' => [
        'created' => 'Thêm mới',
        'delete.selected' => 'Xóa mục đã chọn',
        'edit' => 'Chỉnh sửa',
        'delete' => 'Xóa',
        'view' => 'Xem',
        'save' => 'Lưu lại',
        'back' => 'Quay lại',
        'choose_image' => 'Chọn ảnh',
        'new_line' => 'Thêm dòng',
        'confirm' => 'Xác nhận',
        'cancel' => 'Hủy bỏ'
    ],
    'column' => [
        'name' => 'Tên',
        'guard' => 'Cổng bảo vệ', // Hoặc giữ nguyên 'Guard' nếu dùng Spatie
        'action' => 'Hành động',
        'first_name' => 'Tên',
        'last_name' => 'Họ',
        'status' => 'Trạng thái',
        'password' => 'Mật khẩu',
        'password_confirm' => 'Xác nhận mật khẩu',
        'account_name' => 'Tên tài khoản',
        'assign_group' => 'Gán nhóm',
        'group' => 'Nhóm người dùng',
        'image' => 'Hình ảnh',
        'email' => 'Email',
        'code' => 'Mã',
        'key' => 'Khóa (Key)'
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
    ]
];
