<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\ChapterController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\HomeController;
use App\Http\Controllers\front\OutcomeController;
use App\Http\Controllers\front\RequirementController;
use App\Http\Controllers\front\LessonController;

// 🔓 Public routes (authentication)
Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'authenticate']);
Route::post('/refresh', [AccountController::class, 'refresh']);
Route::get('/fetch-categories', [HomeController::class, 'fetchCategories']);
Route::get('/fetch-featured-courses', [HomeController::class, 'fetchFeaturedCourses']);
// Route::get('/fetch-courses', [HomeController::class, 'courses']);
Route::get('/fetch-levels', [HomeController::class, 'fetchLevels']);
Route::get('/fetch-languages', [HomeController::class, 'fetchLanguages']);
Route::get('/search', [HomeController::class, 'search']);


// 🔐 Protected routes (JWT required)
Route::middleware('auth:api')->group(function () {
    // Account & Profile
    Route::get('/me', [AccountController::class, 'me']);
    Route::post('/logout', [AccountController::class, 'logout']);

    // Courses
    Route::post('/courses', [CourseController::class, 'store']);
    Route::get('/courses/meta-data', [CourseController::class, 'metaData']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::post('/save-course-image/{id}', [CourseController::class, 'saveCourseImage']);
    Route::post('/change-course-status/{id}', [CourseController::class, 'changeStatus']);
    Route::delete('/courses/{id}', [CourseController::class, 'delete']);
    Route::get('/my-courses', [AccountController::class, 'courses']); // User's courses

    // Outcomes
    Route::get('/outcomes', [OutcomeController::class, 'index']);
    Route::post('/outcomes', [OutcomeController::class, 'store']);
    Route::put('/outcomes/{id}', [OutcomeController::class, 'update']);
    Route::delete('/outcomes/{id}', [OutcomeController::class, 'delete']);
    Route::post('/sort-outcomes', [OutcomeController::class, 'sortOutcome']);

    // Requirements
    Route::get('/requirements', [RequirementController::class, 'index']);
    Route::post('/requirements', [RequirementController::class, 'store']);
    Route::put('/requirements/{id}', [RequirementController::class, 'update']);
    Route::delete('/requirements/{id}', [RequirementController::class, 'delete']);
    Route::post('/sort-requirements', [RequirementController::class, 'sortRequirement']);

    // Chapters
    Route::get('/chapters', [ChapterController::class, 'index']);
    Route::post('/chapters', [ChapterController::class, 'store']);
    Route::put('/chapters/{id}', [ChapterController::class, 'update']);
    Route::delete('/chapters/{id}', [ChapterController::class, 'delete']);
    Route::post('/sort-chapters', [ChapterController::class, 'sortChapters']);

    // Lessons
    Route::get('/lessons/{id}', [LessonController::class, 'show']);
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::put('/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'delete']);
    Route::post('/save-lesson-video/{id}', [LessonController::class, 'saveVideo']);
    Route::post('/sort-lessons', [LessonController::class, 'sortLessons']);
});
