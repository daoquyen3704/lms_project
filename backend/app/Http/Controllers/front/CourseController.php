<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    // This method will return all courses for a specific user
    public function index() {}

    // This method will save a new course in database as a draft
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            // 'description' => 'nullable|string',
            // 'price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $course = new Course();
        $course->title = $request->title;
        // $course->description = $request->description;
        // $course->price = $request->price;
        $course->status = 0; // Default status is draft
        $course->user_id = $request->user()->id;
        $course->save(); // Assuming user is authenticated

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => "Course created successfully",
        ], 200);
    }

    // This method will return categories/levels/languages
    public function metaData(Request $request)
    {
        $categories = Category::all();
        $levels = Level::all();
        $languages = Language::all();

        return response()->json([
            'status' => 200,
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
        ], 200);
    }
}
