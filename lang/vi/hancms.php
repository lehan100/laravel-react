<?php

return [
    'dashboard.main' => 'Trang tổng quan',
    'users.main' => 'Thành viên',
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
    ],
    'button' => [
        'created' => 'Thêm mới',
        'delete.selected' => 'Xóa các mục đã chọn',
        'edit' => 'Sửa',
        'delete' => 'Xóa',
        'view' => 'Xem',
        'save' => 'Lưu',
        'back' => 'Quay về'
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
        'assign_group' => 'Gán quyền'
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
        'error' => [
            'required' => ':name không được để trống.',
            'password_confirm'=>'Mật khẩu không trùng khớp'
        ]
    ]
];
