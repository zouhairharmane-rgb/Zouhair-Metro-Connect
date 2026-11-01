<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VoyageController;
use App\Http\Controllers\VoyageurController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/voyageurs', [VoyageurController::class, 'index']);
Route::post('/voyageurs', [VoyageurController::class, 'store']);
Route::delete('/voyageurs/{id}', [VoyageurController::class, 'destroy']);
Route::get('/stations', [VoyageurController::class, 'getStations']);
Route::post('/reservations', [VoyageurController::class, 'book']);

Route::get('/voyages', [VoyageController::class, 'index']);
Route::post('/voyages', [VoyageController::class, 'store']);
Route::get('/voyages/search', [VoyageController::class, 'search']);

Route::get('/activities', [VoyageurController::class, 'getRecentActivities']);

Route::get('/dashboard-stats', [VoyageurController::class, 'getDashboardStats']);