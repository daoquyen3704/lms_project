<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Exists;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

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
        $course = Course::with(['chapters', 'chapters.lessons'])->find($id);

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

    public function saveCourseImage($id, Request $request)
    {
        $course = Course::find($id);
        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => "Course not found",
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|mimes:png,jpg,jpeg',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        if (!empty($course->image)) {
            if (File::exists(public_path('images/courses/' . $course->image))) {
                File::delete(public_path('images/courses/' . $course->image));
            }
            if (File::exists(public_path('uploads/course/small/' . $course->image))) {
                File::delete(public_path('uploads/course/small/' . $course->image));
            }
        }
        $image = $request->image;
        $ext = $image->getClientOriginalExtension();
        $imageName = strtotime('now') . '-' . $id . '.' . $ext; // 123233232-1.jpg
        $image->move(public_path('images/courses'), $imageName);

        // create small thumbnail image
        $manager = new ImageManager(new Driver());
        $img = $manager->read(public_path('images/courses/') . $imageName);
        $img->cover(750, 450);
        $img->save(public_path('uploads/course/small/') . $imageName);

        $course->image = $imageName;
        $course->save();
        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => "Course image uploaded successfully",
        ], 200);
    }
}
