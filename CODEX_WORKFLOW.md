# Codex Workflow

## Mục tiêu

File này là workflow làm việc chuẩn cho thành viên mới hoặc một tài khoản Codex khác khi vào project `/home/lehan100/laravel-react`.

Mục tiêu là để có thể đọc và bắt đầu làm việc ngay, không cần mô tả lại project.

## Snapshot kỹ thuật của project

- Backend: Laravel 13
- PHP: 8.4+ / app hiện đang chạy PHP 8.5 trong môi trường Boost
- Frontend: Inertia Laravel v2 + React 18
- Styling: TailwindCSS v3
- Auth packages: Fortify + Sanctum
- AI package: `laravel/ai`
- Route typing package: `laravel/wayfinder`
- Dev tools: Laravel Boost, Laravel Sail, Laravel Pint, PHPUnit

Mọi lệnh PHP, Artisan, Composer, Node trong project này phải chạy qua Sail.

## 1. Hiểu kiến trúc project

Project này không phải kiểu Laravel thuần controller-model đơn giản. Luồng chính đang theo pattern:

`Route -> Controller -> FormRequest -> Repository -> Model/Observer/Resource -> Inertia Page React`

### Cấu trúc backend chính

- `routes/web.php`
  - Khai báo toàn bộ route web/admin.
  - Admin dùng prefix từ `config('configs.prefix.admin', 'admin')`.
  - Nhiều module admin đang được map bằng `Route::resource(...)`.

- `app/Http/Controllers/Admin/*`
  - Controller admin chủ yếu mỏng.
  - Nhận request, gọi repository theo `task`, render Inertia page, redirect kèm flash message.

- `app/Http/Requests/*`
  - Chứa validation.
  - Nên thêm rule ở đây trước khi nghĩ đến việc validate trong controller.

- `app/Repositories/*`
  - Đây là nơi chứa phần lớn CRUD flow và business logic hiện tại của project.
  - Nhiều repository dùng pattern `save($params, ['task' => '...'])`, `get(...)`, `lists(...)`, `delete(...)`.

- `app/Models/*`
  - Model chia theo domain như `Catalog`, `Media`, `Promotion`, `Sales`, `Users`.

- `app/Observers/*`
  - Observer được đăng ký trong `AppServiceProvider`.
  - Cần kiểm tra observer trước khi sửa logic lưu model vì có side effect.

- `app/Http/Resources/*`
  - Dùng để map dữ liệu trả về cho Inertia hoặc JSON.

- `app/Providers/AppServiceProvider.php`
  - Bind repository interface -> implementation.
  - Đăng ký observer.
  - Có rate limiter và một số cấu hình boot quan trọng.

- `app/Http/Middleware/HandleInertiaRequests.php`
  - Chứa shared props toàn cục cho Inertia:
    - `auth.user`
    - `auth.permissions`
    - `flash.success/error/message`
    - `langs`
    - `locale`

### Cấu trúc frontend chính

- `resources/js/app.tsx`
  - Entry point của Inertia React app.

- `resources/js/Pages/*`
  - Inertia pages.
  - Admin pages nằm trong `resources/js/Pages/Admin/*`.

- `resources/js/Components/*`
  - Component dùng lại.
  - Trước khi tạo component mới, phải kiểm tra ở đây trước.

- `resources/js/Layouts/MainLayout.tsx`
  - Layout chính cho admin pages.

- `resources/js/Hooks/*`
  - Hook dùng chung như `useTrans`, `usePermission`.

### Cấu trúc test

- `tests/Feature/*`
  - Hiện project đang có test PHPUnit theo kiểu feature-focused.
  - Không dùng Pest.

## 2. Cách đọc code khi nhận task mới

Khi nhận một task, không sửa ngay. Đi theo đúng thứ tự này:

1. Xác định entry point.
   - Nếu task đến từ UI admin, tìm route trong `routes/web.php`.
   - Nếu task đến từ form/page, tìm page trong `resources/js/Pages/Admin/...`.

2. Đọc controller tương ứng.
   - Xem controller render page nào.
   - Xem action đang gọi repository nào.
   - Xem flash message, redirect, middleware và share data nếu có.

3. Đọc `FormRequest` nếu action có validate.
   - Kiểm tra rules, `prepareForValidation()`, `attributes()`.

4. Đọc repository tương ứng.
   - Xem `task` nào đang xử lý case của bạn.
   - Kiểm tra transaction, relation sync, ảnh, slug, pipeline, observer side effects.

5. Đọc model/resource/observer liên quan.
   - Đặc biệt khi task liên quan save/update/delete.

6. Đọc page React và component form/table liên quan.
   - Kiểm tra `useForm`, `router`, errors, flash, permission, translation.

7. Tìm test cũ liên quan.
   - Dùng `rg` trong `tests/Feature`.
   - Ưu tiên bám style test hiện có thay vì tự nghĩ style mới.

## 3. Quy trình sửa code đúng với project này

### Nguyên tắc chung

- Không thay đổi dependency nếu chưa được duyệt.
- Không tạo base folder mới nếu chưa được duyệt.
- Không tạo file documentation mới trừ khi được yêu cầu.
- Phải giữ consistency với file cùng domain đang tồn tại.

### Khi sửa backend

1. Nếu là input/form, thêm hoặc sửa validation ở `FormRequest`.
2. Giữ controller mỏng.
3. Nếu module đó đang dùng repository pattern, tiếp tục sửa trong repository thay vì nhét logic mới vào controller.
4. Nếu thêm repository mới:
   - tạo interface + implementation
   - bind trong `AppServiceProvider`
5. Nếu save model có side effect:
   - kiểm tra observer trong `AppServiceProvider`
6. Nếu trả dữ liệu cho page:
   - ưu tiên dùng Resource/Collection nếu module đang dùng pattern này.

### Khi sửa frontend

1. Tìm page đúng trong `resources/js/Pages/Admin/...`.
2. Kiểm tra component chung trong `resources/js/Components/*` trước khi viết mới.
3. Nếu là form Inertia:
   - bám pattern `useForm`
   - hiển thị server-side validation errors
   - giữ flash/error flow hoạt động
4. Nếu frontend gọi backend route/controller:
   - theo guideline project, phải ưu tiên Wayfinder cho route typed integration khi phù hợp
5. Nếu sửa UI với Tailwind:
   - bám utility pattern sẵn có trong app
   - không đổi ngôn ngữ thiết kế toàn page nếu không được yêu cầu

## 4. Quy trình làm việc chuẩn với Sail

### Khởi động môi trường

```bash
vendor/bin/sail up -d
```

### Xem danh sách lệnh Sail

```bash
vendor/bin/sail
```

### Chạy Artisan

```bash
vendor/bin/sail artisan list
```

Ví dụ:

```bash
vendor/bin/sail artisan route:list
vendor/bin/sail artisan migrate
vendor/bin/sail artisan config:show app.name
```

### Chạy Composer

```bash
vendor/bin/sail composer install
```

### Chạy frontend dev server

```bash
vendor/bin/sail npm run dev
```

### Build frontend

```bash
vendor/bin/sail npm run build
```

Không chạy `npm run grod` hoặc `vendor/bin/sail npm run grod` trong project này.

Nếu user không thấy thay đổi ngoài UI, nguyên nhân phổ biến là chưa chạy `npm run dev` hoặc `npm run build`.

## 5. Chạy test đúng cách bằng Sail

Project này dùng PHPUnit. Mọi thay đổi đều phải được test bằng code.

### Chạy toàn bộ test

```bash
vendor/bin/sail artisan test --compact
```

### Chạy một file test

```bash
vendor/bin/sail artisan test --compact tests/Feature/ProductTest.php
```

### Chạy theo tên test

```bash
vendor/bin/sail artisan test --compact --filter=it_can_create_category_with_japanese_slug
```

### Rule khi viết test

- Ưu tiên `Feature` test.
- Dùng PHPUnit class, không dùng Pest.
- Nếu sửa một feature, phải thêm hoặc cập nhật test liên quan rồi chạy đúng test đó.
- Sau khi test liên quan pass, có thể hỏi có cần chạy full suite hay không.

## 6. Format code bằng Pint

Nếu có sửa file PHP, phải chạy Pint trước khi chốt task.

### Lệnh chuẩn của project

```bash
vendor/bin/sail bin pint --dirty --format agent
```

### Nếu cần format rộng hơn

```bash
vendor/bin/sail bin pint --format agent
```

Không dùng `--test`. Project này muốn Pint tự sửa format.

## 7. Cách dùng Laravel Boost trong project này

Laravel Boost là tool ưu tiên để đọc context project.

### Luồng nên dùng

1. Dùng `application_info`
   - lấy version Laravel/PHP/package thật đang chạy

2. Dùng `search_docs` trước khi sửa code
   - luôn tìm docs đúng version project
   - scope theo package khi biết rõ package liên quan

3. Dùng `database-schema`
   - xem schema trước khi viết migration, query, model logic

4. Dùng `database-query`
   - query read-only thay vì tự dựng script linh tinh

5. Dùng `browser-logs`
   - debug lỗi frontend/browser

6. Dùng `last_error` / `read_log_entries`
   - debug lỗi backend

7. Dùng `get_absolute_url`
   - nếu cần chia sẻ URL chuẩn của app

### Nguyên tắc

- Ưu tiên Boost tool hơn đọc mò hoặc đoán.
- Luôn `search_docs` trước khi code.
- Với task Laravel ecosystem, docs từ Boost là nguồn chuẩn đầu tiên.

## 8. Cách dùng Codex trong project này

### Rule vận hành

- Trước khi làm việc lớn, phải đọc code trước.
- Dùng `rg` để tìm text/file.
- Không được tự ý revert thay đổi có sẵn trong worktree nếu không phải thay đổi của mình.
- Chỉ chạm vào phạm vi file liên quan task.
- Mọi lệnh PHP/Composer/Node phải đi qua Sail.

### Skills phải kích hoạt đúng lúc

Theo `AGENTS.md`, khi làm việc theo domain phải dùng đúng skill:

- `laravel-best-practices`
  - cho mọi backend PHP Laravel

- `inertia-react-development`
  - khi sửa page/form/navigation React với Inertia

- `wayfinder-development`
  - khi frontend gọi route/controller backend

- `fortify-development`
  - khi sửa auth, login, register, reset password, verify email, 2FA

- `tailwindcss-development`
  - khi sửa UI có Tailwind

- `ai-sdk-development`
  - khi sửa phần AI dùng `laravel/ai`

### Cách tiếp cận một task bằng Codex

1. Xác định domain.
2. Kích hoạt skill phù hợp.
3. Dùng Boost `search_docs`.
4. Đọc route/controller/request/repository/page liên quan.
5. Sửa ở layer đúng.
6. Viết/cập nhật test.
7. Chạy test qua Sail.
8. Chạy Pint nếu có PHP.
9. Tổng hợp kết quả và blocker rõ ràng.

## 9. Convention hiện có cần bám

### Backend

- Controller admin thường có:
  - `$controllerView`
  - `$routeName`
  - `$mainModel`
- Repository thường dùng `task` string để phân nhánh hành vi.
- `AppServiceProvider` đang bind repository interface theo từng domain.
- Observer đang được dùng cho:
  - category
  - product/photo
  - post
  - media banner
  - promotion modules

### Frontend

- Admin pages nằm dưới `resources/js/Pages/Admin/...`
- Dùng `MainLayout`
- Form thường dùng:
  - `HeaderToolbar`
  - `Card`
  - `SaveButton`
  - `BackButton`
  - các component trong `Components/Form/*`
- Translation thường đi qua `useTrans()`
- Permission thường đi qua shared props hoặc `usePermission()`

### Testing

- Test đang nghiêng về:
  - gọi repository trực tiếp cho business flow
  - validate payload bằng `Validator::make(...)` cho request rules
  - dùng `RefreshDatabase` hoặc `DatabaseMigrations` tùy file hiện có

Khi thêm test mới, nên nhìn file test gần nhất trong cùng domain rồi bám theo.

## 10. Checklist hoàn tất task

Trước khi kết thúc, phải tự check hết các mục dưới đây:

- Đã xác định đúng route/page entry point
- Đã đọc controller liên quan
- Đã đọc request validation liên quan
- Đã đọc repository tương ứng
- Đã kiểm tra model/resource/observer nếu có side effect
- Đã kiểm tra component frontend sẵn có để tái sử dụng
- Đã dùng `search_docs` trước khi sửa
- Đã sửa đúng layer, không nhét logic sai chỗ
- Đã thêm hoặc cập nhật test
- Đã chạy test tối thiểu liên quan bằng Sail
- Đã chạy Pint nếu có sửa PHP
- Đã lưu ý nếu cần `npm run dev` hoặc `npm run build`
- Đã nêu rõ blocker nếu Docker/Sail/test không chạy được

## 11. Lệnh thao tác nhanh

### Start app

```bash
vendor/bin/sail up -d
```

### Dev frontend

```bash
vendor/bin/sail npm run dev
```

### Build frontend

```bash
vendor/bin/sail npm run build
```

Không chạy:

```bash
vendor/bin/sail npm run grod
```

### Route list

```bash
vendor/bin/sail artisan route:list
```

### Run one test file

```bash
vendor/bin/sail artisan test --compact tests/Feature/ProductTest.php
```

### Run filtered test

```bash
vendor/bin/sail artisan test --compact --filter=it_accepts_a_valid_momo_payment_method_payload
```

### Format PHP

```bash
vendor/bin/sail bin pint --dirty --format agent
```

## 12. Gợi ý file nên đọc đầu tiên khi mới vào project

Theo thứ tự:

1. `AGENTS.md`
2. `routes/web.php`
3. `app/Providers/AppServiceProvider.php`
4. `app/Http/Middleware/HandleInertiaRequests.php`
5. Một controller admin đại diện như `app/Http/Controllers/Admin/Catalog/ProductController.php`
6. Một request như `app/Http/Requests/Catalog/ProductRequest.php`
7. Một repository như `app/Repositories/Product/ProductEloquentRepository.php`
8. Một page React như `resources/js/Pages/Admin/Product/Edit.tsx`
9. Một test như `tests/Feature/ProductTest.php`

Đọc xong 9 file này là đủ để hiểu nhịp làm việc chính của project.
