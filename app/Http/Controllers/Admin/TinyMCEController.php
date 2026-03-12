<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TinyMCEController extends Controller
{
    public function uploadTinyMCE(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:2048',
            'path' => 'nullable|string'
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $request->path ?: '';

            $fileName = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '-' . time() . '.' . $file->getClientOriginalExtension();

            // Lưu vào disk media_root (đã trỏ sẵn vào public/media/editor)
            $savePath = Storage::disk('media_root')->putFileAs($path, $file, $fileName);

            return response()->json([
                // SỬA: Chỉ cần asset('media/editor/...') vì savePath bắt đầu từ sau thư mục editor
                'location' => '/media/editor/' . $savePath
            ]);
        }
        return response()->json(['error' => 'Upload failed'], 500);
    }

    public function getImages(Request $request)
    {
        $path = $request->query('path', '');
        $disk = Storage::disk('media_root');

        if (!$disk->exists($path)) {
            $disk->makeDirectory($path);
        }

        $items = [];

        $directories = $disk->directories($path);
        foreach ($directories as $dir) {
            $fileCount = count($disk->files($dir));
            $items[] = [
                'name' => basename($dir),
                'type' => 'folder',
                'path' => $dir,
                'info' => [
                    'count' => $fileCount
                ]
            ];
        }

        $files = $disk->files($path);
        foreach ($files as $file) {
            $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])) {
                $fullPath = $disk->path($file);
                $dimensions = @getimagesize($fullPath);
                $size = $disk->size($file);

                $items[] = [
                    'name' => basename($file),
                    'type' => 'file',
                    // SỬA: URL chuẩn phải nối từ thư mục media/editor
                    'url'  => '/media/editor/' . $file,
                    'path' => $file,
                    'info' => [
                        'width'  => $dimensions[0] ?? 0,
                        'height' => $dimensions[1] ?? 0,
                        'size'   => $size > 1048576
                            ? round($size / 1048576, 2) . ' MB'
                            : round($size / 1024, 2) . ' KB'
                    ]
                ];
            }
        }

        return response()->json($items);
    }

    public function createFolder(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'path' => 'nullable|string'
        ]);

        $folderName = Str::slug($request->name);
        $basePath = $request->path ?: '';
        $fullPath = trim($basePath . '/' . $folderName, '/');

        try {
            if (Storage::disk('media_root')->exists($fullPath)) {
                return response()->json(['success' => false, 'message' => 'Thư mục đã tồn tại!'], 422);
            }

            Storage::disk('media_root')->makeDirectory($fullPath);

            return response()->json([
                'success' => true,
                'message' => 'Tạo thư mục thành công!',
                'path' => $fullPath
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
    public function moveFile(Request $request)
    {
        $request->validate([
            'file_path' => 'required|string',
            'target_path' => 'required|string',
        ]);

        $disk = Storage::disk('media_root');
        $fileName = basename($request->file_path);
        $newPath = $request->target_path . '/' . $fileName;

        try {
            if ($disk->exists($newPath)) {
                return response()->json(['message' => 'File đã tồn tại ở thư mục đích'], 422);
            }

            $disk->move($request->file_path, $newPath);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function rename(Request $request)
    {
        // 1. Làm sạch đường dẫn từ React gửi lên (loại bỏ dấu / ở đầu)
        $oldPath = ltrim($request->old_path, '/');
        $newName = $request->new_name;
        $type = $request->type;

        // 2. Sử dụng đúng Disk 'media_root' để kiểm tra tồn tại
        if (!Storage::disk('media_root')->exists($oldPath)) {
            return response()->json([
                'message' => "Không tìm thấy file gốc trên hệ thống",
                'debug_path' => $oldPath
            ], 404);
        }

        // 3. Xử lý đường dẫn thư mục cha và phần mở rộng
        $info = pathinfo($oldPath);
        // Nếu file ở thư mục gốc, dirname sẽ là ".", ta cần chuẩn hóa thành chuỗi rỗng
        $directory = ($info['dirname'] === '.') ? '' : $info['dirname'] . '/';
        $extension = isset($info['extension']) ? '.' . $info['extension'] : '';

        // 4. Đảm bảo File giữ nguyên đuôi (extension) cũ nếu người dùng lỡ xóa
        if ($type === 'file' && !empty($extension)) {
            // Kiểm tra xem tên mới đã có đuôi file chưa, nếu chưa thì cộng thêm vào
            if (!str_ends_with($newName, $extension)) {
                $newName .= $extension;
            }
        }

        // 5. Tạo đường dẫn mới
        $newPath = $directory . $newName;

        // 6. Kiểm tra xem tên mới đã tồn tại trên Disk 'media_root' chưa
        if (Storage::disk('media_root')->exists($newPath)) {
            return response()->json(['message' => 'Tên này đã tồn tại trong thư mục!'], 422);
        }

        try {
            // 7. Thực hiện di chuyển trên Disk 'media_root'
            Storage::disk('media_root')->move($oldPath, $newPath);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }



    public function delete(Request $request)
    {
        // 1. Làm sạch đường dẫn (loại bỏ dấu / ở đầu nếu có)
        // KHÔNG cộng thêm 'public/' vì disk 'media_root' đã trỏ đúng chỗ rồi
        $path = ltrim($request->path, '/');
        $type = $request->type;

        // 2. Kiểm tra tồn tại trên disk 'media_root' trước khi xóa
        if (!Storage::disk('media_root')->exists($path)) {
            return response()->json([
                'message' => 'Không tìm thấy tập tin hoặc thư mục để xóa.',
                'debug_path' => $path
            ], 404);
        }

        try {
            // 3. Thực hiện xóa dựa trên loại (folder hay file)
            if ($type === 'folder') {
                Storage::disk('media_root')->deleteDirectory($path);
            } else {
                Storage::disk('media_root')->delete($path);
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi hệ thống khi xóa: ' . $e->getMessage()
            ], 500);
        }
    }
}
