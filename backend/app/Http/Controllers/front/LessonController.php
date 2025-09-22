<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
        $lesson = Lesson::find($id);

        if ($lesson == null) {
            return response()->json([
                'status' => 404,
                'message' => "Lesson not found",
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'lesson' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $lesson->chapter_id = $request->chapter_id;
        $lesson->title = $request->lesson;
        $lesson->is_free_preview = ($request->free_preview == 'false') ? 'no' : 'yes';
        $lesson->duration = $request->duration;
        $lesson->description = $request->description;
        $lesson->status = $request->status;
        $lesson->save();

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
}
