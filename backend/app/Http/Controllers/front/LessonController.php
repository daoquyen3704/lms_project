<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;


class LessonController extends Controller
{
    // This method will return all Lesson of a course
    public function index(Request $request)
    {
        // $lessons = Lesson::where('course_id', $request->course_id)
        //     ->orderBy('sort_order')
        //     ->get();
        // return response()->json([
        //     'status' => 200,
        //     'data' => $lessons
        // ], 200);
    }
    // This method will fetch lesson data
    public function show($id)
    {
        $lesson = Lesson::find($id);

        if ($lesson == null) {
            return response()->json([
                'status' => 404,
                'message' => "Lesson not found",
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $lesson,
        ], 200);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lesson' => 'required|string|min:5',
            'chapter' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $lesson = new Lesson();
        $lesson->chapter_id = $request->chapter;
        $lesson->title = $request->lesson;
        $lesson->sort_order = 1000;
        $lesson->status = $request->status;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => "Lesson added successfully",
        ], 200);
    }

    // This method will update a lesson
    public function update($id, Request $request)
    {
        // Tìm lesson theo ID
        $lesson = Lesson::find($id);

        // Nếu không tìm thấy lesson, trả về lỗi 404
        if ($lesson == null) {
            return response()->json([
                'status' => 404,
                'message' => "Lesson not found",
            ], 404);
        }

        // Validate dữ liệu request
        $validator = Validator::make($request->all(), [
            'lesson' => 'required|string|min:5', // Kiểm tra title lesson có ít nhất 5 ký tự
            'chapter_id' => 'required|exists:chapters,id', // Kiểm tra chapter_id có tồn tại trong bảng chapters
            'status' => 'required|boolean', // Kiểm tra status là boolean (1 hoặc 0)
            'free_preview' => 'nullable|boolean', // Kiểm tra free_preview là boolean, nếu không có thì bỏ qua
            'duration' => 'nullable|integer', // Duration nếu có thì là số nguyên
            'description' => 'nullable|string', // Description có thể bỏ qua nếu không có
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // Cập nhật thông tin lesson
        $lesson->chapter_id = $request->chapter_id;
        $lesson->title = $request->lesson;
        $lesson->is_free_preview = ($request->free_preview === null) ? $lesson->is_free_preview : ($request->free_preview ? 'yes' : 'no'); // Kiểm tra free_preview
        $lesson->duration = $request->duration;
        $lesson->description = $request->description;
        $lesson->status = $request->status;

        // Lưu lại
        $lesson->save();

        // Trả về kết quả thành công
        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => "Lesson updated successfully",
        ], 200);
    }


    public function delete($id)
    {
        $lesson = Lesson::find($id);

        if ($lesson == null) {
            return response()->json([
                'status' => 404,
                'message' => "Lesson not found",
            ], 404);
        }
        $lesson->delete();
        return response()->json([
            'status' => 200,
            'message' => "Lesson deleted successfully",
        ], 200);
    }

    public function saveVideo($id, Request $request)
    {
        $lesson = Lesson::find($id);
        if ($lesson == null) {
            return response()->json([
                'status' => 404,
                'message' => "Lesson not found",
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'video' => 'required|mimes:mp4',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        if (!empty($lesson->video)) {
            if (File::exists(public_path('uploads/courses/videos/' . $lesson->video))) {
                File::delete(public_path('uploads/courses/videos/' . $lesson->video));
            }
        }
        $video = $request->video;
        $ext = $video->getClientOriginalExtension();
        $videoName = strtotime('now') . '-' . $id . '.' . $ext; // 123233232-1.jpg
        $video->move(public_path('uploads/courses/videos'), $videoName);



        $lesson->video = $videoName;
        $lesson->save();
        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => "Video uploaded successfully",
        ], 200);
    }
}
