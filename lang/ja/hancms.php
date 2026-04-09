<?php

return [
    'dashboard.main' => 'ダッシュボード',
    'users.main' => 'ユーザー',
    'settings.main' => '設定',
    'sidebar' => [
        'show' => 'サイドバーを表示',
        'hide' => 'サイドバーを非表示',
    ],
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
    'report' => [
        'name' => 'レポート',
        'revenue' => [
            'name' => '売上レポート',
        ],
        'product' => [
            'name' => '商品レポート',
        ],
        'inventory' => [
            'name' => '在庫レポート',
        ],
        'promotion' => [
            'name' => 'プロモーションレポート',
        ],
    ],
    'promotion' => [
        'name' => 'プロモーション設定',
        'saleoffer' => [
            'name' => 'セールオファー',
            'conditions' => '条件',
            'apply_scope' => '適用範囲',
            'apply_scope_hint' => '商品を選択しない場合、このオファーはすべての商品に適用されます。',
            'options' => [
                'percent' => 'パーセント',
                'fixed' => '固定金額',
            ],
            'fields' => [
                'discount_type' => '割引タイプ',
                'discount_value' => '割引値',
                'max_discount_amount' => '最大割引額',
                'starts_at' => '開始日時',
                'ends_at' => '終了日時',
                'priority' => '優先度',
                'stackable' => '併用可',
                'apply_products' => '適用商品',
            ],
        ],
        'coupon' => [
            'name' => 'クーポン',
            'conditions' => '条件',
            'apply_scope' => '適用範囲',
            'apply_scope_hint' => 'カテゴリまたは商品を選択しない場合、このクーポンはすべてに適用されます。',
            'options' => [
                'percent' => 'パーセント',
                'fixed' => '固定金額',
            ],
            'fields' => [
                'discount_type' => '割引タイプ',
                'discount_value' => '割引値',
                'max_discount_amount' => '最大割引額',
                'min_order_amount' => '最低注文金額',
                'max_order_amount' => '最高注文金額',
                'usage_limit_total' => '総利用回数上限',
                'usage_limit_per_user' => 'ユーザーごとの利用上限',
                'first_order_only' => '初回注文のみ',
                'is_public' => '公開クーポン',
                'stackable' => '併用可',
                'starts_at' => '開始日時',
                'ends_at' => '終了日時',
                'apply_categories' => '適用カテゴリ',
                'apply_products' => '適用商品',
            ],
        ],
        'buytogift' => [
            'name' => '購入特典',
            'conditions' => '条件',
            'apply_scope' => '適用範囲',
            'options' => [
                'order_amount' => '注文金額条件',
                'buy_product' => '商品購入で特典付与',
            ],
            'fields' => [
                'condition_type' => '条件タイプ',
                'buy_products' => '購入条件商品',
                'buy_qty' => '購入数量',
                'gift_products' => '特典商品',
                'gift_qty' => '特典数量',
                'min_order_amount' => '特典適用の最低注文金額',
                'max_sets_per_order' => '1注文あたりの特典セット上限',
                'starts_at' => '開始日時',
                'ends_at' => '終了日時',
                'priority' => '優先度',
                'stackable' => '併用可',
            ],
        ],
    ],
    'sales' => [
        'name' => '販売',
        'warehouse' => [
            'name' => '在庫管理',
        ],
        'orders' => [
            'name' => '注文',
        ],
        'payment_methods' => [
            'name' => '支払い方法',
        ],
    ],
    'catalog' => [
        'name' => 'カタログ管理',
        'menu_name' => 'コンテンツ管理',
        'category' => [
            'name' => 'カテゴリー',
            'created' => 'カテゴリーを追加',
            'edit' => 'カテゴリーを編集',
            'tree_structure' => 'カテゴリー樹形図',
            'tree_drag' => 'ドラッグして並び替え',
            'no_data' => 'カテゴリーデータがありません。',
            'select_to_view' => '詳細を表示するにはカテゴリーを選択してください',
            'instruction_text' => '左側の項目をクリックして情報を編集するか、SEOを設定してください。',
            'select' => '--- ルートカテゴリーを選択 ---',
            'type' => [
                'label' => 'カテゴリータイプ',
                'options' => [
                    'select' => 'タイプを選択',
                    'product' => '商品',
                    'news' => 'ニュース',
                    'blog' => 'ブログ',
                    'page' => 'ページ',
                    'contact' => 'お問い合わせ',
                ],
            ],
        ],
        'product' => [
            'admin.name' => '商品一覧',
            'name' => '商品',
            'created' => '商品を追加',
            'edit' => '商品を編集',
            'ai' => [
                'suggest_content' => 'AIで内容提案',
                'suggest_seo' => 'AIでSEO提案',
                'generating' => '生成中...',
                'missing_input' => '生成前に商品名・説明・キーワードのいずれかを入力してください。',
                'empty_response' => 'AIが内容を返しませんでした。もう一度お試しください。',
                'failed' => '現在AIコンテンツを生成できません。しばらくしてから再試行してください。',
            ],
            'photo_hint' => '商品に複数の写真をアップロードできます。デフォルト写真が最初に表示されます。',
            'upload_photos' => '画像をアップロード',
            'add_photos' => '写真を追加',
            'existing_photos' => '既存の写真',
            'new_photos' => '新しい写真',
            'no_photo' => '写真がまだありません。',
            'no_new_photo' => '新しい写真がまだありません。',
            'fields' => [
                'stock_available' => '在庫あり',
                'stock_out' => '在庫切れ',
                'coupon_allowed' => 'クーポン利用可',
                'coupon_disallowed' => 'クーポン利用不可',
            ],
            'tabs' => [
                'general' => '基本情報',
                'content' => '内容',
                'categories' => 'カテゴリー',
                'photos' => '画像',
            ],
        ],
        'post' => [
            'admin.name' => '記事一覧',
            'name' => '記事',
            'created' => '記事を追加',
            'edit' => '記事を編集',
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
    'tabs' => 'タブ',
    'section' => 'セクション',
    'default' => 'デフォルト',
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
        'open' => '開く',
        'save' => '保存',
        'back' => '戻る',
        'choose_image' => '画像を選択',
        'new_line' => '行追加',
        'confirm' => '確認',
        'cancel' => 'キャンセル'
    ],
    'view' => '詳細',
    'open' => '開く',
    'current_tab' => '現在のタブ',
    'ready' => '準備完了',
    'needs_attention' => '要確認',
    'column' => [
        'name' => '名前',
        'slug' => 'ナメクジ',
        'guard' => 'ガード',
        'action' => '操作',
        'first_name' => '名',
        'last_name' => '姓',
        'status' => 'ステータス',
        'sku' => 'SKU',
        'quantity' => '数量',
        'weight' => '重さ',
        'price' => '価格',
        'order' => '並び順',
        'coupon' => 'クーポン',
        'stock' => '在庫',
        'password' => 'パスワード',
        'password_confirm' => 'パスワード(確認)',
        'account_name' => 'アカウント名',
        'assign_group' => 'グループ割り当て',
        'group' => 'ユーザーグループ',
        'image' => '画像',
        'image_edit' => '変更',
        'images' => '画像',
        'categories' => 'カテゴリー',
        'email' => 'メールアドレス',
        'code' => 'コード',
        'currency' => '通貨',
        'key' => 'キー',
        'content' => 'コンテンツ',
        'description' => '短い説明',
        'seo_title' => 'SEOタイトル',
        'seo_keyword' => 'SEOキーワード',
        'seo_description' => 'SEO説明文',
        'default' => 'デフォルト',
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
