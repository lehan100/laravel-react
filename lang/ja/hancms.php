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
    'media' => [
        'name' => 'メディア',
        'position' => [
            'name' => '掲載位置',
            'created' => '役職作成',
            'edit' => '役職編集',
        ],
        'banner' => [
            'name' => 'バナー'
        ]
    ],
    'catalog' => [
        'name' => 'カタログ管理',
        'category' => [
            'name' => 'カテゴリー',
            'created' => 'カテゴリーを追加',
            'edit' => 'カテゴリーを編集',
            'tree_structure' => 'カテゴリー樹形図',
            'no_data' => 'カテゴリーデータがありません。',
            'select_to_view' => '詳細を表示するにはカテゴリーを選択してください',
            'instruction_text' => '左側の項目をクリックして情報を編集するか、SEOを設定してください。',
            'select' => '--- ルートカテゴリーを選択 ---'
        ],
        'product' => [
            'name' => '商品管理'
        ]
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
        'admin.name' => 'レイアウト管理',
        'name' => 'レイアウト',
        'tabs' => [
            'home' => 'ホーム',
            'general' => '基本設定',
            'content' => 'コンテンツ'
        ],
        'items' => [
            'logo' => 'システムロゴ',
            'favicon' => 'ファビコン',
            'meta_title' => 'メタタイトル',
            'meta_keyword' => 'メタキーワード',
            'meta_description' => 'メタディスクリプション',
            'company' => '会社名',
            'phone' => '電話番号',
            'address' => '住所',
            'tax' => '登録番号 / 登録番号',
            'copyright' => 'コピーライト / 著作権',
        ]
    ],
    'seo' => [
        'name' => '検索エンジン最適化 (SEO)',
        'slug' => 'スラッグ / URL',
        'character' => '文字',
        'field' => [
            'title' => 'SEOタイトル',
            'keyword' => 'SEOキーワード',
            'description' => 'SEO説明文',
        ],
        'review' => [
            'title' => 'Google検索結果のプレビュー',
            'description' => 'SEO説明を入力するか、同期ボタンをクリックしてGoogleでの表示を確認してください...',
        ],
        'placeholder' => [
            'description' => 'ウェブサイトの内容を簡潔に説明してください...',
        ],
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
        'slug' => 'ナメクジ',
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
        'image_edit' => '変更',
        'email' => 'メールアドレス',
        'code' => 'コード',
        'key' => 'キー',
        'content' => 'コンテンツ',
        'upload' => 'アップロード'
    ],
    'placeholder' => [
        'select' => '選択してください...'
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
    ],
    'tinymce' => [
        'name' => '画像ライブラリ',
        'button' => [
            'upload_image' => '画像をアップロード',
            'create_folder' => 'フォルダ作成',
            'save' => '保存',
            'cancel' => 'キャンセル',
            'close' => '閉じる'
        ],
        'label' => [
            'folder' => 'フォルダ',
            'file' => 'ファイル',
            'new_name' => '新しい名前を入力:'
        ],
        'message' => [
            'delete' => 'この :name を削除しますか？',
            'data_warning' => 'データを処理中...',
            'folder_empty' => 'フォルダは空です',
            'error' => [
                'move' => 'ファイルを移動できません！',
                'create_folder' => 'フォルダ作成エラー',
                'delete' => '削除エラー！',
                'rename' => '名前変更エラー！'
            ]
        ]
    ]
];
