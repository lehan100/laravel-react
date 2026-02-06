<?php

return [

    'dashboard.main' => 'ダッシュボード',
    'users.main' => 'ユーザー',
    'settings.main' => '設定',
    'roles' => [
        'name' => '役割',
        'created' => '役割の作成',
        'edit' => '役割の編集',
    ],
    'permissions' => '権限',
    'assign_permissions' => [
        'name' => '権限の割り当て',
        'error' => '権限割り当てエラー',
        'error.message' => "権限が選択されていません。"
    ],
    'users' => [
        'admin.name' => 'ユーザー一覧',
        'name' => 'ユーザー',
        'created' => 'ユーザーの作成',
        'edit' => 'ユーザーの編集',
        'profile'=>'私のプロフィール',
        'manage'=>'ユーザーの管理',
        'logout'=>'ログアウト'
    ],
    'languages' => [
        'admin.name' => '言語一覧',
        'name' => '言語',
        'created' => '言語の作成',
        'edit' => '言語の編集',
    ],
    'label' => [
        'admin.name' => 'リストラベル',
        'name' => 'ラベル',
        'created' => '作成したラベル',
        'edit' => 'ラベルを編集する',
    ],
    'button' => [
        'created' => '新規追加',
        'delete.selected' => '選択した項目を削除',
        'edit' => '編集',
        'delete' => '削除',
        'view' => '詳細表示',
        'save' => '保存',
        'back' => '戻る',
        'choose_image' => '画像を選択'
    ],
    'column' => [
        'name' => '名前',
        'guard' => 'ガード',
        'action' => '操作',
        'first_name' => '名',
        'last_name' => '姓',
        'status' => 'ステータス',
        'password' => 'パスワード',
        'password_confirm' => 'パスワード（確認）',
        'account_name' => 'アカウント名',
        'assign_group' => 'グループ割り当て',
        'group' => 'ユーザーグループ',
        'image' => '画像',
        'email' => '電子メール',
        'code' => 'コード',
        'key' => '鍵'
    ],
    'title' => [
        'infomation' => '情報',
        'setting' => '設定'
    ],
     'filter'=>[
        'search'=>'検索...',
        'reset'=>'リセット'
    ],
    'status' => [
        'active' => '有効',
        'inactive' => '無効'
    ],
    'message' => [
        'dashboard.welcome' => '管理システムの準備が整いました。データ管理と運用をスムーズに開始できるよう、すべてセットアップされています。',
        'destroy' => 'この :name を削除してもよろしいですか？',
        'destroys' => '選択したすべての項目を削除してもよろしいですか？',
         'security_notice'=>'別の端末でログインされています。',
        'error' => [
            'required' => ':name は必須項目です。',
            'password_confirm' => 'パスワードが一致しません。',
            'created' => ':name 作成エラー。',
            'edit' => ':name 編集エラー。',
            'deleted' => '削除するデータが見つかりません。'
        ],
        'success' => [
            'created' => ':name が正常に編集されました',
            'edit' => ':name が正常に編集されました',
            'deleted' => ':name は正常に削除されました',
            'restored' => ':name が正常に復元されました。',
        ]

    ]
];
