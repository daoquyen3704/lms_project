<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChapterController extends Controller
{
    // This method will return all chapters of a course
    public function index(Request $request)
    {
        $chapters = Chapter::where('course_id', $request->course_id)
            ->orderBy('sort_order')
            ->get();
        return response()->json([
            'status' => 200,
            'data' => $chapters
        ], 200);
    }

    // This method will store/save a chapter
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chapter' => 'required|string',
            'course_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $chapter = new Chapter();
        $chapter->course_id = $request->course_id;
        $chapter->title = $request->chapter;
        $chapter->sort_order = 1000;
        $chapter->save();

        return response()->json([
            'status' => 200,
            'data' => $chapter,
            'message' => "Chapter created successfully",
        ], 200);
    }

    // This method will update a chapter
    public function update($id, Request $request)
    {
        $chapter = Chapter::find($id);

        if ($chapter == null) {
            return response()->json([
                'status' => 404,
                'message' => "Chapter not found",
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'chapter' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $chapter->title = $request->chapter;
        $chapter->save();

        return response()->json([
            'status' => 200,
            'data' => $chapter,
            'message' => "Chapter updated successfully",
        ], 200);
    }

    // This method will delete a chapter
    public function delete($id)
    {
        $chapter = Chapter::find($id);

        if ($chapter == null) {
            return response()->json([
                'status' => 404,
                'message' => "Chapter not found",
            ], 404);
        }

        $chapter->delete();

        return response()->json([
            'status' => 200,
            'message' => "Chapter deleted successfully",
        ], 200);
    }

    public function sortChapter(Request $request)
    {
        if (!empty($request->chapters)) {
            foreach ($request->chapters as $key => $value) {
                Chapter::where('id', $value['id'])->update(['sort_order' => $key]);
            }
        }
        return response()->json([
            'status' => 200,
            'message' => "Chapter saved successfully",
        ], 200);
    }
}
