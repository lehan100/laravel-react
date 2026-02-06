<?php

return [
    'dashboard.main' => 'Trang tổng quan',
    'users.main' => 'Thành viên',
    'settings.main' => 'Cài đặt',
    'roles' => [
        'name' => 'Phân quyền',
        'created' => 'Tạo phân quyền',
        'edit' => 'Chỉnh sửa phân quyền'
    ],
    'permissions' => 'Danh sách quyền',
    'assign_permissions' => [
        'name' => 'Gán quyền',
        'error' => 'Lỗi gán quyền!',
        'error.message' => "Chưa có quyền nào được chọn."
    ],
    'users' => [
        'admin.name' => 'Quản lý thành viên',
        'name' => 'Thành viên',
        'created' => 'Thêm thành viên',
        'edit' => 'Chỉnh sửa thành viên',
        'profile'=>'Hồ sơ của tôi',
        'manage'=>'Quản lý người dùng',
        'logout'=>'Đăng xuất'
    ],
    'languages' => [
        'admin.name' => 'Ngôn ngữ',
        'name' => 'Ngôn ngữ',
        'created' => 'Thêm ngôn ngữ',
        'edit' => 'Chỉnh sửa ngôn ngữ',
    ],
    'label' => [
        'admin.name' => 'Danh sách nhãn',
        'name' => 'Nhãn',
        'created' => 'Thêm nhãn',
        'edit' => 'Chỉnh sửa nhãn',
    ],
    'button' => [
        'created' => 'Thêm mới',
        'delete.selected' => 'Xóa các mục đã chọn',
        'edit' => 'Sửa',
        'delete' => 'Xóa',
        'view' => 'Xem',
        'save' => 'Lưu',
        'back' => 'Quay về',
        'choose_image' => 'Chọn ảnh'
    ],
    'column' => [
        'name' => 'Tên',
        'guard' => 'Trình xác thực',
        'action' => 'Hành động',
        'first_name' => 'Họ lót',
        'last_name' => 'Tên',
        'status' => 'Trạng thái',
        'password' => 'Mật khẩu',
        'password_confirm' => 'Nhập lại mật khẩu',
        'account_name' => 'Họ và tên',
        'assign_group' => 'Gán quyền',
        'group' => 'Nhóm quyền',
        'image' => 'Hình ảnh',
        'email' => 'Email',
        'code' => 'Code',
        'key'=>'Định danh'
    ],
    'filter'=>[
        'search'=>'Tìm kiếm...',
        'reset'=>'Tạo lại'
    ],
    'title' => [
        'infomation' => 'Thông tin',
        'setting' => 'Cài đặt cấu hình'
    ],
    'status' => [
        'active' => 'Kích hoạt',
        'inactive' => 'Chưa kích hoạt'
    ],
    'message' => [
        'dashboard.welcome' => 'Chào mừng bạn đến với Admin CMS!. Hệ thống quản trị của bạn đã sẵn sàng.',
        'destroy' => 'Bạn có chắc chắn muốn xóa :name này không?',
        'destroys' => 'Bạn có chắc chắn muốn xóa tất cả các mục đã chọn không?',
         'security_notice'=>'Tài khoản của bạn đã được đăng nhập từ một thiết bị khác.',
        'error' => [
            'required' => ':name không được để trống.',
            'password_confirm' => 'Mật khẩu không trùng khớp',
            'created' => ':name tạo thất bại.',
            'edit' => ':name chỉnh sửa thất bại.',
            'deleted'=>'Không tìm thấy thông tin để xóa'
        ],
        'success' => [
            'created' => ':name đã được tạo thành công.',
            'edit' => ':name đã được chỉnh sửa thành công.',
            'deleted' => ':name đã được xóa thành công.',
            'restored' => ':name đã phục hồi thành công.',
        ]

    ]
];
