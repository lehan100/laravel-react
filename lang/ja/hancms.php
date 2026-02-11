<?php

return [
    'dashboard.main' => 'ダッシュボード',
    'users.main' => 'ユーザー',
    'settings.main' => '設定',
    'roles' => [
        'name' => 'ロール',
        'created' => 'ロール作成',
        'edit' => 'ロール編集',
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
        'created' => 'ユーザー作成',
        'edit' => 'ユーザー編集',
        'profile' => 'プロフィール',
        'manage' => 'ユーザー管理',
        'logout' => 'ログアウト'
    ],
    'languages' => [
        'admin.name' => '言語一覧',
        'name' => '言語',
        'created' => '言語作成',
        'edit' => '言語編集',
    ],
    'label' => [
        'admin.name' => 'ラベル一覧',
        'name' => 'ラベル',
        'created' => 'ラベル作成',
        'edit' => 'ラベル編集',
        'msg_newline' => '「+」をクリックして行を追加...',
        'msg_placeholder' => 'キーを入力（例：welcome_msg）',
        'msg_verify' => 'キーを入力してください。',
        'confirm_delete_title' => '削除の確認',
        'confirm_delete' => 'このラベルを削除してもよろしいですか？この操作を行うとすべての言語のデータが削除され、保存後は元に戻すことはできません。'
    ],
    'layout' => [
        'admin.name' => 'レイアウト設定',
        'name' => 'レイアウト',
        'tabs' => [
            'home'    => 'ホーム',       // Hōmu
            'general' => '全般設定',     // Zenpan Settei (Cấu hình tổng quát)
        ],
        'items' => [
            'logo' => 'システムロゴ',
            'favicon' => 'ファビコン',
            'meta_title' => 'メタタイトル',
            'meta_keyword' => 'メタキーワード',
            'meta_description' => 'メタディスクリプション',
            'company'   => '会社名',
            'phone'     => '電話番号',
            'address'   => '住所',
            'tax'       => '登録番号',
            'copyright' => '著作権',
        ]
    ],
    'button' => [
        'created' => '新規作成',
        'delete.selected' => '選択項目を削除',
        'edit' => '編集',
        'delete' => '削除',
        'view' => '詳細',
        'save' => '保存',
        'back' => '戻る',
        'choose_image' => '画像を選択',
        'new_line' => '行追加',
        'confirm' => '確認',
        'cancel' => 'キャンセル'
    ],
    'column' => [
        'name' => '名前',
        'guard' => 'ガード',
        'action' => '操作',
        'first_name' => '名',
        'last_name' => '姓',
        'status' => 'ステータス',
        'password' => 'パスワード',
        'password_confirm' => 'パスワード(確認)',
        'account_name' => 'アカウント名',
        'assign_group' => 'グループ割り当て',
        'group' => 'ユーザーグループ',
        'image' => '画像',
        'email' => 'メールアドレス',
        'code' => 'コード',
        'key' => 'キー'
    ],
    'title' => [
        'infomation' => '情報',
        'setting' => '設定',
        'success' => '成功',
        'error' => 'エラー',
    ],
    'filter' => [
        'search' => '検索...',
        'reset' => 'リセット',
    ],
    'status' => [
        'active' => '有効',
        'inactive' => '無効'
    ],
    'message' => [
        'dashboard.welcome' => '管理システムの準備が整いました。データの管理と運用をスムーズに開始できます。',
        'destroy' => ':name を削除してもよろしいですか？',
        'destroys' => '選択したすべての項目を削除してもよろしいですか？',
        'security_notice' => '別の端末でログインされています。',
        'error' => [
            'required' => ':name は必須項目です。',
            'password_confirm' => 'パスワードが一致しません。',
            'created' => ':name の作成に失敗しました。',
            'edit' => ':name の編集に失敗しました。',
            'deleted' => '削除するデータが見つかりません。'
        ],
        'success' => [
            'created' => ':name を作成しました。',
            'edit' => ':name を更新しました。',
            'deleted' => ':name を削除しました。',
            'restored' => ':name を復元しました。',
        ]
    ]
];
