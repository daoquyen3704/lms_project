<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\OutcomeController;

Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'authenticate']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::group(['middleware' => ['auth:sanctum']], function () {
    // Route::post('/logout', [AccountController::class, 'logout']);

    Route::post('/courses', [CourseController::class, 'store']);
    Route::get('/courses/meta-data', [CourseController::class, 'metaData']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);

    Route::get('/outcomes', [OutcomeController::class, 'index']);
    Route::post('/outcomes', [OutcomeController::class, 'store']);
    Route::put('/outcomes/{id}', [OutcomeController::class, 'update']);
    Route::delete('/outcomes/{id}', [OutcomeController::class, 'delete']);
});
