<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;

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


    public function fetchLevels()
    {
        $levels = Level::orderBy('name', 'asc')->get();
        return response()->json([
            'status' => 200,
            'data' => $levels,
        ], 200);
    }

    public function fetchLanguages()
    {
        $languages = Language::orderBy('name', 'asc')->get();
        return response()->json([
            'status' => 200,
            'data' => $languages,
        ], 200);
    }

    public function search(Request $request)
    {
        $query = Course::where('status', 1);

        // 🔍 Keyword (tìm cả title & description)
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        // 🎯 Filters
        if ($request->filled('category')) {
            $query->whereIn('category_id', explode(',', $request->category));
        }
        if ($request->filled('level')) {
            $query->whereIn('level_id', explode(',', $request->level));
        }
        if ($request->filled('language')) {
            $query->whereIn('language_id', explode(',', $request->language));
        }

        // ↕️ Sort
        $sortField = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        $allowedSortFields = ['created_at', 'title', 'price'];

        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // 📄 Pagination
        $perPage = $request->per_page ?? 6;
        $courses = $query->paginate($perPage);

        return response()->json([
            'status' => 200,
            'data' => $courses->items(),
            'meta' => [
                'current_page' => $courses->currentPage(),
                'last_page' => $courses->lastPage(),
                'per_page' => $courses->perPage(),
                'total' => $courses->total(),
                'next_page_url' => $courses->nextPageUrl(),
                'prev_page_url' => $courses->previousPageUrl(),
            ]
        ], 200);
    }

    public function course($id)
    {
        $course = Course::where('id', $id)
            ->withCount('chapters')
            ->with([
                'level',
                'category',
                'language',
                'outcomes',
                'requirements',
                'chapters' => function ($query) {
                    $query->withCount(['lessons' => function ($q) {
                        $q->where('status', 1);
                        $q->whereNotNull('video');
                    }]);
                    $query->withSum(['lessons' => function ($q) {
                        $q->where('status', 1);
                        $q->whereNotNull('video');
                    }], 'duration');
                },
                'chapters.lessons' => function ($query) {
                    $query->where('status', 1);
                    $query->whereNotNull('video');
                },
                'user'
            ])
            ->first();

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ], 404);
        }

        $totalDuration = $course->chapters->sum('lessons_sum_duration');
        $totalLessons = $course->chapters->sum('lessons_count');
        $course->total_duration = $totalDuration;
        $course->total_lessons = $totalLessons;
        return response()->json([
            'status' => 200,
            'data' => $course,
        ], 200);
    }
}
