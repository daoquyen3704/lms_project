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


    public function show($id)
    {
        $course = Course::find($id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => "Course not found",
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'data' => $course,
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

    // This method will update course basic data
    public function update($id, Request $request)
    {
        $course = Course::find($id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => "Course not found",
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|min:5',
            'category' => 'required',
            'level' => 'required',
            'language' => 'required',
            'sell_price' => 'required|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $course->title = $request->title;
        $course->category_id = $request->category;
        $course->level_id = $request->level;
        $course->language_id = $request->language;
        $course->price = $request->sell_price;
        $course->cross_price = $request->cross_price;
        $course->description = $request->description;
        $course->save(); // Assuming user is authenticated

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => "Course updated successfully",
        ], 200);
    }
}
