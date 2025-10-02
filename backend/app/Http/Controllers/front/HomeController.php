<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Course;

class HomeController extends Controller
{
    public function fetchCategories()
    {
        $categories = Category::orderBy('name', 'asc')->get();
        return response()->json([
            'status' => 200,
            'data' => $categories,
        ], 200);
    }

    public function fetchFeaturedCourses()
    {
        $courses = Course::where('is_featured', 'yes')
            ->where('status', 1)
            ->orderBy('title', 'asc')->get();
        return response()->json([
            'status' => 200,
            'data' => $courses,
        ], 200);
    }
}
